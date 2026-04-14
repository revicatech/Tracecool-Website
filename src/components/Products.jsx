import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../context/LanguageContext'
import energy from '../assets/energy-recovery.jpg'
import accessory from '../assets/Accessory.webp'
import AC_Accessory from '../assets/AC_Accessory.webp'
import Airtowater from '../assets/Airtowater.webp'
import mini from '../assets/mini.webp'
import Roof from '../assets/Roof.webp'
gsap.registerPlugin(ScrollTrigger)

const productMeta = [
  { cls: 'card-1-1', img: accessory },
  { cls: 'card-1-2', img: AC_Accessory },
  { cls: 'card-1-3', img: Airtowater },
  { cls: 'card-2-3', img: energy },
  { cls: 'card-2-2', img: mini },
  { cls: 'card-2-1', img: Roof },
]

const CATEGORY_ORDER = [
  'Accessory & Parts',
  'Air Conditioner Accessories',
  'Air to water heat pump',
  'Chiller',
  'Mini Split Air Conditioner',
  'Rooftop & Package',
]

function BentoCard({ cls, img, title, catId }) {
  const to = catId ? `/products?cat=${catId}` : '/products'
  return (
    <Link to={to} className={`bento-card ${cls}`}>
      <img src={img} alt={title} />
      <div className="card-content">
        <h3>{title}</h3>
      </div>
    </Link>
  )
}

export default function Products() {
  const { t, lang } = useLanguage()
  const products = t('products')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => setCategories(data.filter(c => c.isActive)))
      .catch(() => {})
  }, [])

  const buildCards = () =>
    CATEGORY_ORDER.map((name, i) => {
      const meta = productMeta[i]
      const cat = categories.find(c => c.name_en?.trim().toLowerCase() === name.toLowerCase())
      return {
        ...meta,
        title: cat ? (lang === 'ar' ? cat.name_ar : cat.name_en) : name,
        catId: cat?._id || null,
      }
    })

  const cards = buildCards()
  const row1 = cards.slice(0, 3)
  const row2 = cards.slice(3, 6)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('#products .products-header', {
        scrollTrigger: { trigger: '#products', start: 'top 80%', toggleActions: 'play none none none' },
        y: 30, opacity: 0, duration: 0.8, ease: 'power2.out',
      })
      gsap.from('#products .bento-card', {
        scrollTrigger: { trigger: '#products .products-grid', start: 'top 85%', toggleActions: 'play none none none' },
        y: 40, opacity: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1,
      })
      gsap.from('#products .all-products-btn', {
        scrollTrigger: { trigger: '#products .all-products-btn', start: 'top 90%', toggleActions: 'play none none none' },
        y: 20, opacity: 0, duration: 0.6, ease: 'power2.out',
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="products" className="overflow-hidden relative">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-20 py-24 lg:py-32">
        <div className="products-header mb-12">
          <div className="section-label light mb-5">{products.badge}</div>
          <h2 className="text-5xl md:text-6xl font-medium tracking-tight text-white">
            {products.titleWord} <span className="text-gradient italic font-light">{products.titleAccent}</span>
          </h2>
          <p className="text-white/50 mt-3 text-sm max-w-md">{products.desc}</p>
        </div>

        <div className="products-grid">
          <div className="row-container row-1">
            {row1.map(c => <BentoCard key={c.cls} {...c} />)}
          </div>
          <div className="row-container row-2">
            {row2.map(c => <BentoCard key={c.cls} {...c} />)}
          </div>
        </div>

        <div className="all-products-btn mt-10 flex justify-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 hover:border-white/40 transition-all duration-300"
          >
            {lang === 'ar' ? 'جميع المنتجات' : 'All Products'}
            <svg className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
