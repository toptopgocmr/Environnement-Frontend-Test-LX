import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import router from './router'
import i18n from './i18n'
import App from './App.vue'
import './assets/main.css'

// Après un redéploiement, les anciens chunks JS (hash différent) n'existent
// plus sur le serveur : si un onglet était resté ouvert, un import dynamique
// (lazy route) échoue silencieusement et la page reste blanche (sans navbar
// ni footer, puisque AppLayout est rendu à l'intérieur du composant en échec).
// On force un rechargement complet (une seule fois) pour récupérer les bons
// fichiers, au lieu de laisser une page cassée.
window.addEventListener('vite:preloadError', () => {
  if (sessionStorage.getItem('lirex_reloaded_stale_chunk')) return
  sessionStorage.setItem('lirex_reloaded_stale_chunk', '1')
  window.location.reload()
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: toast.POSITION.BOTTOM_RIGHT,
})

app.mount('#app')
