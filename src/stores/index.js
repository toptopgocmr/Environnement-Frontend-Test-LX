// src/stores/index.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

// ─── Auth store ───────────────────────────────────────────────────────────────
export const useAuthStore = defineStore('auth', () => {
  const user  = ref(JSON.parse(localStorage.getItem('lirex_user') || 'null'))
  const token = ref(localStorage.getItem('lirex_token') || null)

  const isLoggedIn      = computed(() => !!token.value)
  const isAuthor        = computed(() => user.value?.role === 'author')
  const isAdmin         = computed(() => user.value?.role === 'admin')
  const hasSubscription = computed(() => user.value?.has_active_subscription)

  async function login(credentials) {
    const { data } = await api.post('/auth/login', credentials)
    token.value = data.data.token
    user.value  = data.data.user
    localStorage.setItem('lirex_token', token.value)
    localStorage.setItem('lirex_user', JSON.stringify(user.value))
    return data
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register', payload)
    token.value = data.data.token
    user.value  = data.data.user
    localStorage.setItem('lirex_token', token.value)
    localStorage.setItem('lirex_user', JSON.stringify(user.value))
    return data
  }

  async function fetchMe() {
    const { data } = await api.get('/auth/me')
    user.value = data.data
    localStorage.setItem('lirex_user', JSON.stringify(user.value))
  }

  function logout() {
    api.post('/auth/logout').catch(() => {})
    token.value = null
    user.value  = null
    localStorage.removeItem('lirex_token')
    localStorage.removeItem('lirex_user')
  }

  return { user, token, isLoggedIn, isAuthor, isAdmin, hasSubscription, login, register, fetchMe, logout }
})

// ─── Cart store ───────────────────────────────────────────────────────────────
export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('lirex_cart') || '[]'))

  function addToCart(book) {
    if (!items.value.find(i => i.id === book.id)) {
      items.value.push(book)
      persist()
    }
  }

  function removeFromCart(bookId) {
    items.value = items.value.filter(i => i.id !== bookId)
    persist()
  }

  // aliases used in some views
  const add    = addToCart
  const remove = removeFromCart

  function clear() { items.value = []; persist() }
  function persist() { localStorage.setItem('lirex_cart', JSON.stringify(items.value)) }

  return { items, add, addToCart, remove, removeFromCart, clear }
})
