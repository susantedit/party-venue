/**
 * Analytics utility for Google Tag Manager / dataLayer event tracking.
 * All functions are SSR-safe and silently swallow errors so analytics
 * never breaks the UI.
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function pushEvent(event: string, source?: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, source });
  } catch {
    // Silently swallow — analytics must never break the UI
  }
}

export function trackPhoneClick(source?: string): void {
  pushEvent('phone_click', source);
}

export function trackWhatsAppClick(source?: string): void {
  pushEvent('whatsapp_click', source);
}

export function trackDirectionsClick(source?: string): void {
  pushEvent('directions_click', source);
}

export function trackBookingFormSubmit(source?: string): void {
  pushEvent('booking_form_submit', source);
}

export function trackContactFormSubmit(source?: string): void {
  pushEvent('contact_form_submit', source);
}

export function trackMenuView(source?: string): void {
  pushEvent('menu_view', source);
}

export function trackPackageView(source?: string): void {
  pushEvent('package_view', source);
}

export function trackGalleryEngagement(source?: string): void {
  pushEvent('gallery_engagement', source);
}
