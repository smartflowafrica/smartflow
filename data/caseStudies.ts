export type CaseStudy = {
  id: string
  title: string
  slug: string
  business: string
  industry: string
  location: string
  summary: string
  challenge: string
  solution: string
  implementation?: string
  results: Array<{ metric: string; label: string; description?: string }>
  testimonial: string
  author: string
  role: string
  timeframe: string
  logo?: string
  heroImage?: string
  thumbnail?: string
  images?: string[]
  tags?: string[]
  date?: string
  featured?: boolean
}

export const caseStudies: CaseStudy[] = [
  {
    id: '1',
    title: "Mama's Kitchen — Turning missed orders into revenue",
    slug: 'mamas-kitchen',
    business: "Mama's Kitchen",
    industry: 'Restaurant',
    location: 'Lagos, NG',
    summary:
      'Automated WhatsApp ordering and reservations captured missed orders and improved customer response time.',
    challenge:
      'Missing 40–60% of incoming calls during peak hours which translated to sizable lost revenue and frustrated customers. Peak lunch and dinner rushes meant staff couldn\'t answer phones, leaving customers frustrated and orders going to competitors.',
    solution:
      'Implemented a WhatsApp-first ordering flow with automated confirmations, menu quick-replies integrated with their POS system, and smart reservation management.',
    implementation:
      'We deployed a custom WhatsApp Business API integration that handles incoming messages 24/7. Customers can browse the menu, place orders, make reservations, and track delivery status—all through simple conversational flows. The system automatically syncs with their kitchen display and payment processor.',
    results: [
      { metric: '₦465K', label: 'Additional Revenue', description: 'Monthly increase from captured orders' },
      { metric: '100%', label: 'Calls Captured', description: 'Zero missed order opportunities' },
      { metric: '4.8★', label: 'Customer Rating', description: 'Up from 4.2 stars' },
    ],
    testimonial:
      'SmartFlow changed everything for us. We never miss an order now, and our customers love how fast we respond. The WhatsApp system paid for itself in the first month. Best investment we made this year!',
    author: 'Chinedu Okafor',
    role: 'Owner',
    timeframe: '3 months',
    logo: '🍲',
    heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop',
    ],
    tags: ['Restaurant', 'WhatsApp Automation', 'Order Management', 'POS Integration'],
    date: '2024-06-01',
    featured: true,
  },
  {
    id: '2',
    title: 'Spice Route — Automating customer support and increasing conversions',
    slug: 'spice-route',
    business: 'Spice Route',
    industry: 'E-commerce',
    location: 'Abuja, NG',
    summary:
      'AI-powered WhatsApp assistant provided product help, shipping updates and payments — freeing up teams and lifting conversion.',
    challenge:
      '6+ hours daily spent answering repetitive questions about products, shipping times, payment methods, and return policies. The founder was trapped in customer service instead of growing the business, and slow response times hurt conversions.',
    solution:
      'Deployed an AI-powered WhatsApp assistant with full product catalog integration, automated order tracking, and seamless payment processing.',
    implementation:
      'Built a smart chatbot that understands natural language queries in English and Pidgin. It handles product recommendations, checks inventory in real-time, processes payments via Paystack integration, and sends automated shipping updates. Complex queries get escalated to human agents with full context.',
    results: [
      { metric: '89%', label: 'Questions Automated', description: 'AI handles most common inquiries' },
      { metric: '6hrs', label: 'Time Saved Daily', description: 'Freed up for business growth' },
      { metric: '3x', label: 'Conversion Rate', description: 'From automated product recommendations' },
    ],
    testimonial:
      'I finally have time to grow the business instead of answering the same questions all day. The ROI was immediate—we saw a 3x increase in conversions within the first month. My customers actually prefer chatting with the bot because it responds instantly!',
    author: 'Amina Mohammed',
    role: 'Founder',
    timeframe: '2 months',
    logo: '🛍️',
    heroImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    ],
    tags: ['E-commerce', 'AI Assistant', 'WhatsApp Bot', 'Payment Integration'],
    date: '2024-09-10',
    featured: true,
  },
  {
    id: '3',
    title: 'Quick Bites — Unified ordering across locations',
    slug: 'quick-bites',
    business: 'Quick Bites',
    industry: 'Fast Food Chain',
    location: 'Port Harcourt, NG',
    summary:
      'Centralized WhatsApp ordering with location-based routing and confirmations reduced order friction and increased revenue.',
    challenge:
      'Manual coordination across three locations led to inconsistent customer experiences and lost orders. Each location had different ordering processes, causing confusion and delays. No unified reporting meant managers couldn\'t track performance.',
    solution:
      'Built a centralized WhatsApp ordering system with intelligent location-based routing, automated confirmations, and real-time manager dashboards.',
    implementation:
      'Created a single WhatsApp number that automatically detects customer location and routes orders to the nearest branch. Each location has a tablet dashboard showing incoming orders, and managers receive daily performance reports. The system handles peak-hour load balancing across locations.',
    results: [
      { metric: '₦1.2M', label: 'Revenue Increase', description: 'Monthly across all locations' },
      { metric: '45%', label: 'Faster Processing', description: 'Average order fulfillment time' },
      { metric: '92%', label: 'Satisfaction Score', description: 'Up from 78%' },
    ],
    testimonial:
      'SmartFlow unified our operations across all locations. Customers get the same great experience whether they order from Location A or C. The real-time dashboards help us balance workload during rush hours. It\'s like having a central command center for our entire operation.',
    author: 'Ibrahim Yusuf',
    role: 'Operations Manager',
    timeframe: '4 months',
    logo: '🍔',
    heroImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&h=600&fit=crop',
    ],
    tags: ['Fast Food', 'Multi-Location', 'Order Routing', 'Dashboard'],
    date: '2025-01-07',
    featured: false,
  },
]

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((c) => c.slug === slug) || null
}

export function listCaseStudies() {
  // return a shallow copy so callers can slice/map without mutating original
  return [...caseStudies]
}
