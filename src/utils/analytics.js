// Google Ads "Contact" conversion — fired after a contact form is sent successfully.
// The Google tag itself is loaded in index.html.
export function trackContactConversion() {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', { send_to: 'AW-18501203389/iW5RCMWAvZodEL3rh_ZE' })
  }
}
