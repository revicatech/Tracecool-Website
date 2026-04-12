import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import About from './components/About'
import Solutions from './components/Solutions'
import Services from './components/Services'
import Products from './components/Products'
import HowWeWork from './components/HowWeWork'
import Branches from './components/Branches'
import Contact from './components/Contact'
import Footer from './components/Footer'

import SolutionsPage from './pages/SolutionsPage'
import SolutionDetailPage from './pages/SolutionDetailPage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

import AdminApp from './admin/AdminApp'

gsap.registerPlugin(ScrollTrigger)

function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Solutions />
      <Services />
      <Products />
      <HowWeWork />
      <Branches />
      <Contact />
    </>
  )
}

const PAGE_META = {
  '/': {
    title: 'TRACECOOL — Climate Engineering Excellence',
    desc: 'TRACECOOL delivers premium HVAC engineering solutions — VRF systems, chillers, and custom climate control for commercial and industrial projects across the Middle East and Africa.',
  },
  '/about': {
    title: 'About Us | TRACECOOL HVAC Engineers',
    desc: "Learn about TRACECOOL's 20+ year legacy of HVAC engineering excellence, global offices, and our commitment to sustainable climate solutions.",
  },
  '/solutions': {
    title: 'HVAC Solutions | TRACECOOL',
    desc: "Explore TRACECOOL's full range of HVAC solutions: VRF systems, chillers, precision cooling, industrial HVAC, energy recovery, and ventilation.",
  },
  '/services': {
    title: 'Engineering Services | TRACECOOL',
    desc: 'From design consultation to installation and maintenance, TRACECOOL engineering services cover every phase of your HVAC project.',
  },
  '/products': {
    title: 'HVAC Products | TRACECOOL',
    desc: 'Browse TRACECOOL catalog of HVAC products: mini-split air conditioners, heat pumps, rooftop units, chillers, accessories, and more.',
  },
  '/contact': {
    title: 'Contact Us | TRACECOOL',
    desc: 'Get in touch with TRACECOOL for a free consultation or quote. Our team of HVAC engineers is ready to assist with your climate engineering needs.',
  },
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (pathname !== '/') window.scrollTo(0, 0)

    // Update page title and meta description per route
    const meta = PAGE_META[pathname] || PAGE_META['/']
    document.title = meta.title
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', meta.desc)

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active') }),
      { threshold: 0.08 }
    )
    const id = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('active')
        observer.observe(el)
      })
    }, 50)

    return () => {
      clearTimeout(id)
      observer.disconnect()
    }
  }, [pathname])
  return null
}

function AppContent() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    )
  }

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/solutions/:id" element={<SolutionDetailPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
