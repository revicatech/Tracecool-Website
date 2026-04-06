import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const productMeta = [
  { cls: 'card-1-1', img: 'https://i.pinimg.com/1200x/42/4f/37/424f377d8faefd209c891c4b0fa00ac8.jpg', z: 30 },
  { cls: 'card-1-2', img: 'https://i.pinimg.com/1200x/6f/48/2e/6f482e2464626abdf12a6a5b569f372f.jpg', z: 20 },
  { cls: 'card-1-3', img: 'https://i.pinimg.com/736x/cd/35/84/cd3584692be0c8de7e00371761265851.jpg', z: 10 },
  { cls: 'card-2-3', img: 'https://i.pinimg.com/1200x/9d/ce/fc/9dcefc29eb5b3148c1adf9aa576afed1.jpg', z: 30 },
  { cls: 'card-2-2', img: 'https://i.pinimg.com/736x/a2/aa/31/a2aa316e8ccf77d886237cc01a38ca57.jpg', z: 20 },
  { cls: 'card-2-1', img: 'https://i.pinimg.com/1200x/40/88/c3/4088c3d0b109677749a03ce0c5e295e1.jpg', z: 10 },
]

function BentoCard({ cls, img, title, desc, z }) {
  return (
    <Link to="/products" className={`bento-card ${cls}`} style={{ zIndex: z }}>
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

  // Build cards: use backend categories when available, fallback to translation data
  const cards = (categories.length > 0 ? categories : products.items).slice(0, 6).map((item, i) => {
    const meta = productMeta[i]
    if (categories.length > 0) {
      return {
        ...meta,
        title: lang === 'ar' ? item.name_ar : item.name_en,
        desc: '',
        slug: item.slug,
      }
    }
    return { ...meta, ...item, slug: null }
  })

  const row1 = cards.slice(0, 3)
  const row2 = cards.slice(3, 6)

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1025px)', () => {
      gsap.from('#products .mb-14', {
        scrollTrigger: { trigger: '#products', start: 'top 80%', toggleActions: 'play none none none' },
        y: 40, opacity: 0, duration: 1, ease: 'power3.out',
      })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#products', start: 'top top', end: 'bottom bottom',
          scrub: 1.2, pin: '.pin-panel', anticipatePin: 1,
        },
      })
      const move = 104
      tl.fromTo('.card-1-1', { scale: 0.92, opacity: 0.5 }, { scale: 1, opacity: 1, ease: 'none' }, 0)
        .to('.card-1-2', { xPercent: move, ease: 'none' }, 0)
        .to('.card-1-3', { xPercent: move * 2, ease: 'none' }, 0)
      tl.fromTo('.card-2-3', { scale: 0.92, opacity: 0.5 }, { scale: 1, opacity: 1, ease: 'none' }, 0)
        .to('.card-2-2', { xPercent: -move, ease: 'none' }, 0)
        .to('.card-2-1', { xPercent: -(move * 2), ease: 'none' }, 0)
      tl.fromTo(
        ['.card-1-2 .card-content', '.card-1-3 .card-content', '.card-2-2 .card-content', '.card-2-1 .card-content'],
        { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, 0.25,
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
