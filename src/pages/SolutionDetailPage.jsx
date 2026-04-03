import { useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { solutions } from '../data/pageData'

gsap.registerPlugin(ScrollTrigger)

function ArrowIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  )
}

export default function SolutionDetailPage() {
  const { id } = useParams()
  const solution = solutions.find(s => s.id === id)

  useEffect(() => {
    window.scrollTo(0, 0)
    gsap.fromTo('.sol-detail-hero > *',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.1 }
    )
    gsap.fromTo('.sol-detail-content',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.sol-detail-content', start: 'top 80%' }
      }
    )
  }, [id])

  if (!solution) return <Navigate to="/solutions" replace />

  const currentIndex = solutions.findIndex(s => s.id === id)
  const nextSolution = solutions[(currentIndex + 1) % solutions.length]
  const prevSolution = solutions[(currentIndex - 1 + solutions.length) % solutions.length]

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Hero */}
      <section
        className="relative pt-36 pb-0 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #040D1A 0%, #071525 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(26,111,219,0.4) 0%, transparent 65%)' }}
        ></div>
        {/* Back button — fixed to top of viewport, above hero */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-24 pb-4" style={{ background: 'rgba(4,13,26,0.6)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <Link
              to="/solutions"
              className="inline-flex items-center gap-2 text-xs font-medium transition-colors"
              style={{ color: 'rgba(77,158,255,0.8)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#4D9EFF'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(77,158,255,0.8)'}
            >
              <svg className="w-3.5 h-3.5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              All Solutions
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="sol-detail-hero">
            <span className="section-label light mb-4 block">Solution {solution.num}</span>
            <h1 className="text-5xl lg:text-6xl font-medium text-white mb-6 leading-tight">{solution.title}</h1>
            <p className="text-white/50 max-w-2xl text-sm leading-relaxed">{solution.shortDesc}</p>
          </div>

          {/* Hero image */}
          <div className="mt-14 rounded-t-2xl overflow-hidden" style={{ height: '560px' }}>
            <img
              src={solution.image}
              alt={solution.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 sol-detail-content">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main content */}
            <div className="lg:col-span-2">
              {solution.sections ? (
                /* Sectioned layout (e.g. VRF) */
                <div className="space-y-16">
                  {solution.sections.map((sec, i) => (
                    <div key={sec.title}>
                      {/* Section header */}
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className="font-mono text-xs tracking-widest"
                          style={{ color: '#4D9EFF' }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="h-px w-8" style={{ background: 'rgba(26,111,219,0.3)' }}></span>
                      </div>
                      <h3 className="text-3xl font-medium mb-5" style={{ color: '#071525' }}>{sec.title}</h3>

                      {/* Text block */}
                      <p className="text-base leading-relaxed mb-6" style={{ color: '#5A7896' }}>{sec.description}</p>
                      <ul className="space-y-3 mb-10">
                        {sec.points.map(pt => (
                          <li key={pt} className="flex items-start gap-3 text-base" style={{ color: '#071525' }}>
                            <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#1A6FDB' }}></span>
                            {pt}
                          </li>
                        ))}
                      </ul>

                      {/* Full-width image(s) below text */}
                      {sec.images ? (
                        <div className="grid grid-cols-2 gap-4">
                          {sec.images.map((src, idx) => (
                            <div
                              key={idx}
                              className="rounded-2xl overflow-hidden shadow-lg"
                              style={{ border: '1px solid rgba(26,111,219,0.1)', aspectRatio: '4/3' }}
                            >
                              <img
                                src={src}
                                alt={`${sec.title} ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          className="rounded-2xl overflow-hidden shadow-lg"
                          style={{ border: '1px solid rgba(26,111,219,0.1)', height: '360px' }}
                        >
                          <img
                            src={sec.image}
                            alt={sec.title}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          />
                        </div>
                      )}

                      {/* Divider (not after last) */}
                      {i < solution.sections.length - 1 && (
                        <div className="mt-16" style={{ height: '1px', background: '#E4EBF5' }}></div>
                      )}
                    </div>
                  ))}

                  <Link to="/#contact" className="cta-pill-dark text-primary text-sm font-medium">
                    <span>Request this Service</span>
                    <span className="icon"><ArrowIcon /></span>
                  </Link>
                </div>
              ) : (
                /* Default layout */
                <>
                  <h2 className="text-4xl font-medium mb-6" style={{ color: '#071525' }}>Overview</h2>
                  <p className="text-base leading-relaxed mb-10" style={{ color: '#5A7896' }}>{solution.desc}</p>

                  <h3 className="text-2xl font-medium mb-5" style={{ color: '#071525' }}>What We Deliver</h3>
                  <div className="space-y-3 mb-12">
                    {solution.features.map((f, i) => (
                      <div
                        key={f}
                        className="flex items-center gap-4 p-5 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                        style={{ background: '#F2F6FC', border: '1px solid #E4EBF5' }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'rgba(26,111,219,0.25)'
                          e.currentTarget.style.background = 'rgba(26,111,219,0.04)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = '#E4EBF5'
                          e.currentTarget.style.background = '#F2F6FC'
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono"
                          style={{ background: '#1A6FDB', color: 'white' }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <span className="text-base font-medium" style={{ color: '#071525' }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/#contact" className="cta-pill-dark text-primary text-sm font-medium">
                    <span>Request this Service</span>
                    <span className="icon"><ArrowIcon /></span>
                  </Link>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Other solutions */}
              <div className="p-6 rounded-2xl" style={{ background: '#F2F6FC', border: '1px solid #E4EBF5' }}>
                <h4 className="text-sm font-semibold mb-4" style={{ color: '#071525' }}>Other Solutions</h4>
                <div className="space-y-2">
                  {solutions.filter(s => s.id !== id).map(s => (
                    <Link
                      key={s.id}
                      to={`/solutions/${s.id}`}
                      className="flex items-center justify-between p-3 rounded-xl transition-all duration-200 group"
                      style={{ background: 'white', border: '1px solid #E4EBF5' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(26,111,219,0.3)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#E4EBF5'}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono" style={{ color: '#1A6FDB' }}>{s.num}</span>
                        <span className="text-xs font-medium" style={{ color: '#071525' }}>{s.title}</span>
                      </div>
                      <ArrowIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prev / Next */}
      <section className="py-12" style={{ background: '#F2F6FC', borderTop: '1px solid #E4EBF5' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row gap-4 justify-between">
          <Link
            to={`/solutions/${prevSolution.id}`}
            className="flex items-center gap-3 group"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{ background: '#E4EBF5', border: '1px solid #C9D8EF' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="#1A6FDB" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <div>
              <p className="text-xs mb-0.5" style={{ color: '#5A7896' }}>Previous</p>
              <p className="text-sm font-medium" style={{ color: '#071525' }}>{prevSolution.title}</p>
            </div>
          </Link>
          <Link
            to={`/solutions/${nextSolution.id}`}
            className="flex items-center gap-3 justify-end group"
          >
            <div>
              <p className="text-xs mb-0.5 text-right" style={{ color: '#5A7896' }}>Next</p>
              <p className="text-sm font-medium" style={{ color: '#071525' }}>{nextSolution.title}</p>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{ background: '#E4EBF5', border: '1px solid #C9D8EF' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="#1A6FDB" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
