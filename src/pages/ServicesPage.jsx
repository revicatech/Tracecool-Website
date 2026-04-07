import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

function ArrowIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  )
}

function ServiceCard({ service }) {
  const { lang } = useLanguage()
  const t = (en, ar) => (lang === 'ar' && ar) ? ar : en
  const title = t(service.title_en, service.title_ar)
  const shortDesc = t(service.shortDesc_en || service.description_en, service.shortDesc_ar || service.description_ar)

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
        {/* Features pills */}
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

export default function ServicesPage() {
  const { lang } = useLanguage()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetch('/api/services')
      .then(r => r.json())
      .then(data => setServices(data.filter(s => s.isActive)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading || services.length === 0) return
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
  }, [loading, services])

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
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 srv-hero-content">
          <div className="section-label light mb-5">{lang === 'ar' ? 'خدماتنا' : 'Our Services'}</div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <h1 className="text-5xl lg:text-7xl font-medium text-white mb-6 leading-tight">
                {lang === 'ar'
                  ? <>حلول هندسية،<br /><span className="text-gradient italic font-light">أداء مثبت.</span></>
                  : <>Engineered Solutions,<br /><span className="text-gradient italic font-light">Proven Performance.</span></>
                }
              </h1>
              <p className="text-white/50 max-w-xl text-sm leading-relaxed">
                {lang === 'ar'
                  ? 'من التركيبات التجارية الدقيقة إلى الأنظمة السكنية الذكية، كل مشروع هو شهادة على التميز التقني والجودة الدائمة.'
                  : 'From precision-engineered commercial installations to smart residential systems, every TRACECOOL project is a testament to technical excellence and lasting quality.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Cards Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-7 h-7 border-2 border-[#1A6FDB] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-24 text-[#5A7896]">
              <p className="text-5xl mb-4 opacity-20">◈</p>
              <p className="text-lg font-medium">{lang === 'ar' ? 'لا توجد خدمات حالياً' : 'No services available yet'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 srv-grid">
              {services.map(service => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24" style={{ background: '#F2F6FC', borderTop: '1px solid #E4EBF5' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="section-label justify-center mb-5">
            {lang === 'ar' ? 'تحدث مع مهندس' : 'Talk to an Engineer'}
          </div>
          <h2 className="text-4xl font-medium mb-5" style={{ color: '#071525' }}>
            {lang === 'ar' ? 'لست متأكداً من الخدمة المناسبة؟' : 'Not sure which service fits your needs?'}
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#5A7896' }}>
            {lang === 'ar'
              ? 'سيقيّم فريقنا الفني متطلبات مشروعك ويوصي بالنهج الأكثر فعالية.'
              : 'Our technical team will assess your project requirements and recommend the most effective approach.'}
          </p>
          <Link to="/contact" className="cta-pill text-black text-sm font-medium">
            <span>{lang === 'ar' ? 'حدد موعداً للاستشارة' : 'Schedule a Consultation'}</span>
            <span className="icon"><ArrowIcon /></span>
          </Link>
        </div>
      </section>
    </div>
  )
}
