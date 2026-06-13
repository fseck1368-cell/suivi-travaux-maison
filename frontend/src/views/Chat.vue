<template>
  <div class="chat-page">
    <div class="chat-header">
      <h2>Messagerie du projet</h2>
      <router-link :to="`/projets/${projetId}`" class="btn btn-secondary btn-sm">Retour au projet</router-link>
    </div>

    <div class="chat-container card">
      <div class="messages-list" ref="messagesList">
        <div v-for="msg in messages" :key="msg._id"
             class="message" :class="{ own: msg.expediteur._id === userId }">
          <div class="message-header">
            <span class="sender">{{ msg.expediteur.prenom }} {{ msg.expediteur.nom }}</span>
            <span class="role badge badge-secondary">{{ msg.expediteur.role }}</span>
            <span class="time">{{ formatTime(msg.createdAt) }}</span>
          </div>
          <div class="message-content">{{ msg.contenu }}</div>
        </div>
        <p v-if="!messages.length" class="empty">Aucun message. Commencez la conversation !</p>
      </div>

      <div class="typing-indicator" v-if="typingUser">
        {{ typingUser }} est en train d'écrire...
      </div>

      <form class="message-form" @submit.prevent="sendMessage">
        <input type="text" v-model="newMessage" placeholder="Votre message..."
               @input="handleTyping" />
        <button type="submit" class="btn btn-primary" :disabled="!newMessage.trim()">Envoyer</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'
import { connectSocket, getSocket } from '../services/socket'

const route = useRoute()
const authStore = useAuthStore()
const projetId = route.params.projetId
const userId = authStore.user?.id

const messages = ref([])
const newMessage = ref('')
const typingUser = ref('')
const messagesList = ref(null)

let socket = null
let typingTimeout = null

onMounted(async () => {
  const { data } = await api.get(`/messages/${projetId}`)
  messages.value = data

  socket = getSocket() || connectSocket()
  if (socket) {
    socket.emit('join-projet', projetId)

    socket.on('message', (msg) => {
      messages.value.push(msg)
      scrollToBottom()
    })

    socket.on('typing', (data) => {
      typingUser.value = data.user
      clearTimeout(typingTimeout)
      typingTimeout = setTimeout(() => { typingUser.value = '' }, 2000)
    })
  }

  scrollToBottom()
})

onUnmounted(() => {
  if (socket) {
    socket.emit('leave-projet', projetId)
    socket.off('message')
    socket.off('typing')
  }
})

function sendMessage() {
  if (!newMessage.value.trim() || !socket) return
  socket.emit('message', {
    projetId,
    contenu: newMessage.value.trim()
  })
  newMessage.value = ''
}

function handleTyping() {
  if (socket) {
    socket.emit('typing', { projetId })
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesList.value) {
      messagesList.value.scrollTop = messagesList.value.scrollHeight
    }
  })
}

function formatTime(date) {
  return new Date(date).toLocaleString('fr-FR', {
    hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
  })
}
</script>

<style scoped>
.chat-page { max-width: 800px; }

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 70vh;
}

.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.message {
  padding: 0.75rem;
  background: var(--bg);
  border-radius: var(--radius);
  max-width: 75%;
}

.message.own {
  align-self: flex-end;
  background: #dbeafe;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}

.sender { font-weight: 600; font-size: 0.85rem; }
.time { font-size: 0.75rem; color: var(--text-light); margin-left: auto; }
.message-content { font-size: 0.9rem; }

.typing-indicator {
  padding: 0.3rem 1rem;
  font-size: 0.8rem;
  color: var(--text-light);
  font-style: italic;
}

.message-form {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid var(--border);
}

.message-form input {
  flex: 1;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.9rem;
}

.message-form input:focus {
  outline: none;
  border-color: var(--primary);
}

.empty { text-align: center; color: var(--text-light); margin: auto; }
.btn-sm { font-size: 0.8rem; padding: 0.4rem 0.8rem; }
</style>
