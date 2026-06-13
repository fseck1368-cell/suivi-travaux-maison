<template>
  <div class="dashboard">
    <h1>Tableau de bord</h1>

    <div class="stats-grid" v-if="stats">
      <div class="stat-card card">
        <div class="stat-value">{{ stats.totalProjets }}</div>
        <div class="stat-label">Projets</div>
      </div>
      <div class="stat-card card">
        <div class="stat-value">{{ stats.projetsEnCours }}</div>
        <div class="stat-label">En cours</div>
      </div>
      <div class="stat-card card">
        <div class="stat-value">{{ stats.avancementMoyen }}%</div>
        <div class="stat-label">Avancement moyen</div>
      </div>
      <div class="stat-card card">
        <div class="stat-value">{{ formatMoney(stats.totalBudget) }}</div>
        <div class="stat-label">Budget total</div>
      </div>
      <div class="stat-card card">
        <div class="stat-value">{{ formatMoney(stats.totalDepenses) }}</div>
        <div class="stat-label">Dépensé</div>
      </div>
      <div class="stat-card card">
        <div class="stat-value">{{ stats.tachesTerminees }}/{{ stats.totalTaches }}</div>
        <div class="stat-label">Tâches terminées</div>
      </div>
    </div>

    <div class="section" v-if="projets.length">
      <h2>Projets récents</h2>
      <div class="projets-list">
        <div class="projet-item card" v-for="projet in projets" :key="projet._id">
          <div class="projet-header">
            <h3>{{ projet.titre }}</h3>
            <span class="badge" :class="statutBadge(projet.statut)">{{ statutLabel(projet.statut) }}</span>
          </div>
          <p class="projet-adresse">{{ projet.adresse }}</p>
          <div class="progress-section">
            <div class="progress-info">
              <span>Avancement</span>
              <span>{{ projet.avancementGlobal }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-bar-fill" :class="progressClass(projet.avancementGlobal)"
                   :style="{ width: projet.avancementGlobal + '%' }"></div>
            </div>
          </div>
          <router-link :to="`/projets/${projet._id}`" class="btn btn-primary btn-sm">
            Voir détails
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const stats = ref(null)
const projets = ref([])

onMounted(async () => {
  try {
    const [statsRes, projetsRes] = await Promise.all([
      api.get('/projets/dashboard'),
      api.get('/projets')
    ])
    stats.value = statsRes.data
    projets.value = projetsRes.data.slice(0, 5)
  } catch (error) {
    console.error(error)
  }
})

function formatMoney(value) {
  if (!value) return '0 FCFA'
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
.dashboard h1 { margin-bottom: 1.5rem; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card { text-align: center; }
.stat-value { font-size: 1.8rem; font-weight: 700; color: var(--primary); }
.stat-label { color: var(--text-light); font-size: 0.85rem; margin-top: 0.3rem; }

.section h2 { margin-bottom: 1rem; }

.projets-list { display: grid; gap: 1rem; }

.projet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.projet-header h3 { font-size: 1.1rem; }
.projet-adresse { color: var(--text-light); font-size: 0.85rem; margin-bottom: 0.75rem; }

.progress-section { margin-bottom: 1rem; }
.progress-info { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.3rem; }

.btn-sm { font-size: 0.8rem; padding: 0.4rem 0.8rem; }
</style>
