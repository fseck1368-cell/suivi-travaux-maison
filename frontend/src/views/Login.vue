<template>
  <div class="auth-page">
    <div class="auth-card card">
      <h1>Connexion</h1>
      <p class="subtitle">Suivi Travaux Maison</p>

      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" required placeholder="votre@email.com" />
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input type="password" v-model="password" required placeholder="••••••••" />
        </div>
        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <p class="auth-link">
        Pas de compte ? <router-link to="/register">S'inscrire</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur de connexion'
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
  max-width: 400px;
  text-align: center;
}

.auth-card h1 {
  margin-bottom: 0.3rem;
}

.subtitle {
  color: var(--text-light);
  margin-bottom: 1.5rem;
}

.btn-block {
  width: 100%;
  justify-content: center;
  padding: 0.75rem;
}

.auth-link {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--text-light);
}

.auth-link a {
  color: var(--primary);
  text-decoration: none;
}
</style>
