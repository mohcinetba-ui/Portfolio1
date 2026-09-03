<script setup>
import { ref } from 'vue'
import { useFormationsStore } from '@/stores/formations'

const formationsStore = useFormationsStore()

const editingId = ref(null)
const form = ref({ diplome: '', etablissement: '', date_debut: '', date_fin: '', description: '' })

function resetForm() {
  form.value = { diplome: '', etablissement: '', date_debut: '', date_fin: '', description: '' }
  editingId.value = null
}

function submitForm() {
  if (!form.value.diplome.trim()) return

  if (editingId.value) {
    formationsStore.updateFormation(editingId.value, { ...form.value })
  } else {
    formationsStore.addFormation({ ...form.value })
  }
  resetForm()
}

function startEdit(formation) {
  editingId.value = formation.id
  form.value = {
    diplome: formation.diplome,
    etablissement: formation.etablissement,
    date_debut: formation.date_debut,
    date_fin: formation.date_fin,
    description: formation.description,
  }
}

function cancelEdit() {
  resetForm()
}

function deleteFormation(id) {
  if (editingId.value === id) resetForm()
  formationsStore.removeFormation(id)
}
</script>

<template>
  <section class="formations">
    <header class="formations-header">
      <h1 class="h2">Ma formation</h1>
    </header>

    <form class="formation-form" @submit.prevent="submitForm">
      <input v-model="form.diplome" type="text" placeholder="Diplôme" required>
      <input v-model="form.etablissement" type="text" placeholder="Établissement">
      <input v-model="form.date_debut" type="text" placeholder="Date début (ex: 2022)">
      <input v-model="form.date_fin" type="text" placeholder="Date fin (ex: 2024)">
      <textarea v-model="form.description" placeholder="Description" rows="3"></textarea>

      <div class="formation-form-actions">
        <button type="submit" class="btn btn--primary">
          {{ editingId ? 'Modifier' : 'Ajouter' }}
        </button>
        <button v-if="editingId" type="button" class="btn btn--outline" @click="cancelEdit">
          Annuler
        </button>
      </div>
    </form>

    <ol v-if="formationsStore.formations.length" class="formation-timeline">
      <li v-for="formation in formationsStore.formations" :key="formation.id" class="formation-item">
        <div class="formation-info">
          <h3>{{ formation.diplome }}</h3>
          <p class="formation-etablissement">{{ formation.etablissement }}</p>
          <span class="formation-dates">{{ formation.date_debut }} — {{ formation.date_fin }}</span>
          <p class="formation-description">{{ formation.description }}</p>
        </div>

        <div class="formation-actions">
          <button class="icon-btn" @click="startEdit(formation)">Modifier</button>
          <button class="icon-btn icon-btn--danger" @click="deleteFormation(formation.id)">Supprimer</button>
        </div>
      </li>
    </ol>

    <p v-else class="formations-empty">
      Aucune formation pour l'instant — ajoutez-en une avec le formulaire au-dessus.
    </p>
  </section>
</template>

<style scoped>
.formations {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.formation-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 1.25rem;
  border-radius: 10px;
  background: #1a1a1a;
}

.formation-form input,
.formation-form textarea {
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #444;
  background: #111;
  color: #fff;
  font-family: inherit;
}

.formation-form-actions {
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

.formation-timeline {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.formation-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 10px;
  background: #1a1a1a;
  border-left: 3px solid #4f46e5;
}

.formation-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1.05rem;
}

.formation-etablissement {
  color: #aaa;
  font-size: 0.9rem;
  margin: 0 0 0.25rem;
}

.formation-dates {
  font-size: 0.8rem;
  color: #888;
}

.formation-description {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #ccc;
  line-height: 1.5;
}

.formation-actions {
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

.formations-empty {
  color: #888;
  font-style: italic;
}
</style>