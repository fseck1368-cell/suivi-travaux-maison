<template>
  <div class="projets-page">
    <div class="page-header">
      <h1>Mes Projets</h1>
      <router-link to="/projets/nouveau" class="btn btn-primary" v-if="canCreate">
        + Nouveau Projet
      </router-link>
    </div>

    <div class="projets-grid">
      <div class="projet-card card" v-for="projet in projets" :key="projet._id">
        <div class="projet-header">
          <h3>{{ projet.titre }}</h3>
          <span class="badge" :class="statutBadge(projet.statut)">{{ statutLabel(projet.statut) }}</span>
        </div>
        <p class="adresse">{{ projet.adresse }}</p>
        <div class="projet-meta">
          <span>Budget: {{ formatMoney(projet.budgetTotal) }}</span>
        </div>
        <div class="progress-section">
          <div class="progress-info">
            <span>{{ projet.avancementGlobal }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill" :class="progressClass(projet.avancementGlobal)"
                 :style="{ width: projet.avancementGlobal + '%' }"></div>
          </div>
        </div>
        <div class="projet-actions">
          <router-link :to="`/projets/${projet._id}`" class="btn btn-primary btn-sm">Détails</router-link>
          <router-link :to="`/chat/${projet._id}`" class="btn btn-secondary btn-sm">Chat</router-link>
        </div>
      </div>
    </div>

    <p v-if="!projets.length" class="empty">Aucun projet pour le moment.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const authStore = useAuthStore()
const projets = ref([])
const canCreate = computed(() => ['maitre-ouvrage', 'maitre-oeuvre'].includes(authStore.userRole))

onMounted(async () => {
  const { data } = await api.get('/projets')
  projets.value = data
})

function formatMoney(value) {
  return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
}

function statutLabel(statut) {
  const labels = { planification: 'Planification', en_cours: 'En cours', suspendu: 'Suspendu', termine: 'Terminé' }
  return labels[statut] || statut
}

function statutBadge(statut) {
  const classes = { planification: 'badge-secondary', en_cours: 'badge-info', suspendu: 'badge-warning', termine: 'badge-success' }
  return classes[statut] || 'badge-secondary'
}

function progressClass(value) {
  if (value >= 75) return 'high'
  if (value >= 40) return 'medium'
  return 'low'
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.projets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.projet-card h3 { font-size: 1.1rem; }
.projet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.adresse { color: var(--text-light); font-size: 0.85rem; margin-bottom: 0.5rem; }
.projet-meta { font-size: 0.85rem; color: var(--text-light); margin-bottom: 0.75rem; }
.progress-section { margin-bottom: 1rem; }
.progress-info { font-size: 0.85rem; margin-bottom: 0.3rem; }
.projet-actions { display: flex; gap: 0.5rem; }
.btn-sm { font-size: 0.8rem; padding: 0.4rem 0.8rem; }
.empty { text-align: center; color: var(--text-light); margin-top: 3rem; }
</style>
