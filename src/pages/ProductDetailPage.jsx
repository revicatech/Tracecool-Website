import { useEffect, useState } from 'react'
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

export default function ProductDetailPage() {
  const { id } = useParams()
  const product = products.find(p => p.id === id)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
    setActiveImg(0)
    gsap.fromTo('.prod-detail-hero > *',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.1 }
    )
    gsap.fromTo('.prod-detail-body',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.prod-detail-body', start: 'top 82%' }
      }
    )
  }, [id])

  if (!product) return <Navigate to="/products" replace />

  const relatedProducts = products
    .filter(p => p.id !== id && p.category === product.category)
    .slice(0, 3)

  const otherProducts = products.filter(p => p.id !== id).slice(0, 3)
  const displayRelated = relatedProducts.length > 0 ? relatedProducts : otherProducts

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Hero */}
      <section
        className="relative pt-36 pb-16 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #040D1A 0%, #071525 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 40% 40%, rgba(26,111,219,0.45) 0%, transparent 65%)' }}
        ></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 prod-detail-hero">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-medium mb-8 transition-colors"
            style={{ color: 'rgba(77,158,255,0.8)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#4D9EFF'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(77,158,255,0.8)'}
          >
            <svg className="w-3.5 h-3.5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            All Products
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: 'rgba(26,111,219,0.25)', color: '#4D9EFF' }}
            >
              {product.category}
            </span>
            <span
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}
            >
              {product.subcategory}
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-medium text-white mb-5 leading-tight">{product.title}</h1>
          <p className="text-white/50 max-w-2xl text-sm leading-relaxed">{product.shortDesc}</p>
        </div>
      </section>

      {/* Image Gallery + Key Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Image gallery */}
            <div>
              {/* Main image */}
              <div
                className="rounded-2xl overflow-hidden mb-4"
                style={{ height: '420px', border: '1px solid #E4EBF5' }}
              >
                <img
                  src={product.images[activeImg]}
                  alt={`${product.title} — view ${activeImg + 1}`}
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className="rounded-xl overflow-hidden transition-all duration-300"
                    style={{
                      height: '80px',
                      border: i === activeImg ? '2px solid #1A6FDB' : '2px solid transparent',
                      opacity: i === activeImg ? 1 : 0.55,
                    }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Key Features Table */}
            <div>
              <div
                className="rounded-2xl overflow-hidden mb-6"
                style={{ border: '1px solid #E4EBF5' }}
              >
                <div
                  className="px-6 py-4"
                  style={{ background: '#040D1A' }}
                >
                  <h2 className="text-white font-semibold text-sm tracking-wider uppercase">Technical Specifications</h2>
                </div>
                <div className="divide-y" style={{ borderColor: '#E4EBF5' }}>
                  {product.keyFeatures.map((kf, i) => (
                    <div
                      key={kf.label}
                      className="flex items-center justify-between px-6 py-4 transition-colors"
                      style={{ background: i % 2 === 0 ? '#F2F6FC' : 'white' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,111,219,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#F2F6FC' : 'white'}
                    >
                      <span className="text-sm" style={{ color: '#5A7896' }}>{kf.label}</span>
                      <span className="text-sm font-semibold" style={{ color: '#071525' }}>{kf.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  to="/#contact"
                  className="cta-pill-dark text-primary text-sm font-medium flex-1 justify-center"
                >
                  <span>Request a Quote</span>
                  <span className="icon"><ArrowIcon /></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description + Features */}
      <section className="py-16 prod-detail-body" style={{ background: '#F2F6FC' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Description */}
            <div>
              <h2 className="text-3xl font-medium mb-6" style={{ color: '#071525' }}>Product Overview</h2>
              <p className="text-sm leading-loose" style={{ color: '#5A7896' }}>{product.desc}</p>
            </div>

            {/* Features list */}
            <div>
              <h2 className="text-3xl font-medium mb-6" style={{ color: '#071525' }}>Key Features</h2>
              <div className="space-y-3">
                {product.features.map((f, i) => (
                  <div
                    key={f}
                    className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300"
                    style={{ background: 'white', border: '1px solid #E4EBF5' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(26,111,219,0.25)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#E4EBF5'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: '#1A6FDB' }}
                    >
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#071525' }}>{f}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {displayRelated.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl font-medium mb-8" style={{ color: '#071525' }}>
              {relatedProducts.length > 0 ? 'Related Products' : 'Other Products'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayRelated.map(p => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="group rounded-2xl overflow-hidden transition-all duration-400"
                  style={{ border: '1px solid #E4EBF5', background: 'white' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(26,111,219,0.3)'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(26,111,219,0.09)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#E4EBF5'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div className="overflow-hidden" style={{ height: '180px' }}>
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-xs mb-1" style={{ color: '#5A7896' }}>{p.category}</div>
                    <h3 className="text-base font-semibold mb-2" style={{ color: '#071525' }}>{p.title}</h3>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#1A6FDB' }}>
                      View Details <ArrowIcon className="w-3 h-3" />
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
