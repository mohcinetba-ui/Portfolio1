<script setup>
import { ref } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useCompetencesStore } from '@/stores/competences'

const projectsStore = useProjectsStore()
const competencesStore = useCompetencesStore()

const editingId = ref(null)
const form = ref({
  titre: '',
  description: '',
  lien_demo: '',
  lien_repo: '',
  image_url: '',
  competence_ids: [],
})

function resetForm() {
  form.value = { titre: '', description: '', lien_demo: '', lien_repo: '', image_url: '', competence_ids: [] }
  editingId.value = null
}

function submitForm() {
  if (!form.value.titre.trim()) return

  if (editingId.value) {
    projectsStore.updateProject(editingId.value, { ...form.value })
  } else {
    projectsStore.addProject({ ...form.value })
  }
  resetForm()
}

function startEdit(project) {
  editingId.value = project.id
  form.value = {
    titre: project.titre,
    description: project.description,
    lien_demo: project.lien_demo,
    lien_repo: project.lien_repo,
    image_url: project.image_url,
    competence_ids: [...(project.competence_ids || [])],
  }
}

function cancelEdit() {
  resetForm()
}

function deleteProject(id) {
  if (editingId.value === id) resetForm()
  projectsStore.removeProject(id)
}

function competenceName(id) {
  return competencesStore.competences.find(c => c.id === id)?.nom || ''
}
</script>

<template>
  <section class="projets">
    <header class="projets-header">
      <h1 class="h2">Mes projets</h1>
    </header>

    <!-- Form add/edit -->
    <form class="projet-form" @submit.prevent="submitForm">
      <input v-model="form.titre" type="text" placeholder="Titre du projet" required>
      <textarea v-model="form.description" placeholder="Description" rows="3"></textarea>
      <input v-model="form.lien_demo" type="text" placeholder="Lien démo (optionnel)">
      <input v-model="form.lien_repo" type="text" placeholder="Lien repo GitHub (optionnel)">
      <input v-model="form.image_url" type="text" placeholder="URL de l'image (optionnel)">

      <div class="competence-picker">
        <p class="competence-picker-label">Compétences liées :</p>
        <label v-for="c in competencesStore.competences" :key="c.id" class="competence-checkbox">
          <input type="checkbox" :value="c.id" v-model="form.competence_ids">
          {{ c.nom }}
        </label>
        <p v-if="!competencesStore.competences.length" class="competence-picker-empty">
          Ajoutez d'abord des compétences dans la page Compétences.
        </p>
      </div>

      <div class="projet-form-actions">
        <button type="submit" class="btn btn--primary">
          {{ editingId ? 'Modifier' : 'Ajouter' }}
        </button>
        <button v-if="editingId" type="button" class="btn btn--outline" @click="cancelEdit">
          Annuler
        </button>
      </div>
    </form>

    <!-- List -->
    <ul v-if="projectsStore.projects.length" class="projet-list">
      <li v-for="project in projectsStore.projects" :key="project.id" class="projet-card">
        <figure v-if="project.image_url" class="projet-image">
          <img :src="project.image_url" :alt="project.titre">
        </figure>

        <div class="projet-body">
          <h3>{{ project.titre }}</h3>
          <p class="projet-description">{{ project.description }}</p>

          <div v-if="project.competence_ids?.length" class="projet-badges">
            <span v-for="cid in project.competence_ids" :key="cid" class="projet-badge">
              {{ competenceName(cid) }}
            </span>
          </div>

          <div class="projet-links">
            <a v-if="project.lien_demo" :href="project.lien_demo" target="_blank" rel="noopener">Démo</a>
            <a v-if="project.lien_repo" :href="project.lien_repo" target="_blank" rel="noopener">Code</a>
          </div>

          <div class="projet-actions">
            <button class="icon-btn" @click="startEdit(project)">Modifier</button>
            <button class="icon-btn icon-btn--danger" @click="deleteProject(project.id)">Supprimer</button>
          </div>
        </div>
      </li>
    </ul>

    <p v-else class="projets-empty">
      Aucun projet pour l'instant — ajoutez-en un avec le formulaire au-dessus.
    </p>
  </section>
</template>

<style scoped>
.projets {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.projet-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 1.25rem;
  border-radius: 10px;
  background: #1a1a1a;
}

.projet-form input,
.projet-form textarea {
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #444;
  background: #111;
  color: #fff;
  font-family: inherit;
}

.competence-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
}

.competence-picker-label {
  width: 100%;
  font-size: 0.85rem;
  color: #888;
  margin: 0;
}

.competence-checkbox {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: #ccc;
}

.competence-picker-empty {
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
}

.projet-form-actions {
  display: flex;
  gap: 0.6rem;
}

.btn {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.btn--primary {
  background: #4f46e5;
  color: #fff;
}

.btn--outline {
  background: transparent;
  border: 1px solid #4f46e5;
  color: #4f46e5;
}

.projet-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
}

.projet-card {
  border-radius: 10px;
  background: #1a1a1a;
  overflow: hidden;
}

.projet-image {
  width: 100%;
  height: 150px;
}

.projet-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.projet-body {
  padding: 1rem;
}

.projet-body h3 {
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
}

.projet-description {
  font-size: 0.9rem;
  color: #aaa;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.projet-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}

.projet-badge {
  font-size: 0.72rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: #333;
  color: #aaa;
}

.projet-links {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.projet-links a {
  color: #4f46e5;
  font-size: 0.85rem;
}

.projet-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: transparent;
  border: 1px solid #444;
  color: #ccc;
  padding: 0.35rem 0.7rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
}

.icon-btn--danger {
  border-color: #e54f4f;
  color: #e54f4f;
}

.projets-empty {
  color: #888;
  font-style: italic;
}
</style>