
const detectIntent = (message: string): string => {
    const lowerMsg = message.toLowerCase();

    // Greetings
    if (/^(hi|hello|hey|good\s?morning|good\s?afternoon|good\s?evening|how\s?far|xtup|what's\s?up)/.test(lowerMsg)) {
        return 'greeting';
    }

    // Business Hours / Availability
    if (/(open|close|time|hours|available|when|weekend|sunday|saturday|working)/.test(lowerMsg) &&
        /(open|close|time|hours|when)/.test(lowerMsg)) {
        return 'hours';
    }

    // Services / Menu / Product List
    if (/(menu|list|service|product|what\s?do\s?you\s?do|catalogue|offer|sell)/.test(lowerMsg)) {
        return 'services';
    }

    // Pricing
    if (/(price|cost|how\s?much|amount|rate|fee|bill|₦)/.test(lowerMsg)) {
        return 'pricing';
    }

    // Location
    if (/(location|address|where|located|place|office|shop|na\s?where)/.test(lowerMsg)) {
        return 'location';
    }

    // Booking / Appointment
    if (/(book|appointment|schedul|reserv|slot|visit)/.test(lowerMsg)) {
        return 'booking';
    }

    return 'unknown';
}

console.log("Input: 'check prices' -> Intent:", detectIntent("check prices"));
console.log("Input: 'book an appointment' -> Intent:", detectIntent("book an appointment"));
