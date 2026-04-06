import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { solutions } from '../data/pageData'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

function ArrowIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  )
}

function SolutionRow({ solution, index, lang }) {
  const rowRef = useRef(null)
  const isRight = solution.imageSide === 'right'
  const t = (en, ar) => (lang === 'ar' && ar) ? ar : en

  useEffect(() => {
    const ctx = gsap.context(() => {
      const el = rowRef.current
      const img = el.querySelector('.sol-img-wrap')
      const text = el.querySelector('.sol-text-wrap')

      gsap.fromTo(img,
        { opacity: 0, x: isRight ? 60 : -60 },
        {
          opacity: 1, x: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 78%', toggleActions: 'play none none none' }
        }
      )
      gsap.fromTo(text,
        { opacity: 0, x: isRight ? -60 : 60 },
        {
          opacity: 1, x: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 78%', toggleActions: 'play none none none' }
        }
      )
    }, rowRef)
    return () => ctx.revert()
  }, [isRight])

  const textBlock = (
    <div className="sol-text-wrap flex flex-col justify-center">
      <div className="flex items-center gap-3 mb-5">
        <span
          className="font-mono text-xs tracking-widest"
          style={{ color: '#4D9EFF' }}
        >
          {solution.num}
        </span>
        <span className="h-px flex-1 max-w-[40px]" style={{ background: 'rgba(26,111,219,0.3)' }}></span>
      </div>
      <h2
        className="text-4xl lg:text-5xl font-medium mb-5 leading-tight"
        style={{ color: '#071525' }}
      >
        {t(solution.title, solution.title_ar)}
      </h2>
      <p className="text-sm leading-relaxed mb-6 max-w-md" style={{ color: '#5A7896' }}>
        {t(solution.desc, solution.desc_ar)}
      </p>
      <ul className="space-y-2.5 mb-8">
        {solution.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: '#071525' }}>
            <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#1A6FDB' }}></span>
            {typeof f === 'object' ? t(f.en, f.ar) : f}
          </li>
        ))}
      </ul>
      <Link
        to={`/solutions/${solution.id}`}
        className="cta-pill-dark text-primary text-sm font-medium w-fit"
      >
        <span>{t('Learn More', 'اعرف أكثر')}</span>
        <span className="icon"><ArrowIcon /></span>
      </Link>
    </div>
  )

  const imageBlock = (
    <div className="sol-img-wrap relative">
      <div
        className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]"
        style={{ border: '1px solid rgba(26,111,219,0.1)' }}
      >
        <img
          src={solution.image}
          alt={t(solution.title, solution.title_ar)}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>
      <div
        className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl -z-10"
        style={{ background: 'rgba(26,111,219,0.08)', border: '1px solid rgba(26,111,219,0.15)' }}
      ></div>
    </div>
  )

  return (
    <div
      ref={rowRef}
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-16 lg:py-24 border-b"
      style={{ borderColor: 'rgba(90,120,150,0.1)' }}
    >
      {isRight ? (
        <>
          {textBlock}
          {imageBlock}
        </>
      ) : (
        <>
          {imageBlock}
          {textBlock}
        </>
      )}
    </div>
  )
}

export default function SolutionsPage() {
  const heroRef = useRef(null)
  const { lang, isRTL } = useLanguage()
  const t = (en, ar) => (lang === 'ar' && ar) ? ar : en

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo('.sol-hero-content > *',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.1 }
      )
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative pt-36 pb-20 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #040D1A 0%, #071525 60%, #fff 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 60% 40%, rgba(26,111,219,0.35) 0%, transparent 70%)',
          }}
        ></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 sol-hero-content">
          <div className="section-label light mb-5">{t('Solutions', 'الحلول')}</div>
          <h1 className="text-5xl lg:text-7xl font-medium text-white mb-6 leading-tight">
            {t('Core Fields of', 'المجالات الرئيسية')}<br />
            <span className="text-gradient italic font-light">{t('HVAC Expertise', 'لخبرة التكييف')}</span>
          </h1>
          <p className="text-white/50 max-w-xl text-sm leading-relaxed mb-10">
            {t(
              'We deliver comprehensive HVAC engineering and consulting services across five core sectors, combining technical precision with decades of international project experience.',
              'نقدم خدمات هندسة واستشارات شاملة في مجال التكييف عبر خمسة قطاعات رئيسية، نجمع فيها بين الدقة التقنية وعقود من الخبرة الدولية في المشاريع.'
            )}
          </p>
          <div className="flex flex-wrap gap-3">
            {solutions.map(s => (
              <Link
                key={s.id}
                to={`/solutions/${s.id}`}
                className="text-xs font-medium px-4 py-2 rounded-full transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.7)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(26,111,219,0.2)'
                  e.currentTarget.style.borderColor = 'rgba(77,158,255,0.5)'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                }}
              >
                {s.num} {t(s.title, s.title_ar)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Zig-Zag Rows */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        {solutions.map((solution, i) => (
          <SolutionRow key={solution.id} solution={solution} index={i} lang={lang} />
        ))}
      </section>

      {/* CTA */}
      <section
        className="py-24 text-center"
        style={{ background: 'linear-gradient(180deg, #fff 0%, #F2F6FC 100%)' }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <div className="section-label justify-center mb-5">{t('Get Started', 'ابدأ الآن')}</div>
          <h2 className="text-4xl font-medium mb-5" style={{ color: '#071525' }}>
            {t('Ready to start your project?', 'هل أنت مستعد لبدء مشروعك؟')}
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#5A7896' }}>
            {t(
              'Our engineers are ready to analyse your requirements and recommend the optimal solution.',
              'مهندسونا مستعدون لتحليل متطلباتك والتوصية بالحل الأمثل.'
            )}
          </p>
          <Link to="/contact" className="cta-pill text-white text-sm font-medium">
            <span>{t('Request a Consultation', 'طلب استشارة')}</span>
            <span className="icon"><ArrowIcon /></span>
          </Link>
        </div>
      </section>
    </div>
  )
}
