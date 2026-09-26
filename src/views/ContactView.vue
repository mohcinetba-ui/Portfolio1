<script setup>
import { ref } from 'vue'
import { useMessagesStore } from '@/stores/messages'
import { useProfileStore } from '@/stores/profile'

// Store for contact messages (this form will add entries here)
const messagesStore = useMessagesStore()
// Profile store, used to display the user's own contact info (email/phone/address)
const profileStore = useProfileStore()

// Local state for the contact form
const form = ref({ nom_expediteur: '', email: '', sujet: '', contenu: '' })
// Flag to show a "sent successfully" confirmation message after submitting
const sent = ref(false)

function submitForm() {
  // Guard: name, email and message content are required, otherwise do nothing
  if (!form.value.nom_expediteur.trim() || !form.value.email.trim() || !form.value.contenu.trim()) return

  // Add the message to the store (auto-saved to localStorage via the persistence plugin)
  messagesStore.addMessage({ ...form.value })
  // Reset the form back to empty after sending
  form.value = { nom_expediteur: '', email: '', sujet: '', contenu: '' }
  // Show the confirmation message
  sent.value = true
  // Hide it again automatically after 3 seconds
  setTimeout(() => { sent.value = false }, 3000)
}
</script>

<template>
  <section class="contact">
    <header class="contact-header">
      <h1 class="h2">Me contacter</h1>
    </header>

    <div class="contact-layout">

      <!-- LEFT COLUMN: the user's own contact info (static, pulled from the profile store) -->
      <div class="contact-infos">
        <p v-if="profileStore.profile.email">
          <strong>Email :</strong>
          <a :href="`mailto:${profileStore.profile.email}`">{{ profileStore.profile.email }}</a>
        </p>
        <p v-if="profileStore.profile.telephone">
          <strong>Téléphone :</strong> {{ profileStore.profile.telephone }}
        </p>
        <p v-if="profileStore.profile.adresse">
          <strong>Adresse :</strong> {{ profileStore.profile.adresse }}
        </p>
      </div>

      <!-- RIGHT COLUMN: form for visitors to send a message -->
      <form class="contact-form" @submit.prevent="submitForm">
        <input v-model="form.nom_expediteur" type="text" placeholder="Votre nom" required>
        <input v-model="form.email" type="email" placeholder="Votre email" required>
        <input v-model="form.sujet" type="text" placeholder="Sujet (optionnel)">
        <textarea v-model="form.contenu" placeholder="Votre message" rows="5" required></textarea>

        <button type="submit" class="btn btn--primary">Envoyer</button>

        <!-- Only shown briefly after a successful submit (3 seconds) -->
        <p v-if="sent" class="contact-sent">Message envoyé avec succès !</p>
      </form>

    </div>
  </section>
</template>

<style scoped>
.contact {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

/* Layout: contact info on the left, form on the right, wraps on narrow screens */
.contact-layout {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.contact-infos {
  flex: 1;
  min-width: 200px;
  color: #ccc;
  line-height: 1.8;
}

.contact-infos a {
  color: #4f46e5;
}

.contact-form {
  flex: 2; /* form takes up twice the space of contact-infos */
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-form input,
.contact-form textarea {
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #444;
  background: #1a1a1a;
  color: #fff;
  font-family: inherit;
}

.btn {
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  align-self: flex-start; /* button only takes up as much width as its content, not the full row */
}

.btn--primary {
  background: #4f46e5;
  color: #fff;
}

.contact-sent {
  color: #4ade80;
  font-size: 0.9rem;
}
</style>