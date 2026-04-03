import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../context/LanguageContext'
import { products as productData } from '../data/pageData'

gsap.registerPlugin(ScrollTrigger)

const productMeta = [
  { cls: 'card-1-1', img: 'https://i.pinimg.com/1200x/bf/c2/9a/bfc29a86d88c265a879d55ebecba6e27.jpg', z: 30 },
  { cls: 'card-1-2', img: 'https://images.unsplash.com/photo-1590959651373-a3db0f38a961?auto=format&fit=crop&w=800&q=80', z: 20 },
  { cls: 'card-1-3', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80', z: 10 },
  { cls: 'card-2-3', img: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80', z: 30 },
  { cls: 'card-2-2', img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80', z: 20 },
  { cls: 'card-2-1', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80', z: 10 },
]

function BentoCard({ cls, img, title, desc, z, productId }) {
  return (
    <Link to={productId ? `/products/${productId}` : '/products'} className={`bento-card ${cls}`} style={{ zIndex: z }}>
      <img src={img} alt={title} />
      <div className="card-content">
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </Link>
  )
}

export default function Products() {
  const { t } = useLanguage()
  const products = t('products')
  const cards = products.items.map((item, i) => ({ ...productMeta[i], ...item, productId: productData[i]?.id }))
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
