<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useProfileStore } from '@/stores/profile'

// Access the profile store so the logo can display the user's first name
const profileStore = useProfileStore()
</script>

<template>
  <!-- App shell: wraps every page — header + nav stay fixed, only the content below changes -->
  <div class="app-shell">

    <header class="app-header">
      <!-- Logo/brand link — falls back to "Portfolio" if no first name is set yet -->
      <RouterLink to="/" class="app-logo">
        {{ profileStore.profile.prenom || 'Portfolio' }}
      </RouterLink>

      <!-- Main navigation — one RouterLink per view/route -->
      <nav class="app-nav">
        <RouterLink to="/">Accueil</RouterLink>
        <RouterLink to="/a-propos">À propos</RouterLink>
        <RouterLink to="/competences">Compétences</RouterLink>
        <RouterLink to="/projets">Projets</RouterLink>
        <RouterLink to="/experiences">Expériences</RouterLink>
        <RouterLink to="/formations">Formations</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
        <RouterLink to="/mon-cv">Mon CV</RouterLink>
      </nav>
    </header>

    <!-- RouterView renders whichever view matches the current route (Accueil, Contact, etc.) -->
    <main class="app-main">
      <RouterView />
    </main>

  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #0f0f0f;
  color: #eee;
}

/* Header bar: logo on the left, nav links on the right, wraps on narrow screens */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem 2rem;
  border-bottom: 1px solid #222;
}

.app-logo {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
}

.app-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
}

.app-nav a {
  color: #aaa;
  text-decoration: none;
  font-size: 0.9rem;
}

.app-nav a:hover {
  color: #fff;
}

/* Vue Router automatically adds this class to whichever link matches the current route exactly —
   used here to highlight the active page in the nav */
.app-nav a.router-link-exact-active {
  color: #4f46e5;
  font-weight: 600;
}

/* Subtracts the header's approximate height (70px) so main content fills the rest of the viewport */
.app-main {
  min-height: calc(100vh - 70px);
}
</style>