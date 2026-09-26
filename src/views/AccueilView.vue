<script setup>
// Import the "profile" Pinia store so we can read the user's data here
import { useProfileStore } from '@/stores/profile'

// Instantiate the store — this gives us reactive access to profile.state
const profileStore = useProfileStore()
</script>

<template>
  <!-- Main "Accueil" (Home) section — bp-corners adds the blueprint-style corner decoration -->
  <section class="accueil bp-corners">
    <!-- Two-column grid: main content on the left, spec sheet on the right -->
    <div class="accueil-grid">

      <!-- LEFT COLUMN: identity block -->
      <div class="accueil-main bp-fade-in">
        <!-- Small blueprint-style label, purely decorative/thematic -->
        <p class="bp-label">FIG. 00 — PROFIL</p>

        <!-- Only render the photo if a photo_url exists in the store -->
        <figure v-if="profileStore.profile.photo_url" class="accueil-photo">
          <img :src="profileStore.profile.photo_url" :alt="profileStore.profile.nom">
        </figure>

        <!-- First name / last name, with fallback placeholders if empty -->
        <h1 class="accueil-nom">
          {{ profileStore.profile.prenom || 'Prénom' }}<br>
          {{ profileStore.profile.nom || 'Nom' }}
        </h1>

        <!-- Job title / role, fallback to a default title -->
        <p class="accueil-titre">{{ profileStore.profile.titre || 'Développeur Web' }}</p>

        <!-- Short bio text, fallback tells the user how to fill it -->
        <p class="accueil-bio">{{ profileStore.profile.bio || 'Ajoutez votre bio dans le store profile.js pour la voir apparaître ici.' }}</p>

        <!-- Call-to-action buttons: primary (filled) and outline (secondary) -->
        <div class="accueil-actions">
          <RouterLink to="/projets" class="bp-btn bp-btn--primary">Voir mes projets →</RouterLink>
          <RouterLink to="/contact" class="bp-btn bp-btn--outline">Me contacter</RouterLink>
        </div>
      </div>

      <!-- RIGHT COLUMN: "spec sheet" style contact info, staggered fade-in (0.15s delay) -->
      <aside class="accueil-spec bp-fade-in" style="animation-delay: 0.15s">
        <p class="bp-label">SPÉCIFICATIONS</p>
        <!-- Definition list: each row is a label (dt) + value (dd) pair -->
        <dl class="accueil-spec-list">
          <div class="accueil-spec-row">
            <dt>LOCALISATION</dt>
            <dd>{{ profileStore.profile.adresse || '—' }}</dd>
          </div>
          <div class="accueil-spec-row">
            <dt>EMAIL</dt>
            <dd>{{ profileStore.profile.email || '—' }}</dd>
          </div>
          <div class="accueil-spec-row">
            <dt>TÉLÉPHONE</dt>
            <dd>{{ profileStore.profile.telephone || '—' }}</dd>
          </div>
          <div class="accueil-spec-row">
            <dt>STATUT</dt>
            <!-- Hardcoded for now — not pulled from the store -->
            <dd>Disponible</dd>
          </div>
        </dl>
      </aside>

    </div>
  </section>
</template>

<style scoped>
/* Section fills the viewport height minus header/footer space (130px), content vertically centered */
.accueil {
  min-height: calc(100vh - 130px);
  display: flex;
  align-items: center;
  padding: 3rem 4rem;
}

/* Grid: main column is twice as wide as the spec column (2fr vs 1fr) */
.accueil-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

/* Name heading: fluid font-size (clamp) so it scales smoothly between mobile and desktop */
.accueil-nom {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 1.05;
  font-weight: 800;
  margin-bottom: 1rem;
}

/* Job title styled with a monospace font and accent color, for the "blueprint" theme */
.accueil-titre {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  color: var(--bp-accent);
  margin: 0 0 1.5rem;
}

/* Bio text: muted color, limited width (46 characters) so lines don't get too long to read */
.accueil-bio {
  color: var(--bp-ink-muted);
  line-height: 1.7;
  max-width: 46ch;
  margin-bottom: 2.2rem;
}

/* Buttons row: wraps to a new line if there isn't enough space (mobile) */
.accueil-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Right column: thin vertical line separating it from the main column */
.accueil-spec {
  border-left: 1px solid var(--bp-line);
  padding-left: 2rem;
}

/* Spec rows stacked vertically with consistent spacing */
</style>
