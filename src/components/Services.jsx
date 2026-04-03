import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const serviceImages = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1590959651373-a3db0f38a961?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
]

function LocationIcon() {
  return (
    <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
      <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
    </svg>
  )
}

export default function Services() {
  const { t } = useLanguage()
  const services = t('services')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gs_reveal_services', {
        scrollTrigger: {
          trigger: '#services-sec',
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
        y: 55,
        opacity: 0,
        duration: 1.1,
        stagger: 0.18,
        ease: 'power3.out',
      })
    }, '#services-sec')
    return () => ctx.revert()
  }, [])

  return (
    <section id="services-sec" className="py-32 bg-white relative" style={{ zIndex: 1 }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20 gs_reveal_services">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 bg-accent rounded-sm"></span>
            <span className="text-xs font-semibold tracking-widest text-secondary uppercase">{services.badge}</span>
          </div>
          <h2 className="text-5xl font-bold mb-5 tracking-tight">
            {services.title}<br />{services.titleBr}
          </h2>
          <p className="text-secondary max-w-2xl mx-auto leading-relaxed text-sm">{services.desc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {services.items.map(({ title, desc, location, time }, i) => (
            <div key={title} className="service-card gs_reveal_services">
              <div className="beveled-corner overflow-hidden mb-7 bg-gray-100 h-64 shadow-xl">
                <img src={serviceImages[i]} alt={title} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-3">{title}</h3>
              <p className="text-secondary text-sm mb-5 leading-relaxed">{desc}</p>
              <div className="flex items-center gap-5 text-xs text-secondary font-medium mb-7">
                <span className="flex items-center gap-1.5"><LocationIcon />{location}</span>
                <span className="flex items-center gap-1.5"><ClockIcon />{time}</span>
              </div>
              <a href="#contact" className="text-accent font-semibold flex items-center gap-2 hover:underline text-sm">
                {services.requestConsultation} <span>→</span>
              </a>
            </div>
          ))}
        </div>

        <div className="text-center gs_reveal_services">
          <Link to="/services" className="inline-block bg-surface border border-surface-mid px-10 py-4 rounded-xl font-medium hover:bg-surface-mid transition-colors text-sm">
            {services.exploreAll}
          </Link>
        </div>
      </div>
    </section>
  )
}
