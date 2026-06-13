import { io } from 'socket.io-client'

let socket = null

export function connectSocket() {
  const token = localStorage.getItem('token')
  if (!token) return null

  socket = io('http://localhost:5000', {
    auth: { token }
  })

  socket.on('connect', () => {
    console.log('Socket connecté')
  })

  socket.on('connect_error', (err) => {
    console.error('Erreur socket:', err.message)
  })

  return socket
}

export function getSocket() {
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
