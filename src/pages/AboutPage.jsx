import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { agents, agentRegions, timeline } from '../data/pageData'

gsap.registerPlugin(ScrollTrigger)

// ── Map marker factory ────────────────────────────────────────
function makeIcon(isHQ) {
  return L.divIcon({
    className: 'tc-marker-wrap',
    html: `<div class="tc-ring"></div><div class="tc-dot${isHQ ? ' hq' : ''}"></div>`,
    iconSize: [20, 20], iconAnchor: [10, 10], popupAnchor: [0, -16],
  })
}

function makePopup(a) {
  return `<div style="min-width:110px;padding:4px 0">
    <p style="font-size:7px;font-weight:700;color:#4D9EFF;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px">${a.type}</p>
    <p style="font-size:13px;font-weight:600;color:#fff;margin-bottom:2px">${a.name}</p>
    <p style="font-size:9px;color:rgba(255,255,255,0.45);margin-bottom:6px">${a.country}</p>
    <p style="font-size:9px;color:rgba(255,255,255,0.35)">${a.team} team members</p>
  </div>`
}

// ── Stat pill ─────────────────────────────────────────────────
function StatPill({ value, label }) {
  return (
    <div className="text-center px-6 py-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
    </div>
  )
}

// ── Value card ────────────────────────────────────────────────
const valueIcons = [
  <path key="1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  <path key="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />,
  <path key="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />,
  <path key="4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
]

const values = [
  { title: 'German Engineering Standard', desc: 'All systems designed and certified to DIN VDE, ASHRAE, and ISO EN standards for uncompromised performance.' },
  { title: 'Energy Efficiency First', desc: 'We average a 35% reduction in energy consumption across all HVAC installations through intelligent design and automation.' },
  { title: 'Global Project Delivery', desc: 'Active project offices across Europe, Middle East, Asia and the Americas with local expertise and global engineering standards.' },
  { title: '24/7 Service & Support', desc: 'Round-the-clock emergency response and predictive maintenance keeping your systems at peak performance.' },
]

// ── Interactive World Map ─────────────────────────────────────
function AgentsMap() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const [activeAgent, setActiveAgent] = useState(agents[0])
  const [filterRegion, setFilterRegion] = useState('All')

  const filtered = filterRegion === 'All' ? agents : agents.filter(a => a.region === filterRegion)

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
      markersRef.current = []
    }

    const map = L.map(mapRef.current, {
      center: [25, 20],
      zoom: 2,
      scrollWheelZoom: false,
      zoomControl: false,
      minZoom: 2,
    })
    mapInstanceRef.current = map
    L.control.zoom({ position: 'topright' }).addTo(map)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO',
    }).addTo(map)

    markersRef.current = agents.map((a, i) =>
      L.marker([a.lat, a.lng], { icon: makeIcon(a.isHQ) })
        .addTo(map)
        .bindPopup(makePopup(a), { closeButton: false })
        .on('click', () => setActiveAgent(a))
    )

    setTimeout(() => markersRef.current[0]?.openPopup(), 600)

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  const flyTo = (agent) => {
    setActiveAgent(agent)
    const map = mapInstanceRef.current
    if (!map) return
    const idx = agents.findIndex(a => a.id === agent.id)
    map.flyTo([agent.lat, agent.lng], 5, { duration: 1.4 })
    markersRef.current[idx]?.openPopup()
  }

  return (
    <div>
      {/* Region filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', ...agentRegions].map(r => (
          <button
            key={r}
            onClick={() => setFilterRegion(r)}
            className="text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200"
            style={{
              background: filterRegion === r ? '#1A6FDB' : 'rgba(255,255,255,0.05)',
              color: filterRegion === r ? 'white' : 'rgba(255,255,255,0.5)',
              border: filterRegion === r ? '1px solid #1A6FDB' : '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full rounded-2xl overflow-hidden"
        style={{ height: 460, border: '1px solid rgba(255,255,255,0.07)' }}
      />

      {/* Agent cards below map */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-5">
        {filtered.map(a => (
          <button
            key={a.id}
            onClick={() => flyTo(a)}
            className="text-left rounded-xl p-4 transition-all duration-250"
            style={{
              background: activeAgent?.id === a.id ? 'rgba(26,111,219,0.15)' : 'rgba(255,255,255,0.03)',
              border: activeAgent?.id === a.id ? '1px solid rgba(26,111,219,0.45)' : '1px solid rgba(255,255,255,0.07)',
            }}
            onMouseEnter={e => {
              if (activeAgent?.id !== a.id) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
              }
            }}
            onMouseLeave={e => {
              if (activeAgent?.id !== a.id) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
              }
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-1"
              style={{ color: a.isHQ ? '#fff' : '#4D9EFF' }}
            >
              {a.label}
            </p>
            <p className="font-medium text-sm text-white">{a.name}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{a.country}</p>
          </button>
        ))}
      </div>

      {/* Active agent detail panel */}
      {activeAgent && (
        <div
          className="mt-6 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300"
          style={{ background: 'rgba(26,111,219,0.07)', border: '1px solid rgba(26,111,219,0.2)' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: activeAgent.isHQ ? 'rgba(255,255,255,0.15)' : 'rgba(26,111,219,0.25)', color: activeAgent.isHQ ? 'white' : '#4D9EFF' }}
              >
                {activeAgent.type}
              </span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Est. {activeAgent.since}</span>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-1">{activeAgent.name}</h3>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>{activeAgent.country} — {activeAgent.region}</p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{activeAgent.desc}</p>
          </div>
          <div className="flex flex-col justify-between">
            <div className="space-y-3">
              {[
                { icon: 'location', val: activeAgent.address },
                { icon: 'email', val: activeAgent.email },
                { icon: 'phone', val: activeAgent.phone },
              ].map(item => (
                <div key={item.icon} className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(26,111,219,0.25)' }}
                  >
                    <svg className="w-3.5 h-3.5" style={{ color: '#4D9EFF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.icon === 'location' && <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></>}
                      {item.icon === 'email' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                      {item.icon === 'phone' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />}
                    </svg>
                  </div>
                  <p className="text-xs leading-relaxed pt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{item.val}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-5 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <p className="text-xl font-bold text-white">{activeAgent.team}</p>
                <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Team Size</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">{activeAgent.projects}</p>
                <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Projects</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">{activeAgent.since}</p>
                <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Since</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Timeline ──────────────────────────────────────────────────
function Timeline() {
  return (
    <div className="relative">
      {/* vertical line */}
      <div
        className="absolute left-[11px] top-0 bottom-0 w-px hidden md:block"
        style={{ background: 'linear-gradient(180deg, #1A6FDB 0%, rgba(26,111,219,0.15) 100%)' }}
      ></div>
      <div className="space-y-10 md:space-y-8">
        {timeline.map((item, i) => (
          <div key={item.year} className="flex gap-6 md:gap-10 items-start tl-item">
            {/* Dot + year */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 relative"
                style={{ background: '#040D1A', borderColor: '#1A6FDB' }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: '#4D9EFF' }}></div>
              </div>
            </div>
            {/* Content */}
            <div className="flex-1 pb-2">
              <span
                className="text-xs font-mono font-bold tracking-widest mb-2 block"
                style={{ color: '#4D9EFF' }}
              >
                {item.year}
              </span>
              <h4 className="text-base font-semibold mb-1.5" style={{ color: '#071525' }}>{item.title}</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#5A7896' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function AboutPage() {
  const heroRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    // Hero entrance
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-hero-content > *',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.14, ease: 'power3.out', delay: 0.1 }
      )
    }, heroRef)

    // Values scroll reveal
    gsap.fromTo('.value-card',
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '#about-values', start: 'top 80%' }
      }
    )

    // Timeline items
    gsap.fromTo('.tl-item',
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '#about-timeline', start: 'top 78%' }
      }
    )

    return () => ctx.revert()
  }, [])

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative pt-36 pb-24 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #040D1A 0%, #071525 100%)' }}
      >
        {/* glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(ellipse at 65% 40%, rgba(26,111,219,0.25) 0%, transparent 65%)' }}
        ></div>
        {/* grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 about-hero-content">
          <div className="section-label light mb-5">About TRACECOOL</div>
          <h1 className="text-5xl lg:text-7xl font-medium text-white mb-6 leading-tight max-w-4xl">
            Precision Climate Control<br />
            <span className="text-gradient italic font-light">Since 1999.</span>
          </h1>
          <p className="text-white/50 max-w-2xl text-sm leading-relaxed mb-12">
            TRACECOOL is a privately owned, independent HVAC consulting and engineering company headquartered in Worms, Germany.
            For over two decades, we have delivered intelligent climate engineering solutions to clients across Europe, the Middle East, and Asia.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            <StatPill value="25+" label="Years of Excellence" />
            <StatPill value="1,000+" label="Projects Delivered" />
            <StatPill value="60+" label="Countries Served" />
            <StatPill value="8" label="Global Offices" />
          </div>
        </div>

        {/* Hero image strip */}
        <div className="mt-16 overflow-hidden">
          <div className="flex gap-3 px-6 lg:px-8 max-w-7xl mx-auto">
            {[
              'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
            ].map((src, i) => (
              <div
                key={i}
                className="flex-1 rounded-2xl overflow-hidden"
                style={{ height: '220px', opacity: 1 - i * 0.2 }}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story ─────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <div className="section-label mb-5">Our Story</div>
              <div className="blue-line"></div>
              <h2 className="text-4xl font-medium mb-6 leading-tight" style={{ color: '#071525' }}>
                Built on Engineering<br />Excellence
              </h2>
              <p className="text-sm leading-loose mb-5" style={{ color: '#5A7896' }}>
                Founded in 1999 by a team of German mechanical engineers, TRACECOOL began as a specialist consultancy for commercial HVAC systems in the Rhine-Neckar region. Our reputation for technical precision and energy-efficient design quickly attracted projects across Germany and neighbouring markets.
              </p>
              <p className="text-sm leading-loose mb-8" style={{ color: '#5A7896' }}>
                Today, with 8 offices spanning 4 continents, we combine the precision of German engineering with deep local market knowledge — delivering everything from single-building system designs to multi-site district energy infrastructure.
              </p>
              <div className="flex gap-6">
                {[
                  { value: 'ISO 9001', label: 'Certified' },
                  { value: 'ASHRAE', label: 'Member' },
                  { value: 'VDMA', label: 'Certified' },
                ].map(c => (
                  <div
                    key={c.label}
                    className="px-4 py-3 rounded-xl text-center"
                    style={{ background: '#F2F6FC', border: '1px solid #E4EBF5' }}
                  >
                    <p className="text-sm font-bold" style={{ color: '#1A6FDB' }}>{c.value}</p>
                    <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: '#5A7896' }}>{c.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal" style={{ transitionDelay: '150ms' }}>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=80"
                  alt="TRACECOOL engineering team"
                  className="w-full rounded-2xl object-cover shadow-2xl"
                  style={{ height: '420px' }}
                />
                <div
                  className="absolute -bottom-5 -left-5 rounded-2xl p-5 hidden md:block"
                  style={{ background: '#040D1A', border: '1px solid rgba(26,111,219,0.25)', minWidth: '180px' }}
                >
                  <p className="text-3xl font-bold text-white mb-1">35%</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>Average energy saving<br />across all installations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────── */}
      <section id="about-values" className="py-20" style={{ background: '#F2F6FC' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="section-label justify-center mb-4">Our Principles</div>
            <h2 className="text-4xl font-medium" style={{ color: '#071525' }}>What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ title, desc }, i) => (
              <div
                key={title}
                className="value-card p-7 rounded-2xl transition-all duration-350 hover:-translate-y-2"
                style={{
                  background: 'white',
                  border: '1px solid #E4EBF5',
                  boxShadow: '0 2px 16px rgba(7,21,37,0.04)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(26,111,219,0.25)'
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(26,111,219,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E4EBF5'
                  e.currentTarget.style.boxShadow = '0 2px 16px rgba(7,21,37,0.04)'
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(26,111,219,0.08)' }}
                >
                  <svg className="w-5 h-5" style={{ color: '#1A6FDB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {valueIcons[i]}
                  </svg>
                </div>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: '#071525' }}>{title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: '#5A7896' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive Agents Map ────────────────────────────── */}
      <section className="py-24" style={{ background: '#040D1A' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div>
              <div className="section-label light mb-4">Global Network</div>
              <h2 className="text-4xl lg:text-5xl font-medium text-white leading-tight">
                Close to our clients,<br />
                <span className="text-gradient italic font-light">wherever they operate.</span>
              </h2>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">8</p>
                <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Offices</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">4</p>
                <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Continents</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">130+</p>
                <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Engineers</p>
              </div>
            </div>
          </div>

          <AgentsMap />
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────── */}
      <section id="about-timeline" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="section-label mb-5">Our History</div>
              <div className="blue-line"></div>
              <h2 className="text-4xl font-medium mb-6 leading-tight" style={{ color: '#071525' }}>
                25 Years of<br />Engineering Milestones
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#5A7896' }}>
                From a small consulting firm in Worms to an international HVAC engineering group — our journey has been defined by technical ambition, client partnerships, and a relentless focus on performance.
              </p>
            </div>
            <Timeline />
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section
        className="py-24 text-center"
        style={{ background: 'linear-gradient(180deg, #F2F6FC 0%, #fff 100%)', borderTop: '1px solid #E4EBF5' }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <div className="section-label justify-center mb-5">Work With Us</div>
          <h2 className="text-4xl font-medium mb-5" style={{ color: '#071525' }}>
            Ready to start a project?
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#5A7896' }}>
            Whether you need a full HVAC design, energy consultancy, or emergency maintenance — our global team is ready.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="cta-pill-dark text-primary text-sm font-medium">
              <span>Get in Touch</span>
              <span className="icon">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
            <Link to="/services" className="cta-pill text-white text-sm font-medium">
              <span>Explore Services</span>
              <span className="icon">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
