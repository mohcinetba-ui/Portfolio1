import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([
    // { id: 1, titre: '', description: '', lien_demo: '', lien_repo: '', image_url: '', competence_ids: [1, 2] }
  ])

  function addProject(project) {
    const id = projects.value.length
      ? Math.max(...projects.value.map(p => p.id)) + 1
      : 1
    projects.value.push({ id, profil_id: 1, competence_ids: [], ...project })
  }

  function updateProject(id, newData) {
    const index = projects.value.findIndex(p => p.id === id)
    if (index !== -1) {
      projects.value[index] = { ...projects.value[index], ...newData }
    }
  }

  function removeProject(id) {
    projects.value = projects.value.filter(p => p.id !== id)
  }

  return { projects, addProject, updateProject, removeProject }
})