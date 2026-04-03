import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { services } from '../data/pageData'

gsap.registerPlugin(ScrollTrigger)

function ArrowIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
    </svg>
  )
}

function ServiceCard({ service, index }) {
  return (
    <div
      className="group rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 srv-card"
      style={{
        background: 'white',
        border: '1px solid #E4EBF5',
        boxShadow: '0 2px 20px rgba(7,21,37,0.05)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(26,111,219,0.3)'
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(26,111,219,0.1)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#E4EBF5'
        e.currentTarget.style.boxShadow = '0 2px 20px rgba(7,21,37,0.05)'
      }}
    >
      {/* Image */}
      <div className="overflow-hidden" style={{ height: '260px' }}>
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-7">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: 'rgba(26,111,219,0.08)', color: '#1A6FDB' }}
          >
            {service.badge}
          </span>
        </div>

        <h3 className="text-xl font-semibold mb-3" style={{ color: '#071525' }}>{service.title}</h3>
        <p className="text-sm leading-relaxed mb-5" style={{ color: '#5A7896' }}>{service.shortDesc}</p>

        {/* Stats row */}
        <div className="flex gap-4 mb-5">
          {service.stats.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-xl font-bold" style={{ color: '#1A6FDB' }}>{stat.value}</div>
              <div className="text-[10px] tracking-wide" style={{ color: '#5A7896' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div
          className="flex items-center gap-5 text-xs mb-6 pb-5"
          style={{ color: '#5A7896', borderBottom: '1px solid #E4EBF5' }}
        >
          <span className="flex items-center gap-1.5" style={{ color: '#5A7896' }}>
            <LocationIcon />{service.location}
          </span>
          <span className="flex items-center gap-1.5" style={{ color: '#5A7896' }}>
            <ClockIcon />{service.time}
          </span>
        </div>

        <Link
          to={`/services/${service.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
          style={{ color: '#1A6FDB' }}
          onMouseEnter={e => e.currentTarget.style.color = '#4D9EFF'}
          onMouseLeave={e => e.currentTarget.style.color = '#1A6FDB'}
        >
          Learn More
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default function ServicesPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
    gsap.fromTo('.srv-hero-content > *',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.1 }
    )
    gsap.fromTo('.srv-card',
      { opacity: 0, y: 55 },
      {
        opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.srv-grid', start: 'top 80%' }
      }
    )
  }, [])

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Hero */}
      <section
        className="relative pt-36 pb-24 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #040D1A 0%, #071525 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(26,111,219,0.4) 0%, transparent 65%)' }}
        ></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 srv-hero-content">
          <div className="section-label light mb-5">Our Services</div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <h1 className="text-5xl lg:text-7xl font-medium text-white mb-6 leading-tight">
                Engineered Solutions,<br />
                <span className="text-gradient italic font-light">Proven Performance.</span>
              </h1>
              <p className="text-white/50 max-w-xl text-sm leading-relaxed">
                From precision-engineered commercial installations to smart residential systems,
                every TRACECOOL project is a testament to technical excellence and lasting quality.
              </p>
            </div>
            <div className="flex gap-6 flex-shrink-0">
              {[
                { value: '5', label: 'Service Areas' },
                { value: '25+', label: 'Years Experience' },
                { value: '60+', label: 'Countries' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-bold text-white">{s.value}</div>
                  <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Cards Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 srv-grid">
            {services.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24" style={{ background: '#F2F6FC', borderTop: '1px solid #E4EBF5' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="section-label justify-center mb-5">Talk to an Engineer</div>
          <h2 className="text-4xl font-medium mb-5" style={{ color: '#071525' }}>
            Not sure which service fits your needs?
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#5A7896' }}>
            Our technical team will assess your project requirements and recommend the most effective approach.
          </p>
          <Link to="/#contact" className="cta-pill text-white text-sm font-medium">
            <span>Schedule a Consultation</span>
            <span className="icon"><ArrowIcon /></span>
          </Link>
        </div>
      </section>
    </div>
  )
}
