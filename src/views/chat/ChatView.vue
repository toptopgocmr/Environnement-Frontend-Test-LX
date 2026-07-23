<template>
  <AppLayout>
    <div class="flex h-[calc(100vh-64px)] bg-gray-50">

      <!-- Liste des conversations -->
      <aside class="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div class="p-4 border-b border-gray-100">
          <h2 class="font-bold text-gray-800 text-lg">Messages</h2>
          <p v-if="totalUnread > 0" class="text-xs text-blue-600 mt-0.5">{{ totalUnread }} non lu(s)</p>
        </div>

        <div v-if="loadingConvs" class="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Chargement...
        </div>

        <div v-else-if="conversations.length === 0" class="flex-1 flex items-center justify-center text-gray-400 text-sm p-6 text-center">
          Aucune conversation. Ajoutez un livre à votre panier pour démarrer une discussion avec l'auteur.
        </div>

        <div v-else class="flex-1 overflow-y-auto">
          <div
            v-for="conv in conversations"
            :key="conv.id"
            @click="selectConversation(conv)"
            class="flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors"
            :class="{ 'bg-blue-50': selectedConv?.id === conv.id }"
          >
            <div class="relative flex-shrink-0">
              <img
                :src="getOtherParticipant(conv)?.user?.avatar_url || avatarFallback(getOtherParticipant(conv)?.user?.name)"
                class="w-10 h-10 rounded-full object-cover"
              />
              <span v-if="conv.unread_count > 0" class="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{ conv.unread_count > 9 ? '9+' : conv.unread_count }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <p class="font-medium text-sm text-gray-900 truncate">
                  {{ getOtherParticipant(conv)?.user?.name || 'Support LireX' }}
                </p>
                <span class="text-xs text-gray-400 flex-shrink-0 ml-2">
                  {{ formatTime(conv.last_message_at) }}
                </span>
              </div>
              <p class="text-xs text-gray-500 truncate mt-0.5">{{ conv.subject || conv.book?.title || '—' }}</p>
              <p class="text-xs text-gray-400 truncate mt-0.5">
                {{ conv.last_message?.body || 'Aucun message' }}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Zone de messages -->
      <main class="flex-1 flex flex-col">
        <div v-if="!selectedConv" class="flex-1 flex items-center justify-center text-gray-400">
          <div class="text-center">
            <div class="text-5xl mb-4">💬</div>
            <p class="font-medium text-gray-600">Sélectionnez une conversation</p>
            <p class="text-sm mt-1">ou ajoutez un livre à votre panier pour contacter un auteur</p>
          </div>
        </div>

        <template v-else>
          <!-- En-tête conversation -->
          <div class="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
            <img
              :src="getOtherParticipant(selectedConv)?.user?.avatar_url || avatarFallback(getOtherParticipant(selectedConv)?.user?.name)"
              class="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p class="font-semibold text-gray-900">{{ getOtherParticipant(selectedConv)?.user?.name }}</p>
              <p class="text-xs text-gray-500">{{ selectedConv.subject || selectedConv.book?.title }}</p>
            </div>
            <div class="ml-auto">
              <span class="badge bg-blue-100 text-blue-700">{{ convTypeLabel(selectedConv.type) }}</span>
            </div>
          </div>

          <!-- Messages -->
          <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4">
            <div v-if="loadingMessages" class="text-center text-gray-400 text-sm">Chargement...</div>

            <div v-for="msg in messages" :key="msg.id" class="flex" :class="msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'">
              <div class="max-w-xs lg:max-w-md">
                <div v-if="msg.type === 'system'" class="text-center text-xs text-gray-400 italic my-2">
                  {{ msg.body }}
                </div>
                <template v-else>
                  <div class="flex items-end gap-2" :class="msg.sender_id === currentUserId ? 'flex-row-reverse' : ''">
                    <img
                      :src="msg.sender?.avatar || avatarFallback(msg.sender?.name)"
                      class="w-7 h-7 rounded-full object-cover flex-shrink-0"
                    />
                    <div
                      class="rounded-2xl px-4 py-2.5 text-sm"
                      :class="msg.sender_id === currentUserId
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm shadow-sm'"
                    >
                      <p v-if="msg.type === 'file'" class="flex items-center gap-2">
                        📎 <a :href="`/storage/${msg.file_path}`" target="_blank" class="underline">{{ msg.file_name }}</a>
                      </p>
                      <p v-else>{{ msg.body }}</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-400 mt-1" :class="msg.sender_id === currentUserId ? 'text-right' : 'text-left'">
                    {{ formatTime(msg.created_at) }}
                  </p>
                </template>
              </div>
            </div>
          </div>

          <!-- Zone de saisie -->
          <div class="bg-white border-t border-gray-200 p-4">
            <div v-if="error" class="text-red-500 text-xs mb-2">{{ error }}</div>
            <div class="flex items-end gap-3">
              <label class="cursor-pointer text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0">
                📎
                <input type="file" class="hidden" @change="onFileSelect" />
              </label>
              <textarea
                v-model="newMessage"
                rows="1"
                class="flex-1 input resize-none"
                placeholder="Votre message..."
                @keydown.enter.prevent="sendMessage"
                @input="autoResize"
                ref="textarea"
              ></textarea>
              <button @click="sendMessage" class="btn-primary flex-shrink-0" :disabled="sending || (!newMessage.trim() && !selectedFile)">
                {{ sending ? '...' : 'Envoyer' }}
              </button>
            </div>
            <div v-if="selectedFile" class="mt-2 text-xs text-gray-500">
              📎 {{ selectedFile.name }}
              <button @click="selectedFile = null" class="ml-2 text-red-500">✕</button>
            </div>
          </div>
        </template>
      </main>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useAuthStore } from '@/stores/index.js'
import api from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'
dayjs.extend(relativeTime)
dayjs.locale('fr')

const auth = useAuthStore()
const currentUserId = computed(() => auth.user?.id)

const conversations   = ref([])
const selectedConv    = ref(null)
const messages        = ref([])
const newMessage      = ref('')
const selectedFile    = ref(null)
const loadingConvs    = ref(true)
const loadingMessages = ref(false)
const sending         = ref(false)
const error           = ref('')
const messagesContainer = ref(null)
const textarea          = ref(null)

const totalUnread = computed(() => conversations.value.reduce((sum, c) => sum + (c.unread_count || 0), 0))

onMounted(fetchConversations)

async function fetchConversations() {
  loadingConvs.value = true
  try {
    const { data } = await api.get('/chat')
    conversations.value = data.data
  } finally {
    loadingConvs.value = false
  }
}

async function selectConversation(conv) {
  selectedConv.value = conv
  loadingMessages.value = true
  messages.value = []
  try {
    const { data } = await api.get(`/chat/${conv.id}`)
    messages.value = data.data.data
    conv.unread_count = 0
    await nextTick()
    scrollToBottom()
  } finally {
    loadingMessages.value = false
  }
}

async function sendMessage() {
  if (!newMessage.value.trim() && !selectedFile.value) return
  sending.value = true; error.value = ''
  try {
    const fd = new FormData()
    if (newMessage.value.trim()) fd.append('body', newMessage.value)
    if (selectedFile.value) fd.append('file', selectedFile.value)

    const { data } = await api.post(`/chat/${selectedConv.value.id}/messages`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    messages.value.push(data.data)
    newMessage.value = ''
    selectedFile.value = null
    await nextTick()
    scrollToBottom()
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur envoi message.'
  } finally {
    sending.value = false
  }
}

function onFileSelect(e) { selectedFile.value = e.target.files[0] }

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function autoResize(e) {
  const el = e.target
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

function getOtherParticipant(conv) {
  return conv.participants?.find(p => p.user_id !== currentUserId.value)
}

function convTypeLabel(type) {
  return { reader_author: 'Auteur', admin_author: 'Admin', admin_reader: 'Support', support: 'Support' }[type] || type
}

function formatTime(date) {
  if (!date) return ''
  return dayjs(date).fromNow()
}

function avatarFallback(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=EFF6FF&color=2563EB`
}
</script>
