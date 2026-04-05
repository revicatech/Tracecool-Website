import { useEffect, useState, useCallback, useRef } from 'react'
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
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function Gallery({ images, title }) {
  const [active, setActive] = useState(0)
  const imgRef = useRef(null)

  const goTo = useCallback((i) => {
    if (i === active) return
    gsap.to(imgRef.current, {
      opacity: 0, scale: 1.03, duration: 0.18, ease: 'power2.in',
      onComplete: () => {
        setActive(i)
        gsap.fromTo(imgRef.current,
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 0.42, ease: 'power2.out' }
        )
      },
    })
  }, [active])

  const prev = useCallback(() => goTo((active - 1 + images.length) % images.length), [active, goTo, images.length])
  const next = useCallback(() => goTo((active + 1) % images.length), [active, goTo, images.length])

  useEffect(() => { setActive(0) }, [images])

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative rounded-2xl overflow-hidden group cursor-zoom-in"
        style={{ height: '480px', background: '#0D1F35' }}
      >
        <img
          ref={imgRef}
          src={images[active]}
          alt={`${title} — view ${active + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(4,13,26,0.45) 0%, transparent 50%)' }}
        />

        {/* Prev / Next */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ background: 'rgba(4,13,26,0.75)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <ArrowIcon className="w-4 h-4 text-white rotate-180" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ background: 'rgba(4,13,26,0.75)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <ArrowIcon className="w-4 h-4 text-white" />
            </button>
          </>
        )}

        {/* Counter badge */}
        <div
          className="absolute bottom-4 right-4 font-mono text-[11px] font-medium px-3 py-1.5 rounded-full select-none"
          style={{ background: 'rgba(4,13,26,0.7)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${images.length}, 1fr)` }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-xl overflow-hidden transition-all duration-300"
              style={{
                height: '64px',
                border: i === active ? '2px solid #1A6FDB' : '2px solid rgba(255,255,255,0.08)',
                boxShadow: i === active ? '0 0 0 3px rgba(26,111,219,0.2)' : 'none',
                opacity: i === active ? 1 : 0.45,
                transform: i === active ? 'scale(1)' : 'scale(0.97)',
              }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, isRTL } = useLanguage()
  const [product, setProduct] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const t = (en, ar) => (lang === 'ar' && ar) ? ar : en

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`/api/products/${id}`).then(r => r.ok ? r.json() : null),
      fetch('/api/products').then(r => r.json()),
    ]).then(([prod, all]) => {
      if (!prod) { navigate('/products', { replace: true }); return; }
      setProduct(prod)
      setAllProducts(all)
    }).catch(() => navigate('/products', { replace: true }))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!product) return
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.05, defaults: { ease: 'power3.out' } })
      tl.fromTo('.pdp-back', { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.45 })
        .fromTo('.pdp-badge', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, '-=0.2')
        .fromTo('.pdp-title', { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.25')
        .fromTo('.pdp-divider', { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 0.5 }, '-=0.35')
        .fromTo('.pdp-desc', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.3')
        .fromTo('.pdp-cta-row', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
        .fromTo('.pdp-gallery', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.85')

      gsap.fromTo('.pdp-feat-item',
        { opacity: 0, x: -24 },
        {
          opacity: 1, x: 0, duration: 0.55, stagger: 0.07, ease: 'power3.out',
          scrollTrigger: { trigger: '#pdp-features', start: 'top 78%' },
        }
      )
      gsap.fromTo('.pdp-feat-heading > *',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '#pdp-features', start: 'top 80%' },
        }
      )

      gsap.fromTo('.pdp-rel-card',
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '#pdp-related', start: 'top 82%' },
        }
      )
    })

    return () => ctx.revert()
  }, [product])

  if (loading) return (
    <div className="min-h-screen bg-[#071525] flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-[#1A6FDB] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!product) return null

  const categoryId = product.category?._id
  const relatedProducts = allProducts
    .filter(p => p._id !== id && p.category?._id === categoryId)
    .slice(0, 3)
  const displayRelated = relatedProducts.length > 0
    ? relatedProducts
    : allProducts.filter(p => p._id !== id).slice(0, 3)

  const title = t(product.title_en, product.title_ar)
  const description = t(product.description_en, product.description_ar)
  const shortDesc = t(product.shortDesc_en, product.shortDesc_ar)
  const categoryName = t(product.category?.name_en, product.category?.name_ar)
  const subcategoryName = t(product.subcategory?.name_en, product.subcategory?.name_ar)

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }} dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ══════════════════════════════════════════════════════
          HERO — dark split: info left | gallery right
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #040D1A 0%, #071525 55%, #0A1E3A 100%)',
          paddingTop: '7rem',
          paddingBottom: '6rem',
        }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        {/* Radial glow top-right */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-5%', right: '-8%', width: '52%', height: '85%',
            background: 'radial-gradient(ellipse at 60% 30%, rgba(26,111,219,0.22) 0%, transparent 68%)',
          }}
        />
        {/* Subtle bottom glow for blending */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.06))' }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

          {/* Back link */}
          <Link
            to="/products"
            className="pdp-back inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest mb-10 transition-colors group"
            style={{ color: 'rgba(77,158,255,0.55)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#4D9EFF'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(77,158,255,0.55)'}
          >
            <ArrowIcon className={`w-3 h-3 rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5 ${isRTL ? 'rotate-0' : ''}`} />
            {t('All Products', 'جميع المنتجات')}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">

            {/* ── LEFT: Info ──────────────────────────────── */}
            <div className="flex flex-col">

              {/* Category badges */}
              <div className="flex flex-wrap items-center gap-2 mb-7">
                {categoryName && (
                  <span
                    className="pdp-badge text-[11px] font-semibold px-3.5 py-1.5 rounded-full tracking-wide"
                    style={{
                      background: 'rgba(26,111,219,0.15)',
                      color: '#4D9EFF',
                      border: '1px solid rgba(26,111,219,0.35)',
                    }}
                  >
                    {categoryName}
                  </span>
                )}
                {subcategoryName && (
                  <>
                    <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '11px' }}>›</span>
                    <span
                      className="pdp-badge text-[11px] font-medium px-3.5 py-1.5 rounded-full"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.45)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      {subcategoryName}
                    </span>
                  </>
                )}
              </div>

              {/* Product title */}
              <h1
                className="pdp-title font-medium leading-[1.05] mb-6"
                style={{
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.75rem)',
                  color: 'white',
                  letterSpacing: '-0.025em',
                }}
              >
                {title}
              </h1>

              {/* Animated blue divider */}
              <div
                className="pdp-divider mb-7"
                style={{
                  height: '2px',
                  width: '52px',
                  background: 'linear-gradient(90deg, #4D9EFF, #1A6FDB)',
                  borderRadius: '2px',
                }}
              />

              {/* Description */}
              <p
                className="pdp-desc text-sm leading-loose mb-10"
                style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '500px' }}
              >
                {shortDesc || description}
              </p>

              {/* CTA row */}
              <div className="pdp-cta-row flex flex-wrap items-center gap-4">
                <Link to="/contact" className="cta-pill text-white text-sm font-medium">
                  <span>{t('Request a Quote', 'طلب عرض سعر')}</span>
                  <span className="icon"><ArrowIcon /></span>
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                >
                  {t('Browse catalogue', 'تصفح الكتالوج')}
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* ── RIGHT: Gallery ──────────────────────────── */}
            {product.images?.length > 0 && (
              <div className="pdp-gallery relative">
                {/* Glow halo behind gallery */}
                <div
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
                  style={{
                    width: '75%', height: '48px',
                    background: 'rgba(26,111,219,0.28)',
                    filter: 'blur(36px)',
                    borderRadius: '50%',
                  }}
                />
                <Gallery images={product.images} title={title} />
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES — light, two-column
      ══════════════════════════════════════════════════════ */}
      {product.features?.length > 0 && (
        <section id="pdp-features" className="py-24" style={{ background: '#fff' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Left: heading block */}
              <div className="pdp-feat-heading">
                <div className="section-label mb-5">{t('Key Features', 'الميزات الرئيسية')}</div>
                <div className="blue-line" />
                <h2
                  className="font-medium leading-tight mb-6"
                  style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.9rem)', color: '#071525', letterSpacing: '-0.02em' }}
                >
                  {t('Engineered for', 'مصمم من أجل')}
                  <br />
                  <span className="text-gradient italic font-light">{t('peak performance.', 'أعلى مستويات الأداء.')}</span>
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: '#5A7896', maxWidth: '380px' }}>
                  {t(
                    'Every component is selected to German engineering standards — precision-rated, field-proven, and certified to DIN VDE, ASHRAE, and ISO EN specifications.',
                    'كل مكون يتم اختياره وفق المعايير الهندسية الألمانية — بدقة عالية، ومُختبر ميدانياً، ومعتمد وفق مواصفات DIN VDE و ASHRAE و ISO EN.'
                  )}
                </p>
              </div>

              {/* Right: feature list */}
              <div>
                {product.features.map((f, i) => (
                  <div
                    key={i}
                    className="pdp-feat-item flex items-start gap-5 py-5 group"
                    style={{
                      borderBottom: i < product.features.length - 1 ? '1px solid #E4EBF5' : 'none',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: 'rgba(26,111,219,0.08)',
                        border: '1px solid rgba(26,111,219,0.18)',
                        color: '#1A6FDB',
                      }}
                    >
                      <CheckIcon />
                    </div>
                    <div className="pt-1">
                      <p className="text-sm font-medium leading-relaxed" style={{ color: '#071525' }}>
                        {t(f.feature_en, f.feature_ar)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          RELATED PRODUCTS
      ══════════════════════════════════════════════════════ */}
      {displayRelated.length > 0 && (
        <section id="pdp-related" className="py-24" style={{ background: '#F2F6FC' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
              <div>
                <div className="section-label mb-4">
                  {relatedProducts.length > 0 ? t('Related Products', 'منتجات ذات صلة') : t('You May Also Like', 'قد يعجبك أيضاً')}
                </div>
                <div className="blue-line" />
                <h2
                  className="font-medium leading-tight"
                  style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#071525', letterSpacing: '-0.02em' }}
                >
                  {t('Continue exploring.', 'تابع الاستكشاف.')}
                </h2>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors self-start sm:self-end pb-0.5"
                style={{ color: '#1A6FDB', borderBottom: '1px solid rgba(26,111,219,0.25)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#4D9EFF'}
                onMouseLeave={e => e.currentTarget.style.color = '#1A6FDB'}
              >
                {t('View all products', 'عرض جميع المنتجات')}
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayRelated.map(p => (
                <Link
                  key={p._id}
                  to={`/products/${p._id}`}
                  className="pdp-rel-card group rounded-2xl overflow-hidden block transition-all duration-300"
                  style={{
                    background: 'white',
                    border: '1px solid #E4EBF5',
                    boxShadow: '0 2px 16px rgba(7,21,37,0.04)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(26,111,219,0.28)'
                    e.currentTarget.style.transform = 'translateY(-5px)'
                    e.currentTarget.style.boxShadow = '0 24px 56px rgba(26,111,219,0.1)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#E4EBF5'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 16px rgba(7,21,37,0.04)'
                  }}
                >
                  {/* Image */}
                  {p.images?.[0] && (
                    <div className="relative overflow-hidden" style={{ height: '210px' }}>
                      <img
                        src={p.images[0]}
                        alt={t(p.title_en, p.title_ar)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(to top, rgba(4,13,26,0.55) 0%, transparent 55%)' }}
                      />
                      {p.subcategory?.name_en && (
                        <span
                          className="absolute bottom-3 left-3 text-[11px] font-medium px-2.5 py-1 rounded-full"
                          style={{ background: 'rgba(26,111,219,0.85)', color: 'white' }}
                        >
                          {t(p.subcategory.name_en, p.subcategory.name_ar)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {p.category?.name_en && (
                      <div
                        className="text-[10px] font-semibold uppercase tracking-widest mb-2"
                        style={{ color: '#5A7896' }}
                      >
                        {t(p.category.name_en, p.category.name_ar)}
                      </div>
                    )}
                    <h3 className="text-base font-semibold mb-2.5 leading-snug" style={{ color: '#071525' }}>
                      {t(p.title_en, p.title_ar)}
                    </h3>
                    <p className="text-xs leading-relaxed mb-5" style={{ color: '#5A7896' }}>
                      {t(p.shortDesc_en, p.shortDesc_ar) || t(p.description_en, p.description_ar)}
                    </p>
                    <div
                      className="flex items-center justify-end pt-4"
                      style={{ borderTop: '1px solid #E4EBF5' }}
                    >
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all group-hover:gap-2"
                        style={{ color: '#1A6FDB' }}
                      >
                        {t('View', 'عرض')}
                        <ArrowIcon className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          BOTTOM CTA STRIP
      ══════════════════════════════════════════════════════ */}
      <section
        className="py-16 text-center"
        style={{ background: 'linear-gradient(180deg, #F2F6FC 0%, #fff 100%)' }}
      >
        <div className="max-w-xl mx-auto px-6">
          <div className="section-label justify-center mb-5">{t('Expert Support', 'دعم متخصص')}</div>
          <h2
            className="font-medium mb-3"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#071525', letterSpacing: '-0.015em' }}
          >
            {t('Need custom specifications?', 'تحتاج مواصفات مخصصة؟')}
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#5A7896' }}>
            {t(
              'Our engineers can adapt, specify, and source any HVAC equipment to match your exact project requirements.',
              'يمكن لمهندسينا تكييف وتحديد وتوفير أي معدات HVAC لتناسب متطلبات مشروعك بدقة.'
            )}
          </p>
          <Link to="/contact" className="cta-pill-dark text-primary text-sm font-medium">
            <span>{t('Talk to an Engineer', 'تحدث مع مهندس')}</span>
            <span className="icon"><ArrowIcon /></span>
          </Link>
        </div>
      </section>

    </div>
  )
}
