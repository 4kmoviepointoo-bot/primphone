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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
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
                  <div key={text} className="flex items-center gap-3 text-slate-400 text-sm">
                    {icon}
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              {/* Socials */}
              <div className="flex gap-3 mt-8">
                {socials.map(({ name, icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    aria-label={`Follow PrimePhone on ${name}`}
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full glass border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/30 transition-all duration-300"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items], ci) => (
            <ScrollReveal key={category} direction="up" delay={ci * 0.1}>
              <h4 className="font-mono text-xs uppercase tracking-widest text-primary mb-5">
                {category}
              </h4>
              <ul className="space-y-3">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-slate-400 text-sm hover:text-slate-800 transition-colors duration-200 animated-underline"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          ))}
        </div>

        {/* Newsletter */}
        <ScrollReveal direction="up" delay={0.3}>
          <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h4 className="font-heading text-xl text-slate-800">
                  Stay in the loop
                </h4>
                <p className="text-slate-400 text-sm mt-1">
                  Get exclusive offers and new product alerts.
                </p>
              </div>
              <form
                className="flex gap-3 w-full md:w-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  id="newsletter-email"
                  aria-label="Email address for newsletter"
                  placeholder="your@email.com"
                  className="input-primary rounded-sm px-4 py-3 text-sm flex-1 md:w-64"
                />
                <button 
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="btn-primary px-6 py-3 rounded-sm text-sm whitespace-nowrap"
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


