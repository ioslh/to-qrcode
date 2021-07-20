export default function trackEvent<T extends Record<string, any>>(name: string, args?: T) {
  try {
    gtag('event', name, args)
  } catch(e) {}
}