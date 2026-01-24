// Mock data for demo purposes - will be replaced with real DB queries

export const mockClients = [
    {
        id: '1',
        businessName: 'AutoFix Lagos',
        businessType: 'AUTO_MECHANIC',
        ownerName: 'Chidi Okafor',
        email: 'chidi@autofix.ng',
        phone: '+234 803 123 4567',
        status: 'ACTIVE',
        planTier: 'PROFESSIONAL',
        monthlyFee: 25000,
        createdAt: new Date('2024-01-15'),
    },
    {
        id: '2',
        businessName: 'Mama Put Restaurant',
        businessType: 'RESTAURANT',
        ownerName: 'Ngozi Adeyemi',
        email: 'ngozi@mamaput.ng',
        phone: '+234 805 987 6543',
        status: 'ACTIVE',
        planTier: 'BASIC',
        monthlyFee: 15000,
        createdAt: new Date('2024-02-20'),
    },
    {
        id: '3',
        businessName: 'Glam Beauty Salon',
        businessType: 'SALON',
        ownerName: 'Amaka Johnson',
        email: 'amaka@glam.ng',
        phone: '+234 807 456 7890',
        status: 'TRIAL',
        planTier: 'BASIC',
        monthlyFee: 15000,
        createdAt: new Date('2024-12-01'),
    },
    {
        id: '4',
        businessName: 'Sunset Hotel',
        businessType: 'HOTEL',
        ownerName: 'Ibrahim Musa',
        email: 'ibrahim@sunset.ng',
        phone: '+234 809 234 5678',
        status: 'ACTIVE',
        planTier: 'ENTERPRISE',
        monthlyFee: 50000,
        createdAt: new Date('2023-11-10'),
    },
];

export const mockStats = {
    totalClients: 47,
    activeWorkflows: 132,
    messagesProcessed24h: 1847,
    monthlyRevenue: 1250000,
    newClientsThisMonth: 8,
    churnRate: 2.1,
};

export const mockRecentActivity = [
    {
        id: '1',
        type: 'client_signup',
        message: 'New client signed up: Tech Store Ikeja',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
        clientId: '5',
    },
    {
        id: '2',
        type: 'message_spike',
        message: 'AutoFix Lagos processed 150 messages (spike detected)',
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
        clientId: '1',
    },
    {
        id: '3',
        type: 'payment_received',
        message: 'Payment received: Mama Put Restaurant - ₦15,000',
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        clientId: '2',
    },
    {
        id: '4',
        type: 'integration_connected',
        message: 'Glam Beauty Salon connected WhatsApp',
        timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
        clientId: '3',
    },
    {
        id: '5',
        type: 'workflow_error',
        message: 'Workflow error: Sunset Hotel - Payment webhook timeout',
        timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
        clientId: '4',
        severity: 'error',
    },
];

export const mockMessages = [
    {
        id: '1',
        clientId: '1',
        customerPhone: '+234 803 111 2222',
        customerName: 'John Doe',
        messageText: 'Is my car ready for pickup?',
        botResponse: 'Yes! Your Toyota Camry is ready. You can pick it up anytime today.',
        category: 'status_check',
        handledBy: 'BOT',
        status: 'COMPLETED',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
        id: '2',
        clientId: '2',
        customerPhone: '+234 805 333 4444',
        customerName: 'Sarah Ibrahim',
        messageText: 'I want to order 2 plates of jollof rice',
        botResponse: 'Order confirmed! 2 plates of Jollof Rice - ₦2,000. Delivery in 30 mins.',
        category: 'order',
        handledBy: 'BOT',
        status: 'COMPLETED',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
    },
];

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(amount);
}

export function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}
