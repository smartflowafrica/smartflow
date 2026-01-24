import Redis from 'ioredis';

export interface RateLimitStats {
    totalSent: number;
    blockedCount: number;
    hourlyUsage: number;
}

export class RateLimiter {
    private redis: Redis;
    private readonly HOURLY_LIMIT = 20;
    private readonly WINDOW_SECONDS = 3600;

    constructor() {
        this.redis = new Redis(process.env.CACHE_REDIS_URI || 'redis://localhost:6379/1');
    }

    /**
     * Checks if a message can be sent to the recipient
     */
    async canSend(to: string): Promise<{ allowed: boolean, waitMs?: number }> {
        const key = `ratelimit:${to}`;

        const count = await this.redis.get(key);
        const currentUsage = count ? parseInt(count) : 0;

        if (currentUsage >= this.HOURLY_LIMIT) {
            const ttl = await this.redis.ttl(key);
            return {
                allowed: false,
                waitMs: ttl > 0 ? ttl * 1000 : 3600000 // Default 1hr if ttl fails
            };
        }

        return { allowed: true };
    }

    /**
     * Records a successful send event
     */
    async recordSend(to: string, type: string): Promise<void> {
        const userKey = `ratelimit:${to}`;
        const globalKey = `stats:global:hourly`;
        const dateKey = `stats:daily:${new Date().toISOString().split('T')[0]}`;

        // 1. Increment User Limit
        const userCount = await this.redis.incr(userKey);
        if (userCount === 1) {
            await this.redis.expire(userKey, this.WINDOW_SECONDS);
        }

        // 2. Increment Global Stats (Daily)
        await this.redis.incr(dateKey);

        // 3. Track Hourly (for stats)
        await this.redis.incr(globalKey);
        // Ensure global key expires every hour just to keep it fresh
        if ((await this.redis.ttl(globalKey)) === -1) {
            await this.redis.expire(globalKey, 3600);
        }
    }

    /**
     * Retrieves usage statistics
     */
    async getStats(): Promise<RateLimitStats> {
        const dateKey = `stats:daily:${new Date().toISOString().split('T')[0]}`;
        const globalKey = `stats:global:hourly`;

        const totalSentStr = await this.redis.get(dateKey);
        const hourlyUsageStr = await this.redis.get(globalKey);

        return {
            totalSent: totalSentStr ? parseInt(totalSentStr) : 0,
            hourlyUsage: hourlyUsageStr ? parseInt(hourlyUsageStr) : 0,
            blockedCount: 0 // We aren't strictly tracking blocking events in Redis yet
        };
    }
}
