import { useEffect, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'

function animateCounter(el, target) {
  const duration = 2200
  const steps = 72
  let step = 0
  const easeOut = t => 1 - Math.pow(1 - t, 3)
  const timer = setInterval(() => {
    step++
    el.textContent = Math.floor(easeOut(step / steps) * target).toLocaleString()
    if (step >= steps) { el.textContent = target.toLocaleString(); clearInterval(timer) }
  }, duration / steps)
}

export default function Stats() {
  const { t } = useLanguage()
  const stats = t('stats')
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !e.target.dataset.animated) {
          e.target.dataset.animated = '1'
          e.target.querySelectorAll('.counter-num[data-count]').forEach(el =>
            animateCounter(el, parseInt(el.dataset.count))
          )
        }
      })
    }, { threshold: 0.3 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="stats" ref={sectionRef} className="py-24 bg-white relative" style={{ zIndex: 1 }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 reveal">
          <h2 className="text-3xl md:text-4xl font-medium max-w-xl leading-tight">{stats.heading}</h2>
          <div className="mt-8 md:mt-0">
            <a href="#solutions" className="cta-pill-dark text-primary text-sm font-medium">
              <span>{stats.cta}</span>
              <span className="icon">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 border-t border-gray-200 pt-10 reveal" style={{ transitionDelay: '200ms' }}>
          {stats.items.map(({ count, label }) => (
            <div key={label}>
              <h2 className="text-5xl md:text-6xl font-medium mb-2">
                <span className="counter-num" data-count={count}>0</span>
                <span className="text-accent">+</span>
              </h2>
              <p className="text-secondary text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
