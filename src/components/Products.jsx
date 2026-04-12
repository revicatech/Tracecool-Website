import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../context/LanguageContext'
import energy from '../assets/energy-recovery.jpg'
import accessory from '../assets/Accessory.jpg'
import AC_Accessory from '../assets/AC_Accessory.jpg'
import Airtowater from '../assets/Airtowater.jpg'
import Roof from '../assets/Roof.jpg'
gsap.registerPlugin(ScrollTrigger)

const productMeta = [
  { cls: 'card-1-1', img: accessory, z: 30 },
  { cls: 'card-1-2', img: AC_Accessory, z: 20 },
  { cls: 'card-1-3', img: Airtowater, z: 10 },
  { cls: 'card-2-3', img: energy, z: 30 },
  { cls: 'card-2-2', img: '', z: 20 },
  { cls: 'card-2-1', img: Roof, z: 10 },
]

// Ordered list of category names to display (must match DB name_en exactly)
const CATEGORY_ORDER = [
  'Accessory & Parts',
  'Air Conditioner Accessories',
  'Air to water heat pump',
  'Chiller',
  'Mini Split Air Conditioner',
  'Rooftop & Package',
]

function BentoCard({ cls, img, title, desc, z, catId }) {
  const to = catId ? `/products?cat=${catId}` : '/products'
  return (
    <Link to={to} className={`bento-card ${cls}`} style={{ zIndex: z }}>
      <img src={img} alt={title} />
      <div className="card-content">
        <h3>{title}</h3>
        <p>{desc}</p>
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
      .then(data => {
        const active = data.filter(c => c.isActive)
        setCategories(active)
      })
      .catch(() => {})
  }, [])

  // Always build cards from CATEGORY_ORDER; enrich with DB ids/AR names when available
  const buildCards = () => {
    return CATEGORY_ORDER.map((name, i) => {
      const meta = productMeta[i]
      const cat = categories.find(c =>
        c.name_en?.trim().toLowerCase() === name.toLowerCase()
      )
      return {
        ...meta,
        title: cat ? (lang === 'ar' ? cat.name_ar : cat.name_en) : name,
        desc: '',
        catId: cat?._id || null,
      }
    })
  }

  const cards = buildCards()
  const row1 = cards.slice(0, 3)
  const row2 = cards.slice(3, 6)

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1025px)', () => {
      gsap.from('#products .mb-14', {
        scrollTrigger: { trigger: '#products', start: 'top 80%', toggleActions: 'play none none none' },
        y: 40, opacity: 0, duration: 1, ease: 'power3.out', force3D: true,
      })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#products', start: 'top top', end: 'bottom bottom',
          scrub: 0.5, pin: '.pin-panel', anticipatePin: 0,
        },
      })
      const move = 104
      tl.fromTo('.card-1-1', { scale: 0.92, opacity: 0.5 }, { scale: 1, opacity: 1, ease: 'none', force3D: true }, 0)
        .to('.card-1-2', { xPercent: move, ease: 'none', force3D: true }, 0)
        .to('.card-1-3', { xPercent: move * 2, ease: 'none', force3D: true }, 0)
      tl.fromTo('.card-2-3', { scale: 0.92, opacity: 0.5 }, { scale: 1, opacity: 1, ease: 'none', force3D: true }, 0)
        .to('.card-2-2', { xPercent: -move, ease: 'none', force3D: true }, 0)
        .to('.card-2-1', { xPercent: -(move * 2), ease: 'none', force3D: true }, 0)
      tl.fromTo(
        ['.card-1-2 .card-content', '.card-1-3 .card-content', '.card-2-2 .card-content', '.card-2-1 .card-content'],
        { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, force3D: true }, 0.25,
      )
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="products" className="overflow-hidden relative bg-white" style={{ zIndex: 1 }}>
      <div className="pin-panel h-screen w-full flex flex-col justify-center relative px-6 lg:px-20 max-w-[1600px] mx-auto">
        <div className="mb-14 relative z-50">
          <div className="section-label light mb-5">{products.badge}</div>
          <h2 className="text-5xl md:text-6xl font-medium tracking-tight text-white">
            {products.titleWord} <span className="text-gradient italic font-light">{products.titleAccent}</span>
          </h2>
          <p className="text-white/50 mt-3 text-sm max-w-md">{products.desc}</p>
        </div>

        <div className="products-grid">
          <div className="row-container row-1 flex relative h-[35vh] min-h-[280px] max-h-[420px] mb-5">
            {row1.map(c => <BentoCard key={c.cls} {...c} />)}
          </div>
          <div className="row-container row-2 flex relative h-[35vh] min-h-[280px] max-h-[420px]">
            {row2.map(c => <BentoCard key={c.cls} {...c} />)}
          </div>
        </div>
      </div>
      <div className="scroll-spacer h-[10vh]"></div>
    </section>
  )
}
