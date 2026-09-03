import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'accueil',
      component: () => import('../views/AccueilView.vue'),
    },
    {
      path: '/a-propos',
      name: 'a-propos',
      component: () => import('../views/AProposView.vue'),
    },
    {
      path: '/competences',
      name: 'competences',
      component: () => import('../views/CompetencesView.vue'),
    },
    {
      path: '/projets',
      name: 'projets',
      component: () => import('../views/ProjetsView.vue'),
    },
    {
      path: '/experiences',
      name: 'experiences',
      component: () => import('../views/ExperiencesView.vue'),
    },
    {
      path: '/formations',
      name: 'formations',
      component: () => import('../views/FormationsView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
    },
    {
      path: '/mon-cv',
      name: 'mon-cv',
      component: () => import('../views/MonCvView.vue'),
    },
  ],
})

export default router