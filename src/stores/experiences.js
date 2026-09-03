import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useExperiencesStore = defineStore('experiences', () => {
  const experiences = ref([
    // { id: 1, poste: '', entreprise: '', date_debut: '', date_fin: '', description: '' }
  ])

  function addExperience(experience) {
    const id = experiences.value.length
      ? Math.max(...experiences.value.map(e => e.id)) + 1
      : 1
    experiences.value.push({ id, profil_id: 1, ...experience })
  }

  function updateExperience(id, newData) {
    const index = experiences.value.findIndex(e => e.id === id)
    if (index !== -1) {
      experiences.value[index] = { ...experiences.value[index], ...newData }
    }
  }

  function removeExperience(id) {
    experiences.value = experiences.value.filter(e => e.id !== id)
  }

  return { experiences, addExperience, updateExperience, removeExperience }
})