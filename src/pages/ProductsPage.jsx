import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

function ArrowIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  )
}

function FilterCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group select-none">
      <div
        className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200"
        style={{
          background: checked ? '#1A6FDB' : 'transparent',
          border: checked ? '2px solid #1A6FDB' : '2px solid #C9D8EF',
        }}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
      <span
        className="text-xs transition-colors duration-200"
        style={{ color: checked ? '#071525' : '#5A7896' }}
      >
        {label}
      </span>
    </label>
  )
}

function CategoryAccordion({ cat, subcategories, selectedSubcategories, onToggleSub, t }) {
  const [open, setOpen] = useState(true)
  const catSubs = subcategories.filter(s => s.category?._id === cat._id)
  const activeCount = catSubs.filter(s => selectedSubcategories.includes(s._id)).length
  const hasActive = activeCount > 0

  if (catSubs.length === 0) return null

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        border: hasActive ? '1px solid rgba(26,111,219,0.3)' : '1px solid #E4EBF5',
        background: hasActive ? 'rgba(26,111,219,0.03)' : 'white',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span
            className="text-xs font-semibold leading-tight truncate"
            style={{ color: hasActive ? '#1A6FDB' : '#071525' }}
          >
            {t(cat.name_en, cat.name_ar)}
          </span>
          {hasActive && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
              style={{ background: '#1A6FDB', color: 'white' }}
            >
              {activeCount}
            </span>
          )}
        </div>
        <svg
          className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ml-2"
          style={{
            color: hasActive ? '#1A6FDB' : '#5A7896',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-3 space-y-2.5" style={{ borderTop: '1px solid #E4EBF5' }}>
          <div className="pt-3">
            {catSubs.map(sub => (
              <div key={sub._id} className="mb-2.5">
                <FilterCheckbox
                  label={t(sub.name_en, sub.name_ar)}
                  checked={selectedSubcategories.includes(sub._id)}
                  onChange={() => onToggleSub(sub._id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ProductCard({ product, t }) {
  return (
    <Link
      to={`/products/${product._id}`}
      className="group block rounded-2xl overflow-hidden transition-all duration-400 prod-card"
      style={{
        background: 'white',
        border: '1px solid #E4EBF5',
        boxShadow: '0 2px 16px rgba(7,21,37,0.04)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(26,111,219,0.3)'
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(26,111,219,0.1)'
        e.currentTarget.style.transform = 'translateY(-4px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#E4EBF5'
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(7,21,37,0.04)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Image */}
      <div className="overflow-hidden relative" style={{ height: '220px', background: '#0D1F35' }}>
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={t(product.title_en, product.title_ar)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 opacity-20" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(4,13,26,0.55) 0%, transparent 55%)' }}
        />
        {product.subcategory?.name_en && (
          <span
            className="absolute bottom-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(26,111,219,0.85)', color: 'white' }}
          >
            {t(product.subcategory.name_en, product.subcategory.name_ar)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {product.category?.name_en && (
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#5A7896' }}>
            {t(product.category.name_en, product.category.name_ar)}
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#071525' }}>
          {t(product.title_en, product.title_ar)}
        </h3>
        <p className="text-xs leading-relaxed mb-5" style={{ color: '#5A7896' }}>
          {t(product.shortDesc_en, product.shortDesc_ar) || t(product.description_en, product.description_ar)}
        </p>

        <div
          className="flex items-center justify-end pt-4"
          style={{ borderTop: '1px solid #E4EBF5' }}
        >
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors group-hover:text-[#4D9EFF]"
            style={{ color: '#1A6FDB' }}
          >
            {t('View Details', 'عرض التفاصيل')}
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function ProductsPage() {
  const { lang, isRTL } = useLanguage()
  const t = (en, ar) => (lang === 'ar' && ar) ? ar : en
  const [searchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSubcategories, setSelectedSubcategories] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const PAGE_SIZE = 12

  useEffect(() => {
    window.scrollTo(0, 0)
    gsap.fromTo('.prod-hero-content > *',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.1 }
    )

    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/subcategories').then(r => r.json()),
    ]).then(([prods, cats, subs]) => {
      setProducts(prods)
      setCategories(cats)
      setSubcategories(subs)

      // Pre-select subcategories if ?cat=<categoryId> is in the URL
      const catParam = searchParams.get('cat')
      if (catParam) {
        const subIds = subs
          .filter(s => s.category?._id === catParam)
          .map(s => s._id)
        if (subIds.length > 0) setSelectedSubcategories(subIds)
      }
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!loading) {
      gsap.fromTo('.prod-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
      )
    }
  }, [selectedSubcategories, search, loading])

  const toggleSub = (subId) => {
    setSelectedSubcategories(prev =>
      prev.includes(subId) ? prev.filter(s => s !== subId) : [...prev, subId]
    )
    setPage(1)
  }

  const filtered = products.filter(p => {
    const matchesSub = selectedSubcategories.length === 0 || selectedSubcategories.includes(p.subcategory?._id)
    const titleEn = p.title_en?.toLowerCase() || ''
    const titleAr = p.title_ar?.toLowerCase() || ''
    const catEn = p.category?.name_en?.toLowerCase() || ''
    const subEn = p.subcategory?.name_en?.toLowerCase() || ''
    const q = search.toLowerCase()
    const matchesSearch = search === '' || titleEn.includes(q) || titleAr.includes(q) || catEn.includes(q) || subEn.includes(q)
    return matchesSub && matchesSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }} dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Hero */}
      <section
        className="relative pt-36 pb-24 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #040D1A 0%, #071525 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(26,111,219,0.4) 0%, transparent 65%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 prod-hero-content">
          <div className="section-label light mb-5">{t('Product Portfolio', 'محفظة المنتجات')}</div>
          <h1 className="text-5xl lg:text-7xl font-medium text-white mb-6 leading-tight">
            {t('Product', 'المنتجات')}
            <br />
            <span className="text-gradient italic font-light">{t('Portfolio.', 'المحفظة.')}</span>
          </h1>
          <p className="text-white/50 max-w-xl text-sm leading-relaxed mb-10">
            {t(
              `Industry-leading HVAC equipment — precision-selected, expertly integrated. Browse our full range of ${products.length} products across ${categories.length} categories.`,
              `معدات HVAC رائدة في الصناعة — مختارة بدقة ومتكاملة باحترافية. تصفح مجموعتنا الكاملة من ${products.length} منتج عبر ${categories.length} فئات.`
            )}
          </p>

          {/* Category pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => {
                const catSubIds = subcategories.filter(s => s.category?._id === cat._id).map(s => s._id)
                const allSelected = catSubIds.length > 0 && catSubIds.every(id => selectedSubcategories.includes(id))
                return (
                  <button
                    key={cat._id}
                    onClick={() => {
                      if (allSelected) {
                        setSelectedSubcategories(prev => prev.filter(id => !catSubIds.includes(id)))
                      } else {
                        setSelectedSubcategories(prev => [...new Set([...prev, ...catSubIds])])
                      }
                      setPage(1)
                    }}
                    className="text-xs font-medium px-4 py-2 rounded-full transition-all duration-200"
                    style={{
                      background: allSelected ? 'rgba(26,111,219,0.3)' : 'rgba(255,255,255,0.07)',
                      border: allSelected ? '1px solid rgba(77,158,255,0.5)' : '1px solid rgba(255,255,255,0.12)',
                      color: allSelected ? 'white' : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {t(cat.name_en, cat.name_ar)}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Mobile filter toggle */}
          <div className="lg:hidden flex items-center justify-between mb-5">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{ background: '#F2F6FC', border: '1px solid #E4EBF5', color: '#071525' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M7 8h10M11 12h2M9 16h6" />
              </svg>
              {t('Filters', 'الفلاتر')}
              {selectedSubcategories.length > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#1A6FDB', color: 'white' }}>
                  {selectedSubcategories.length}
                </span>
              )}
            </button>
            <p className="text-xs" style={{ color: '#5A7896' }}>
              {filtered.length} {t('products', 'منتجات')}
            </p>
          </div>

          {/* Mobile filter drawer overlay */}
          {mobileFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div
                className={`relative ml-auto w-80 max-w-[90vw] h-full bg-white overflow-y-auto p-6 flex flex-col ${isRTL ? 'mr-auto ml-0' : ''}`}
                style={{ boxShadow: '-8px 0 32px rgba(7,21,37,0.15)' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#5A7896' }}>
                    {t('Filter Products', 'تصفية المنتجات')}
                  </h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                    style={{ background: '#F2F6FC' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedSubcategories.length > 0 && (
                  <button
                    onClick={() => { setSelectedSubcategories([]); setPage(1) }}
                    className="text-xs font-medium mb-4 self-end transition-colors"
                    style={{ color: '#1A6FDB' }}
                  >
                    {t('Clear all', 'مسح الكل')}
                  </button>
                )}

                {/* Search */}
                <div className="relative mb-5">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5A7896' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                    placeholder={t('Search products…', 'ابحث عن المنتجات…')}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
                    style={{ background: '#F2F6FC', border: '1px solid #E4EBF5', color: '#071525', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#1A6FDB'}
                    onBlur={e => e.target.style.borderColor = '#E4EBF5'}
                  />
                </div>

                <div className="space-y-2 flex-1">
                  {categories.map(cat => (
                    <CategoryAccordion
                      key={cat._id}
                      cat={cat}
                      subcategories={subcategories}
                      selectedSubcategories={selectedSubcategories}
                      onToggleSub={toggleSub}
                      t={t}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="mt-6 w-full py-3 rounded-xl text-sm font-semibold text-white transition-colors"
                  style={{ background: '#1A6FDB' }}
                >
                  {t('Show Results', 'عرض النتائج')} ({filtered.length})
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-10">

            {/* Sidebar Filter — desktop only */}
            <aside className="hidden lg:block lg:w-72 flex-shrink-0">
              <div className="sticky top-28">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#5A7896' }}>
                    {t('Filter Products', 'تصفية المنتجات')}
                  </h3>
                  {selectedSubcategories.length > 0 && (
                    <button
                      onClick={() => { setSelectedSubcategories([]); setPage(1) }}
                      className="text-xs font-medium transition-colors"
                      style={{ color: '#1A6FDB' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#4D9EFF'}
                      onMouseLeave={e => e.currentTarget.style.color = '#1A6FDB'}
                    >
                      {t('Clear all', 'مسح الكل')}
                    </button>
                  )}
                </div>

                {/* Search */}
                <div className="relative mb-5">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: '#5A7896' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                    placeholder={t('Search products…', 'ابحث عن المنتجات…')}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                    style={{
                      background: 'white',
                      border: '1px solid #E4EBF5',
                      color: '#071525',
                      outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = '#1A6FDB'}
                    onBlur={e => e.target.style.borderColor = '#E4EBF5'}
                  />
                </div>

                {/* Category accordions */}
                <div className="space-y-2">
                  {categories.map(cat => (
                    <CategoryAccordion
                      key={cat._id}
                      cat={cat}
                      subcategories={subcategories}
                      selectedSubcategories={selectedSubcategories}
                      onToggleSub={toggleSub}
                      t={t}
                    />
                  ))}
                </div>

                {/* Count */}
                <div
                  className="mt-5 pt-4 text-xs"
                  style={{ borderTop: '1px solid #E4EBF5', color: '#5A7896' }}
                >
                  {t('Showing', 'عرض')}{' '}
                  <span className="font-bold" style={{ color: '#071525' }}>
                    {Math.min((safePage - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(safePage * PAGE_SIZE, filtered.length)}
                  </span>
                  {' '}{t('of', 'من')}{' '}{filtered.length}{' '}{t('products', 'منتجات')}
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Active filter pills */}
              {selectedSubcategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedSubcategories.map(subId => {
                    const sub = subcategories.find(s => s._id === subId)
                    if (!sub) return null
                    return (
                      <span
                        key={subId}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer"
                        style={{ background: 'rgba(26,111,219,0.1)', color: '#1A6FDB', border: '1px solid rgba(26,111,219,0.2)' }}
                        onClick={() => toggleSub(subId)}
                      >
                        {t(sub.name_en, sub.name_ar)}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                    )
                  })}
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-32">
                  <div className="w-7 h-7 border-2 border-[#1A6FDB] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-lg font-medium mb-2" style={{ color: '#071525' }}>
                    {t('No products found', 'لا توجد منتجات')}
                  </p>
                  <p className="text-sm" style={{ color: '#5A7896' }}>
                    {t('Try adjusting your filters or search term.', 'حاول تعديل الفلاتر أو مصطلح البحث.')}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pageItems.map(product => (
                      <ProductCard key={product._id} product={product} t={t} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-10 pt-6" style={{ borderTop: '1px solid #E4EBF5' }}>
                      <p className="text-xs" style={{ color: '#5A7896' }}>
                        {t('Page', 'الصفحة')} {safePage} {t('of', 'من')} {totalPages}
                        {' · '}{filtered.length} {t('products', 'منتجات')}
                      </p>
                      <div className="flex gap-1.5">
                        <button
                          disabled={safePage === 1}
                          onClick={() => { setPage(safePage - 1); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ border: '1px solid #E4EBF5', color: '#5A7896', background: 'white' }}
                          onMouseEnter={e => { if (safePage !== 1) e.currentTarget.style.background = '#F2F6FC' }}
                          onMouseLeave={e => e.currentTarget.style.background = 'white'}
                        >
                          {isRTL ? '›' : '‹'} {t('Prev', 'السابق')}
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                          .reduce((acc, p, idx, arr) => {
                            if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('…')
                            acc.push(p)
                            return acc
                          }, [])
                          .map((p, idx) =>
                            p === '…' ? (
                              <span key={`e-${idx}`} className="px-2 py-1.5 text-xs" style={{ color: '#5A7896' }}>…</span>
                            ) : (
                              <button
                                key={p}
                                onClick={() => { setPage(p); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                                className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200"
                                style={{
                                  background: safePage === p ? '#1A6FDB' : 'white',
                                  color: safePage === p ? 'white' : '#5A7896',
                                  border: safePage === p ? '1px solid #1A6FDB' : '1px solid #E4EBF5',
                                }}
                                onMouseEnter={e => { if (safePage !== p) e.currentTarget.style.background = '#F2F6FC' }}
                                onMouseLeave={e => { if (safePage !== p) e.currentTarget.style.background = 'white' }}
                              >
                                {p}
                              </button>
                            )
                          )}

                        <button
                          disabled={safePage === totalPages}
                          onClick={() => { setPage(safePage + 1); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ border: '1px solid #E4EBF5', color: '#5A7896', background: 'white' }}
                          onMouseEnter={e => { if (safePage !== totalPages) e.currentTarget.style.background = '#F2F6FC' }}
                          onMouseLeave={e => e.currentTarget.style.background = 'white'}
                        >
                          {t('Next', 'التالي')} {isRTL ? '‹' : '›'}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 text-center"
        style={{ background: 'linear-gradient(180deg, #fff 0%, #F2F6FC 100%)' }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <div className="section-label justify-center mb-5">{t('Custom Requirements', 'متطلبات مخصصة')}</div>
          <h2 className="text-3xl font-medium mb-4" style={{ color: '#071525' }}>
            {t('Need a bespoke product selection?', 'تحتاج اختياراً مخصصاً للمنتجات؟')}
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#5A7896' }}>
            {t(
              'Our engineers can select, specify, and source any HVAC equipment to match your exact project requirements.',
              'يمكن لمهندسينا اختيار وتحديد وتوفير أي معدات HVAC لتناسب متطلبات مشروعك بدقة.'
            )}
          </p>
          <Link to="/#contact" className="cta-pill text-white text-sm font-medium">
            <span>{t('Talk to an Engineer', 'تحدث مع مهندس')}</span>
            <span className="icon"><ArrowIcon /></span>
          </Link>
        </div>
      </section>
    </div>
  )
}
