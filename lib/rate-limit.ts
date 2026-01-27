import { RateLimiterMemory } from 'rate-limiter-flexible';

// Global limiter: 100 requests per 15 minutes
export const globalLimiter = new RateLimiterMemory({
    points: 100,
    duration: 15 * 60,
});

// Auth limiter: 5 login attempts per minute (Brute force protection)
export const authLimiter = new RateLimiterMemory({
    points: 5,
    duration: 60,
});
