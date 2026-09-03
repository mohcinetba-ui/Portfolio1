import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref({
    id: 1,
    nom: 'Tba',
    prenom: 'Mohcine',
    titre: 'Développeur Web',
    email: 'mohcintba3131@gmail.com',
    telephone: '+212 777 450 367',
    adresse: 'Saknia, Kenitra, Morocco',
    bio: "Je suis un développeur web passionné, basé au Maroc, intéressé par la création de sites modernes et interactifs. J'aime apprendre de nouvelles technologies, résoudre des problèmes et transformer des idées en expériences numériques simples, créatives et fonctionnelles.",
    photo_url: '',
  })

  function updateProfile(newData) {
    profile.value = { ...profile.value, ...newData }
  }

  return { profile, updateProfile }
})