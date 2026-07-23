// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import LoginView    from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import HomeView     from '@/views/HomeView.vue'

const routes = [
  { path: '/',                  component: HomeView,                                                 name: 'home' },
  { path: '/books',             component: () => import('@/views/BooksView.vue'),                   name: 'books' },
  { path: '/books/:id',         component: () => import('@/views/BookDetailView.vue'),              name: 'book-detail' },
  { path: '/search',            component: () => import('@/views/SearchView.vue'),                  name: 'search' },
  { path: '/academic',          component: () => import('@/views/AcademicSearchView.vue'),          name: 'academic' },
  { path: '/categories',        component: () => import('@/views/CategoriesView.vue'),              name: 'categories' },
  { path: '/authors/:id',       component: () => import('@/views/AuthorProfileView.vue'),           name: 'author-profile' },
  { path: '/plans',             component: () => import('@/views/PlansView.vue'),                   name: 'plans' },
  { path: '/login',             component: LoginView,                                                name: 'login',    meta: { guestOnly: true } },
  { path: '/register',          component: RegisterView,                                             name: 'register', meta: { guestOnly: true } },
  { path: '/library',           component: () => import('@/views/reader/LibraryView.vue'),          name: 'library',  meta: { requiresAuth: true } },
  { path: '/library/read/:id',  component: () => import('@/views/reader/ReaderView.vue'),           name: 'reader',   meta: { requiresAuth: true } },
  { path: '/cart',              component: () => import('@/views/CartView.vue'),                    name: 'cart' },
  { path: '/wishlist',          component: () => import('@/views/reader/WishlistView.vue'),         name: 'wishlist', meta: { requiresAuth: true } },
  { path: '/orders',            component: () => import('@/views/reader/OrdersView.vue'),           name: 'orders',   meta: { requiresAuth: true } },
  { path: '/profile',           component: () => import('@/views/reader/ProfileView.vue'),          name: 'profile',  meta: { requiresAuth: true } },
  { path: '/checkout/:bookId',  component: () => import('@/views/reader/CheckoutView.vue'),         name: 'checkout', meta: { requiresAuth: true } },
  { path: '/physical/:id',      component: () => import('@/views/reader/PhysicalOrderView.vue'),    name: 'physical', meta: { requiresAuth: true } },
  { path: '/tracking/:orderId', component: () => import('@/views/reader/TrackingView.vue'),         name: 'tracking', meta: { requiresAuth: true } },
  { path: '/chat',              component: () => import('@/views/chat/ChatView.vue'),               name: 'chat',     meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*',   component: () => import('@/views/NotFoundView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to, from, saved) => saved || { top: 0 },
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn)
    return next({ name: 'login', query: { redirect: to.fullPath } })
  if (to.meta.guestOnly && auth.isLoggedIn)
    return next({ name: 'home' })
  next()
})

export default router
