<template>
  <div class="layout">
    <nav class="sidebar">
      <div class="sidebar-header">
        <h2>Suivi Travaux</h2>
      </div>
      <ul class="nav-links">
        <li><router-link to="/">Dashboard</router-link></li>
        <li><router-link to="/projets">Projets</router-link></li>
      </ul>
      <div class="sidebar-footer">
        <div class="user-info">
          <span class="user-name">{{ user?.prenom }} {{ user?.nom }}</span>
          <span class="user-role badge badge-info">{{ user?.role }}</span>
        </div>
        <button class="btn btn-secondary" @click="handleLogout">Déconnexion</button>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { disconnectSocket } from '../services/socket'
import { computed } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

function handleLogout() {
  disconnectSocket()
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background: var(--text);
  color: white;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
}

.sidebar-header h2 {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.nav-links {
  list-style: none;
  flex: 1;
}

.nav-links li { margin-bottom: 0.5rem; }

.nav-links a {
  display: block;
  padding: 0.6rem 1rem;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  border-radius: var(--radius);
  transition: all 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background: rgba(255,255,255,0.1);
  color: white;
}

.sidebar-footer {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 1rem;
}

.user-info {
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.user-name {
  font-weight: 500;
  font-size: 0.9rem;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
}
</style>
