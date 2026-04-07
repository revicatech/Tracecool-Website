import { useLanguage } from '../context/LanguageContext'
import realImage from '../assets/realImage.png'
const valueIcons = [
  <path key="1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  <path key="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />,
  <path key="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />,
  <path key="4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
]

export default function About() {
  const { t } = useLanguage()
  const about = t('about')

  return (
    <section id="about" className="py-24 bg-surface relative" style={{ zIndex: 1 }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">

          <div className="lg:w-5/12 lg:sticky lg:top-32 lg:h-fit reveal">
            <div className="section-label mb-5">{about.badge}</div>
            <div className="blue-line"></div>
            <h2 className="text-4xl font-medium leading-tight mb-6">{about.title}</h2>
            <p className="text-secondary leading-relaxed mb-8 text-sm">{about.desc}</p>
            <a href="#services-sec" className="cta-pill-dark text-primary text-sm font-medium">
              <span>{about.cta}</span>
              <span className="icon">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </a>
          </div>

          <div className="lg:w-7/12 space-y-10">
            <div className="reveal" style={{ transitionDelay: '100ms' }}>
              <img
                src={realImage}
                alt={about.badge}
                className="w-full h-48 sm:h-64 md:h-72 object-cover rounded-xl shadow-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 reveal" style={{ transitionDelay: '200ms' }}>
              {about.values.map(({ title, desc }, i) => (
                <div key={title} className="sol-card p-6">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {valueIcons[i]}
                    </svg>
                  </div>
                  <h4 className="font-medium mb-2 text-sm">{title}</h4>
                  <p className="text-secondary text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
