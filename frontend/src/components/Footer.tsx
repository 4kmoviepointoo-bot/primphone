import { Link } from 'react-router-dom'
import { Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

const links = {
  'Products': [
    { label: 'Pixel 9 Series', href: '/shop?search=pixel+9' },
    { label: 'Pixel Fold', href: '/shop?search=fold' },
    { label: 'All Phones', href: '/shop' },
    { label: 'Accessories', href: '/shop' },
  ],
  'Support': [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping Info', href: '/shipping-info' },
    { label: 'Returns', href: '/returns' },
    { label: 'Contact Us', href: '/contact' },
  ],
  'Company': [
    { label: 'About', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
  ],
}

const socials = [
  { name: 'Instagram', icon: <Instagram className="w-4 h-4" />, href: '#' },
  { name: 'Twitter', icon: <Twitter className="w-4 h-4" />, href: '#' },
  { name: 'YouTube', icon: <Youtube className="w-4 h-4" />, href: '#' },
]

export default function Footer() {
  return (
    <footer className="relative bg-white border-t border-slate-200 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 orb orb-primary opacity-30" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 orb orb-purple opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-5">
            <ScrollReveal direction="left">
              <Link to="/" className="inline-block mb-6">
                <span className="font-display text-3xl font-light tracking-widest">
                  <span className="gradient-primary">PRIME</span>
                  <span className="text-slate-800">PHONE</span>
                </span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Experience the pinnacle of mobile technology. Curated Google Pixel devices
                for the discerning enthusiast.
              </p>

              {/* Contact info */}
              <div className="mt-8 space-y-3">
                {[
                  { icon: <MapPin className="w-4 h-4 text-primary flex-shrink-0" />, text: 'Dubai Marina, UAE' },
                  { icon: <Phone className="w-4 h-4 text-primary flex-shrink-0" />, text: '+971 4 123 4567' },
                  { icon: <Mail className="w-4 h-4 text-primary flex-shrink-0" />, text: 'hello@primphone.com' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                    {icon}
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              {/* Socials - Matching solid primary accent of contact info */}
              <div className="flex gap-3 mt-8">
                {socials.map(({ name, icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    aria-label={`Follow PrimePhone on ${name}`}
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-xs"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Link columns - Even distribution with consistent gutters */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {Object.entries(links).map(([category, items], ci) => (
              <ScrollReveal key={category} direction="up" delay={ci * 0.1}>
                <h3 className="font-mono text-xs uppercase tracking-widest text-primary mb-5 font-bold">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {items.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        to={href}
                        className="text-slate-500 text-sm hover:text-slate-900 transition-colors duration-200 animated-underline font-medium"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Newsletter - Aligned to exact left margin of logo and contact info */}
        <ScrollReveal direction="up" delay={0.3}>
          <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 max-w-4xl">
              <div>
                <h3 className="font-heading text-xl text-slate-900 font-bold">
                  Stay in the loop
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Get exclusive offers, feature releases, and new product alerts.
                </p>
              </div>
              <form
                className="flex items-center gap-3 w-full sm:w-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  id="newsletter-email"
                  aria-label="Email address for newsletter"
                  placeholder="your@email.com"
                  className="input-primary rounded-full px-5 py-3 text-sm flex-1 sm:w-72 shadow-xs bg-slate-50 border border-slate-200/80"
                />
                <button 
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="btn-primary px-7 py-3 rounded-full text-sm font-bold whitespace-nowrap shadow-md shadow-primary/20"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs font-mono">
            © {new Date().getFullYear()} PrimePhone. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms of Service', href: '/terms-of-service' },
              { label: 'Cookie Policy', href: '/cookie-policy' }
            ].map(({ label, href }) => (
              <Link key={label} to={href} className="text-slate-400 text-xs hover:text-primary transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}


