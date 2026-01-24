import prisma from '@/lib/prisma';

/**
 * FAQ Matcher - Finds the best matching FAQ for a customer message
 * Uses keyword matching with fuzzy scoring
 */
export class FAQMatcher {
    /**
     * Find the best matching FAQ for a given message
     * Returns null if no good match is found
     */
    public async findMatch(
        message: string,
        clientId: string
    ): Promise<{ answer: string; confidence: number } | null> {
        // Fetch active FAQs for this client, ordered by priority
        const faqs = await prisma.fAQ.findMany({
            where: {
                clientId,
                isActive: true
            },
            orderBy: { priority: 'desc' }
        });

        if (faqs.length === 0) {
            return null;
        }

        const lowerMessage = message.toLowerCase();
        const messageWords = this.tokenize(lowerMessage);

        let bestMatch: { answer: string; confidence: number } | null = null;
        let highestScore = 0;

        for (const faq of faqs) {
            const score = this.calculateMatchScore(lowerMessage, messageWords, faq);

            if (score > highestScore && score >= 0.4) { // Minimum 40% match required
                highestScore = score;
                bestMatch = {
                    answer: faq.answer,
                    confidence: Math.round(score * 100)
                };
            }
        }

        return bestMatch;
    }

    /**
     * Calculate match score between message and FAQ
     */
    private calculateMatchScore(
        lowerMessage: string,
        messageWords: string[],
        faq: { question: string; keywords: string[] }
    ): number {
        const questionWords = this.tokenize(faq.question.toLowerCase());
        const allKeywords = [...questionWords, ...faq.keywords.map(k => k.toLowerCase())];

        if (allKeywords.length === 0) {
            return 0;
        }

        // Count matching keywords
        let matchCount = 0;
        for (const keyword of allKeywords) {
            // Check for exact word match or substring match
            if (messageWords.includes(keyword) || lowerMessage.includes(keyword)) {
                matchCount++;
            }
        }

        // Calculate score based on matched keywords
        const score = matchCount / allKeywords.length;

        // Bonus for longer keyword matches (more specific)
        const longestKeywordMatch = allKeywords
            .filter(k => lowerMessage.includes(k))
            .reduce((max, k) => Math.max(max, k.length), 0);

        const lengthBonus = longestKeywordMatch > 5 ? 0.1 : 0;

        return Math.min(score + lengthBonus, 1);
    }

    /**
     * Tokenize a string into words
     */
    private tokenize(text: string): string[] {
        return text
            .replace(/[^\w\s]/g, ' ') // Remove punctuation
            .split(/\s+/)
            .filter(word => word.length > 2); // Ignore very short words
    }
}

// Export singleton instance
export const faqMatcher = new FAQMatcher();
