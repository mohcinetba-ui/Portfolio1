<script setup>
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()
</script>

<template>
  <section class="accueil bp-corners">
    <div class="accueil-grid">

      <div class="accueil-main bp-fade-in">
        <p class="bp-label">FIG. 00 — PROFIL</p>

        <figure v-if="profileStore.profile.photo_url" class="accueil-photo">
          <img :src="profileStore.profile.photo_url" :alt="profileStore.profile.nom">
        </figure>

        <h1 class="accueil-nom">
          {{ profileStore.profile.prenom || 'Prénom' }}<br>
          {{ profileStore.profile.nom || 'Nom' }}
        </h1>

        <p class="accueil-titre">{{ profileStore.profile.titre || 'Développeur Web' }}</p>

        <p class="accueil-bio">{{ profileStore.profile.bio || 'Ajoutez votre bio dans le store profile.js pour la voir apparaître ici.' }}</p>

        <div class="accueil-actions">
          <RouterLink to="/projets" class="bp-btn bp-btn--primary">Voir mes projets →</RouterLink>
          <RouterLink to="/contact" class="bp-btn bp-btn--outline">Me contacter</RouterLink>
        </div>
      </div>

      <aside class="accueil-spec bp-fade-in" style="animation-delay: 0.15s">
        <p class="bp-label">SPÉCIFICATIONS</p>
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
            <dd>Disponible</dd>
          </div>
        </dl>
      </aside>

    </div>
  </section>
</template>

<style scoped>
.accueil {
  min-height: calc(100vh - 130px);
  display: flex;
  align-items: center;
  padding: 3rem 4rem;
}

.accueil-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.accueil-nom {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 1.05;
  font-weight: 800;
  margin-bottom: 1rem;
}

.accueil-titre {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  color: var(--bp-accent);
  margin: 0 0 1.5rem;
}

.accueil-bio {
  color: var(--bp-ink-muted);
  line-height: 1.7;
  max-width: 46ch;
  margin-bottom: 2.2rem;
}

.accueil-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.accueil-spec {
  border-left: 1px solid var(--bp-line);
  padding-left: 2rem;
}

.accueil-spec-list {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.accueil-spec-row dt {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  color: var(--bp-ink-faint);
  margin-bottom: 0.2rem;
}

.accueil-spec-row dd {
  margin: 0;
  font-size: 0.9rem;
  color: var(--bp-ink);
}

@media (max-width: 800px) {
  .accueil {
    padding: 2.5rem 1.5rem;
  }
  .accueil-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .accueil-spec {
    border-left: none;
    border-top: 1px solid var(--bp-line);
    padding-left: 0;
    padding-top: 1.5rem;
  }
}
</style>