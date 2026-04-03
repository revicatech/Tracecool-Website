import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import { gsap } from 'gsap'
import { agents } from '../data/pageData'

function makeIcon(isHQ) {
  return L.divIcon({
    className: 'tc-marker-wrap',
    html: `<div class="tc-ring"></div><div class="tc-dot${isHQ ? ' hq' : ''}"></div>`,
    iconSize: [20, 20], iconAnchor: [10, 10], popupAnchor: [0, -14],
  })
}

// ── HQ mini-map ───────────────────────────────────────────────
function HQMap() {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)

  useEffect(() => {
    if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null }

    const map = L.map(mapRef.current, {
      center: [49.6317, 8.3575],
      zoom: 13,
      scrollWheelZoom: false,
      zoomControl: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
    })
    mapInstance.current = map

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO',
    }).addTo(map)

    L.marker([49.6317, 8.3575], { icon: makeIcon(true) })
      .addTo(map)
      .bindPopup('<div style="color:#fff;font-size:11px;padding:2px 0">TRACECOOL HQ<br><span style="color:rgba(255,255,255,0.45);font-size:9px">Worms, Germany</span></div>', { closeButton: false })
      .openPopup()

    return () => { map.remove(); mapInstance.current = null }
  }, [])

  return (
    <div
      ref={mapRef}
      className="w-full rounded-2xl overflow-hidden"
      style={{ height: 260, border: '1px solid rgba(255,255,255,0.07)' }}
    />
  )
}

// ── Contact item ──────────────────────────────────────────────
function ContactItem({ icon, label, value, href }) {
  const inner = (
    <div
      className="flex items-start gap-4 p-5 rounded-2xl group transition-all duration-300 hover:-translate-y-0.5"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(26,111,219,0.1)'
        e.currentTarget.style.borderColor = 'rgba(26,111,219,0.3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(26,111,219,0.2)' }}
      >
        <svg className="w-4.5 h-4.5" style={{ color: '#4D9EFF', width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon === 'location' && <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></>}
          {icon === 'email' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
          {icon === 'phone' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />}
          {icon === 'clock' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
        </svg>
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
        <p className="text-sm font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>{value}</p>
      </div>
    </div>
  )

  return href ? <a href={href}>{inner}</a> : inner
}

// ── Office row ────────────────────────────────────────────────
function OfficeRow({ agent }) {
  return (
    <div
      className="flex items-center justify-between py-4 transition-colors group"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: agent.isHQ ? '#ffffff' : '#4D9EFF' }}
        ></div>
        <div>
          <p className="text-sm font-medium text-white group-hover:text-[#4D9EFF] transition-colors">
            {agent.name}, {agent.country}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{agent.type}</p>
        </div>
      </div>
      <a
        href={`mailto:${agent.email}`}
        className="text-xs transition-colors"
        style={{ color: 'rgba(255,255,255,0.35)' }}
        onMouseEnter={e => e.currentTarget.style.color = '#4D9EFF'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
      >
        {agent.email}
      </a>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [activeService, setActiveService] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    gsap.fromTo('.contact-hero-content > *',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.14, ease: 'power3.out', delay: 0.1 }
    )
  }, [])

  const serviceOptions = [
    'HVAC System Design',
    'Energy Efficiency Consulting',
    'Installation & Commissioning',
    'Maintenance Contract',
    'Emergency Service',
    'Building Automation / BMS',
    'Other',
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div style={{ background: '#071525', minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative pt-36 pb-20 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #040D1A 0%, #071525 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(ellipse at 30% 40%, rgba(26,111,219,0.28) 0%, transparent 65%)' }}
        ></div>
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 contact-hero-content">
          <div className="section-label light mb-5">Contact</div>
          <h1 className="text-5xl lg:text-7xl font-medium text-white mb-6 leading-tight">
            How to<br />
            <span className="text-gradient italic font-light">Reach Us.</span>
          </h1>
          <p className="text-white/50 max-w-xl text-sm leading-relaxed">
            Ready to optimise your building's climate system? Whether it's a new installation, an energy audit,
            or an urgent maintenance issue — our global team is ready to help.
          </p>
        </div>
      </section>

      {/* ── Main grid ─────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#071525' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* ── Contact info + HQ map (2 cols) ──────────────── */}
            <div className="lg:col-span-2 space-y-5">
              <h2 className="text-xl font-semibold text-white mb-6">Headquarters</h2>

              <ContactItem icon="location" label="Address" value="Lutherring 12, 67547 Worms, Germany" />
              <ContactItem icon="email" label="Email" value="info@tracecool.de" href="mailto:info@tracecool.de" />
              <ContactItem icon="phone" label="Phone" value="+49 (0) 6241 / 123 456" href="tel:+4962411234556" />
              <ContactItem icon="clock" label="Office Hours" value="Mon – Fri, 08:00 – 18:00 CET · Emergency 24/7" />

              {/* HQ mini-map */}
              <div className="mt-4">
                <HQMap />
              </div>

              {/* Certifications */}
              <div className="flex gap-3 pt-2">
                {['ISO 9001', 'ASHRAE', 'VDMA'].map(cert => (
                  <span
                    key={cert}
                    className="text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full"
                    style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }}
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Contact Form (3 cols) ──────────────────────── */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div
                  className="h-full flex flex-col items-center justify-center text-center py-20 rounded-2xl"
                  style={{ background: 'rgba(26,111,219,0.07)', border: '1px solid rgba(26,111,219,0.2)' }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                    style={{ background: 'rgba(26,111,219,0.2)' }}
                  >
                    <svg className="w-8 h-8" style={{ color: '#4D9EFF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">Message Sent!</h3>
                  <p className="text-sm max-w-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Thank you for reaching out. One of our engineers will respond within one business day.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-xs font-medium transition-colors"
                    style={{ color: '#4D9EFF' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = '#4D9EFF'}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Send a Message</h2>

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Smith"
                        className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'white',
                          outline: 'none',
                        }}
                        onFocus={e => { e.target.style.borderColor = '#1A6FDB'; e.target.style.background = 'rgba(26,111,219,0.08)' }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'white',
                          outline: 'none',
                        }}
                        onFocus={e => { e.target.style.borderColor = '#1A6FDB'; e.target.style.background = 'rgba(26,111,219,0.08)' }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
                      />
                    </div>
                  </div>

                  {/* Company + Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Company</label>
                      <input
                        type="text"
                        placeholder="Company name"
                        className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'white',
                          outline: 'none',
                        }}
                        onFocus={e => { e.target.style.borderColor = '#1A6FDB'; e.target.style.background = 'rgba(26,111,219,0.08)' }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Phone (optional)</label>
                      <input
                        type="tel"
                        placeholder="+1 234 567 890"
                        className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'white',
                          outline: 'none',
                        }}
                        onFocus={e => { e.target.style.borderColor = '#1A6FDB'; e.target.style.background = 'rgba(26,111,219,0.08)' }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
                      />
                    </div>
                  </div>

                  {/* Service interest — pill toggles */}
                  <div>
                    <label className="block text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Service Interest</label>
                    <div className="flex flex-wrap gap-2">
                      {serviceOptions.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setActiveService(activeService === opt ? '' : opt)}
                          className="text-xs font-medium px-3.5 py-2 rounded-full transition-all duration-200"
                          style={{
                            background: activeService === opt ? '#1A6FDB' : 'rgba(255,255,255,0.05)',
                            border: activeService === opt ? '1px solid #1A6FDB' : '1px solid rgba(255,255,255,0.1)',
                            color: activeService === opt ? 'white' : 'rgba(255,255,255,0.55)',
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Your Message *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your project or inquiry…"
                      className="w-full px-4 py-3 rounded-xl text-sm resize-none transition-all duration-200"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                        outline: 'none',
                      }}
                      onFocus={e => { e.target.style.borderColor = '#1A6FDB'; e.target.style.background = 'rgba(26,111,219,0.08)' }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
                    />
                  </div>

                  {/* Privacy + Submit */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input type="checkbox" required className="sr-only peer" />
                        <div
                          className="w-5 h-5 rounded-md border transition-colors peer-checked:bg-[#1A6FDB] peer-checked:border-[#1A6FDB]"
                          style={{ border: '1px solid rgba(255,255,255,0.2)', background: 'transparent' }}
                        ></div>
                      </div>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        I agree to the <a href="#" className="underline hover:text-white transition-colors">privacy policy</a>.
                      </span>
                    </label>
                    <button
                      type="submit"
                      className="cta-pill text-white text-sm font-medium flex-shrink-0"
                    >
                      <span>Send Message</span>
                      <span className="icon">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── All offices list ──────────────────────────────────── */}
      <section className="py-20" style={{ background: '#040D1A', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="section-label light mb-5">Global Network</div>
              <h2 className="text-3xl font-medium text-white mb-4 leading-tight">
                All Offices &amp; Project Sites
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                With offices and active project teams across Europe, the Middle East, Asia, and the Americas, there's always a TRACECOOL engineer close to your project.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 mt-6 text-xs font-medium transition-colors" style={{ color: '#4D9EFF' }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = '#4D9EFF'}
              >
                View full network on map
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            <div className="divide-y" style={{ borderColor: 'transparent' }}>
              {agents.map(a => <OfficeRow key={a.id} agent={a} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── Emergency banner ─────────────────────────────────── */}
      <section
        className="py-14 text-center"
        style={{ background: 'rgba(26,111,219,0.1)', borderTop: '1px solid rgba(26,111,219,0.2)' }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#4D9EFF' }}>24 / 7 Emergency Line</p>
          <a
            href="tel:+4962411234556"
            className="text-3xl lg:text-4xl font-bold text-white hover:text-[#4D9EFF] transition-colors"
          >
            +49 (0) 6241 / 123 456
          </a>
          <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
            For urgent HVAC breakdowns and emergency maintenance — round the clock.
          </p>
        </div>
      </section>

    </div>
  )
}
