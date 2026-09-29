import { useEffect } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'
import { useLocation } from 'react-router-dom'

const contentMap: Record<string, { title: string, subtitle: string, body: React.ReactNode }> = {
  '/about': {
    title: 'About PrimePhone',
    subtitle: 'Elevating the mobile experience.',
    body: (
      <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
        <p>
          Founded on the principle that technology should be as beautiful as it is powerful, PrimePhone is your premier destination for curated Google Pixel devices.
        </p>
        <p>
          We don't just sell phones; we provide a gateway to Google's incredibly intelligent ecosystem, wrapped in a luxury retail experience. Every device we offer is strictly verified and comes with extended warranty and premium support.
        </p>
      </div>
    ),
  },
  '/faq': {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know.',
    body: (
      <div className="space-y-6 text-slate-600">
        <h3 className="text-xl font-bold text-slate-800">What is your return policy?</h3>
        <p>We offer a 30-day no-questions-asked return policy for all unopened devices.</p>
        <h3 className="text-xl font-bold text-slate-800">Do you offer international shipping?</h3>
        <p>Yes, we ship globally using express insured couriers.</p>
        <h3 className="text-xl font-bold text-slate-800">Are the devices unlocked?</h3>
        <p>Every single device sold on PrimePhone is factory unlocked and ready for global use.</p>
      </div>
    ),
  },
  '/contact': {
    title: 'Contact Us',
    subtitle: 'We are here to help 24/7.',
    body: (
      <div className="space-y-6 text-slate-600">
        <p>Email: <strong>hello@primphone.com</strong></p>
        <p>Phone: <strong>+971 4 123 4567</strong></p>
        <p>Address: <strong>Dubai Marina, UAE</strong></p>
        <p>Our dedicated concierge team usually replies within 15 minutes.</p>
      </div>
    ),
  },
  '/terms-of-service': {
    title: 'Terms of Service',
    subtitle: 'Clear, transparent ownership and service agreement.',
    body: (
      <div className="space-y-8 text-slate-600 leading-relaxed">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">1. Agreement to Terms</h3>
          <p>By browsing, accessing, or purchasing from PrimePhone, you agree to be bound by these Terms of Service. All devices sold are 100% genuine factory unlocked Google Pixel units backed by manufacturer warranties.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">2. Warranty & Authenticity Guarantee</h3>
          <p>Every smartphone sold includes an official 2-year warranty covering technical and hardware defects. Our concierge support coordinates fast diagnostics and repair or replacement.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">3. Orders, Pricing & Payment</h3>
          <p>Prices are listed in USD and include all standard duties unless otherwise noted. Payments are processed securely with 256-bit SSL encryption. We reserve the right to cancel suspicious or fraudulent orders.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">4. Insured Global Shipping & Deliveries</h3>
          <p>We utilize express insured couriers (DHL / FedEx Express). Ownership and risk of loss transfer upon confirmed delivery signature to your shipping address.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">5. Returns & Refunds</h3>
          <p>Unopened devices may be returned within 30 days of delivery for a full refund. Opened items must be in pristine condition with all original packaging and accessories.</p>
        </div>
      </div>
    ),
  },
  '/privacy-policy': {
    title: 'Privacy Policy',
    subtitle: 'Your personal data, protected with absolute integrity.',
    body: (
      <div className="space-y-8 text-slate-600 leading-relaxed">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">1. Information We Collect</h3>
          <p>We only collect information strictly necessary to process your orders, deliver shipments, and provide concierge customer support. This includes your name, shipping address, email, and phone number.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">2. How We Protect Your Data</h3>
          <p>PrimePhone implements strict end-to-end encryption protocols. Payment information is processed directly by certified PCI-DSS compliant gateways—we never store your raw credit card data on our servers.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">3. Zero Selling of Personal Data</h3>
          <p>We believe your privacy is fundamental. We do not sell, rent, or trade your personal information with third-party advertisers or data brokers under any circumstances.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">4. Your Rights (GDPR & CCPA)</h3>
          <p>You have the full right to access, rectify, download, or request permanent deletion of your account and personal data at any time by contacting privacy@primphone.com.</p>
        </div>
      </div>
    ),
  },
  '/cookie-policy': {
    title: 'Cookie Policy',
    subtitle: 'How we use essential cookies to power your luxury shopping experience.',
    body: (
      <div className="space-y-8 text-slate-600 leading-relaxed">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">1. What Are Cookies?</h3>
          <p>Cookies are small, encrypted text files stored on your browser to enable core shopping functions such as retaining items in your shopping bag, preserving login sessions, and remembering your region preferences.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">2. Essential Cookies</h3>
          <p>These cookies are required for the website to function. They power shopping cart persistence, authentication tokens, and secure checkout navigation.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">3. Performance & Analytics Cookies</h3>
          <p>We use anonymous telemetry cookies to monitor website loading speeds, identify broken links, and optimize device rendering for mobile users.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">4. Managing Your Preferences</h3>
          <p>You can manage or disable non-essential cookies at any time through your browser settings without affecting your ability to browse products.</p>
        </div>
      </div>
    ),
  },
  '/shipping-info': {
    title: 'Shipping & Delivery',
    subtitle: 'Express global delivery, fully insured and tracked in real time.',
    body: (
      <div className="space-y-8 text-slate-600 leading-relaxed">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">1. Complimentary Express Courier</h3>
          <p>Every Google Pixel order qualifies for free insured priority shipping via DHL Express or FedEx Air. Delivery typically takes 2–4 business days worldwide.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">2. White-Glove Packaging</h3>
          <p>Each unit is packed inside tamper-evident, climate-controlled, shock-absorbent luxury packaging to ensure your pristine flagship device arrives in immaculate condition.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">3. Real-Time Tracking & Signature</h3>
          <p>Once dispatched, you receive direct SMS and email tracking updates with minute-by-minute status. Direct signature is required upon delivery for complete security.</p>
        </div>
      </div>
    ),
  },
  '/returns': {
    title: 'Returns & Exchange',
    subtitle: '30-Day Hassle-Free Return Guarantee with Pre-Paid Concierge Pickup.',
    body: (
      <div className="space-y-8 text-slate-600 leading-relaxed">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">1. 30-Day Money-Back Guarantee</h3>
          <p>If you are not completely enchanted by your new Pixel, you may initiate a return within 30 days of delivery for a full 100% refund.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">2. Pre-Paid Return Waybill</h3>
          <p>Contact our concierge team at support@primphone.com to receive an immediate prepaid DHL/FedEx insured return label. Schedule a courier pickup directly from your doorstep.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">3. Rapid Reimbursement</h3>
          <p>Refunds are initiated back to your original payment method within 24 hours of device receipt and inspection.</p>
        </div>
      </div>
    ),
  },
  '/careers': {
    title: 'Join PrimePhone',
    subtitle: 'Shape the future of luxury smartphone retail and AI device ecosystems.',
    body: (
      <div className="space-y-8 text-slate-600 leading-relaxed">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Our Mission</h3>
          <p>We believe smartphones are the most intimate piece of technology humans interact with. We are building the world's most curated, high-touch platform for Android's smartest hardware.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Open Positions</h3>
          <div className="space-y-3 mt-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800">Senior Full-Stack Engineer (React / Node.js)</h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Remote • Full-Time • Engineering</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">Apply</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800">Hardware Concierge & Product Specialist</h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Dubai / London • Full-Time • Customer Experience</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">Apply</span>
            </div>
          </div>
        </div>
        <div>
          <p>Interested in joining? Send your portfolio or resume to <strong>careers@primphone.com</strong>.</p>
        </div>
      </div>
    ),
  },
  '/press': {
    title: 'Press & Media Kit',
    subtitle: 'Official brand assets, executive bios, and recent press announcements.',
    body: (
      <div className="space-y-8 text-slate-600 leading-relaxed">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Press Inquiries</h3>
          <p>For interview requests, review device loaners, or executive quotes, please email our press desk at <strong>press@primphone.com</strong>. We respond to accredited journalists within 4 hours.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Brand Identity & Assets</h3>
          <p>Download official high-resolution vector logos, product photography, and brand guidelines for publication use.</p>
        </div>
      </div>
    ),
  },
  '/blog': {
    title: 'PrimePhone Journal',
    subtitle: 'Insights, in-depth reviews, and photography guides for Google Pixel.',
    body: (
      <div className="space-y-8 text-slate-600 leading-relaxed">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
            <span className="text-xs font-mono text-primary font-bold uppercase tracking-wider">Deep Dive</span>
            <h4 className="text-lg font-bold text-slate-800 mt-2">Inside Tensor G4: How Gemini Nano Runs 100% On-Device</h4>
            <p className="text-sm text-slate-500 mt-2">An architectural overview of Google's latest custom silicon and why local inference changes privacy forever.</p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
            <span className="text-xs font-mono text-primary font-bold uppercase tracking-wider">Photography</span>
            <h4 className="text-lg font-bold text-slate-800 mt-2">Pro Controls & Night Sight: Mastering the 50MP Triple Camera</h4>
            <p className="text-sm text-slate-500 mt-2">Step-by-step techniques to capture DSLR-grade astro-photography and editorial portraits on Pixel 9 Pro XL.</p>
          </div>
        </div>
      </div>
    ),
  },
}

export default function StaticPage() {
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const content = contentMap[pathname] || {
    title: pathname.substring(1).replace('-', ' ').toUpperCase(),
    subtitle: 'Page under construction.',
    body: <p className="text-slate-600">More information coming soon.</p>,
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-slate-800 mb-4 capitalize">
              {content.title}
            </h1>
            <p className="font-mono text-slate-500 uppercase tracking-widest text-sm">
              {content.subtitle}
            </p>
            <div className="w-16 h-1 bg-primary mx-auto mt-8 rounded-full opacity-50" />
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={0.2}>
          <motion.div 
            className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {content.body}
          </motion.div>
        </ScrollReveal>
      </div>
    </div>
  )
}
