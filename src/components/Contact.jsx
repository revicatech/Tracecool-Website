import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { useLanguage } from '../context/LanguageContext'

const EMAILJS_SERVICE_ID = 'service_3j4w1wl'
const EMAILJS_TEMPLATE_ID = 'template_d8le1xe'
const EMAILJS_PUBLIC_KEY = 'hkCSUwOFuHcjLufQy'

function ContactItem({ icon, children }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon === 'location' && (
            <>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </>
          )}
          {icon === 'email' && (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          )}
          {icon === 'phone' && (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          )}
        </svg>
      </div>
      <span>{children}</span>
    </div>
  )
}

export default function Contact() {
  const { t } = useLanguage()
  const contact = t('contact')
  const form = contact.form

  const [formData, setFormData] = useState({ fullName: '', email: '', company: '', phone: '', service: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError('')
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.fullName,
          from_email: formData.email,
          company: formData.company,
          phone: formData.phone,
          service: formData.service,
          message: formData.message,
          to_email: 'info@tracecool.com',
        },
        EMAILJS_PUBLIC_KEY
      )
      setSubmitted(true)
    } catch {
      setFormError('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-surface border-t border-gray-200 relative" style={{ zIndex: 1 }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          <div className="reveal">
            <div className="section-label mb-5">{contact.badge}</div>
            <div className="blue-line"></div>
            <h2 className="text-4xl md:text-5xl font-medium mb-6 leading-tight">
              {contact.titleLine1}<br />{contact.titleLine2}
            </h2>
            <p className="text-secondary leading-relaxed text-sm max-w-md mb-10">{contact.desc}</p>
            <div className="space-y-4 text-sm text-secondary">
              <ContactItem icon="location">{contact.address}</ContactItem>
              <ContactItem icon="email">{contact.email}</ContactItem>
              <ContactItem icon="phone">{contact.phone}</ContactItem>
            </div>
          </div>

          <div className="reveal" style={{ transitionDelay: '200ms' }}>
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-16">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Message Sent!</h3>
                <p className="text-secondary text-sm max-w-xs mb-6">Thank you for reaching out. We'll respond within one business day.</p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ fullName: '', email: '', company: '', phone: '', service: '', message: '' }) }}
                  className="text-xs font-medium text-accent hover:text-primary transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="space-y-7" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <input type="text" required placeholder={form.fullName} value={formData.fullName} onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))} className="form-input text-sm" />
                  <input type="email" required placeholder={form.email} value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="form-input text-sm" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <input type="text" placeholder={form.company} value={formData.company} onChange={e => setFormData(p => ({ ...p, company: e.target.value }))} className="form-input text-sm" />
                  <input type="tel" placeholder={form.phone} value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="form-input text-sm" />
                </div>
                <div>
                  <select className="form-input text-sm" style={{ cursor: 'pointer' }} value={formData.service} onChange={e => setFormData(p => ({ ...p, service: e.target.value }))}>
                    <option value="" disabled>{form.serviceInterest}</option>
                    {form.options.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <textarea required placeholder={form.message} rows={3} value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} className="form-input text-sm resize-none" />
                </div>
                {formError && <p className="text-sm text-red-500">{formError}</p>}
                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={submitting} className="cta-pill-dark text-primary text-sm font-medium flex-shrink-0" style={{ opacity: submitting ? 0.6 : 1 }}>
                    <span>{submitting ? 'Sending…' : form.submit}</span>
                    <span className="icon">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
