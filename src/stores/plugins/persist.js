// Generic Pinia plugin: persists every store's state to localStorage
// and restores it automatically on app load. No changes needed in
// individual stores — this hooks into all of them at once.

export function persistPlugin({ store }) {
  const storageKey = `portfolio:${store.$id}`

  // Restore saved state (if any) when the store is created
  const saved = localStorage.getItem(storageKey)
  if (saved) {
    try {
      store.$patch(JSON.parse(saved))
    } catch (e) {
      console.warn(`Impossible de restaurer ${storageKey}`, e)
    }
  }

  // Save to localStorage on every state change
  store.$subscribe((_mutation, state) => {
    localStorage.setItem(storageKey, JSON.stringify(state))
  })
}