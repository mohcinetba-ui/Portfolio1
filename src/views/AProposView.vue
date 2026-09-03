<script setup>
import { ref } from 'vue'
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()

const editing = ref(false)
const form = ref({ ...profileStore.profile })
const photoError = ref('')

function startEdit() {
  form.value = { ...profileStore.profile }
  photoError.value = ''
  editing.value = true
}

function handlePhotoUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    photoError.value = 'Merci de choisir un fichier image.'
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    photoError.value = 'Image trop lourde (2 Mo max).'
    return
  }

  photoError.value = ''
  const reader = new FileReader()
  reader.onload = () => {
    form.value.photo_url = reader.result
  }
  reader.readAsDataURL(file)
}

function removePhoto() {
  form.value.photo_url = ''
}

function saveProfile() {
  profileStore.updateProfile({ ...form.value })
  editing.value = false
}

function cancelEdit() {
  editing.value = false
}
</script>

<template>
  <section class="a-propos">
    <div class="a-propos-header">
      <div class="a-propos-header-text">
        <p class="bp-label">FIG. 01 — À PROPOS</p>
        <h1 class="a-propos-title">À propos de moi</h1>
      </div>
      <button v-if="!editing" class="bp-btn bp-btn--outline" @click="startEdit">Modifier</button>
    </div>

    <!-- Edit form -->
    <form v-if="editing" class="bp-panel a-propos-form" @submit.prevent="saveProfile">
      <div class="a-propos-form-row">
        <input v-model="form.prenom" type="text" placeholder="Prénom">
        <input v-model="form.nom" type="text" placeholder="Nom">
      </div>
      <input v-model="form.titre" type="text" placeholder="Titre (ex: Développeur Web)">
      <div class="a-propos-form-row">
        <input v-model="form.email" type="email" placeholder="Email">
        <input v-model="form.telephone" type="text" placeholder="Téléphone">
      </div>
      <input v-model="form.adresse" type="text" placeholder="Adresse">

      <div class="a-propos-photo-upload">
        <label class="a-propos-upload-label">
          Photo de profil
          <input type="file" accept="image/*" @change="handlePhotoUpload">
        </label>
        <p v-if="photoError" class="a-propos-photo-error">{{ photoError }}</p>

        <div v-if="form.photo_url" class="a-propos-photo-preview">
          <img :src="form.photo_url" alt="Aperçu">
          <button type="button" class="bp-mini-btn" @click="removePhoto">Retirer</button>
        </div>
      </div>

      <textarea v-model="form.bio" placeholder="Bio" rows="5"></textarea>

      <div class="a-propos-form-actions">
        <button type="submit" class="bp-btn bp-btn--primary">Enregistrer</button>
        <button type="button" class="bp-btn bp-btn--outline" @click="cancelEdit">Annuler</button>
      </div>
    </form>

    <!-- Display -->
    <div v-else class="a-propos-content">

      <figure v-if="profileStore.profile.photo_url" class="a-propos-photo">
        <img :src="profileStore.profile.photo_url" :alt="profileStore.profile.nom">
      </figure>

      <div class="a-propos-text">
        <p v-if="profileStore.profile.bio">{{ profileStore.profile.bio }}</p>
        <p v-else class="a-propos-empty">
          Aucune bio pour l'instant — cliquez sur "Modifier" pour l'ajouter.
        </p>

        <ul class="a-propos-infos">
          <li v-if="profileStore.profile.email">
            <strong>Email :</strong>
            <a :href="`mailto:${profileStore.profile.email}`">{{ profileStore.profile.email }}</a>
          </li>
          <li v-if="profileStore.profile.telephone">
            <strong>Téléphone :</strong> {{ profileStore.profile.telephone }}
          </li>
          <li v-if="profileStore.profile.adresse">
            <strong>Adresse :</strong> {{ profileStore.profile.adresse }}
          </li>
        </ul>
      </div>

    </div>
  </section>
</template>

<style scoped>
.a-propos {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.a-propos-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
}

.a-propos-title {
  font-size: 1.8rem;
  margin-top: 0.3rem;
}

.a-propos-content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.a-propos-photo {
  flex-shrink: 0;
  width: 160px;
  height: 160px;
  border-radius: 2px;
  overflow: hidden;
}

.a-propos-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.a-propos-text {
  flex: 1;
  line-height: 1.7;
  color: var(--bp-ink);
}

.a-propos-empty {
  color: var(--bp-ink-faint);
  font-style: italic;
}

.a-propos-infos {
  list-style: none;
  padding: 0;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.a-propos-infos a {
  color: var(--bp-accent-deep);
}

/* Edit form */
.a-propos-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
}

.a-propos-form-row {
  display: flex;
  gap: 0.75rem;
}

.a-propos-form input,
.a-propos-form textarea {
  flex: 1;
  padding: 0.6rem 0.8rem;
  border-radius: 2px;
  border: 1px solid var(--bp-line);
  background: var(--bp-bg-deep);
  color: var(--bp-ink);
  font-family: var(--font-sans);
}

.a-propos-form-actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

.a-propos-photo-upload {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.a-propos-upload-label {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--bp-ink-muted);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.a-propos-upload-label input[type='file'] {
  font-family: var(--font-sans);
  font-size: 0.82rem;
  color: var(--bp-ink);
}

.a-propos-photo-error {
  font-size: 0.8rem;
  color: var(--bp-danger);
  margin: 0;
}

.a-propos-photo-preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.a-propos-photo-preview img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 2px;
  border: 1px solid var(--bp-line);
}

.bp-mini-btn {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  background: transparent;
  border: 1px solid var(--bp-line);
  color: var(--bp-ink-muted);
  padding: 0.3rem 0.6rem;
  border-radius: 2px;
  cursor: pointer;
  letter-spacing: 0.05em;
}

@media (max-width: 600px) {
  .a-propos-content {
    flex-direction: column;
  }
  .a-propos-form-row {
    flex-direction: column;
  }
}
</style>