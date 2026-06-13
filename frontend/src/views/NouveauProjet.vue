<template>
  <div class="nouveau-projet">
    <h1>Nouveau Projet</h1>

    <div v-if="error" class="alert alert-error">{{ error }}</div>

    <form class="card" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Titre du projet</label>
        <input type="text" v-model="form.titre" required placeholder="Ex: Construction Villa..." />
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea v-model="form.description" rows="3" placeholder="Description du projet..."></textarea>
      </div>
      <div class="form-group">
        <label>Adresse</label>
        <input type="text" v-model="form.adresse" required placeholder="Adresse du chantier" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Date de début</label>
          <input type="date" v-model="form.dateDebut" required />
        </div>
        <div class="form-group">
          <label>Date de fin prévue</label>
          <input type="date" v-model="form.dateFinPrevue" required />
        </div>
      </div>
      <div class="form-group">
        <label>Budget total (FCFA)</label>
        <input type="number" v-model="form.budgetTotal" required min="0" placeholder="Ex: 50000000" />
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Création...' : 'Créer le projet' }}
        </button>
        <router-link to="/projets" class="btn btn-secondary">Annuler</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const error = ref('')
const loading = ref(false)

const form = reactive({
  titre: '', description: '', adresse: '',
  dateDebut: '', dateFinPrevue: '', budgetTotal: ''
})

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await api.post('/projets', form)
    router.push('/projets')
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la création'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.nouveau-projet h1 { margin-bottom: 1.5rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-actions { display: flex; gap: 1rem; margin-top: 1rem; }
</style>
