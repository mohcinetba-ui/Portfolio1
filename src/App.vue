<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()
</script>

<template>
  <div class="app-shell">

    <header class="app-header">
      <RouterLink to="/" class="app-logo">
        {{ profileStore.profile.prenom || 'Portfolio' }}
      </RouterLink>

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

.app-nav a.router-link-exact-active {
  color: #4f46e5;
  font-weight: 600;
}

.app-main {
  min-height: calc(100vh - 70px);
}
</style>