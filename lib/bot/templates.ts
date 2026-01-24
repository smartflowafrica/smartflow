export const templates = {
    greeting: "Hello! Welcome to {businessName}. How can I help you today?",
    hours: "We're open:\n{hours}\nWe're currently {openStatus}.",
    menu: "Here's our menu:\n{menuItems}\nReply with item name to order.",
    price: "{serviceName} is ₦{price}. Would you like to book it?",
    booking: "To book {service}, please provide:\n1. Preferred date\n2. Preferred time\n3. Your name",
    location: "We're located at: {address}\n{mapLink}",
    delivery: "Delivery available to {areas} for ₦{fee}. Send your address.",
    payment: "Total: ₦{amount}\nPay here: {paymentLink}",
    status: "Please provide your Job ID or Order Number to check the status.",
    unknown: "I'm not sure I understood that. Could you please rephrase? You can ask for our 'menu', 'hours', 'location', or 'payment details'."
};

export function formatMenu(services: any[]): string {
    if (!services || services.length === 0) return "No services available currently.";

    return services.map((s, i) => {
        const price = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(s.price));
        return `${i + 1}. ${s.name} - ${price}`;
    }).join('\n');
}

export function formatHours(hours: Record<string, string>): string {
    if (!hours) return "Hours not available.";

    return Object.entries(hours)
        .filter(([_, val]) => val && val.toLowerCase() !== 'closed')
        .map(([day, val]) => {
            // Capitalize first letter
            return `${day.charAt(0).toUpperCase() + day.slice(1)}: ${val}`;
        })
        .join('\n');
}

export function getOpenStatus(hours: Record<string, string>): string {
    if (!hours) return "Unknown";

    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[now.getDay()];

    // Get today's hours
    const todayHours = hours[currentDay];

    if (!todayHours || todayHours.toLowerCase() === 'closed') {
        return "Closed";
    }

    // Parse Range "9:00 AM - 5:00 PM"
    try {
        const parts = todayHours.split('-').map(p => p.trim());
        if (parts.length !== 2) return "Open"; // Fallback if format is weird

        const [startStr, endStr] = parts;

        const startTime = parseTimeToday(startStr);
        const endTime = parseTimeToday(endStr);

        if (now >= startTime && now <= endTime) {
            return `Open (Closes at ${endStr})`;
        } else {
            return "Closed";
        }
    } catch (e) {
        return "Open"; // Fallback
    }
}

function parseTimeToday(timeStr: string): Date {
    const d = new Date();
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier.toLowerCase() === 'pm' && hours < 12) hours += 12;
    if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0;

    d.setHours(hours, minutes || 0, 0, 0);
    return d;
}

export function generatePaymentLink(amount: number, clientId: string): string {
    // Placeholder for actual payment link generation logic
    return `https://pay.smartflow.africa/${clientId}?amount=${amount}`;
}
