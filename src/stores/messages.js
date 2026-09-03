import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMessagesStore = defineStore('messages', () => {
  const messages = ref([
    // { id: 1, nom_expediteur: '', email: '', sujet: '', contenu: '', date_envoi: '' }
  ])

  function addMessage(message) {
    const id = messages.value.length
      ? Math.max(...messages.value.map(m => m.id)) + 1
      : 1
    messages.value.push({
      id,
      profil_id: 1,
      date_envoi: new Date().toISOString(),
      ...message,
    })
  }

  function removeMessage(id) {
    messages.value = messages.value.filter(m => m.id !== id)
  }

  return { messages, addMessage, removeMessage }
})