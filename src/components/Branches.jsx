import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { useLanguage } from '../context/LanguageContext'

function makeIcon(isHQ) {
  return L.divIcon({
    className: 'tc-marker-wrap',
    html: `<div class="tc-ring"></div><div class="tc-dot${isHQ ? ' hq' : ''}"></div>`,
    iconSize: [20, 20], iconAnchor: [10, 10], popupAnchor: [0, -14],
  })
}

function makePopupHTML(b) {
  return `<div style="min-width:90px;padding:2px 0">
    <p style="font-size:7px;font-weight:700;color:#4D9EFF;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px">${b.type}</p>
    <p style="font-size:11px;font-weight:500;color:#fff;margin-bottom:2px">${b.name}</p>
    <p style="font-size:9px;color:rgba(255,255,255,0.45)">${b.country}</p>
  </div>`
}

export default function Branches() {
  const { t, lang } = useLanguage()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    // Clean up previous map instance on language change
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
      markersRef.current = []
    }

    const branches = t('branches').items
    const map = L.map(mapRef.current, {
      center: [30, 20], zoom: 2, scrollWheelZoom: false, zoomControl: false,
    })
    mapInstanceRef.current = map

    L.control.zoom({ position: 'topright' }).addTo(map)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO',
    }).addTo(map)

    markersRef.current = branches.map((b, i) =>
      L.marker([b.lat, b.lng], { icon: makeIcon(i === 0) })
        .addTo(map)
        .bindPopup(makePopupHTML(b), { closeButton: false })
    )

    setTimeout(() => markersRef.current[0]?.openPopup(), 800)

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [lang]) // reinit map when language changes so popup text updates

  const handleBranchClick = (idx) => {
    setActiveIdx(idx)
    const branches = t('branches').items
    const map = mapInstanceRef.current
    if (!map) return
    map.flyTo([branches[idx].lat, branches[idx].lng], 5, { duration: 1.4 })
    markersRef.current[idx]?.openPopup()
  }

  const br = t('branches')

  return (
    <section id="branches" className="py-28 bg-primary text-white overflow-hidden relative" style={{ zIndex: 1 }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <div className="section-label light mb-5">{br.badge}</div>
            <h2 className="text-4xl md:text-5xl font-medium leading-tight reveal">
              {br.titleLine1}<br />{br.titleLine2}
            </h2>
          </div>
          <div className="flex gap-8 sm:gap-12 sm:border-l border-white/10 rtl:sm:border-l-0 rtl:sm:border-r sm:pl-12 rtl:sm:pl-0 rtl:sm:pr-12 reveal">
            <div>
              <p className="text-3xl font-medium mb-1">05</p>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">{br.keyOffices}</p>
            </div>
            <div>
              <p className="text-3xl font-medium mb-1">24/7</p>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">{br.globalSupport}</p>
            </div>
          </div>
        </div>

        <div
          ref={mapRef}
          id="branches-map"
          className="w-full rounded-xl overflow-hidden reveal"
          style={{ height: 460 }}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-6" id="branch-cards">
          {br.items.map((b, i) => (
            <div
              key={b.name}
              className={`branch-card${activeIdx === i ? ' active' : ''}`}
              onClick={() => handleBranchClick(i)}
            >
              <p className="text-accent-light text-[10px] font-bold uppercase tracking-widest mb-1">{b.label}</p>
              <p className="font-medium text-sm">{b.name}</p>
              <p className="text-white/40 text-xs mt-0.5">{b.country}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
