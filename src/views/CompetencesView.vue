<script setup>
import { ref } from 'vue'
import { useCompetencesStore } from '@/stores/competences'

// Access the competences store (CRUD list of skills)
const competencesStore = useCompetencesStore()

// Holds the id of the competence currently being edited, or null when adding a new one
const editingId = ref(null)

// The form's local state — shared by both "add" and "edit" modes
const form = ref({ nom: '', categorie: '', niveau: 50 })

// Clears the form back to defaults and exits edit mode
function resetForm() {
  form.value = { nom: '', categorie: '', niveau: 50 }
  editingId.value = null
}

// Handles both add AND edit in one function, based on whether editingId is set
function submitForm() {
  if (!form.value.nom.trim()) return // guard: don't allow an empty name

  if (editingId.value) {
    // We're editing an existing competence
    competencesStore.updateCompetence(editingId.value, { ...form.value })
  } else {
    // We're adding a brand new one
    competencesStore.addCompetence({ ...form.value })
  }
  resetForm()
}

// Called when the user clicks "MOD" on a list item — loads that item into the form
function startEdit(competence) {
  editingId.value = competence.id
  form.value = { nom: competence.nom, categorie: competence.categorie, niveau: competence.niveau }
}

// Cancels editing without saving changes
function cancelEdit() {
  resetForm()
}

// Deletes a competence; if it was the one being edited, reset the form too
function deleteCompetence(id) {
  if (editingId.value === id) resetForm()
  competencesStore.removeCompetence(id)
}
</script>

<template>
  <section class="competences">
    <p class="bp-label">FIG. 02 — COMPÉTENCES</p>
    <h1 class="competences-title">Mesures de compétence</h1>

    <!-- Single form used for BOTH adding and editing — button label changes based on mode -->
    <form class="bp-panel competence-form" @submit.prevent="submitForm">
      <input v-model="form.nom" type="text" placeholder="Nom (ex: Vue.js)" required>
      <input v-model="form.categorie" type="text" placeholder="Catégorie (ex: Frontend)">
      <!-- v-model.number auto-converts the input string into a Number -->
      <input v-model.number="form.niveau" type="number" min="0" max="100" placeholder="Niveau %">
      <button type="submit" class="bp-btn bp-btn--primary">
        {{ editingId ? 'Modifier' : 'Ajouter' }}
      </button>
      <!-- Cancel button only appears while editing an existing item -->
      <button v-if="editingId" type="button" class="bp-btn bp-btn--outline" @click="cancelEdit">
        Annuler
      </button>
    </form>

    <!-- List of competences, each shown as a "dimension line" (like a measurement/ruler graphic) -->
    <ul v-if="competencesStore.competences.length" class="competence-list">
      <!-- v-for loops over the array; :key gives Vue a stable identity per item for efficient re-rendering -->
      <li v-for="competence in competencesStore.competences" :key="competence.id" class="competence-item">

        <div class="competence-meta">
          <span class="competence-nom">{{ competence.nom }}</span>
          <!-- Category badge only shown if it was filled in -->
          <span v-if="competence.categorie" class="competence-categorie">{{ competence.categorie }}</span>
        </div>

        <!-- Visual skill-level bar: a horizontal line with a filled portion and a % label -->
        <div class="dimension-line">
          <span class="dimension-tick dimension-tick--start"></span>
          <div class="dimension-track">
            <!-- Fill width is bound dynamically to the skill level percentage -->
            <div class="dimension-fill" :style="{ width: (competence.niveau || 0) + '%' }"></div>
            <!-- The % label position is also bound to the same percentage, via 'left' -->
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

    <!-- Empty state, shown only when the list has zero items -->
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

/* Form fields wrap onto new lines on narrow screens (flex-wrap) */
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

/* Each item is a mini-grid: name/category row spans col 1, actions sit in col 2 */
.competence-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.6rem 1rem;
  animation: bp-item-in 0.5s ease both;
}

/* Staggered entrance animation: each item fades in slightly later than the previous one */
.competence-item:nth-child(1) { animation-delay: 0.05s; }
.competence-item:nth-child(2) { animation-delay: 0.1s; }
.competence-item:nth-child(3) { animation-delay: 0.15s; }
.competence-item:nth-child(4) { animation-delay: 0.2s; }
.competence-item:nth-child(5) { animation-delay: 0.25s; }
.competence-item:nth-child(n+6) { animation-delay: 0.3s; } /* everything from the 6th item onward, same delay */

@keyframes bp-item-in {
  from { opacity: 0; transform: translateX(-8px); } /* start slightly left and invisible */
  to   { opacity: 1; transform: translateX(0); }     /* end in normal position, fully visible */
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

/* Positions the MOD/DEL buttons in the grid's second column, top-aligned */
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

/* Red-tinted variant for the delete button */
.bp-mini-btn--danger {
  border-color: var(--bp-danger);
  color: var(--bp-danger);
}

/* --- Dimension line (signature visual element: a "ruler" style skill bar) --- */
.dimension-line {
  grid-column: 1 / -1; /* spans the full grid width, under the name/category row */
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

/* Small vertical tick marks at each end of the line, like a technical ruler */
.dimension-tick {
  width: 1px;
  height: 12px;
  background: var(--bp-ink-faint);
  flex-shrink: 0;
}

/* The full-width background track (100% = the whole skill scale) */
.dimension-track {
  position: relative;
  flex: 1;
  height: 1px;
  background: var(--bp-line);
}

/* The filled portion representing the actual skill level, animated when width changes */
.dimension-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 1px;
  background: var(--bp-accent);
  transition: width 0.9s cubic-bezier(0.16, 1, 0.3, 1); /* smooth "ease-out" fill animation */
}

/* Small vertical tick at the end of the filled portion, marking exactly where it stops */
.dimension-fill::after {
  content: '';
  position: absolute;
  right: 0;
  top: -3px;
  width: 1px;
  height: 7px;
  background: var(--bp-accent);
}

/* The "72%" text label, positioned above the track at the same horizontal spot as the fill end */
.dimension-marker {
  position: absolute;
  top: -22px;
  transform: translateX(-50%); /* centers the label exactly over its position point */
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