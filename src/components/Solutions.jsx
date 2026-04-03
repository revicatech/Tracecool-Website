import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const solutionImages = [
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
]

export default function Solutions() {
  const { t } = useLanguage()
  const solutions = t('solutions')

  return (
    <section id="solutions" className="py-24 bg-white relative" style={{ zIndex: 1 }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">

          <div className="lg:w-1/3 lg:sticky lg:top-32 lg:h-fit reveal">
            <div className="section-label mb-5">{solutions.badge}</div>
            <div className="blue-line"></div>
            <h2 className="text-4xl font-medium mb-5 leading-tight">{solutions.title}</h2>
            <p className="text-secondary mb-10 leading-relaxed text-sm">{solutions.desc}</p>
            <Link to="/solutions" className="cta-pill-dark text-primary text-sm font-medium">
              <span>{solutions.cta}</span>
              <span className="icon">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12 gap-y-16">
            {solutions.items.map(({ num, title, desc }, i) => (
              <div key={num} className="reveal" style={i % 2 === 1 ? { transitionDelay: '100ms' } : {}}>
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <span className="text-xs text-secondary block bg-surface w-fit px-3 py-1 rounded-full border border-gray-100">{num}</span>
                </div>
                <h3 className="text-3xl font-medium mb-3 text-gray-900">{title}</h3>
                <p className="text-secondary text-m mb-5 leading-relaxed" style={{ minHeight: '5rem' }}>{desc}</p>
                <img
                  src={solutionImages[i]}
                  alt={title}
                  className="w-full aspect-square object-cover rounded-lg transition-all duration-700 shadow-sm"
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
