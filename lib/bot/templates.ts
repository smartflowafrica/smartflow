// Professional Assistant Persona Templates
export const templates = {
    greeting: [
        "Hello! Welcome to {businessName}. How can I assist you today?",
        "Hi there! Thanks for reaching out to {businessName}. What can we do for you?",
        "Good day! You've reached {businessName}. I'm here to help with bookings and inquiries."
    ],
    hours: [
        "Here are our business hours:\n{hours}\nWe are currently {openStatus}.",
        "We are open at these times:\n{hours}\nStatus: {openStatus}."
    ],
    menu: [
        "Take a look at our services:\n{menuItems}\n\nReply with the **Service Name** or **Number** (e.g., '1') to book it!",
        "Here is what we offer:\n{menuItems}\n\nLet me know if you'd like to schedule any of these (you can just reply with the number!)."
    ],
    price: [
        "The price for **{serviceName}** is **₦{price}**. Shall I book that for you?",
        "**{serviceName}** costs **₦{price}**. Would you like to proceed with a booking?"
    ],
    booking: [
        "Great choice. To book **{service}**, I just need a few details:\n1. Preferred date\n2. Preferred time\n3. Your name",
        "I can help you schedule **{service}**. Please tell me:\n- When would you like to come in? (Date & Time)\n- Your full name"
    ],
    location: [
        "You can find us at:\n{address}\n{mapLink}",
        "Our office is located at:\n{address}"
    ],
    delivery: [
        "We deliver to {areas} for a fee of ₦{fee}. Please send your delivery address.",
        "Delivery is available! The cost is ₦{fee} to {areas}. Where should we send it?"
    ],
    payment: [
        "The total is ₦{amount}. You can pay securely here: {paymentLink}",
        "Please complete your payment of ₦{amount} using this link: {paymentLink}"
    ],
    status: [
        "I can check that for you. Please send me your Job ID or Order Number.",
        "To check your status, please provide your reference number."
    ],
    unknown: [
        "I didn't quite catch that. You can ask for our **menu**, **hours**, or **location**. How can I help?",
        "I'm not sure I understood. I can help you **book an appointment** or **check prices**. What do you need?",
        "Sorry, I missed that. Are you looking to see our **services** or **hours**?"
    ]
};

export const pickRandom = (template: string[] | string | undefined): string => {
    if (!template) return "";
    if (Array.isArray(template)) {
        const index = Math.floor(Math.random() * template.length);
        return template[index] || "";
    }
    return template;
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
        const parts = todayHours.split('-').map((p: string) => p.trim());
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
