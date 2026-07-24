// src/services/api.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
})

// Attach JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('lirex_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401
api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      const auth = useAuthStore()
      auth.logout()
      router.push('/login')
    }
    return Promise.reject(err)
  }
)

export default api

// Book service
export const bookService = {
  list: (params = {})         => api.get('/books', { params }),
  get: (id)                   => api.get(`/books/${id}`),
  featured: ()                => api.get('/books/featured'),
  show: (id)                  => api.get(`/books/${id}`),
  preview: (id)               => api.get(`/books/${id}/preview`),
  byAuthor: (authorId, p={})  => api.get(`/books/by-author/${authorId}`, { params: p }),
  reviews: (id)               => api.get(`/books/${id}/reviews`),
  review: (id, data)          => api.post(`/books/${id}/reviews`, data),
  readLink: (id)              => api.get(`/books/${id}/read-link`),
  ask: (id, data)             => api.post(`/books/${id}/ask`, data),
  askAI: (id, data)           => api.post(`/books/${id}/ask`, data),
  pages: (id)                 => api.get(`/books/${id}/pages`),
  page: (id, n)               => api.get(`/books/${id}/pages/${n}`),
  translate: (id, data)       => api.post(`/books/${id}/translate`, data),
  inLibrary: (id)             => api.get(`/books/${id}/in-library`),
}

// Order service
export const orderService = {
  initiate: (data)    => api.post('/orders/initiate', data),
  myOrders: (p={})    => api.get('/orders', { params: p }),
  downloadLink: (id)  => api.post(`/orders/${id}/download-link`),
  peexCountries: ()   => api.get('/payments/peex-countries'),
}

export const physicalOrderService = {
  myOrders:  (p={})  => api.get('/physical/orders', { params: p }),
  tracking:  (id)    => api.get(`/physical/orders/${id}/tracking`),
  initiate:  (data)  => api.post('/physical/orders', data),
}

// Library service
export const libraryService = {
  myLibrary: (p={})          => api.get('/library', { params: p }),
  wishlist: (p={})           => api.get('/library/wishlist', { params: p }),
  toggleWishlist: (bookId)   => api.post(`/library/wishlist/${bookId}`),
  updateProgress: (bookId, d)=> api.put(`/library/progress/${bookId}`, d),
}

// Wishlist service
export const wishlistService = {
  list: (p={})       => api.get('/library/wishlist', { params: p }),
  add: (bookId)      => api.post(`/library/wishlist/${bookId}`),
  remove: (bookId)   => api.delete(`/library/wishlist/${bookId}`),
  check: (bookId)    => api.get(`/library/wishlist/${bookId}/check`),
}

// Category service
export const categoryService = {
  list: () => api.get('/categories'),
}

// Author service
export const authorService = {
  dashboard: ()                      => api.get('/author/dashboard'),
  myBooks: (p={})                    => api.get('/author/books', { params: p }),
  submitBook: (formData, onProgress) => api.post('/author/books', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
      ? e => onProgress(Math.round(e.loaded * 100 / (e.total || 1)))
      : undefined,
  }),
  earnings: (p={})                   => api.get('/author/earnings', { params: p }),
}
