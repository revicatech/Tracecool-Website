import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import logo from '../assets/LOGO.png'

function ArrowIcon({ className = 'w-3 h-3' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  )
}

function LangToggle({ className = '' }) {
  const { lang, setLang } = useLanguage()
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
      className={`flex items-center gap-1 text-xs font-semibold tracking-widest transition-colors ${className}`}
      aria-label="Toggle language"
    >
      <span className={lang === 'en' ? 'text-white' : 'text-white/35'}>EN</span>
      <span className="text-white/20 select-none">|</span>
      <span className={lang === 'ar' ? 'text-white' : 'text-white/35'}>AR</span>
    </button>
  )
}

// NavLink that handles both hash anchors (/#section) and full page routes (/solutions)
function NavLink({ href, label, onClick }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isPage = !href.includes('#')
  const isActive = isPage
    ? location.pathname === href || location.pathname.startsWith(href + '/')
    : false

  const handleClick = (e) => {
    if (onClick) onClick()
    if (href.startsWith('/#')) {
      e.preventDefault()
      const hash = href.slice(1) // '#section'
      if (location.pathname !== '/') {
        navigate('/')
        // After navigation, scroll to section
        setTimeout(() => {
          const el = document.querySelector(hash)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 300)
      } else {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  if (isPage) {
    return (
      <Link
        to={href}
        onClick={onClick}
        className="hover:text-white transition-colors"
        style={{ color: isActive ? 'white' : undefined, fontWeight: isActive ? 600 : undefined }}
      >
        {label}
      </Link>
    )
  }

  return (
    <a href={href} onClick={handleClick} className="hover:text-white transition-colors">
      {label}
    </a>
  )
}

export default function Navbar() {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const nav = t('nav')

  const navLinks = [
    { href: '/#home', label: nav.home },
    { href: '/about', label: nav.about },
    { href: '/solutions', label: nav.solutions },
    { href: '/services', label: nav.services },
    { href: '/products', label: nav.products },
    { href: '/contact', label: nav.contact },
  ]

  const drawerLinks = [
    ...navLinks,
    { href: '/about#global-network', label: nav.globalOffices },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const closeDrawer = () => setDrawerOpen(false)

  return (
    <>
      <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4" id="navbar">
        <div id="navbar-pill" className={`rounded-full w-full max-w-5xl px-5 py-3 flex justify-between items-center${scrolled ? ' scrolled' : ''}`}>
          {/* Logo */}
          <Link to="/" className="leading-none">
            <img src={logo} alt="Tracecool" className="h-8 w-auto" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-7 rtl:space-x-reverse text-sm font-medium text-white/80">
            {navLinks.map(link => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </div>

          {/* Desktop Right: Lang toggle + CTA */}
          <div className="hidden md:flex items-center gap-5">
            <LangToggle />
            <NavLink href="/contact" label={
              <span className="cta-pill text-white text-sm font-medium flex items-center gap-3">
                <span>{nav.getQuote}</span>
                <span className="icon"><ArrowIcon /></span>
              </span>
            } />
          </div>

          {/* Mobile: Lang toggle + Hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <LangToggle />
            <button id="mobile-menu-btn" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
              <div className="hamburger-icon">
                <span></span><span></span><span></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer Overlay */}
      <div id="drawer-overlay" className={drawerOpen ? 'open' : ''} onClick={closeDrawer}></div>

      {/* Side Drawer */}
      <aside id="side-drawer" className={drawerOpen ? 'open' : ''} aria-label="Navigation menu">
        <div className="flex justify-between items-start mb-6">
          <img src={logo} alt="Tracecool" className="h-7 w-auto" />
          <button id="drawer-close-btn" aria-label="Close menu" onClick={closeDrawer}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="w-8 h-0.5 bg-accent mb-7 rounded-full"></div>

        <nav className="flex flex-col flex-1">
          {drawerLinks.map(link => (
            <NavLink
              key={link.href}
              href={link.href}
              onClick={closeDrawer}
              label={
                <span className="drawer-link flex items-center justify-between w-full">
                  {link.label}
                  <svg className="drawer-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              }
            />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <NavLink
            href="/contact"
            onClick={closeDrawer}
            label={
              <span
                className="cta-pill text-white text-sm font-medium w-full justify-between mb-5 flex"
              >
                <span>{nav.getFreeQuote}</span>
                <span className="icon">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </span>
            }
          />
          <div className="space-y-1.5 mt-5">
            <p className="text-white/35 text-xs">{nav.contactEmail}</p>
            <p className="text-white/35 text-xs">{nav.contactPhone}</p>
          </div>
        </div>
      </aside>
    </>
  )
}
