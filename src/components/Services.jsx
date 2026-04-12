import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

function ServiceCard({ service }) {
  const { lang } = useLanguage()
  const tStr = (en, ar) => (lang === 'ar' && ar) ? ar : en
  const title = tStr(service.title_en, service.title_ar)
  const shortDesc = tStr(service.shortDesc_en || service.description_en, service.shortDesc_ar || service.description_ar)

  return (
    <div
      className="group rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
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
      <div className="overflow-hidden" style={{ height: '240px' }}>
        {service.image ? (
          <img
            src={service.image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #071525 0%, #0E2850 100%)' }}>
            <span className="text-5xl text-white/10 font-bold">{title[0]}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-7">
        {service.features?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {service.features.slice(0, 2).map((f, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(26,111,219,0.07)', color: '#1A6FDB' }}>
                {(lang === 'ar' && f.feature_ar) ? f.feature_ar : f.feature_en}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-xl font-semibold mb-3" style={{ color: '#071525' }}>{title}</h3>
        <p className="text-sm leading-relaxed mb-6" style={{ color: '#5A7896' }}>{shortDesc}</p>

        <Link
          to={`/services/${service._id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
          style={{ color: '#1A6FDB' }}
          onMouseEnter={e => e.currentTarget.style.color = '#4D9EFF'}
          onMouseLeave={e => e.currentTarget.style.color = '#1A6FDB'}
        >
          {lang === 'ar' ? 'اعرف أكثر' : 'Learn More'}
          <svg className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default function Services() {
  const { t } = useLanguage()
  const services = t('services')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(data => setItems(data.filter(s => s.isActive).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading || items.length === 0) return
    const ctx = gsap.context(() => {
      gsap.from('.gs_reveal_services', {
        scrollTrigger: {
          trigger: '#services-sec',
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
        y: 55,
        opacity: 0,
        duration: 1.1,
        stagger: 0.18,
        ease: 'power3.out',
      })
    }, '#services-sec')
    return () => ctx.revert()
  }, [loading, items])

  return (
    <section id="services-sec" className="py-32 bg-white relative" style={{ zIndex: 1 }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20 gs_reveal_services">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 bg-accent rounded-sm"></span>
            <span className="text-xs font-semibold tracking-widest text-secondary uppercase">{services.badge}</span>
          </div>
          <h2 className="text-5xl font-bold mb-5 tracking-tight">
            {services.title}<br />{services.titleBr}
          </h2>
          <p className="text-secondary max-w-2xl mx-auto leading-relaxed text-sm">{services.desc}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-7 h-7 border-2 border-[#1A6FDB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? null : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            {items.map(service => (
              <div key={service._id} className="gs_reveal_services">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center gs_reveal_services">
          <Link to="/services" className="inline-block bg-surface border border-surface-mid px-10 py-4 rounded-xl font-medium hover:bg-surface-mid transition-colors text-sm">
            {services.exploreAll}
          </Link>
        </div>
      </div>
    </section>
  )
}
