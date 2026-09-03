<script setup>
import { ref } from 'vue'
import { useCompetencesStore } from '@/stores/competences'

const competencesStore = useCompetencesStore()

const editingId = ref(null)
const form = ref({ nom: '', categorie: '', niveau: 50 })

function resetForm() {
  form.value = { nom: '', categorie: '', niveau: 50 }
  editingId.value = null
}

function submitForm() {
  if (!form.value.nom.trim()) return

  if (editingId.value) {
    competencesStore.updateCompetence(editingId.value, { ...form.value })
  } else {
    competencesStore.addCompetence({ ...form.value })
  }
  resetForm()
}

function startEdit(competence) {
  editingId.value = competence.id
  form.value = { nom: competence.nom, categorie: competence.categorie, niveau: competence.niveau }
}

function cancelEdit() {
  resetForm()
}

function deleteCompetence(id) {
  if (editingId.value === id) resetForm()
  competencesStore.removeCompetence(id)
}
</script>

<template>
  <section class="competences">
    <p class="bp-label">FIG. 02 — COMPÉTENCES</p>
    <h1 class="competences-title">Mesures de compétence</h1>

    <!-- Form add/edit -->
    <form class="bp-panel competence-form" @submit.prevent="submitForm">
      <input v-model="form.nom" type="text" placeholder="Nom (ex: Vue.js)" required>
      <input v-model="form.categorie" type="text" placeholder="Catégorie (ex: Frontend)">
      <input v-model.number="form.niveau" type="number" min="0" max="100" placeholder="Niveau %">
      <button type="submit" class="bp-btn bp-btn--primary">
        {{ editingId ? 'Modifier' : 'Ajouter' }}
      </button>
      <button v-if="editingId" type="button" class="bp-btn bp-btn--outline" @click="cancelEdit">
        Annuler
      </button>
    </form>

    <!-- Dimension-line list -->
    <ul v-if="competencesStore.competences.length" class="competence-list">
      <li v-for="competence in competencesStore.competences" :key="competence.id" class="competence-item">

        <div class="competence-meta">
          <span class="competence-nom">{{ competence.nom }}</span>
          <span v-if="competence.categorie" class="competence-categorie">{{ competence.categorie }}</span>
        </div>

        <div class="dimension-line">
          <span class="dimension-tick dimension-tick--start"></span>
          <div class="dimension-track">
            <div class="dimension-fill" :style="{ width: (competence.niveau || 0) + '%' }"></div>
            <span class="dimension-marker" :style="{ left: (competence.niveau || 0) + '%' }">
              {{ competence.niveau || 0 }}%
            </span>
          </div>
          <span class="dimension-tick dimension-tick--end"></span>
        </div>

        <div class="competence-actions">
          <button class="bp-mini-btn" @click="startEdit(competence)">MOD</button>
          <button class="bp-mini-btn bp-mini-btn--danger" @click="deleteCompetence(competence.id)">DEL</button>
        </div>
      </li>
    </ul>

    <p v-else class="competences-empty">
      Aucune compétence pour l'instant — ajoutez-en une avec le formulaire au-dessus.
    </p>
  </section>
</template>

<style scoped>
.competences {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.competences-title {
  font-size: 1.8rem;
  margin-bottom: 2rem;
}

.competence-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 2.5rem;
}

.competence-form input {
  flex: 1;
  min-width: 120px;
  padding: 0.6rem 0.8rem;
  border-radius: 2px;
  border: 1px solid var(--bp-line);
  background: var(--bp-bg-deep);
  color: var(--bp-ink);
  font-family: var(--font-sans);
}

.competence-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.competence-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.6rem 1rem;
  animation: bp-item-in 0.5s ease both;
}

.competence-item:nth-child(1) { animation-delay: 0.05s; }
.competence-item:nth-child(2) { animation-delay: 0.1s; }
.competence-item:nth-child(3) { animation-delay: 0.15s; }
.competence-item:nth-child(4) { animation-delay: 0.2s; }
.competence-item:nth-child(5) { animation-delay: 0.25s; }
.competence-item:nth-child(n+6) { animation-delay: 0.3s; }

@keyframes bp-item-in {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}

.competence-meta {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}

.competence-nom {
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 0.95rem;
}

.competence-categorie {
  font-size: 0.72rem;
  color: var(--bp-ink-faint);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.competence-actions {
  grid-row: 1;
  grid-column: 2;
  display: flex;
  gap: 0.4rem;
  align-self: start;
}

.bp-mini-btn {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  background: transparent;
  border: 1px solid var(--bp-line);
  color: var(--bp-ink-muted);
  padding: 0.25rem 0.55rem;
  border-radius: 2px;
  cursor: pointer;
  letter-spacing: 0.05em;
}

.bp-mini-btn--danger {
  border-color: var(--bp-danger);
  color: var(--bp-danger);
}

/* --- Dimension line (signature element) --- */
.dimension-line {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.dimension-tick {
  width: 1px;
  height: 12px;
  background: var(--bp-ink-faint);
  flex-shrink: 0;
}

.dimension-track {
  position: relative;
  flex: 1;
  height: 1px;
  background: var(--bp-line);
}

.dimension-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 1px;
  background: var(--bp-accent);
  transition: width 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}

.dimension-fill::after {
  content: '';
  position: absolute;
  right: 0;
  top: -3px;
  width: 1px;
  height: 7px;
  background: var(--bp-accent);
}

.dimension-marker {
  position: absolute;
  top: -22px;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--bp-accent);
  white-space: nowrap;
}

.competences-empty {
  color: var(--bp-ink-faint);
  font-style: italic;
}
</style>