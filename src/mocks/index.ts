export async function cleanupLegacyMockWorker() {
  if (!import.meta.env.DEV || !('serviceWorker' in navigator)) return

  try {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(
      registrations
        .filter(registration =>
          [registration.active, registration.waiting, registration.installing].some(worker =>
            worker?.scriptURL.endsWith('/mockServiceWorker.js')
          )
        )
        .map(registration => registration.unregister())
    )
  } catch (error) {
    console.warn('[vite:mock] Failed to unregister the legacy mock service worker.', error)
  }
}
