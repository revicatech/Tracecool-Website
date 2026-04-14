import { useLanguage } from '../context/LanguageContext'
import logo from '../assets/LOGO.png'

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/tracecool.lb?igsh=MXZjaWd0MGQwbzY4MQ%3D%3D&utm_source=qr',
    d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1DUnWjwd9Q/?mibextid=wwXIfr',
    d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@trace.cool.lb?_r=1&_t=ZS-95VZ1XOIjv3',
    d: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.5a8.18 8.18 0 004.79 1.52V6.56a4.85 4.85 0 01-1.02.13z',
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
              {socialLinks.map(({ label, href, d }) => (
                <a key={label} href={href} target="_blank" aria-label={`Follow TRACECOOL on ${label}`} rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-accent-light hover:bg-accent/10 transition-all">
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
                <li className="leading-relaxed whitespace-pre-line">
                  <a href="https://www.google.com/maps/place/33%C2%B050'09.3%22N+35%C2%B054'42.8%22E/@33.8359242,35.9093041,17z/data=!3m1!4b1!4m4!3m3!8m2!3d33.8359242!4d35.911879?hl=en&entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{footer.address}</a>
                </li>
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

        <div className="border-t border-white/10 py-6 flex items-center justify-center text-xs text-white/30">
          <span>{footer.copyright}</span>
        </div>
      </div>
    </footer>
  )
}
