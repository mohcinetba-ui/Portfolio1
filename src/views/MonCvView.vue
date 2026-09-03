<script setup>
import { ref } from 'vue'
import jsPDF from 'jspdf'
import { useProfileStore } from '@/stores/profile'
import { useCompetencesStore } from '@/stores/competences'
import { useExperiencesStore } from '@/stores/experiences'
import { useFormationsStore } from '@/stores/formations'

const profileStore = useProfileStore()
const competencesStore = useCompetencesStore()
const experiencesStore = useExperiencesStore()
const formationsStore = useFormationsStore()

const generating = ref(false)

function exportPdf() {
  generating.value = true

  const doc = new jsPDF()
  const marginLeft = 15
  let y = 20

  doc.setFontSize(20)
  doc.text(`${profileStore.profile.prenom || ''} ${profileStore.profile.nom || ''}`.trim() || 'Nom Prénom', marginLeft, y)
  y += 8

  doc.setFontSize(12)
  doc.setTextColor(100)
  doc.text(profileStore.profile.titre || '', marginLeft, y)
  y += 6

  doc.setFontSize(10)
  const contactLine = [profileStore.profile.email, profileStore.profile.telephone, profileStore.profile.adresse]
    .filter(Boolean)
    .join(' · ')
  doc.text(contactLine, marginLeft, y)
  y += 10

  doc.setTextColor(0)

  if (profileStore.profile.bio) {
    doc.setFontSize(11)
    const bioLines = doc.splitTextToSize(profileStore.profile.bio, 180)
    doc.text(bioLines, marginLeft, y)
    y += bioLines.length * 5 + 6
  }

  if (experiencesStore.experiences.length) {
    doc.setFontSize(14)
    doc.text('Expériences', marginLeft, y)
    y += 7
    doc.setFontSize(10)

    experiencesStore.experiences.forEach(exp => {
      doc.setFont(undefined, 'bold')
      doc.text(`${exp.poste} — ${exp.entreprise}`, marginLeft, y)
      doc.setFont(undefined, 'normal')
      y += 5
      doc.setTextColor(120)
      doc.text(`${exp.date_debut} — ${exp.date_fin}`, marginLeft, y)
      doc.setTextColor(0)
      y += 5
      if (exp.description) {
        const lines = doc.splitTextToSize(exp.description, 180)
        doc.text(lines, marginLeft, y)
        y += lines.length * 5
      }
      y += 4
    })
    y += 2
  }

  if (formationsStore.formations.length) {
    doc.setFontSize(14)
    doc.text('Formations', marginLeft, y)
    y += 7
    doc.setFontSize(10)

    formationsStore.formations.forEach(f => {
      doc.setFont(undefined, 'bold')
      doc.text(`${f.diplome} — ${f.etablissement}`, marginLeft, y)
      doc.setFont(undefined, 'normal')
      y += 5
      doc.setTextColor(120)
      doc.text(`${f.date_debut} — ${f.date_fin}`, marginLeft, y)
      doc.setTextColor(0)
      y += 5
      if (f.description) {
        const lines = doc.splitTextToSize(f.description, 180)
        doc.text(lines, marginLeft, y)
        y += lines.length * 5
      }
      y += 4
    })
    y += 2
  }

  if (competencesStore.competences.length) {
    doc.setFontSize(14)
    doc.text('Compétences', marginLeft, y)
    y += 7
    doc.setFontSize(10)

    const skillsLine = competencesStore.competences.map(c => `${c.nom} (${c.niveau || 0}%)`).join('  ·  ')
    const lines = doc.splitTextToSize(skillsLine, 180)
    doc.text(lines, marginLeft, y)
    y += lines.length * 5
  }

  const fileName = `CV_${profileStore.profile.nom || 'portfolio'}.pdf`
  doc.save(fileName)

  generating.value = false
}
</script>

<template>
  <section class="cv-page">

    <div class="cv-toolbar">
      <h1 class="cv-toolbar-title">Mon CV</h1>
      <button class="cv-download-btn" @click="exportPdf" :disabled="generating">
        {{ generating ? 'Génération…' : 'Télécharger en PDF' }}
      </button>
    </div>

    <!-- Classic CV document preview -->
    <div class="cv-sheet">

      <header class="cv-header">
        <h2 class="cv-name">{{ profileStore.profile.prenom }} {{ profileStore.profile.nom }}</h2>
        <p class="cv-titre">{{ profileStore.profile.titre }}</p>
        <p class="cv-contact">
          {{ [profileStore.profile.email, profileStore.profile.telephone, profileStore.profile.adresse].filter(Boolean).join('  •  ') }}
        </p>
      </header>

      <p v-if="profileStore.profile.bio" class="cv-bio">{{ profileStore.profile.bio }}</p>

      <div v-if="experiencesStore.experiences.length" class="cv-section">
        <h3 class="cv-section-title">Expérience professionnelle</h3>
        <div v-for="exp in experiencesStore.experiences" :key="exp.id" class="cv-entry">
          <div class="cv-entry-row">
            <span class="cv-entry-title">{{ exp.poste }}</span>
            <span class="cv-entry-dates">{{ exp.date_debut }} — {{ exp.date_fin }}</span>
          </div>
          <p class="cv-entry-sub">{{ exp.entreprise }}</p>
          <p class="cv-entry-desc">{{ exp.description }}</p>
        </div>
      </div>

      <div v-if="formationsStore.formations.length" class="cv-section">
        <h3 class="cv-section-title">Formation</h3>
        <div v-for="f in formationsStore.formations" :key="f.id" class="cv-entry">
          <div class="cv-entry-row">
            <span class="cv-entry-title">{{ f.diplome }}</span>
            <span class="cv-entry-dates">{{ f.date_debut }} — {{ f.date_fin }}</span>
          </div>
          <p class="cv-entry-sub">{{ f.etablissement }}</p>
          <p class="cv-entry-desc">{{ f.description }}</p>
        </div>
      </div>

      <div v-if="competencesStore.competences.length" class="cv-section">
        <h3 class="cv-section-title">Compétences</h3>
        <div class="cv-skills">
          <span v-for="c in competencesStore.competences" :key="c.id" class="cv-skill">
            {{ c.nom }}
          </span>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.cv-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
}

.cv-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.cv-toolbar-title {
  font-size: 1.5rem;
  font-family: var(--font-mono);
}

.cv-download-btn {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.6rem 1.3rem;
  border-radius: 6px;
  border: none;
  background: var(--bp-accent);
  color: #fff;
  cursor: pointer;
}

.cv-download-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Classic CV sheet — plain, print-like, minimal styling */
.cv-sheet {
  background: #ffffff;
  color: #1f1f1f;
  padding: 3rem 3rem 2.5rem;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  font-family: 'Georgia', 'Times New Roman', serif;
}

.cv-header {
  text-align: center;
  border-bottom: 2px solid #222;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.cv-name {
  font-family: 'Georgia', serif;
  font-size: 1.7rem;
  font-weight: 700;
  margin: 0 0 0.2rem;
  letter-spacing: 0.02em;
}

.cv-titre {
  font-size: 1rem;
  color: #555;
  margin: 0 0 0.5rem;
}

.cv-contact {
  font-size: 0.82rem;
  color: #666;
  margin: 0;
}

.cv-bio {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 1.75rem;
  text-align: center;
}

.cv-section {
  margin-bottom: 1.6rem;
}

.cv-section-title {
  font-family: 'Georgia', serif;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.3rem;
  margin-bottom: 0.9rem;
  color: #1f1f1f;
}

.cv-entry {
  margin-bottom: 1rem;
}

.cv-entry-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}

.cv-entry-title {
  font-weight: 700;
  font-size: 0.95rem;
}

.cv-entry-dates {
  font-size: 0.78rem;
  color: #777;
  white-space: nowrap;
}

.cv-entry-sub {
  font-style: italic;
  color: #555;
  font-size: 0.87rem;
  margin: 0.15rem 0 0.3rem;
}

.cv-entry-desc {
  font-size: 0.85rem;
  color: #333;
  line-height: 1.55;
  margin: 0;
}

.cv-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cv-skill {
  font-size: 0.8rem;
  padding: 0.25rem 0.7rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  color: #333;
}

@media (max-width: 600px) {
  .cv-sheet {
    padding: 2rem 1.5rem;
  }
  .cv-entry-row {
    flex-direction: column;
    gap: 0.1rem;
  }
}
</style>