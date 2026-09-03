import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useFormationsStore = defineStore('formations', () => {
  const formations = ref([
    // { id: 1, diplome: '', etablissement: '', date_debut: '', date_fin: '', description: '' }
  ])

  function addFormation(formation) {
    const id = formations.value.length
      ? Math.max(...formations.value.map(f => f.id)) + 1
      : 1
    formations.value.push({ id, profil_id: 1, ...formation })
  }

  function updateFormation(id, newData) {
    const index = formations.value.findIndex(f => f.id === id)
    if (index !== -1) {
      formations.value[index] = { ...formations.value[index], ...newData }
    }
  }

  function removeFormation(id) {
    formations.value = formations.value.filter(f => f.id !== id)
  }

  return { formations, addFormation, updateFormation, removeFormation }
})