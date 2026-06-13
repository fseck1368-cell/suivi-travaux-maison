<template>
  <div class="projet-detail" v-if="projet">
    <div class="page-header">
      <div>
        <h1>{{ projet.titre }}</h1>
        <p class="adresse">{{ projet.adresse }}</p>
      </div>
      <div class="header-actions">
        <select v-model="projet.statut" @change="updateStatut" class="statut-select" v-if="canManage">
          <option value="planification">Planification</option>
          <option value="en_cours">En cours</option>
          <option value="suspendu">Suspendu</option>
          <option value="termine">Terminé</option>
        </select>
        <span v-else class="badge" :class="statutBadge(projet.statut)">{{ statutLabel(projet.statut) }}</span>
      </div>
    </div>

    <!-- Avancement global -->
    <div class="card avancement-card">
      <h3>Avancement global</h3>
      <div class="avancement-display">
        <span class="avancement-value">{{ projet.avancementGlobal }}%</span>
        <div class="progress-bar large">
          <div class="progress-bar-fill" :class="progressClass(projet.avancementGlobal)"
               :style="{ width: projet.avancementGlobal + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- Budget -->
    <div class="card budget-card" v-if="projet.budget">
      <h3>Budget</h3>
      <div class="budget-grid">
        <div><span class="label">Total</span><span class="value">{{ formatMoney(projet.budget.total) }}</span></div>
        <div><span class="label">Dépensé</span><span class="value danger">{{ formatMoney(projet.budget.depense) }}</span></div>
        <div><span class="label">Restant</span><span class="value success">{{ formatMoney(projet.budget.restant) }}</span></div>
      </div>
    </div>

    <!-- Notifications temps réel -->
    <div class="card notifications" v-if="notifications.length">
      <h3>Activité en direct</h3>
      <div class="notif-list">
        <div class="notif-item" v-for="(notif, i) in notifications" :key="i">
          <span class="notif-badge">LIVE</span>
          {{ notif.message }}
        </div>
      </div>
    </div>

    <!-- PHASES -->
    <div class="card">
      <div class="section-header">
        <h3>Phases du projet</h3>
        <button class="btn btn-primary btn-sm" @click="showPhaseForm = !showPhaseForm" v-if="canManage">
          + Phase
        </button>
      </div>

      <!-- Formulaire ajout phase -->
      <form v-if="showPhaseForm" class="inline-form" @submit.prevent="createPhase">
        <div class="form-row">
          <div class="form-group">
            <label>Titre</label>
            <input type="text" v-model="newPhase.titre" required placeholder="Ex: Fondations" />
          </div>
          <div class="form-group">
            <label>Ordre</label>
            <input type="number" v-model="newPhase.ordre" required min="1" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Date début</label>
            <input type="date" v-model="newPhase.dateDebut" />
          </div>
          <div class="form-group">
            <label>Date fin</label>
            <input type="date" v-model="newPhase.dateFin" />
          </div>
          <div class="form-group">
            <label>Budget prévu (FCFA)</label>
            <input type="number" v-model="newPhase.budgetPrevu" min="0" />
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-success btn-sm">Ajouter</button>
          <button type="button" class="btn btn-secondary btn-sm" @click="showPhaseForm = false">Annuler</button>
        </div>
      </form>

      <div class="phases-list">
        <div class="phase-item" v-for="phase in projet.phases" :key="phase._id">
          <div class="phase-header">
            <span class="phase-titre">{{ phase.ordre }}. {{ phase.titre }}</span>
            <span class="badge" :class="statutBadge(phase.statut)">{{ phase.avancement }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill" :class="progressClass(phase.avancement)"
                 :style="{ width: phase.avancement + '%' }"></div>
          </div>
        </div>
      </div>
      <p v-if="!projet.phases?.length" class="empty-text">Aucune phase créée.</p>
    </div>

    <!-- TACHES -->
    <div class="card">
      <div class="section-header">
        <h3>Tâches</h3>
        <button class="btn btn-primary btn-sm" @click="showTacheForm = !showTacheForm" v-if="canManage">
          + Tâche
        </button>
      </div>

      <!-- Formulaire ajout tâche -->
      <form v-if="showTacheForm" class="inline-form" @submit.prevent="createTache">
        <div class="form-row">
          <div class="form-group">
            <label>Titre</label>
            <input type="text" v-model="newTache.titre" required placeholder="Ex: Coulage semelles" />
          </div>
          <div class="form-group">
            <label>Phase</label>
            <select v-model="newTache.phase" required>
              <option value="">-- Choisir --</option>
              <option v-for="p in projet.phases" :key="p._id" :value="p._id">{{ p.titre }}</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Artisan</label>
            <select v-model="newTache.artisan">
              <option value="">-- Non assigné --</option>
              <option v-for="a in artisans" :key="a._id" :value="a._id">{{ a.prenom }} {{ a.nom }} ({{ a.specialite }})</option>
            </select>
          </div>
          <div class="form-group">
            <label>Priorité</label>
            <select v-model="newTache.priorite">
              <option value="basse">Basse</option>
              <option value="moyenne">Moyenne</option>
              <option value="haute">Haute</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="newTache.description" rows="2" placeholder="Description optionnelle..."></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-success btn-sm">Ajouter</button>
          <button type="button" class="btn btn-secondary btn-sm" @click="showTacheForm = false">Annuler</button>
        </div>
      </form>

      <table v-if="projet.taches?.length">
        <thead>
          <tr>
            <th>Tâche</th>
            <th>Artisan</th>
            <th>Priorité</th>
            <th>Avancement</th>
            <th v-if="canUpdateTache">Modifier %</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tache in projet.taches" :key="tache._id">
            <td>{{ tache.titre }}</td>
            <td>{{ tache.artisan ? `${tache.artisan.prenom} ${tache.artisan.nom}` : 'Non assigné' }}</td>
            <td><span class="badge" :class="prioriteBadge(tache.priorite)">{{ tache.priorite }}</span></td>
            <td>
              <div class="tache-avancement">
                <div class="progress-bar small">
                  <div class="progress-bar-fill" :class="progressClass(tache.avancement)"
                       :style="{ width: tache.avancement + '%' }"></div>
                </div>
                <span>{{ tache.avancement }}%</span>
              </div>
            </td>
            <td v-if="canUpdateTache">
              <input type="range" min="0" max="100" step="5"
                     :value="tache.avancement"
                     @change="updateAvancement(tache, $event)" />
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!projet.taches?.length" class="empty-text">Aucune tâche créée.</p>
    </div>

    <!-- DEPENSES -->
    <div class="card">
      <div class="section-header">
        <h3>Dépenses</h3>
        <button class="btn btn-primary btn-sm" @click="showDepenseForm = !showDepenseForm" v-if="canManage">
          + Dépense
        </button>
      </div>

      <!-- Formulaire ajout dépense -->
      <form v-if="showDepenseForm" class="inline-form" @submit.prevent="createDepense">
        <div class="form-row">
          <div class="form-group">
            <label>Titre</label>
            <input type="text" v-model="newDepense.titre" required placeholder="Ex: Achat ciment" />
          </div>
          <div class="form-group">
            <label>Montant (FCFA)</label>
            <input type="number" v-model="newDepense.montant" required min="1" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Catégorie</label>
            <select v-model="newDepense.categorie" required>
              <option value="">-- Choisir --</option>
              <option value="materiaux">Matériaux</option>
              <option value="main_oeuvre">Main d'oeuvre</option>
              <option value="equipement">Équipement</option>
              <option value="transport">Transport</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div class="form-group">
            <label>Phase (optionnel)</label>
            <select v-model="newDepense.phase">
              <option value="">-- Aucune --</option>
              <option v-for="p in projet.phases" :key="p._id" :value="p._id">{{ p.titre }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Date</label>
            <input type="date" v-model="newDepense.date" />
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="newDepense.description" rows="2" placeholder="Détails..."></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-success btn-sm">Ajouter</button>
          <button type="button" class="btn btn-secondary btn-sm" @click="showDepenseForm = false">Annuler</button>
        </div>
      </form>

      <table v-if="depenses.length">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Catégorie</th>
            <th>Montant</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dep in depenses" :key="dep._id">
            <td>{{ dep.titre }}</td>
            <td><span class="badge badge-secondary">{{ dep.categorie }}</span></td>
            <td>{{ formatMoney(dep.montant) }}</td>
            <td>{{ formatDate(dep.date) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="!depenses.length" class="empty-text">Aucune dépense enregistrée.</p>
    </div>

    <!-- RAPPORTS JOURNALIERS -->
    <div class="card">
      <div class="section-header">
        <h3>Rapports journaliers</h3>
        <button class="btn btn-primary btn-sm" @click="showRapportForm = !showRapportForm" v-if="canReport">
          + Rapport
        </button>
      </div>

      <!-- Formulaire ajout rapport -->
      <form v-if="showRapportForm" class="inline-form" @submit.prevent="createRapport">
        <div class="form-group">
          <label>Travaux réalisés</label>
          <textarea v-model="newRapport.travauxRealises" rows="3" required placeholder="Décrivez les travaux du jour..."></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Difficultés rencontrées</label>
            <textarea v-model="newRapport.difficultes" rows="2" placeholder="Optionnel..."></textarea>
          </div>
          <div class="form-group">
            <label>Météo</label>
            <select v-model="newRapport.meteo">
              <option value="ensoleille">Ensoleillé</option>
              <option value="nuageux">Nuageux</option>
              <option value="pluie">Pluie</option>
              <option value="vent_fort">Vent fort</option>
              <option value="journee_perdue">Journée perdue</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Observations</label>
          <textarea v-model="newRapport.observations" rows="2" placeholder="Notes supplémentaires..."></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-success btn-sm">Envoyer le rapport</button>
          <button type="button" class="btn btn-secondary btn-sm" @click="showRapportForm = false">Annuler</button>
        </div>
      </form>

      <div class="rapports-list" v-if="rapports.length">
        <div class="rapport-item" v-for="rapport in rapports" :key="rapport._id">
          <div class="rapport-header">
            <span class="rapport-date">{{ formatDate(rapport.date) }}</span>
            <span class="rapport-auteur">{{ rapport.auteur?.prenom }} {{ rapport.auteur?.nom }}</span>
            <span class="badge badge-info">{{ meteoLabel(rapport.meteo) }}</span>
          </div>
          <p class="rapport-contenu">{{ rapport.travauxRealises }}</p>
          <p class="rapport-difficultes" v-if="rapport.difficultes">
            Difficultés : {{ rapport.difficultes }}
          </p>
        </div>
      </div>
      <p v-if="!rapports.length" class="empty-text">Aucun rapport journalier.</p>
    </div>

    <!-- Actions -->
    <div class="actions-bar">
      <router-link :to="`/chat/${projet._id}`" class="btn btn-primary">Messagerie</router-link>
      <router-link to="/projets" class="btn btn-secondary">Retour</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'
import { connectSocket, getSocket } from '../services/socket'

const route = useRoute()
const authStore = useAuthStore()
const projet = ref(null)
const depenses = ref([])
const rapports = ref([])
const artisans = ref([])
const notifications = ref([])

const showPhaseForm = ref(false)
const showTacheForm = ref(false)
const showDepenseForm = ref(false)
const showRapportForm = ref(false)

const newPhase = reactive({ titre: '', ordre: 1, dateDebut: '', dateFin: '', budgetPrevu: 0 })
const newTache = reactive({ titre: '', phase: '', artisan: '', priorite: 'moyenne', description: '' })
const newDepense = reactive({ titre: '', montant: '', categorie: '', phase: '', date: '', description: '' })
const newRapport = reactive({ travauxRealises: '', difficultes: '', meteo: 'ensoleille', observations: '' })

const canManage = computed(() => ['maitre-ouvrage', 'maitre-oeuvre'].includes(authStore.userRole))
const canUpdateTache = computed(() => ['artisan', 'maitre-oeuvre'].includes(authStore.userRole))
const canReport = computed(() => ['artisan', 'maitre-oeuvre', 'maitre-ouvrage'].includes(authStore.userRole))

let socket = null

onMounted(async () => {
  await loadAll()
  await loadArtisans()

  socket = getSocket() || connectSocket()
  if (socket) {
    socket.emit('join-projet', route.params.id)

    socket.on('avancement', (data) => {
      notifications.value.unshift({ message: `${data.artisan} a mis à jour une tâche: ${data.avancement}%` })
      if (notifications.value.length > 5) notifications.value.pop()
      loadAll()
    })

    socket.on('tache-terminee', (data) => {
      notifications.value.unshift({ message: `${data.artisan} a terminé: ${data.titre}` })
      loadAll()
    })
  }
})

onUnmounted(() => {
  if (socket) {
    socket.emit('leave-projet', route.params.id)
    socket.off('avancement')
    socket.off('tache-terminee')
  }
})

async function loadAll() {
  const { data } = await api.get(`/projets/${route.params.id}`)
  projet.value = data

  try {
    const depRes = await api.get(`/depenses/projet/${route.params.id}`)
    depenses.value = depRes.data.depenses || []
  } catch { depenses.value = [] }

  try {
    const rapRes = await api.get(`/rapports/projet/${route.params.id}`)
    rapports.value = rapRes.data || []
  } catch { rapports.value = [] }
}

async function loadArtisans() {
  try {
    const { data } = await api.get('/users/artisans')
    artisans.value = data
  } catch { artisans.value = [] }
}

async function updateStatut() {
  await api.put(`/projets/${route.params.id}`, { statut: projet.value.statut })
}

async function createPhase() {
  await api.post('/phases', { ...newPhase, projet: route.params.id })
  Object.assign(newPhase, { titre: '', ordre: (projet.value.phases?.length || 0) + 2, dateDebut: '', dateFin: '', budgetPrevu: 0 })
  showPhaseForm.value = false
  await loadAll()
}

async function createTache() {
  await api.post('/taches', { ...newTache, projet: route.params.id })
  Object.assign(newTache, { titre: '', phase: '', artisan: '', priorite: 'moyenne', description: '' })
  showTacheForm.value = false
  await loadAll()
}

async function createDepense() {
  const payload = { ...newDepense, projet: route.params.id }
  if (!payload.phase) delete payload.phase
  if (!payload.date) delete payload.date
  await api.post('/depenses', payload)
  Object.assign(newDepense, { titre: '', montant: '', categorie: '', phase: '', date: '', description: '' })
  showDepenseForm.value = false
  await loadAll()
}

async function createRapport() {
  await api.post('/rapports', { ...newRapport, projet: route.params.id })
  Object.assign(newRapport, { travauxRealises: '', difficultes: '', meteo: 'ensoleille', observations: '' })
  showRapportForm.value = false
  await loadAll()
}

async function updateAvancement(tache, event) {
  const newValue = parseInt(event.target.value)
  await api.put(`/taches/${tache._id}`, { avancement: newValue })
  if (socket) {
    socket.emit('avancement', { projetId: route.params.id, tacheId: tache._id, avancement: newValue })
    if (newValue === 100) {
      socket.emit('tache-terminee', { projetId: route.params.id, tacheId: tache._id, titre: tache.titre })
    }
  }
  await loadAll()
}

function formatMoney(value) {
  if (!value) return '0 FCFA'
  return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR')
}

function statutLabel(statut) {
  const labels = { planification: 'Planification', en_cours: 'En cours', suspendu: 'Suspendu', termine: 'Terminé', a_faire: 'A faire', terminee: 'Terminée' }
  return labels[statut] || statut
}

function statutBadge(statut) {
  const classes = { planification: 'badge-secondary', en_cours: 'badge-info', suspendu: 'badge-warning', termine: 'badge-success', a_faire: 'badge-secondary', terminee: 'badge-success' }
  return classes[statut] || 'badge-secondary'
}

function prioriteBadge(p) {
  return { haute: 'badge-danger', moyenne: 'badge-warning', basse: 'badge-info' }[p] || 'badge-secondary'
}

function progressClass(value) {
  if (value >= 75) return 'high'
  if (value >= 40) return 'medium'
  return 'low'
}

function meteoLabel(m) {
  const labels = { ensoleille: 'Ensoleillé', nuageux: 'Nuageux', pluie: 'Pluie', vent_fort: 'Vent fort', journee_perdue: 'Journée perdue' }
  return labels[m] || m
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
.adresse { color: var(--text-light); font-size: 0.9rem; }
.header-actions { display: flex; align-items: center; gap: 0.5rem; }

.statut-select {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.9rem;
}

.avancement-card .avancement-display { display: flex; align-items: center; gap: 1rem; margin-top: 0.75rem; }
.avancement-value { font-size: 2rem; font-weight: 700; color: var(--primary); min-width: 80px; }
.progress-bar.large { height: 12px; flex: 1; }

.budget-card .budget-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 0.75rem; }
.budget-grid > div { text-align: center; }
.budget-grid .label { display: block; font-size: 0.8rem; color: var(--text-light); }
.budget-grid .value { display: block; font-size: 1.2rem; font-weight: 600; margin-top: 0.3rem; }
.budget-grid .value.danger { color: var(--danger); }
.budget-grid .value.success { color: var(--success); }

.card { margin-bottom: 1.5rem; }
.card h3 { margin-bottom: 0.75rem; }

.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }

.inline-form {
  background: var(--bg);
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 1rem;
  border: 1px dashed var(--border);
}

.form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem; }
.form-actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; }

.phases-list { display: grid; gap: 0.75rem; }
.phase-item { padding: 0.75rem; background: var(--bg); border-radius: var(--radius); }
.phase-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
.phase-titre { font-weight: 500; }

.tache-avancement { display: flex; align-items: center; gap: 0.5rem; }
.progress-bar.small { width: 80px; height: 6px; }

.notifications { border-left: 3px solid var(--success); }
.notif-list { display: grid; gap: 0.5rem; }
.notif-item { font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; }
.notif-badge { background: var(--success); color: white; font-size: 0.65rem; padding: 0.1rem 0.4rem; border-radius: 3px; font-weight: 700; }

.rapports-list { display: grid; gap: 1rem; }
.rapport-item { padding: 1rem; background: var(--bg); border-radius: var(--radius); }
.rapport-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
.rapport-date { font-weight: 600; }
.rapport-auteur { color: var(--text-light); font-size: 0.85rem; }
.rapport-contenu { font-size: 0.9rem; }
.rapport-difficultes { font-size: 0.85rem; color: var(--warning); margin-top: 0.3rem; font-style: italic; }

.actions-bar { display: flex; gap: 1rem; }
.btn-sm { font-size: 0.8rem; padding: 0.4rem 0.8rem; }
.empty-text { color: var(--text-light); font-size: 0.85rem; font-style: italic; }

input[type="range"] { width: 100px; cursor: pointer; }
</style>
