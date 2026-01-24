# SmartFlow Africa Website

A modern, high-converting website for SmartFlow Africa - AI Automation for Nigerian Businesses.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**

```powershell
npm install
```

2. **Run the development server:**

```powershell
npm run dev
```

3. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
SmartFlowAfricaNew/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Header/Footer
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── layout/            # Header, Footer
│   ├── home/              # Homepage sections
│   └── ui/                # Reusable UI components
├── data/                  # Website content and configuration
├── styles/                # Global CSS and Tailwind
├── public/                # Static assets (images, etc.)
└── lib/                   # Utility functions

```

## 🎨 Design System

### Colors

- **Primary Blue:** `#0066FF` - Trust, technology
- **Secondary Green:** `#00D9A6` - Growth, success
- **Accent Orange:** `#FF6B35` - Energy, action
- **Dark:** `#1A1A1A` - Professional
- **Light:** `#F8F9FA` - Clean background

### Typography

- **Font:** Inter (Google Fonts)
- **Headings:** Bold (700 weight)
- **Body:** Regular (400 weight)
- **Code:** JetBrains Mono

### Components

Use Tailwind CSS utility classes and custom components:

```tsx
// Primary button
<Link href="/demo" className="btn-primary">
  Get Started
</Link>

// Secondary button
<Link href="/contact" className="btn-secondary">
  Learn More
</Link>

// Container
<div className="container-custom">
  {/* Content */}
</div>

// Section padding
<section className="section-padding">
  {/* Content */}
</section>
```

## 📄 Key Pages

### Implemented
- ✅ Homepage (with Hero section)
- ✅ Header (with navigation)
- ✅ Footer (with links)

### To Implement
- ⏳ Services pages
- ⏳ Industries pages
- ⏳ Pricing page
- ⏳ Demo booking page
- ⏳ Contact page
- ⏳ Case studies
- ⏳ About page
- ⏳ Resources/Blog

## 🛠️ Development

### Available Scripts

```powershell
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Code Style

- Use TypeScript for type safety
- Use Tailwind CSS for styling
- Use Framer Motion for animations
- Follow Next.js App Router conventions
- Use 'use client' directive for client components

## 🎯 Features

### Implemented
- ✅ Responsive navigation with dropdown menus
- ✅ Mobile-friendly hamburger menu
- ✅ Animated hero section
- ✅ Custom color scheme
- ✅ SEO-optimized metadata

### To Implement
- ⏳ Interactive ROI calculator
- ⏳ Demo booking form with calendar
- ⏳ Contact forms
- ⏳ Case study showcase
- ⏳ Blog system
- ⏳ Analytics integration
- ⏳ Performance optimization

## 📊 Performance Targets

- Lighthouse Performance: 90+
- Lighthouse Accessibility: 95+
- Lighthouse Best Practices: 95+
- Lighthouse SEO: 100
- Page load time: < 3 seconds

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Forms
NEXT_PUBLIC_FORM_ENDPOINT=https://api.smartflowafrica.com/forms

# Demo Booking
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/smartflowafrica
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Other Platforms

Build the production version:

```powershell
npm run build
```

The output will be in the `.next` folder.

## 📝 Content Management

Website content is stored in `/data` folder as TypeScript/JSON files. To update:

1. Edit the relevant data file
2. Changes will reflect immediately in development
3. Build and deploy for production

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📞 Support

For questions or issues:
- Email: hello@smartflowafrica.com
- Phone: +234-XXX-XXX-XXXX
- WhatsApp: +234-XXX-XXX-XXXX

## 📄 License

© 2025 SmartFlow Africa. All rights reserved.

---

## 🎯 Next Steps

1. **Install dependencies:**
   ```powershell
   npm install
   ```

2. **Start development:**
   ```powershell
   npm run dev
   ```

3. **Begin building additional sections:**
   - LogoCloud component
   - ProblemSolution component
   - ServicesOverview component
   - And more...

4. **Add content:**
   - Replace placeholder text
   - Add real images
   - Update contact information

5. **Test and optimize:**
   - Mobile responsiveness
   - Cross-browser compatibility
   - Performance optimization

Happy coding! 🚀
