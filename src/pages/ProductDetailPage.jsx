import { useEffect, useState, useCallback } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { products } from '../data/pageData'

gsap.registerPlugin(ScrollTrigger)

function ArrowIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  )
}

function ImageSlider({ images, title }) {
  const [active, setActive] = useState(0)

  const prev = useCallback(() => setActive(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setActive(i => (i + 1) % images.length), [images.length])

  useEffect(() => { setActive(0) }, [images])

  return (
    <div>
      {/* Main image */}
      <div
        className="relative rounded-2xl overflow-hidden mb-4 group"
        style={{ height: '480px', border: '1px solid #E4EBF5' }}
      >
        <img
          key={active}
          src={images[active]}
          alt={`${title} — view ${active + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Gradient overlay for arrows */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
          style={{ background: 'rgba(4,13,26,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <svg className="w-4 h-4 text-white rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
          style={{ background: 'rgba(4,13,26,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        {/* Dot indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === active ? '20px' : '6px',
                height: '6px',
                background: i === active ? '#4D9EFF' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${images.length}, 1fr)` }}>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="rounded-xl overflow-hidden transition-all duration-300 hover:opacity-90"
            style={{
              height: '72px',
              border: i === active ? '2px solid #1A6FDB' : '2px solid #E4EBF5',
              boxShadow: i === active ? '0 0 0 3px rgba(26,111,219,0.15)' : 'none',
            }}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const product = products.find(p => p.id === id)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo('.pd-main > *',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.05 }
      )
      gsap.fromTo('.pd-spec-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: '#pd-specs', start: 'top 82%' }
        }
      )
      gsap.fromTo('.pd-related-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '#pd-related', start: 'top 82%' }
        }
      )
    })
    return () => ctx.revert()
  }, [id])

  if (!product) return <Navigate to="/products" replace />

  const relatedProducts = products.filter(p => p.id !== id && p.category === product.category).slice(0, 3)
  const displayRelated = relatedProducts.length > 0
    ? relatedProducts
    : products.filter(p => p.id !== id).slice(0, 3)

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* ── Slim dark hero / breadcrumb ─────────────────────── */}
      <section
        className="relative pt-32 pb-10 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #040D1A 0%, #071525 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 40% 60%, rgba(26,111,219,0.45) 0%, transparent 65%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Back link */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-medium mb-6 transition-colors"
            style={{ color: 'rgba(77,158,255,0.7)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#4D9EFF'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(77,158,255,0.7)'}
          >
            <svg className="w-3.5 h-3.5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            All Products
          </Link>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <span>{product.category}</span>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>{product.subcategory}</span>
            <span>/</span>
            <span style={{ color: 'rgba(77,158,255,0.8)' }}>{product.title}</span>
          </div>
        </div>
      </section>

      {/* ── Main: Slider + Info ──────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start pd-main">

            {/* Left — image slider */}
            <ImageSlider images={product.images} title={product.title} />

            {/* Right — product info */}
            <div className="flex flex-col">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(26,111,219,0.1)', color: '#1A6FDB', border: '1px solid rgba(26,111,219,0.2)' }}
                >
                  {product.category}
                </span>
                <span
                  className="text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{ background: '#F2F6FC', color: '#5A7896', border: '1px solid #E4EBF5' }}
                >
                  {product.subcategory}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-medium leading-tight mb-5" style={{ color: '#071525' }}>
                {product.title}
              </h1>

              {/* Divider */}
              <div className="mb-6" style={{ height: '2px', width: '48px', background: '#1A6FDB', borderRadius: '2px' }} />

              {/* Description */}
              <p className="text-base leading-relaxed mb-8" style={{ color: '#5A7896' }}>
                {product.desc}
              </p>

              {/* CTA */}
              <div className="pt-6" style={{ borderTop: '1px solid #E4EBF5' }}>
                <Link
                  to="/#contact"
                  className="cta-pill-dark text-primary text-sm font-medium w-fit"
                >
                  <span>Request a Quote</span>
                  <span className="icon"><ArrowIcon /></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Features ─────────────────────────────────────── */}
      <section id="pd-specs" className="py-16" style={{ background: '#F2F6FC' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <div className="section-label mb-4">Key Features</div>
            <div className="blue-line" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.features.map((f, i) => (
              <div
                key={f}
                className="pd-spec-card flex items-start gap-4 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'white',
                  border: '1px solid #E4EBF5',
                  boxShadow: '0 2px 12px rgba(7,21,37,0.04)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(26,111,219,0.25)'
                  e.currentTarget.style.boxShadow = '0 10px 28px rgba(26,111,219,0.07)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E4EBF5'
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(7,21,37,0.04)'
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold"
                  style={{ background: '#1A6FDB', color: 'white' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <span className="text-sm leading-relaxed pt-1" style={{ color: '#071525' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Products ─────────────────────────────────── */}
      {displayRelated.length > 0 && (
        <section id="pd-related" className="py-20" style={{ background: '#fff' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-12">
              <div className="section-label mb-4">
                {relatedProducts.length > 0 ? 'Related Products' : 'Other Products'}
              </div>
              <div className="blue-line" />
              <h2 className="text-4xl font-medium mt-4" style={{ color: '#071525' }}>
                You may also like
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayRelated.map(p => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="pd-related-card group rounded-2xl overflow-hidden transition-all duration-400"
                  style={{
                    background: 'white',
                    border: '1px solid #E4EBF5',
                    boxShadow: '0 2px 16px rgba(7,21,37,0.04)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(26,111,219,0.3)'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 20px 48px rgba(26,111,219,0.1)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#E4EBF5'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 16px rgba(7,21,37,0.04)'
                  }}
                >
                  <div className="relative overflow-hidden" style={{ height: '200px' }}>
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(4,13,26,0.5) 0%, transparent 55%)' }}
                    />
                    <span
                      className="absolute bottom-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(26,111,219,0.85)', color: 'white' }}
                    >
                      {p.subcategory}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#5A7896' }}>
                      {p.category}
                    </div>
                    <h3 className="text-base font-semibold mb-3" style={{ color: '#071525' }}>{p.title}</h3>
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors group-hover:text-[#4D9EFF]"
                      style={{ color: '#1A6FDB' }}
                    >
                      View Details
                      <ArrowIcon className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
