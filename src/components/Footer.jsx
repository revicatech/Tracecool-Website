import { useLanguage } from '../context/LanguageContext'
import logo from '../assets/LOGO.png'

const socialLinks = [
  {
    label: 'LinkedIn',
    d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    label: 'Twitter / X',
    d: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
  },
  {
    label: 'Instagram',
    d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
]

export default function Footer() {
  const { t } = useLanguage()
  const footer = t('footer')

  return (
    <footer className="bg-primary text-white relative" style={{ zIndex: 1 }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 py-20">

          {/* Brand Column */}
          <div className="lg:w-5/12">
            <div className="mb-6">
              <a href="/">
                <img src={logo} alt="Tracecool" className="h-20 w-auto" />
              </a>
            </div>
            <div className="w-10 h-px bg-accent mb-6"></div>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-8">{footer.desc}</p>

            <div className="flex gap-3 mb-10">
              {socialLinks.map(({ label, d }) => (
                <a key={label} href="#" aria-label={`Follow TRACECOOL on ${label}`} rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-accent-light hover:bg-accent/10 transition-all">
                  <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>

            <div className="flex gap-4 flex-wrap">
              {['ISO 9001', 'ASHRAE', 'VDMA'].map(cert => (
                <span key={cert} className="text-[10px] uppercase tracking-widest text-white/30 border border-white/10 px-3 py-1.5 rounded-full">
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:w-7/12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
            <div>
              <h5 className="text-xs uppercase tracking-widest text-white/30 mb-5">{footer.company}</h5>
              <ul className="space-y-3 text-sm text-white/60">
                {footer.companyLinks.map(({ href, label }) => (
                  <li key={label}><a href={href} className="hover:text-white transition-colors">{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-xs uppercase tracking-widest text-white/30 mb-5">{footer.services}</h5>
              <ul className="space-y-3 text-sm text-white/60">
                {footer.serviceLinks.map(({ href, label }) => (
                  <li key={label}><a href={href} className="hover:text-white transition-colors">{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-xs uppercase tracking-widest text-white/30 mb-5">{footer.contact}</h5>
              <ul className="space-y-3 text-sm text-white/60">
                <li className="leading-relaxed whitespace-pre-line">{footer.address}</li>
                <li><a href={`mailto:${footer.email}`} className="hover:text-white transition-colors">{footer.email}</a></li>
                <li><a href={`tel:${footer.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{footer.phone}</a></li>
                <li className="pt-2">
                  <a href="/#contact" className="inline-flex items-center gap-2 text-accent-light hover:text-white transition-colors text-xs font-medium">
                    {footer.getQuote}
                    <svg className="w-3 h-3 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <span>{footer.copyright}</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/60 transition-colors">{footer.privacy}</a>
            <a href="#" className="hover:text-white/60 transition-colors">{footer.imprint}</a>
            <a href="#" className="hover:text-white/60 transition-colors">{footer.cookies}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
