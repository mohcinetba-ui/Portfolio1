import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCompetencesStore = defineStore('competences', () => {
  const competences = ref([
    // { id: 1, nom: 'Vue.js', categorie: 'Frontend', niveau: 80 }
  ])

  function addCompetence(competence) {
    const id = competences.value.length
      ? Math.max(...competences.value.map(c => c.id)) + 1
      : 1
    competences.value.push({ id, profil_id: 1, ...competence })
  }

  function updateCompetence(id, newData) {
    const index = competences.value.findIndex(c => c.id === id)
    if (index !== -1) {
      competences.value[index] = { ...competences.value[index], ...newData }
    }
  }

  function removeCompetence(id) {
    competences.value = competences.value.filter(c => c.id !== id)
  }

  return { competences, addCompetence, updateCompetence, removeCompetence }
})