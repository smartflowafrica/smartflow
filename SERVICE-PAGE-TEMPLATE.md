# Service Page Template

Use this template to quickly create the remaining service pages:
- Email Marketing Automation
- Payment Processing
- Workflow Automation
- Custom Development

## File Structure

Each service page should be at: `app/services/[service-slug]/page.tsx`

## Template Structure

```tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircleIcon, [OtherIcons] } from '@heroicons/react/24/outline'

export default function [ServiceName]Page() {
  return (
    <>
      {/* 1. Hero Section */}
      <section className="section-padding gradient-bg text-white">
        {/* Service name, value proposition, stats grid, 2 CTAs */}
      </section>

      {/* 2. Features Section */}
      <section className="section-padding bg-white">
        {/* 6 key features with icons and descriptions */}
      </section>

      {/* 3. Use Cases / Examples Section */}
      <section className="section-padding bg-gray-50">
        {/* 3 real-world examples or use cases */}
      </section>

      {/* 4. How It Works (Optional) */}
      <section className="section-padding bg-white">
        {/* Step-by-step process */}
      </section>

      {/* 5. Pricing Section */}
      <section id="pricing" className="section-padding bg-white">
        {/* Pricing tiers or add-on pricing */}
      </section>

      {/* 6. FAQ (Optional) */}
      <section className="section-padding bg-gray-50">
        {/* 3-4 common questions */}
      </section>

      {/* 7. Final CTA */}
      <section className="section-padding gradient-bg text-white">
        {/* Final call-to-action matching service */}
      </section>
    </>
  )
}
```

## Remaining Services to Build

### 1. Email Marketing Automation (`/services/email-automation`)

**Hero Stats:**
- 10K+ emails sent monthly
- 45% open rate
- 3x conversion vs manual
- 2hrs saved daily

**Key Features:**
- Welcome email sequences
- Abandoned cart recovery
- Post-purchase follow-ups
- Newsletter automation
- A/B testing
- Analytics dashboard

**Use Cases:**
- E-commerce: Abandoned cart emails
- SaaS: Onboarding sequences
- Content Creators: Newsletter automation

**Pricing:** From ₦25,000/month

---

### 2. Payment Processing (`/services/payment-processing`)

**Hero Stats:**
- ₦50M+ processed monthly
- 99.9% success rate
- 30sec payment time
- Zero manual invoicing

**Key Features:**
- Paystack & Flutterwave integration
- Automated payment link generation
- Payment confirmation automation
- Invoice creation
- Recurring billing
- Payment analytics

**Use Cases:**
- E-commerce: Instant checkout links
- Service Providers: Service payment collection
- Subscriptions: Recurring payment automation

**Pricing:** From ₦30,000/month + transaction fees

---

### 3. Workflow Automation (`/services/workflow-automation`)

**Hero Stats:**
- 1000+ workflows
- 90% time saved
- Zero errors
- Custom solutions

**Key Features:**
- Custom trigger-action workflows
- Multi-step automation
- Conditional logic
- Data transformation
- Third-party API integration
- Scheduled tasks

**Use Cases:**
- Operations: Inventory sync across platforms
- Logistics: Order routing automation
- Manufacturing: Production tracking

**Pricing:** From ₦50,000/month

---

### 4. Custom Development (`/services/custom-development`)

**Hero Stats:**
- 20+ projects delivered
- 100% satisfaction
- Enterprise-grade
- Dedicated team

**Key Features:**
- Custom API development
- Bespoke integrations
- Mobile app integration
- Custom dashboards
- Advanced AI features
- Dedicated development team

**Use Cases:**
- Enterprise: Complex multi-system integration
- Unique Requirements: Industry-specific solutions
- Complex Systems: Legacy system integration

**Pricing:** Custom pricing (starts at ₦200,000 one-time + monthly support)

---

## Quick Build Instructions

For each service:

1. **Copy template** from WhatsApp Automation or CRM Integration page
2. **Update hero section** with service-specific content
3. **Replace stats** in hero grid (4 stats)
4. **Update features** (6 features with icons)
5. **Add use cases** (3 examples)
6. **Set pricing** based on service
7. **Update final CTA** to match service value prop
8. **Test page** at http://localhost:3000/services/[slug]

## Icons to Use

Import from `@heroicons/react/24/outline`:

- **Email:** EnvelopeIcon, InboxIcon, PaperAirplaneIcon
- **Payment:** CreditCardIcon, BanknotesIcon, ShoppingCartIcon
- **Workflow:** Cog6ToothIcon, ArrowPathIcon, BoltIcon
- **Custom Dev:** CodeBracketIcon, CommandLineIcon, CpuChipIcon

## Content Guidelines

- **Hero headline:** Clear benefit statement (not just service name)
- **Description:** Focus on pain point solved, not technical features
- **Stats:** Use real numbers when possible, estimates when not
- **Features:** Lead with benefit, follow with explanation
- **Use cases:** Specific business names and results (can be generic)
- **CTAs:** Action-oriented ("Schedule Demo" not "Learn More")

## Navigation Updates

After creating all service pages, they will automatically appear in the header dropdown (already configured in Header.tsx).

Current dropdown links:
- WhatsApp Automation ✅
- CRM Integration ✅
- Email Automation (TODO)
- Payment Processing (TODO)
- Workflow Automation (TODO)
- Custom Development (TODO)

## Testing Checklist

For each service page:

- [ ] Page loads without errors
- [ ] Hero section displays correctly
- [ ] All stats visible and formatted
- [ ] Features section has 6 items
- [ ] Icons load correctly
- [ ] Pricing section shows correct amount
- [ ] All CTAs link to /demo or /contact
- [ ] Mobile responsive (test at 375px, 768px, 1024px)
- [ ] Animations work smoothly
- [ ] No TypeScript errors

## Time Estimate

- Email Automation: 30 minutes
- Payment Processing: 30 minutes
- Workflow Automation: 30 minutes
- Custom Development: 30 minutes

**Total: ~2 hours for all remaining service pages**

---

## Example: Quick Email Automation Page

```tsx
export default function EmailAutomationPage() {
  return (
    <>
      <section className="section-padding gradient-bg text-white">
        <div className="container-custom">
          <h1>Email Marketing Automation</h1>
          <p>Send the right message at the right time. Automatically.</p>
          {/* Stats: 10K+ emails, 45% open rate, 3x conversion, 2hrs saved */}
        </div>
      </section>
      
      {/* Features: Welcome sequences, Cart recovery, Follow-ups, etc. */}
      {/* Use Cases: E-commerce, SaaS, Content creators */}
      {/* Pricing: ₦25,000/month */}
      {/* Final CTA */}
    </>
  )
}
```

---

This template ensures consistency across all service pages while allowing customization for each service's unique value proposition.
