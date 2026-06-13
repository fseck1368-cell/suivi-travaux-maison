<template>
  <div class="auth-page">
    <div class="auth-card card">
      <h1>Inscription</h1>
      <p class="subtitle">Créer un compte</p>

      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <form @submit.prevent="handleRegister">
        <div class="form-row">
          <div class="form-group">
            <label>Nom</label>
            <input type="text" v-model="form.nom" required />
          </div>
          <div class="form-group">
            <label>Prénom</label>
            <input type="text" v-model="form.prenom" required />
          </div>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="form.email" required />
        </div>
        <div class="form-group">
          <label>Téléphone</label>
          <input type="tel" v-model="form.telephone" />
        </div>
        <div class="form-group">
          <label>Rôle</label>
          <select v-model="form.role" required>
            <option value="">-- Choisir --</option>
            <option value="maitre-ouvrage">Maître d'ouvrage</option>
            <option value="maitre-oeuvre">Maître d'oeuvre</option>
            <option value="artisan">Artisan</option>
          </select>
        </div>
        <div class="form-group" v-if="form.role === 'artisan'">
          <label>Spécialité</label>
          <input type="text" v-model="form.specialite" placeholder="Ex: Maçonnerie, Plomberie..." />
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input type="password" v-model="form.password" required minlength="6" />
        </div>
        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          {{ loading ? 'Inscription...' : "S'inscrire" }}
        </button>
      </form>

      <p class="auth-link">
        Déjà un compte ? <router-link to="/login">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  nom: '', prenom: '', email: '', telephone: '',
  role: '', specialite: '', password: ''
})
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await authStore.register(form)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || "Erreur lors de l'inscription"
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
}

.auth-card {
  width: 100%;
  max-width: 450px;
}

.auth-card h1 { text-align: center; margin-bottom: 0.3rem; }
.subtitle { text-align: center; color: var(--text-light); margin-bottom: 1.5rem; }

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.btn-block { width: 100%; justify-content: center; padding: 0.75rem; }
.auth-link { margin-top: 1rem; font-size: 0.9rem; color: var(--text-light); text-align: center; }
.auth-link a { color: var(--primary); text-decoration: none; }
</style>
