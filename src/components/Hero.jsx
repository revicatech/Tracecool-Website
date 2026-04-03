import { useRef, useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()
  const hero = t('hero')
  const videoRef = useRef(null)
  const [soundOn, setSoundOn] = useState(true)
  const unlockedRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.play().catch(() => {})

    const keepPlaying = () => {
      if (!document.hidden && video.paused) video.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', keepPlaying)
    const interval = setInterval(keepPlaying, 300)

    const enableSound = () => {
      if (unlockedRef.current) return
      unlockedRef.current = true
      ;['click', 'keydown', 'touchstart', 'pointerdown', 'scroll'].forEach(ev =>
        document.removeEventListener(ev, enableSound)
      )
      if (soundOn) video.muted = false
    }
    ;['click', 'keydown', 'touchstart', 'pointerdown', 'scroll'].forEach(ev =>
      document.addEventListener(ev, enableSound, { passive: true })
    )

    return () => {
      document.removeEventListener('visibilitychange', keepPlaying)
      clearInterval(interval)
      ;['click', 'keydown', 'touchstart', 'pointerdown', 'scroll'].forEach(ev =>
        document.removeEventListener(ev, enableSound)
      )
    }
  }, [])

  const toggleSound = () => {
    unlockedRef.current = true
    const next = !soundOn
    setSoundOn(next)
    if (videoRef.current) videoRef.current.muted = !next
  }

  return (
    <header
      id="home"
      className="sticky top-0 h-screen min-h-[580px] flex items-center overflow-hidden"
      style={{ background: '#071525', zIndex: 0 }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline autoPlay loop muted
      >
        <source src="/2.mp4" type="video/mp4" />
      </video>

      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(140deg,rgba(7,21,37,0.55) 0%,rgba(14,40,80,0.45) 60%,rgba(26,111,219,0.15) 100%)' }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(77,158,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(77,158,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Sound toggle */}
      <button
        onClick={toggleSound}
        title="Toggle sound"
        style={{
          position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 20,
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(7,21,37,0.6)', border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', transition: 'background 0.25s, border-color 0.25s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(26,111,219,0.55)'; e.currentTarget.style.borderColor = 'rgba(77,158,255,0.6)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(7,21,37,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
      >
        {soundOn ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full z-10 pt-20 sm:pt-24">
        <div className="max-w-3xl text-white reveal">
          <div className="section-label light mb-6">{hero.badge}</div>
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-[1.08] mb-7">
            {hero.titleLine1}<br />
            <span className="text-gradient">{hero.titleLine2}</span>
          </h1>
          <p className="text-base md:text-lg font-light mb-10 max-w-xl text-white/75 leading-relaxed">
            {hero.desc}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <a href="#solutions" className="cta-pill text-white text-sm font-medium">
              <span>{hero.cta1}</span>
              <span className="icon">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </a>
            <a href="#services-sec" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm group">
              <span>{hero.cta2}</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-[10px] tracking-widest uppercase">
        <span>{hero.scroll}</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent"></div>
      </div>
    </header>
  )
}
