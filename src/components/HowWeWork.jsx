import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

export default function HowWeWork() {
  const { t } = useLanguage()
  const hw = t('howWeWork')

  useEffect(() => {
    gsap.to('.process-step', {
      scrollTrigger: {
        trigger: '#how-we-work',
        start: 'top 68%',
        toggleActions: 'play none none none',
        onEnter: () => {
          const line = document.getElementById('process-line')
          if (line) {
            line.style.transition = 'width 1.6s cubic-bezier(0.4,0,0.2,1) 0.3s'
            line.style.width = '100%'
          }
        },
      },
      x: 0, opacity: 1, duration: 0.85, stagger: 0.2, ease: 'power3.out',
    })
  }, [])

  return (
    <section id="how-we-work" className="py-28 bg-white border-t border-gray-100 relative" style={{ zIndex: 1 }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <div className="section-label mb-4">{hw.badge}</div>
            <h2 className="text-4xl md:text-5xl font-medium leading-tight">{hw.title}</h2>
          </div>
          <p className="text-secondary text-sm max-w-xs mt-5 md:mt-0 leading-relaxed">{hw.desc}</p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute h-px bg-gray-200" style={{ top: 20, left: 40, right: 40, zIndex: 0 }}>
            <div id="process-line" className="h-full bg-accent transition-none" style={{ width: 0 }}></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 relative z-10">
            {hw.steps.map(({ num, title, desc }) => (
              <div key={num} className="process-step">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-sm mb-6 shadow-lg shadow-accent/30">
                  {num}
                </div>
                <h4 className="font-semibold mb-3 text-base">{title}</h4>
                <p className="text-secondary text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 reveal">
          {hw.features.map(({ value, desc, dark }) => {
            const isISO = value === 'ISO 9001'
            return (
              <div key={value} className={`${dark ? 'bg-primary' : 'bg-surface'} rounded-2xl p-8 flex flex-col gap-4`}>
                {isISO ? (
                  <span className="text-3xl font-bold text-white">
                    ISO<br /><span className="text-accent-light">9001</span>
                  </span>
                ) : (
                  <span className={`text-3xl font-bold ${dark ? 'text-white' : 'text-accent'}`}>{value}</span>
                )}
                <p className={`text-sm leading-relaxed ${dark ? 'text-white/50' : 'text-secondary'}`}>{desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
