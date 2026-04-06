import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../context/LanguageContext'

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
    <p style="font-size:13px;font-weight:600;color:#fff;margin-bottom:2px">${a.name_en}</p>
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
  { title: 'German Engineering Standard', title_ar: 'معيار الهندسة الألمانية', desc: 'All systems designed and certified to DIN VDE, ASHRAE, and ISO EN standards for uncompromised performance.', desc_ar: 'جميع الأنظمة مصممة ومعتمدة وفق معايير DIN VDE وASHRAE وISO EN لأداء لا تنازل فيه.' },
  { title: 'Energy Efficiency First', title_ar: 'الكفاءة الطاقوية أولاً', desc: 'We average a 35% reduction in energy consumption across all HVAC installations through intelligent design and automation.', desc_ar: 'نحقق في المتوسط انخفاضاً بنسبة 35٪ في استهلاك الطاقة في جميع تركيبات التكييف من خلال التصميم الذكي والأتمتة.' },
  { title: 'Global Project Delivery', title_ar: 'تسليم المشاريع عالمياً', desc: 'Active project offices across Europe, Middle East, Asia and the Americas with local expertise and global engineering standards.', desc_ar: 'مكاتب مشاريع نشطة في أوروبا والشرق الأوسط وآسيا والأمريكتين بخبرة محلية ومعايير هندسية عالمية.' },
  { title: '24/7 Service & Support', title_ar: 'خدمة ودعم على مدار الساعة', desc: 'Round-the-clock emergency response and predictive maintenance keeping your systems at peak performance.', desc_ar: 'استجابة طارئة على مدار الساعة وصيانة وقائية للحفاظ على أنظمتك في أعلى مستويات الأداء.' },
]

const philosophy = [
  {
    key: 'values',
    label: 'Values', label_ar: 'القيم',
    text: 'We operate with integrity, embrace openness, foster collaboration, and celebrate shared success.',
    text_ar: 'نعمل بنزاهة، ونتبنى الانفتاح، ونعزز التعاون، ونحتفل بالنجاح المشترك.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
  },
  {
    key: 'mission',
    label: 'Mission', label_ar: 'الرسالة',
    text: 'Our commitment: to continuously create exceptional value for our customers.',
    text_ar: 'التزامنا: خلق قيمة استثنائية باستمرار لعملائنا.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
  },
  {
    key: 'vision',
    label: 'Vision', label_ar: 'الرؤية',
    text: 'We aim to lead the HVAC industry and earn worldwide recognition as a trusted brand.',
    text_ar: 'نهدف إلى قيادة صناعة التكييف وكسب الاعتراف العالمي كعلامة تجارية موثوقة.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.394 0C6.606 8.604 9.094 6.5 12 6.5s5.394 2.104 6.394 5.5c-1 3.396-3.488 5.5-6.394 5.5S6.606 15.396 5.606 12z" />
    ),
  },
]

const coreBusiness = [
  {
    title: 'HVAC Products', title_ar: 'منتجات التكييف',
    desc: 'We offer a complete selection of air conditioning products for residential, commercial, and industrial use, including accessories and spare parts.',
    desc_ar: 'نقدم مجموعة كاملة من منتجات التكييف للاستخدام السكني والتجاري والصناعي، بما في ذلك الملحقات وقطع الغيار.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    ),
  },
  {
    title: 'HVAC Solutions', title_ar: 'حلول التكييف',
    desc: 'A skilled technical team delivers customized solutions for VRF, water, ventilation, and control systems.',
    desc_ar: 'يقدم فريق تقني متخصص حلولاً مخصصة لأنظمة VRF والمياه والتهوية والتحكم.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    ),
  },
  {
    title: 'HVAC Services', title_ar: 'خدمات التكييف',
    desc: 'Enjoy seamless one-stop services: HVAC system design, professional installation training, efficient shipment consolidation, and reliable after-sales assistance.',
    desc_ar: 'استمتع بخدمات شاملة متكاملة: تصميم أنظمة التكييف، والتدريب على التركيب المهني، وتوحيد الشحن الفعال، والدعم الموثوق بعد البيع.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
    ),
  },
]

// ── Hardcoded locations ───────────────────────────────────────
const LOCATIONS = [
  { id: '1', name_en: 'West Bekaa', country: 'Lebanon', region: 'Middle East', lat: 33.62, lng: 35.73 },
  { id: '2', name_en: 'North Bekaa', country: 'Lebanon', region: 'Middle East', lat: 34.27, lng: 36.18 },
  { id: '3', name_en: 'Sidon', country: 'Lebanon', region: 'Middle East', lat: 33.56, lng: 35.37 },
  { id: '4', name_en: 'Tripoli', country: 'Lebanon', region: 'Middle East', lat: 34.43, lng: 35.85 },
  { id: '5', name_en: 'United Arab Emirates', country: 'UAE', region: 'Middle East', lat: 24.47, lng: 54.37 },
  { id: '6', name_en: 'Oman', country: 'Oman', region: 'Middle East', lat: 23.58, lng: 58.41 },
  { id: '7', name_en: 'Iraq', country: 'Iraq', region: 'Middle East', lat: 33.34, lng: 44.40 },
  { id: '8', name_en: 'Syria', country: 'Syria', region: 'Middle East', lat: 33.51, lng: 36.29 },
  { id: '9', name_en: 'Angola', country: 'Angola', region: 'Africa', lat: -8.84, lng: 13.23 },
  { id: '10', name_en: 'Kinshasa', country: 'DR Congo', region: 'Africa', lat: -4.32, lng: 15.32 },
  { id: '11', name_en: 'Ivory Coast', country: 'Ivory Coast', region: 'Africa', lat: 5.35, lng: -4.00 },
]

// ── Interactive World Map ─────────────────────────────────────
function AgentsMap() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const [activeAgent, setActiveAgent] = useState(LOCATIONS[0])
  const [filterRegion, setFilterRegion] = useState('All')

  const agents = LOCATIONS

  const agentRegions = [...new Set(agents.map(a => a.region).filter(Boolean))]
  const filtered = filterRegion === 'All' ? agents : agents.filter(a => a.region === filterRegion)

  useEffect(() => {
    if (!mapRef.current) return

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

    markersRef.current = agents
      .map(a =>
        L.marker([a.lat, a.lng], { icon: makeIcon(false) })
          .addTo(map)
          .bindPopup(makePopup({ ...a, type: a.region, team: '' }), { closeButton: false })
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

      {/* Location cards below map */}
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
              style={{ color: '#4D9EFF' }}
            >
              {a.region}
            </p>
            <p className="font-medium text-sm text-white">{a.name_en}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{a.country}</p>
          </button>
        ))}
      </div>

      {/* Active location detail panel */}
      {activeAgent && (
        <div
          className="mt-6 rounded-2xl p-6 transition-all duration-300"
          style={{ background: 'rgba(26,111,219,0.07)', border: '1px solid rgba(26,111,219,0.2)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(26,111,219,0.25)', color: '#4D9EFF' }}
            >
              {activeAgent.region}
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-white mb-1">{activeAgent.name_en}</h3>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{activeAgent.country}</p>
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function AboutPage() {
  const heroRef = useRef(null)
  const { lang, isRTL } = useLanguage()
  const t = (en, ar) => (lang === 'ar' && ar) ? ar : en

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

    // Philosophy items
    gsap.fromTo('.phil-item',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '#about-philosophy', start: 'top 80%' }
      }
    )

    // Core business cards
    gsap.fromTo('.core-card',
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.85, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '#about-core', start: 'top 80%' }
      }
    )

    return () => ctx.revert()
  }, [])

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }} dir={isRTL ? 'rtl' : 'ltr'}>

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
          <div className="section-label light mb-5">{t('About TRACECOOL', 'عن تريس كول')}</div>
          <h1 className="text-5xl lg:text-7xl font-medium text-white mb-6 leading-tight max-w-4xl">
            {t('Precision Climate Control', 'التحكم الدقيق في المناخ')}<br />
            <span className="text-gradient italic font-light">{t('Since 1999.', 'منذ عام 1999.')}</span>
          </h1>
          <p className="text-white/50 max-w-2xl text-sm leading-relaxed mb-12">
            {t(
              'TRACECOOL is a privately owned, independent HVAC consulting and engineering company headquartered in Worms, Germany. For over two decades, we have delivered intelligent climate engineering solutions to clients across Europe, the Middle East, and Asia.',
              'تريس كول شركة استشارات وهندسة متخصصة في أنظمة التكييف، مملوكة بالكامل ومستقلة، مقرها في فورمس بألمانيا. على مدى أكثر من عقدين قدمنا حلولاً ذكية لهندسة المناخ لعملاء في أوروبا والشرق الأوسط وآسيا.'
            )}
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            <StatPill value="25+" label={t('Years of Excellence', 'سنوات من التميز')} />
            <StatPill value="1,000+" label={t('Projects Delivered', 'مشروع منجز')} />
            <StatPill value="60+" label={t('Countries Served', 'دولة نخدمها')} />
            <StatPill value="8" label={t('Global Offices', 'مكاتب عالمية')} />
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
              <div className="section-label mb-5">{t('Our Story', 'قصتنا')}</div>
              <div className="blue-line"></div>
              <h2 className="text-4xl font-medium mb-6 leading-tight" style={{ color: '#071525' }}>
                {t('Built on Engineering', 'مبنية على الهندسة')}<br />{t('Excellence', 'والتميز')}
              </h2>
              <p className="text-sm leading-loose mb-5" style={{ color: '#5A7896' }}>
                {t(
                  'Founded in 1999 by a team of German mechanical engineers, TRACECOOL began as a specialist consultancy for commercial HVAC systems in the Rhine-Neckar region. Our reputation for technical precision and energy-efficient design quickly attracted projects across Germany and neighbouring markets.',
                  'تأسست تريس كول عام 1999 على يد فريق من المهندسين الميكانيكيين الألمان، وبدأت كمستشارية متخصصة في أنظمة التكييف التجارية في منطقة راين-نيكار. اكتسبنا سمعة في الدقة التقنية والتصميم الموفر للطاقة مما جذب مشاريع عبر ألمانيا والأسواق المجاورة بسرعة.'
                )}
              </p>
              <p className="text-sm leading-loose mb-8" style={{ color: '#5A7896' }}>
                {t(
                  'Today, with 8 offices spanning 4 continents, we combine the precision of German engineering with deep local market knowledge — delivering everything from single-building system designs to multi-site district energy infrastructure.',
                  'اليوم، مع 8 مكاتب تمتد عبر 4 قارات، نجمع بين دقة الهندسة الألمانية والمعرفة العميقة بالأسواق المحلية — نقدم كل شيء من تصاميم أنظمة المباني الفردية إلى البنية التحتية للطاقة متعددة المواقع.'
                )}
              </p>
              <div className="flex gap-6">
                {[
                  { value: 'ISO 9001', label: t('Certified', 'معتمد') },
                  { value: 'ASHRAE', label: t('Member', 'عضو') },
                  { value: 'VDMA', label: t('Certified', 'معتمد') },
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
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{t('Average energy saving', 'متوسط توفير الطاقة')}<br />{t('across all installations', 'في جميع التركيبات')}</p>
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
            <div className="section-label justify-center mb-4">{t('Our Principles', 'مبادئنا')}</div>
            <h2 className="text-4xl font-medium" style={{ color: '#071525' }}>{t('What Drives Us', 'ما يحركنا')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ title, title_ar, desc, desc_ar }, i) => (
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
                <h4 className="font-semibold mb-2 text-sm" style={{ color: '#071525' }}>{t(title, title_ar)}</h4>
                <p className="text-xs leading-relaxed" style={{ color: '#5A7896' }}>{t(desc, desc_ar)}</p>
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
              <div className="section-label light mb-4">{t('Global Network', 'الشبكة العالمية')}</div>
              <h2 className="text-4xl lg:text-5xl font-medium text-white leading-tight">
                {t('Close to our clients,', 'قريبون من عملائنا،')}<br />
                <span className="text-gradient italic font-light">{t('wherever they operate.', 'أينما كانوا.')}</span>
              </h2>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">8</p>
                <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{t('Offices', 'مكاتب')}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">4</p>
                <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{t('Continents', 'قارات')}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">130+</p>
                <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{t('Engineers', 'مهندس')}</p>
              </div>
            </div>
          </div>

          <AgentsMap />
        </div>
      </section>

      {/* ── Philosophy ────────────────────────────────────────── */}
      <section id="about-philosophy" className="py-24" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-label justify-center mb-4">{t('Philosophy', 'الفلسفة')}</div>
            <div className="blue-line mx-auto"></div>
            <h2 className="text-4xl font-medium mt-4" style={{ color: '#071525' }}>{t('What We Stand For', 'ما نؤمن به')}</h2>
          </div>

          {/* Values / Mission / Vision */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {philosophy.map(({ key, label, label_ar, text, text_ar, icon }) => (
              <div
                key={key}
                className="phil-item flex flex-col items-start p-8 rounded-2xl transition-all duration-350 hover:-translate-y-1"
                style={{ background: '#F2F6FC', border: '1px solid #E4EBF5' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(26,111,219,0.3)'
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(26,111,219,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E4EBF5'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(26,111,219,0.1)' }}
                >
                  <svg className="w-6 h-6" style={{ color: '#1A6FDB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                  </svg>
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest mb-3"
                  style={{ color: '#1A6FDB' }}
                >
                  {t(label, label_ar)}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: '#5A7896' }}>{t(text, text_ar)}</p>
              </div>
            ))}
          </div>

          {/* Core Business */}
          <div id="about-core">
            <div className="flex items-center gap-4 mb-10">
              <div style={{ flex: 1, height: '1px', background: '#E4EBF5' }}></div>
              <span className="section-label">{t('Core Business', 'الأعمال الرئيسية')}</span>
              <div style={{ flex: 1, height: '1px', background: '#E4EBF5' }}></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coreBusiness.map(({ title, title_ar, desc, desc_ar, icon }, i) => (
                <div
                  key={title}
                  className="core-card rounded-2xl overflow-hidden transition-all duration-350 hover:-translate-y-2"
                  style={{
                    background: 'linear-gradient(180deg, #040D1A 0%, #071525 100%)',
                    border: '1px solid rgba(26,111,219,0.2)',
                    boxShadow: '0 4px 24px rgba(4,13,26,0.12)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(26,111,219,0.5)'
                    e.currentTarget.style.boxShadow = '0 20px 56px rgba(26,111,219,0.15)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(26,111,219,0.2)'
                    e.currentTarget.style.boxShadow = '0 4px 24px rgba(4,13,26,0.12)'
                  }}
                >
                  <div className="p-8">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                      style={{ background: 'rgba(26,111,219,0.2)' }}
                    >
                      <svg className="w-6 h-6" style={{ color: '#4D9EFF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {icon}
                      </svg>
                    </div>
                    <div
                      className="text-[10px] font-bold uppercase tracking-widest mb-3"
                      style={{ color: '#4D9EFF' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-3">{t(title, title_ar)}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{t(desc, desc_ar)}</p>
                  </div>
                  <div style={{ height: '3px', background: 'linear-gradient(90deg, #1A6FDB, transparent)' }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section
        className="py-24 text-center"
        style={{ background: 'linear-gradient(180deg, #F2F6FC 0%, #fff 100%)', borderTop: '1px solid #E4EBF5' }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <div className="section-label justify-center mb-5">{t('Work With Us', 'اعمل معنا')}</div>
          <h2 className="text-4xl font-medium mb-5" style={{ color: '#071525' }}>
            {t('Ready to start a project?', 'هل أنت مستعد لبدء مشروع؟')}
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#5A7896' }}>
            {t(
              'Whether you need a full HVAC design, energy consultancy, or emergency maintenance — our global team is ready.',
              'سواء كنت تحتاج إلى تصميم HVAC كامل أو استشارات طاقة أو صيانة طارئة — فريقنا العالمي مستعد.'
            )}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="cta-pill-dark text-primary text-sm font-medium">
              <span>{t('Get in Touch', 'تواصل معنا')}</span>
              <span className="icon">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
            <Link to="/services" className="cta-pill text-white text-sm font-medium">
              <span>{t('Explore Services', 'استكشف الخدمات')}</span>
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
