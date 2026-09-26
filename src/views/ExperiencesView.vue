<script setup>
import { ref } from 'vue'
import { useExperiencesStore } from '@/stores/experiences'

// Access the experiences store (CRUD list of work experiences)
const experiencesStore = useExperiencesStore()

// Holds the id of the experience currently being edited, or null when adding a new one
const editingId = ref(null)

// The form's local state — shared by both "add" and "edit" modes
const form = ref({ poste: '', entreprise: '', date_debut: '', date_fin: '', description: '' })

// Clears the form back to empty and exits edit mode
function resetForm() {
  form.value = { poste: '', entreprise: '', date_debut: '', date_fin: '', description: '' }
  editingId.value = null
}

// Handles both add AND edit in one function, based on whether editingId is set
function submitForm() {
  if (!form.value.poste.trim()) return // guard: job title is required

  if (editingId.value) {
    // We're editing an existing experience
    experiencesStore.updateExperience(editingId.value, { ...form.value })
  } else {
    // We're adding a brand new one
    experiencesStore.addExperience({ ...form.value })
  }
  resetForm()
}

// Called when the user clicks "Modifier" on a list item — loads that item into the form
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

// Cancels editing without saving changes
function cancelEdit() {
  resetForm()
}

// Deletes an experience; if it was the one being edited, reset the form too
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

    <!-- Single form used for BOTH adding and editing — button label changes based on mode -->
    <form class="experience-form" @submit.prevent="submitForm">
      <input v-model="form.poste" type="text" placeholder="Poste" required>
      <input v-model="form.entreprise" type="text" placeholder="Entreprise">
      <!-- Dates are plain text fields, not date pickers — allows flexible values like "2023" or "Présent" -->
      <input v-model="form.date_debut" type="text" placeholder="Date début (ex: 2023)">
      <input v-model="form.date_fin" type="text" placeholder="Date fin (ex: Présent)">
      <textarea v-model="form.description" placeholder="Description" rows="3"></textarea>

      <div class="experience-form-actions">
        <button type="submit" class="btn btn--primary">
          {{ editingId ? 'Modifier' : 'Ajouter' }}
        </button>
        <!-- Cancel button only appears while editing an existing item -->
        <button v-if="editingId" type="button" class="btn btn--outline" @click="cancelEdit">
          Annuler
        </button>
      </div>
    </form>

    <!-- <ol> (ordered list) is used instead of <ul> since a timeline has a natural chronological order -->
    <ol v-if="experiencesStore.experiences.length" class="experience-timeline">
      <!-- v-for loops over the array; :key gives Vue a stable identity per item -->
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

    <!-- Empty state, shown only when the list has zero items -->
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

/* Each entry: info on the left, actions on the right, with a colored left border like a timeline marker */
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

/* flex-shrink: 0 keeps the action buttons from getting squeezed when the description text is long */
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