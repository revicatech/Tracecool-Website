import { useRef, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import video from '../assets/video.mp4'
export default function Hero() {
  const { t } = useLanguage()
  const hero = t('hero')
  const videoRef = useRef(null)

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

    const interactionEvents = ['click', 'keydown', 'touchstart', 'pointerdown', 'scroll']
    let lastTime = 0
    const onTimeUpdate = () => {
      if (video.currentTime < lastTime - 0.3) {
        video.muted = true
        video.removeEventListener('timeupdate', onTimeUpdate)
      }
      lastTime = video.currentTime
    }

    const enableSound = () => {
      interactionEvents.forEach(ev => document.removeEventListener(ev, enableSound))
      video.muted = false
      lastTime = video.currentTime
      video.addEventListener('timeupdate', onTimeUpdate)
    }
    interactionEvents.forEach(ev =>
      document.addEventListener(ev, enableSound, { passive: true, once: true })
    )

    return () => {
      document.removeEventListener('visibilitychange', keepPlaying)
      clearInterval(interval)
      interactionEvents.forEach(ev => document.removeEventListener(ev, enableSound))
      video.removeEventListener('timeupdate', onTimeUpdate)
    }
  }, [])

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
        <source src={video} type="video/mp4" />
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
