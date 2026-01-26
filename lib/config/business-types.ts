
export type BusinessTypeConfig = {
    id: string;
    name: string;
    icon: string;
    terminology: {
        job: string;
        jobs: string;
        customer: string;
        customers: string;
        service: string;
        services: string;
        statusLabel: string;
        calendarLabel: string;
    };
    statusStages: Array<{
        value: string;
        label: string;
        color: string;
        description?: string;
    }>;
    quickActions: Array<{
        id: string;
        label: string;
        icon: string;
        color: string;
        description: string;
    }>;
    dashboardSections: Array<{
        id: string;
        label: string;
        icon: string;
        enabled: boolean;
        description: string;
    }>;
    defaultServices: string[]; // Suggested services during onboarding
    metrics: Array<{
        id: string;
        label: string;
        icon: string;
        format: 'number' | 'currency' | 'percentage';
    }>;
};

export const BUSINESS_TYPES: Record<string, BusinessTypeConfig> = {
    AUTO_MECHANIC: {
        id: 'AUTO_MECHANIC',
        name: 'Auto Mechanic Shop',
        icon: '🔧',
        terminology: {
            job: 'Car',
            jobs: 'Cars',
            customer: 'Customer',
            customers: 'Customers',
            service: 'Service',
            services: 'Services',
            statusLabel: 'Job Status',
            calendarLabel: 'Service Schedule',
        },
        statusStages: [
            { value: 'received', label: 'Received/Checked In', color: '#3B82F6', description: 'Car has been received' },
            { value: 'diagnosing', label: 'Diagnosing', color: '#F59E0B', description: 'Identifying the issue' },
            { value: 'awaiting_approval', label: 'Awaiting Customer Approval', color: '#EF4444', description: 'Waiting for customer to approve quote' },
            { value: 'in_progress', label: 'Work in Progress', color: '#8B5CF6', description: 'Actively working on the car' },
            { value: 'testing', label: 'Testing/QC', color: '#EC4899', description: 'Quality check and test drive' },
            { value: 'ready', label: 'Ready for Pickup', color: '#10B981', description: 'Car is ready to be collected' },
            { value: 'completed', label: 'Completed/Picked Up', color: '#6B7280', description: 'Job completed and paid' },
        ],
        quickActions: [
            {
                id: 'mark_ready',
                label: 'Mark Car as Ready',
                icon: '🚗',
                color: '#10B981',
                description: 'Notify customer their car is ready for pickup'
            },
            {
                id: 'update_status',
                label: 'Update Job Status',
                icon: '🔧',
                color: '#3B82F6',
                description: 'Change the status of a job'
            },
            {
                id: 'book_appointment',
                label: 'Book Walk-in Appointment',
                icon: '📅',
                color: '#F59E0B',
                description: 'Schedule a new appointment'
            },
            {
                id: 'generate_invoice',
                label: 'Generate Invoice',
                icon: '💰',
                color: '#8B5CF6',
                description: 'Create invoice for completed work'
            },
        ],
        dashboardSections: [
            { id: 'conversations', label: 'Messages', icon: '💬', enabled: true, description: 'WhatsApp conversations' },
            { id: 'active_jobs', label: 'Active Jobs', icon: '🚗', enabled: true, description: 'Cars currently being serviced' },
            { id: 'calendar', label: 'Appointments', icon: '📅', enabled: true, description: 'Scheduled appointments' },
            { id: 'customers', label: 'Customers', icon: '👥', enabled: true, description: 'Customer database' },
            { id: 'analytics', label: 'Analytics', icon: '📊', enabled: true, description: 'Business insights' },
        ],
        defaultServices: [
            'Oil Change',
            'Brake Service',
            'AC Repair',
            'Engine Diagnostics',
            'Tire Service',
            'Battery Replacement',
            'Wheel Alignment',
            'Transmission Repair',
            'Electrical Work',
        ],
        metrics: [
            { id: 'messages_today', label: 'Messages Today', icon: '💬', format: 'number' },
            { id: 'cars_in_shop', label: 'Cars in Shop', icon: '🚗', format: 'number' },
            { id: 'ready_for_pickup', label: 'Ready for Pickup', icon: '✅', format: 'number' },
            { id: 'revenue_today', label: 'Revenue Today', icon: '💰', format: 'currency' },
            { id: 'cash_collected', label: 'Cash Collected', icon: '💵', format: 'currency' },
        ],
    },

    RESTAURANT: {
        id: 'RESTAURANT',
        name: 'Restaurant/Food Business',
        icon: '🍲',
        terminology: {
            job: 'Order',
            jobs: 'Orders',
            customer: 'Customer',
            customers: 'Customers',
            service: 'Menu Item',
            services: 'Menu Items',
            statusLabel: 'Order Status',
            calendarLabel: 'Reservations',
        },
        statusStages: [
            { value: 'received', label: 'Order Received', color: '#3B82F6' },
            { value: 'preparing', label: 'Preparing', color: '#F59E0B' },
            { value: 'ready', label: 'Ready for Pickup', color: '#10B981' },
            { value: 'out_for_delivery', label: 'Out for Delivery', color: '#8B5CF6' },
            { value: 'delivered', label: 'Delivered', color: '#10B981' },
            { value: 'completed', label: 'Completed', color: '#6B7280' },
        ],
        quickActions: [
            { id: 'mark_ready', label: 'Mark Order Ready', icon: '🍽️', color: '#10B981', description: 'Order is ready for pickup/delivery' },
            { id: 'update_status', label: 'Update Delivery Status', icon: '📦', color: '#3B82F6', description: 'Update order progress' },
            { id: 'book_reservation', label: 'Book Reservation', icon: '📅', color: '#F59E0B', description: 'Reserve a table' },
            { id: 'generate_receipt', label: 'Generate Receipt', icon: '💰', color: '#8B5CF6', description: 'Create order receipt' },
        ],
        dashboardSections: [
            { id: 'conversations', label: 'Messages', icon: '💬', enabled: true, description: 'Customer messages' },
            { id: 'active_orders', label: 'Active Orders', icon: '🍽️', enabled: true, description: 'Orders being prepared' },
            { id: 'reservations', label: 'Reservations', icon: '📅', enabled: true, description: 'Table bookings' },
            { id: 'menu_management', label: 'Menu', icon: '📋', enabled: true, description: 'Manage menu items' },
            { id: 'customers', label: 'Customers', icon: '👥', enabled: true, description: 'Customer database' },
            { id: 'analytics', label: 'Analytics', icon: '📊', enabled: true, description: 'Sales insights' },
        ],
        defaultServices: [
            'Jollof Rice',
            'Fried Rice',
            'White Rice',
            'Chicken',
            'Fish',
            'Beef',
            'Plantain',
            'Pounded Yam',
            'Egusi Soup',
        ],
        metrics: [
            { id: 'messages_today', label: 'Messages Today', icon: '💬', format: 'number' },
            { id: 'orders_today', label: 'Orders Today', icon: '🍽️', format: 'number' },
            { id: 'preparing', label: 'Preparing Now', icon: '👨‍🍳', format: 'number' },
            { id: 'revenue_today', label: 'Revenue Today', icon: '💰', format: 'currency' },
            { id: 'cash_collected', label: 'Cash Collected', icon: '💵', format: 'currency' },
        ],
    },

    SALON: {
        id: 'SALON',
        name: 'Salon/Spa/Beauty',
        icon: '💇',
        terminology: {
            job: 'Appointment',
            jobs: 'Appointments',
            customer: 'Client',
            customers: 'Clients',
            service: 'Service',
            services: 'Services',
            statusLabel: 'Service Status',
            calendarLabel: 'Appointment Calendar',
        },
        statusStages: [
            { value: 'scheduled', label: 'Scheduled', color: '#3B82F6' },
            { value: 'arrived', label: 'Client Arrived', color: '#F59E0B' },
            { value: 'in_progress', label: 'Service in Progress', color: '#8B5CF6' },
            { value: 'completed', label: 'Service Completed', color: '#10B981' },
            { value: 'checked_out', label: 'Checked Out', color: '#6B7280' },
        ],
        quickActions: [
            { id: 'mark_ready', label: 'Mark Client Done', icon: '💇', color: '#10B981', description: 'Service completed' },
            { id: 'update_status', label: 'Update Service Status', icon: '💅', color: '#3B82F6', description: 'Update progress' },
            { id: 'book_appointment', label: 'Book Appointment', icon: '📅', color: '#F59E0B', description: 'Schedule new appointment' },
            { id: 'generate_invoice', label: 'Generate Invoice', icon: '💰', color: '#8B5CF6', description: 'Create invoice' },
        ],
        dashboardSections: [
            { id: 'conversations', label: 'Messages', icon: '💬', enabled: true, description: 'Client messages' },
            { id: 'appointments', label: "Today's Appointments", icon: '📅', enabled: true, description: 'Today\'s schedule' },
            { id: 'calendar', label: 'Calendar View', icon: '📆', enabled: true, description: 'Full calendar' },
            { id: 'clients', label: 'Clients', icon: '👥', enabled: true, description: 'Client database' },
            { id: 'services', label: 'Services', icon: '✨', enabled: true, description: 'Service offerings' },
            { id: 'analytics', label: 'Analytics', icon: '📊', enabled: true, description: 'Business insights' },
        ],
        defaultServices: [
            'Hair Cut',
            'Hair Styling',
            'Hair Coloring',
            'Manicure',
            'Pedicure',
            'Facial Treatment',
            'Makeup',
            'Massage',
            'Waxing',
        ],
        metrics: [
            { id: 'messages_today', label: 'Messages Today', icon: '💬', format: 'number' },
            { id: 'appointments_today', label: 'Appointments Today', icon: '📅', format: 'number' },
            { id: 'in_progress', label: 'In Progress', icon: '💇', format: 'number' },
            { id: 'revenue_today', label: 'Revenue Today', icon: '💰', format: 'currency' },
            { id: 'cash_collected', label: 'Cash Collected', icon: '💵', format: 'currency' },
        ],
    },

    HOTEL: {
        id: 'HOTEL',
        name: 'Hotel/Hospitality',
        icon: '🏨',
        terminology: {
            job: 'Reservation',
            jobs: 'Reservations',
            customer: 'Guest',
            customers: 'Guests',
            service: 'Room/Service',
            services: 'Rooms/Services',
            statusLabel: 'Reservation Status',
            calendarLabel: 'Booking Calendar',
        },
        statusStages: [
            { value: 'pending', label: 'Pending Confirmation', color: '#F59E0B' },
            { value: 'confirmed', label: 'Confirmed', color: '#3B82F6' },
            { value: 'checked_in', label: 'Checked In', color: '#8B5CF6' },
            { value: 'in_house', label: 'In House', color: '#10B981' },
            { value: 'checked_out', label: 'Checked Out', color: '#6B7280' },
            { value: 'completed', label: 'Completed', color: '#6B7280' },
        ],
        quickActions: [
            { id: 'check_in', label: 'Check-in Guest', icon: '🔑', color: '#10B981', description: 'Guest has arrived' },
            { id: 'check_out', label: 'Check-out Guest', icon: '👋', color: '#6B7280', description: 'Guest is leaving' },
            { id: 'room_service', label: 'Log Service Request', icon: '🛎️', color: '#F59E0B', description: 'New guest request' },
            { id: 'generate_invoice', label: 'Generate Invoice', icon: '💰', color: '#8B5CF6', description: 'Create final bill' },
        ],
        dashboardSections: [
            { id: 'conversations', label: 'Guest Messages', icon: '💬', enabled: true, description: 'Guest inquiries' },
            { id: 'active_reservations', label: 'Current Guests', icon: '🏨', enabled: true, description: 'Guests in-house' },
            { id: 'calendar', label: 'Booking Calendar', icon: '📅', enabled: true, description: 'Room availability' },
            { id: 'guests', label: 'Guest Database', icon: '👥', enabled: true, description: 'Guest records' },
            { id: 'services', label: 'Services', icon: '🛎️', enabled: true, description: 'Room service menu' },
            { id: 'analytics', label: 'Analytics', icon: '📊', enabled: true, description: 'Occupancy stats' },
        ],
        defaultServices: [
            'Standard Room',
            'Deluxe Room',
            'Suite',
            'Room Service',
            'Laundry',
            'Airport Pickup',
        ],
        metrics: [
            { id: 'occupancy', label: 'Occupancy', icon: '🏨', format: 'percentage' },
            { id: 'check_ins', label: 'Check-ins Today', icon: '🔑', format: 'number' },
            { id: 'requests', label: 'Open Requests', icon: '🛎️', format: 'number' },
            { id: 'revenue_today', label: 'Revenue Today', icon: '💰', format: 'currency' },
            { id: 'cash_collected', label: 'Cash Collected', icon: '💵', format: 'currency' },
        ],
    },

    RETAIL: {
        id: 'RETAIL',
        name: 'Retail Store',
        icon: '🛍️',
        terminology: {
            job: 'Order',
            jobs: 'Orders',
            customer: 'Customer',
            customers: 'Customers',
            service: 'Product',
            services: 'Products',
            statusLabel: 'Order Status',
            calendarLabel: 'Delivery Schedule',
        },
        statusStages: [
            { value: 'received', label: 'Order Received', color: '#3B82F6' },
            { value: 'processing', label: 'Processing', color: '#F59E0B' },
            { value: 'ready', label: 'Ready for Pickup', color: '#10B981' },
            { value: 'out_for_delivery', label: 'Out for Delivery', color: '#8B5CF6' },
            { value: 'delivered', label: 'Delivered', color: '#10B981' },
            { value: 'completed', label: 'Completed', color: '#6B7280' },
        ],
        quickActions: [
            { id: 'mark_ready', label: 'Mark Order Ready', icon: '📦', color: '#10B981', description: 'Order is ready' },
            { id: 'update_delivery', label: 'Update Delivery Status', icon: '🚚', color: '#3B82F6', description: 'Track delivery' },
            { id: 'check_inventory', label: 'Check Inventory', icon: '📊', color: '#F59E0B', description: 'Stock levels' },
            { id: 'generate_receipt', label: 'Generate Receipt', icon: '💰', color: '#8B5CF6', description: 'Create receipt' },
        ],
        dashboardSections: [
            { id: 'conversations', label: 'Messages', icon: '💬', enabled: true, description: 'Customer inquiries' },
            { id: 'orders', label: 'Orders', icon: '📦', enabled: true, description: 'Order management' },
            { id: 'inventory', label: 'Inventory', icon: '📊', enabled: true, description: 'Stock tracking' },
            { id: 'customers', label: 'Customers', icon: '👥', enabled: true, description: 'Customer base' },
            { id: 'products', label: 'Products', icon: '🛍️', enabled: true, description: 'Product catalog' },
            { id: 'analytics', label: 'Analytics', icon: '📊', enabled: true, description: 'Sales analytics' },
        ],
        defaultServices: [
            'Product Category 1',
            'Product Category 2',
            'Product Category 3',
        ],
        metrics: [
            { id: 'messages_today', label: 'Messages Today', icon: '💬', format: 'number' },
            { id: 'orders_today', label: 'Orders Today', icon: '📦', format: 'number' },
            { id: 'pending_delivery', label: 'Pending Delivery', icon: '🚚', format: 'number' },
            { id: 'revenue_today', label: 'Revenue Today', icon: '💰', format: 'currency' },
            { id: 'cash_collected', label: 'Cash Collected', icon: '💵', format: 'currency' },
        ],
    },

    HEALTHCARE: {
        id: 'HEALTHCARE',
        name: 'Healthcare/Clinic',
        icon: '🏥',
        terminology: {
            job: 'Appointment',
            jobs: 'Appointments',
            customer: 'Patient',
            customers: 'Patients',
            service: 'Service',
            services: 'Services',
            statusLabel: 'Appointment Status',
            calendarLabel: 'Patient Schedule',
        },
        statusStages: [
            { value: 'scheduled', label: 'Scheduled', color: '#3B82F6' },
            { value: 'arrived', label: 'Patient Arrived', color: '#F59E0B' },
            { value: 'in_consultation', label: 'In Consultation', color: '#8B5CF6' },
            { value: 'treatment', label: 'Treatment', color: '#EC4899' },
            { value: 'completed', label: 'Completed', color: '#10B981' },
            { value: 'follow_up', label: 'Follow-up Scheduled', color: '#F59E0B' },
        ],
        quickActions: [
            { id: 'check_in', label: 'Check-in Patient', icon: '🏥', color: '#10B981', description: 'Patient has arrived' },
            { id: 'update_status', label: 'Update Status', icon: '📋', color: '#3B82F6', description: 'Update appointment' },
            { id: 'book_appointment', label: 'Book Appointment', icon: '📅', color: '#F59E0B', description: 'New appointment' },
            { id: 'generate_invoice', label: 'Generate Invoice', icon: '💰', color: '#8B5CF6', description: 'Create bill' },
        ],
        dashboardSections: [
            { id: 'conversations', label: 'Messages', icon: '💬', enabled: true, description: 'Patient messages' },
            { id: 'appointments', label: 'Appointments', icon: '📅', enabled: true, description: 'Today\'s appointments' },
            { id: 'patients', label: 'Patients', icon: '👥', enabled: true, description: 'Patient records' },
            { id: 'calendar', label: 'Calendar', icon: '📆', enabled: true, description: 'Schedule view' },
            { id: 'services', label: 'Services', icon: '💊', enabled: true, description: 'Medical services' },
            { id: 'analytics', label: 'Analytics', icon: '📊', enabled: true, description: 'Patient analytics' },
        ],
        defaultServices: [
            'General Consultation',
            'Vaccination',
            'Laboratory Tests',
            'X-Ray',
            'Dental Care',
            'Eye Exam',
            'Physical Therapy',
        ],
        metrics: [
            { id: 'messages_today', label: 'Messages Today', icon: '💬', format: 'number' },
            { id: 'appointments_today', label: 'Appointments Today', icon: '📅', format: 'number' },
            { id: 'waiting_patients', label: 'Waiting Patients', icon: '⏳', format: 'number' },
            { id: 'revenue_today', label: 'Revenue Today', icon: '💰', format: 'currency' },
            { id: 'cash_collected', label: 'Cash Collected', icon: '💵', format: 'currency' },
        ],
    },
};

// Helper functions
export function getBusinessTypeConfig(type: string): BusinessTypeConfig {
    return BUSINESS_TYPES[type] || BUSINESS_TYPES.AUTO_MECHANIC;
}

export function getAllBusinessTypes(): BusinessTypeConfig[] {
    return Object.values(BUSINESS_TYPES);
}

export function getBusinessTypeLabel(type: string): string {
    return BUSINESS_TYPES[type]?.name || 'Unknown Business Type';
}
