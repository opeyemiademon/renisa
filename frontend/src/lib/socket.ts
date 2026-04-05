import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      path: '/socket.io',
      autoConnect: false,
      transports: ['websocket', 'polling'],
    })
  }
  return socket
}

export function connectSocket(token: string) {
  const s = getSocket()
  if (!s.connected) s.connect()
  s.emit('auth', token)
  return s
}

export function disconnectSocket() {
  if (socket?.connected) socket.disconnect()
}
