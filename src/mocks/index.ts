export async function setupMockWorker() {
  if (!import.meta.env.DEV) {
    return
  }

  const { worker } = await import('./browser')

  await worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js'
    },
    onUnhandledRequest: 'bypass'
  })
}
