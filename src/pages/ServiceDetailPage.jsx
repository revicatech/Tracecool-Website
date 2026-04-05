import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

function ArrowIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function ServiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, isRTL } = useLanguage()
  const [service, setService] = useState(null)
  const [allServices, setAllServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImages, setActiveImages] = useState({}) // { sectionIdx: imageIdx }

  const t = (en, ar) => (lang === 'ar' && ar) ? ar : en

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`/api/services/${id}`).then(r => r.ok ? r.json() : null),
      fetch('/api/services').then(r => r.json()),
    ]).then(([svc, all]) => {
      if (!svc) { navigate('/services', { replace: true }); return; }
      setService(svc)
      setAllServices(all)
      // Initialize active image per section
      const init = {}
      ;(svc.sections || []).forEach((_, i) => { init[i] = 0 })
      setActiveImages(init)
    }).catch(() => navigate('/services', { replace: true }))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!service) return
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-content > *',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.1 }
      )
      gsap.utils.toArray('.section-reveal').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 82%', once: true }
          }
        )
      })
    })
    return () => ctx.revert()
  }, [service])

  if (loading) return (
    <div className="min-h-screen bg-[#071525] flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-[#1A6FDB] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!service) return null

  const currentIndex = allServices.findIndex(s => s._id === id)
  const nextService = allServices.length > 1
    ? allServices[(currentIndex + 1) % allServices.length]
    : null

  const title = t(service.title_en, service.title_ar)
  const shortDesc = t(service.shortDesc_en, service.shortDesc_ar)
  const description = t(service.description_en, service.description_ar)

  return (
    <div className="bg-white min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #040D1A 0%, #071525 100%)' }}>

        {/* Background image with overlay */}
        {service.image && (
          <>
            <div className="absolute inset-0">
              <img src={service.image} alt={title}
                className="w-full h-full object-cover opacity-25" />
            </div>
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, #071525 30%, rgba(7,21,37,0.6) 70%, rgba(7,21,37,0.3) 100%)' }} />
          </>
        )}

        {/* Blue glow */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 60% 30%, rgba(26,111,219,0.5) 0%, transparent 60%)' }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pb-16 pt-36 hero-content">
          <Link to="/services"
            className="inline-flex items-center gap-2 text-xs font-medium mb-8 transition-colors"
            style={{ color: 'rgba(77,158,255,0.75)' }}>
            <svg className="w-3.5 h-3.5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            {t('All Services', 'جميع الخدمات')}
          </Link>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-px w-8 bg-[#1A6FDB]" />
              <span className="text-[#1A6FDB] text-xs font-semibold uppercase tracking-widest">
                {t('Our Service', 'خدمتنا')}
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-medium text-white mb-5 leading-tight">
              {title}
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-2xl">{shortDesc || description}</p>
          </div>

          {/* Key features pills */}
          {service.features?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {service.features.slice(0, 4).map((f, i) => (
                <span key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(26,111,219,0.15)', color: '#4D9EFF', border: '1px solid rgba(26,111,219,0.25)' }}>
                  {t(f.feature_en, f.feature_ar)}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── OVERVIEW ───────────────────────────────────────── */}
      {description && (
        <section className="py-16 section-reveal">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-medium text-[#071525] mb-4">{t('About This Service', 'حول هذه الخدمة')}</h2>
              <div className="h-1 w-12 bg-[#1A6FDB] rounded mx-auto mb-6" />
              <p className="text-[#5A7896] leading-relaxed">{description}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── DYNAMIC SECTIONS ───────────────────────────────── */}
      {service.sections?.map((sec, sIdx) => {
        const secTitle = t(sec.title_en, sec.title_ar)
        const points = sec.points || []
        const imgs = sec.images || []
        const activeImg = activeImages[sIdx] ?? 0
        const isEven = sIdx % 2 === 0

        return (
          <section
            key={sIdx}
            className="py-20 section-reveal"
            style={{ background: isEven ? '#F2F6FC' : '#fff' }}
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className={`flex flex-col lg:flex-row items-start gap-12 lg:gap-16 ${!isEven ? 'lg:flex-row-reverse' : ''}`}>

                {/* Images column */}
                {imgs.length > 0 && (
                  <div className="lg:w-5/12 flex-shrink-0 w-full">
                    {/* Main image */}
                    <div className="rounded-2xl overflow-hidden shadow-lg"
                      style={{ height: '340px' }}>
                      <img
                        src={imgs[activeImg] || imgs[0]}
                        alt={secTitle}
                        className="w-full h-full object-cover transition-all duration-700"
                      />
                    </div>

                    {/* Thumbnails — only if > 1 image */}
                    {imgs.length > 1 && (
                      <div className="flex gap-3 mt-3">
                        {imgs.map((img, iIdx) => (
                          <button
                            key={iIdx}
                            onClick={() => setActiveImages(a => ({ ...a, [sIdx]: iIdx }))}
                            className="rounded-xl overflow-hidden flex-1 transition-all duration-300"
                            style={{
                              height: '72px',
                              border: iIdx === activeImg ? '2px solid #1A6FDB' : '2px solid transparent',
                              opacity: iIdx === activeImg ? 1 : 0.5,
                            }}
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Text column */}
                <div className="flex-1">
                  {secTitle && (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0"
                          style={{ background: '#1A6FDB', color: 'white' }}>
                          {String(sIdx + 1).padStart(2, '0')}
                        </div>
                        <div className="h-px flex-1 bg-[#E4EBF5]" />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-medium text-[#071525] mb-6">{secTitle}</h3>
                    </>
                  )}

                  {points.length > 0 && (
                    <ul className="space-y-3">
                      {points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-3">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: 'rgba(26,111,219,0.1)', color: '#1A6FDB' }}>
                            <CheckIcon />
                          </div>
                          <p className="text-[#071525] text-sm leading-relaxed">
                            {t(pt.point_en, pt.point_ar)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </section>
        )
      })}

      {/* ── ALL FEATURES (if any and no sections) ──────────── */}
      {(!service.sections?.length && service.features?.length > 0) && (
        <section className="py-20 section-reveal" style={{ background: '#F2F6FC' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-medium text-[#071525] mb-10">{t('Key Capabilities', 'القدرات الرئيسية')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.features.map((f, i) => (
                <div key={i}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#E4EBF5] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#1A6FDB]/25">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold bg-[#1A6FDB] text-white">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <p className="text-sm leading-relaxed mt-0.5 text-[#071525]">{t(f.feature_en, f.feature_ar)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CONTACT + NEXT SERVICE ─────────────────────────── */}
      <section className="py-24 section-reveal">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Contact Us card */}
            <div
              className="rounded-2xl p-10 flex flex-col justify-between"
              style={{ background: 'linear-gradient(135deg, #071525 0%, #0E2850 100%)', minHeight: '260px' }}>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px w-6 bg-[#1A6FDB]" />
                  <span className="text-[#1A6FDB] text-xs font-semibold uppercase tracking-widest">
                    {t('Get in Touch', 'تواصل معنا')}
                  </span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-medium text-white mb-3">
                  {t(`Interested in ${service.title_en}?`, `مهتم بـ ${service.title_ar}؟`)}
                </h2>
                <p className="text-white/50 text-sm leading-relaxed">
                  {t(
                    'Contact our engineering team to discuss your specific requirements and get a tailored proposal.',
                    'تواصل مع فريقنا الهندسي لمناقشة متطلباتك وللحصول على عرض مخصص.'
                  )}
                </p>
              </div>
              <Link
                to="/contact"
                className="mt-8 inline-flex items-center gap-3 self-start"
              >
                <span
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
                  style={{ background: '#1A6FDB', color: 'white' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#4D9EFF'}
                  onMouseLeave={e => e.currentTarget.style.background = '#1A6FDB'}
                >
                  {t('Request a Consultation', 'طلب استشارة')}
                  <ArrowIcon className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </span>
              </Link>
            </div>

            {/* Next Service card */}
            {nextService && (
              <Link
                to={`/services/${nextService._id}`}
                className="rounded-2xl p-10 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: '#F2F6FC',
                  border: '1px solid #E4EBF5',
                  minHeight: '260px',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(26,111,219,0.3)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(26,111,219,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E4EBF5'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div>
                  <p className="text-xs font-semibold text-[#5A7896] uppercase tracking-widest mb-4">
                    {t('Next Service', 'الخدمة التالية')}
                  </p>
                  <h3 className="text-2xl font-medium text-[#071525] mb-3">
                    {t(nextService.title_en, nextService.title_ar)}
                  </h3>
                  <p className="text-sm text-[#5A7896] leading-relaxed line-clamp-3">
                    {t(nextService.shortDesc_en || nextService.description_en, nextService.shortDesc_ar || nextService.description_ar)}
                  </p>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1A6FDB]">
                  {t('View Service', 'عرض الخدمة')}
                  <ArrowIcon className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
