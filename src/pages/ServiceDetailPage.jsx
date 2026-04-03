import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { services } from '../data/pageData'

gsap.registerPlugin(ScrollTrigger)

function ArrowIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  )
}

export default function ServiceDetailPage() {
  const { id } = useParams()
  const service = services.find(s => s.id === id)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
    setActiveImg(0)
    gsap.fromTo('.srvd-hero > *',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.1 }
    )
  }, [id])

  if (!service) return <Navigate to="/services" replace />

  const currentIndex = services.findIndex(s => s.id === id)
  const nextService = services[(currentIndex + 1) % services.length]

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Hero */}
      <section
        className="relative pt-36 pb-16 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #040D1A 0%, #071525 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 60% 30%, rgba(26,111,219,0.4) 0%, transparent 65%)' }}
        ></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 srvd-hero">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs font-medium mb-8 transition-colors"
            style={{ color: 'rgba(77,158,255,0.8)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#4D9EFF'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(77,158,255,0.8)'}
          >
            <svg className="w-3.5 h-3.5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            All Services
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="section-label light">{service.badge}</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-medium text-white mb-5 leading-tight max-w-3xl">
            {service.title}
          </h1>
          <p className="text-white/50 max-w-2xl text-sm leading-relaxed mb-8">{service.shortDesc}</p>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-8">
            {service.stats.map(s => (
              <div key={s.label}>
                <div className="text-2xl font-bold" style={{ color: '#4D9EFF' }}>{s.value}</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Main image */}
            <div className="rounded-2xl overflow-hidden" style={{ height: '420px' }}>
              <img
                src={service.gallery[activeImg]}
                alt={service.title}
                className="w-full h-full object-cover transition-all duration-700"
              />
            </div>
            {/* Thumbnails + description */}
            <div>
              <div className="flex gap-3 mb-8">
                {service.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className="rounded-xl overflow-hidden flex-1 transition-all duration-300"
                    style={{
                      height: '90px',
                      border: i === activeImg
                        ? '2px solid #1A6FDB'
                        : '2px solid transparent',
                      opacity: i === activeImg ? 1 : 0.55,
                    }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <h2 className="text-2xl font-medium mb-4" style={{ color: '#071525' }}>About This Service</h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: '#5A7896' }}>{service.desc}</p>

              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(26,111,219,0.08)', color: '#1A6FDB' }}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  {service.location}
                </span>
                <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(26,111,219,0.08)', color: '#1A6FDB' }}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                  </svg>
                  {service.time}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16" style={{ background: '#F2F6FC' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-medium mb-10" style={{ color: '#071525' }}>Key Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.features.map((f, i) => (
              <div
                key={f}
                className="flex items-start gap-4 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'white', border: '1px solid #E4EBF5' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(26,111,219,0.25)'
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(26,111,219,0.07)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E4EBF5'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold"
                  style={{ background: '#1A6FDB', color: 'white' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <p className="text-sm leading-relaxed mt-0.5" style={{ color: '#071525' }}>{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + Next service */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-medium mb-4" style={{ color: '#071525' }}>
              Interested in {service.title}?
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#5A7896' }}>
              Contact our engineering team to discuss your specific requirements and get a tailored proposal.
            </p>
            <Link to="/#contact" className="cta-pill-dark text-primary text-sm font-medium">
              <span>Request a Consultation</span>
              <span className="icon"><ArrowIcon /></span>
            </Link>
          </div>

          <Link
            to={`/services/${nextService.id}`}
            className="flex-1 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 group"
            style={{ background: '#040D1A', border: '1px solid rgba(255,255,255,0.06)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(26,111,219,0.35)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
          >
            <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>Next Service</p>
            <h3 className="text-xl font-medium text-white mb-3">{nextService.title}</h3>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>{nextService.shortDesc}</p>
            <span className="inline-flex items-center gap-2 text-xs font-medium" style={{ color: '#4D9EFF' }}>
              View Service <ArrowIcon className="w-3 h-3" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}
