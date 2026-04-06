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
  const [filterType, setFilterType] = useState('All')

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
      markersRef.current = []
    }

    const branches = t('branches').items
    const map = L.map(mapRef.current, {
      center: [30, 20], zoom: 2, scrollWheelZoom: false, zoomControl: false, minZoom: 2,
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
        .on('click', () => setActiveIdx(i))
    )

    setTimeout(() => markersRef.current[0]?.openPopup(), 800)

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [lang])

  const handleBranchClick = (idx) => {
    setActiveIdx(idx)
    const branches = t('branches').items
    const map = mapInstanceRef.current
    if (!map) return
    map.flyTo([branches[idx].lat, branches[idx].lng], 5, { duration: 1.4 })
    markersRef.current[idx]?.openPopup()
  }

  const br = t('branches')
  const branches = br.items

  const types = [...new Set(branches.map(b => b.type))]
  const filtered = filterType === 'All' ? branches : branches.filter(b => b.type === filterType)

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

        {/* Type filter tabs */}
        {/* <div className="flex flex-wrap gap-2 mb-6">
          {['All', ...types].map(tp => (
            <button
              key={tp}
              onClick={() => setFilterType(tp)}
              className="text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200"
              style={{
                background: filterType === tp ? '#1A6FDB' : 'rgba(255,255,255,0.05)',
                color: filterType === tp ? 'white' : 'rgba(255,255,255,0.5)',
                border: filterType === tp ? '1px solid #1A6FDB' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {tp}
            </button>
          ))}
        </div> */}

        <div
          ref={mapRef}
          id="branches-map"
          className="w-full rounded-2xl overflow-hidden reveal"
          style={{ height: 460, border: '1px solid rgba(255,255,255,0.07)' }}
        />

        {/* Branch cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-5">
          {filtered.map((b, i) => {
            const globalIdx = branches.indexOf(b)
            const isActive = activeIdx === globalIdx
            return (
              <button
                key={b.name}
                onClick={() => handleBranchClick(globalIdx)}
                className="text-left rounded-xl p-4 transition-all duration-250"
                style={{
                  background: isActive ? 'rgba(26,111,219,0.15)' : 'rgba(255,255,255,0.03)',
                  border: isActive ? '1px solid rgba(26,111,219,0.45)' : '1px solid rgba(255,255,255,0.07)',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                  }
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#4D9EFF' }}>{b.label}</p>
                <p className="font-medium text-sm text-white">{b.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{b.country}</p>
              </button>
            )
          })}
        </div>

        {/* Active branch detail panel */}
        {branches[activeIdx] && (
          <div
            className="mt-6 rounded-2xl p-6 transition-all duration-300"
            style={{ background: 'rgba(26,111,219,0.07)', border: '1px solid rgba(26,111,219,0.2)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(26,111,219,0.25)', color: '#4D9EFF' }}
              >
                {branches[activeIdx].type}
              </span>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-1">{branches[activeIdx].name}</h3>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{branches[activeIdx].country}</p>
          </div>
        )}
      </div>
    </section>
  )
}
