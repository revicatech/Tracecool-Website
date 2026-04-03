import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { products, productCategories } from '../data/pageData'

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
    <label
      className="flex items-center gap-2.5 cursor-pointer group select-none"
    >
      <div
        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200"
        style={{
          background: checked ? '#1A6FDB' : 'transparent',
          border: checked ? '2px solid #1A6FDB' : '2px solid #C9D8EF',
        }}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
      <span
        className="text-sm transition-colors duration-200"
        style={{ color: checked ? '#071525' : '#5A7896' }}
      >
        {label}
      </span>
    </label>
  )
}

function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
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
      <div className="overflow-hidden relative" style={{ height: '220px' }}>
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(4,13,26,0.55) 0%, transparent 55%)' }}
        ></div>
        <span
          className="absolute bottom-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(26,111,219,0.85)', color: 'white' }}
        >
          {product.subcategory}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#5A7896' }}>
          {product.category}
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#071525' }}>{product.title}</h3>
        <p className="text-xs leading-relaxed mb-5" style={{ color: '#5A7896' }}>{product.shortDesc}</p>

        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: '1px solid #E4EBF5' }}
        >
          <span className="text-xs font-medium" style={{ color: '#1A6FDB' }}>
            {product.keyFeatures[0].label}: {product.keyFeatures[0].value}
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors group-hover:text-[#4D9EFF]"
            style={{ color: '#1A6FDB' }}
          >
            View Details
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
  const [selectedCategories, setSelectedCategories] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    gsap.fromTo('.prod-hero-content > *',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.1 }
    )
  }, [])

  useEffect(() => {
    gsap.fromTo('.prod-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
    )
  }, [selectedCategories, search])

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const filtered = products.filter(p => {
    const matchesCat = selectedCategories.length === 0 || selectedCategories.includes(p.category)
    const matchesSearch = search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Hero */}
      <section
        className="relative pt-36 pb-24 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #040D1A 0%, #071525 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(26,111,219,0.4) 0%, transparent 65%)' }}
        ></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 prod-hero-content">
          <div className="section-label light mb-5">Product Portfolio</div>
          <h1 className="text-5xl lg:text-7xl font-medium text-white mb-6 leading-tight">
            Product
            <br />
            <span className="text-gradient italic font-light">Portfolio.</span>
          </h1>
          <p className="text-white/50 max-w-xl text-sm leading-relaxed">
            Industry-leading HVAC equipment — precision-selected, expertly integrated.
            Browse our full range of {products.length} products across {productCategories.length} categories.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Sidebar Filter */}
            <aside className="lg:w-64 flex-shrink-0">
              <div
                className="rounded-2xl p-6 sticky top-28"
                style={{ background: '#F2F6FC', border: '1px solid #E4EBF5' }}
              >
                <h3 className="text-sm font-semibold mb-5 uppercase tracking-widest" style={{ color: '#5A7896' }}>
                  Filter Products
                </h3>

                {/* Search */}
                <div className="relative mb-6">
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
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search products…"
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

                {/* Category checkboxes */}
                <div className="mb-5">
                  <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#5A7896' }}>
                    Category
                  </p>
                  <div className="space-y-3">
                    {productCategories.map(cat => (
                      <FilterCheckbox
                        key={cat}
                        label={cat}
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                      />
                    ))}
                  </div>
                </div>

                {selectedCategories.length > 0 && (
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="text-xs font-medium transition-colors"
                    style={{ color: '#1A6FDB' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#4D9EFF'}
                    onMouseLeave={e => e.currentTarget.style.color = '#1A6FDB'}
                  >
                    Clear filters
                  </button>
                )}

                {/* Count */}
                <div
                  className="mt-6 pt-5 text-xs"
                  style={{ borderTop: '1px solid #E4EBF5', color: '#5A7896' }}
                >
                  Showing <span className="font-bold" style={{ color: '#071525' }}>{filtered.length}</span> of {products.length} products
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Active filter pills */}
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCategories.map(cat => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer"
                      style={{ background: 'rgba(26,111,219,0.1)', color: '#1A6FDB', border: '1px solid rgba(26,111,219,0.2)' }}
                      onClick={() => toggleCategory(cat)}
                    >
                      {cat}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                  ))}
                </div>
              )}

              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-lg font-medium mb-2" style={{ color: '#071525' }}>No products found</p>
                  <p className="text-sm" style={{ color: '#5A7896' }}>Try adjusting your filters or search term.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
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
          <div className="section-label justify-center mb-5">Custom Requirements</div>
          <h2 className="text-3xl font-medium mb-4" style={{ color: '#071525' }}>
            Need a bespoke product selection?
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#5A7896' }}>
            Our engineers can select, specify, and source any HVAC equipment to match your exact project requirements.
          </p>
          <Link to="/#contact" className="cta-pill text-white text-sm font-medium">
            <span>Talk to an Engineer</span>
            <span className="icon"><ArrowIcon /></span>
          </Link>
        </div>
      </section>
    </div>
  )
}
