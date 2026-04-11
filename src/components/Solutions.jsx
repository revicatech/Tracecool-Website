import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { solutions } from '../data/pageData'

export default function Solutions() {
  const { t, lang } = useLanguage()
  const section = t('solutions')
  const tStr = (en, ar) => (lang === 'ar' && ar) ? ar : en

  return (
    <section id="solutions" className="py-24 bg-white relative" style={{ zIndex: 1 }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">

          <div className="lg:w-1/3 lg:sticky lg:top-32 lg:h-fit reveal">
            <div className="section-label mb-5">{section.badge}</div>
            <div className="blue-line"></div>
            <h2 className="text-4xl font-medium mb-5 leading-tight">{section.title}</h2>
            <p className="text-secondary mb-10 leading-relaxed text-sm">{section.desc}</p>
            <Link to="/solutions" className="cta-pill-dark text-primary text-sm font-medium">
              <span>{section.cta}</span>
              <span className="icon">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12 gap-y-16">
            {solutions.map((solution, i) => (
              <Link
                key={solution.id}
                to={`/solutions/${solution.id}`}
                className="reveal group block"
                style={i % 2 === 1 ? { transitionDelay: '100ms' } : {}}
              >
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <span className="text-xs text-secondary block bg-surface w-fit px-3 py-1 rounded-full border border-gray-100">{solution.num}</span>
                </div>
                <h3 className="text-3xl font-medium mb-3 text-gray-900">{tStr(solution.title, solution.title_ar)}</h3>
                <p className="text-secondary text-m mb-5 leading-relaxed" style={{ minHeight: '5rem' }}>{tStr(solution.shortDesc, solution.shortDesc_ar)}</p>
                <img
                  src={solution.image}
                  alt={tStr(solution.title, solution.title_ar)}
                  className="w-full aspect-square object-cover rounded-lg transition-all duration-700 shadow-sm"
                />
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
