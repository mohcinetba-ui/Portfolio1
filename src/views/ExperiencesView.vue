<script setup>
import { ref } from 'vue'
import { useExperiencesStore } from '@/stores/experiences'

const experiencesStore = useExperiencesStore()

const editingId = ref(null)
const form = ref({ poste: '', entreprise: '', date_debut: '', date_fin: '', description: '' })

function resetForm() {
  form.value = { poste: '', entreprise: '', date_debut: '', date_fin: '', description: '' }
  editingId.value = null
}

function submitForm() {
  if (!form.value.poste.trim()) return

  if (editingId.value) {
    experiencesStore.updateExperience(editingId.value, { ...form.value })
  } else {
    experiencesStore.addExperience({ ...form.value })
  }
  resetForm()
}

function startEdit(experience) {
  editingId.value = experience.id
  form.value = {
    poste: experience.poste,
    entreprise: experience.entreprise,
    date_debut: experience.date_debut,
    date_fin: experience.date_fin,
    description: experience.description,
  }
}

function cancelEdit() {
  resetForm()
}

function deleteExperience(id) {
  if (editingId.value === id) resetForm()
  experiencesStore.removeExperience(id)
}
</script>

<template>
  <section class="experiences">
    <header class="experiences-header">
      <h1 class="h2">Mon expérience</h1>
    </header>

    <form class="experience-form" @submit.prevent="submitForm">
      <input v-model="form.poste" type="text" placeholder="Poste" required>
      <input v-model="form.entreprise" type="text" placeholder="Entreprise">
      <input v-model="form.date_debut" type="text" placeholder="Date début (ex: 2023)">
      <input v-model="form.date_fin" type="text" placeholder="Date fin (ex: Présent)">
      <textarea v-model="form.description" placeholder="Description" rows="3"></textarea>

      <div class="experience-form-actions">
        <button type="submit" class="btn btn--primary">
          {{ editingId ? 'Modifier' : 'Ajouter' }}
        </button>
        <button v-if="editingId" type="button" class="btn btn--outline" @click="cancelEdit">
          Annuler
        </button>
      </div>
    </form>

    <ol v-if="experiencesStore.experiences.length" class="experience-timeline">
      <li v-for="experience in experiencesStore.experiences" :key="experience.id" class="experience-item">
        <div class="experience-info">
          <h3>{{ experience.poste }}</h3>
          <p class="experience-entreprise">{{ experience.entreprise }}</p>
          <span class="experience-dates">{{ experience.date_debut }} — {{ experience.date_fin }}</span>
          <p class="experience-description">{{ experience.description }}</p>
        </div>

        <div class="experience-actions">
          <button class="icon-btn" @click="startEdit(experience)">Modifier</button>
          <button class="icon-btn icon-btn--danger" @click="deleteExperience(experience.id)">Supprimer</button>
        </div>
      </li>
    </ol>

    <p v-else class="experiences-empty">
      Aucune expérience pour l'instant — ajoutez-en une avec le formulaire au-dessus.
    </p>
  </section>
</template>

<style scoped>
.experiences {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.experience-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 1.25rem;
  border-radius: 10px;
  background: #1a1a1a;
}

.experience-form input,
.experience-form textarea {
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #444;
  background: #111;
  color: #fff;
  font-family: inherit;
}

.experience-form-actions {
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

.experience-timeline {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.experience-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 10px;
  background: #1a1a1a;
  border-left: 3px solid #4f46e5;
}

.experience-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1.05rem;
}

.experience-entreprise {
  color: #aaa;
  font-size: 0.9rem;
  margin: 0 0 0.25rem;
}

.experience-dates {
  font-size: 0.8rem;
  color: #888;
}

.experience-description {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #ccc;
  line-height: 1.5;
}

.experience-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
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

.experiences-empty {
  color: #888;
  font-style: italic;
}
</style>