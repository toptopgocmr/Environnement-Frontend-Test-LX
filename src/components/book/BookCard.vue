<!-- src/components/book/BookCard.vue -->
<template>
  <router-link :to="`/books/${book.id}`" class="group block">
    <div class="relative overflow-hidden rounded-xl bg-slate-100 aspect-[2/3] mb-3 shadow-sm group-hover:shadow-lg transition-shadow">
      <img :src="book.cover_url || book.cover_image" :alt="book.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
      <div v-if="book.is_free" class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Gratuit</div>
      <div v-if="book.is_featured" class="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">★ Vedette</div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
        <button class="w-full bg-blue-600 text-white text-xs font-semibold py-2 rounded-lg">Voir le livre</button>
      </div>
    </div>
    <h3 class="font-semibold text-slate-800 text-sm line-clamp-2 mb-1">{{ book.title }}</h3>
    <p class="text-slate-500 text-xs mb-1">{{ book.author?.name }}</p>
    <div class="flex items-center justify-between">
      <span class="font-bold text-blue-600 text-sm">{{ book.price_formatted }}</span>
      <div v-if="book.average_rating > 0" class="flex items-center gap-1 text-amber-500 text-xs">
        <span>★</span>
        <span class="text-slate-500">{{ book.average_rating }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({ book: { type: Object, required: true } })
</script>
