<template>
  <AppLayout>
  <div class="min-h-screen flex flex-col" :style="`background:${theme.bg};font-family:'Inter',system-ui,sans-serif`">

    <!-- ══ TOP BAR ══════════════════════════════════════════════════════════ -->
    <div :style="`background:${theme.panel};border-bottom:1px solid ${theme.border};flex-shrink:0`">
      <div class="px-5 py-2.5 flex items-center justify-between gap-3">

        <!-- Gauche : retour + titre -->
        <div class="flex items-center gap-3 min-w-0">
          <button @click="$router.back()"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium flex-shrink-0 transition hover:opacity-80"
            :style="`background:${theme.btnBg};border:1px solid ${theme.border};color:${theme.link}`">
            ← Retour
          </button>
          <div v-if="book" class="min-w-0 hidden sm:block">
            <p class="font-semibold text-xs truncate" :style="`color:${theme.text}`">{{ book.title }}</p>
            <p class="text-xs truncate" :style="`color:${theme.sub}`">{{ book.author?.name }}</p>
          </div>
        </div>

        <!-- Centre : sélecteur de mode -->
        <div class="flex items-center rounded-lg overflow-hidden flex-shrink-0"
          :style="`border:1px solid ${theme.border};background:${theme.bg}`">
          <button v-for="m in modes" :key="m.key" @click="readMode = m.key"
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition"
            :style="readMode === m.key
              ? `background:#1B6EBF;color:#fff`
              : `background:${theme.bg};color:${theme.sub}`">
            <span>{{ m.icon }}</span>
            <span class="hidden sm:inline">{{ m.label }}</span>
          </button>
        </div>

        <!-- Droite : contrôles -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <!-- A- / A+ -->
          <div class="flex items-center gap-1 px-2.5 py-1.5 rounded"
            :style="`background:${theme.btnBg};border:1px solid ${theme.border}`">
            <button @click="decreaseFont" class="text-xs font-bold px-1" :style="`color:${theme.sub}`">A-</button>
            <span class="text-xs w-6 text-center" :style="`color:${theme.sub}`">{{ fontSize }}</span>
            <button @click="increaseFont" class="text-xs font-bold px-1" :style="`color:${theme.sub}`">A+</button>
          </div>

          <!-- Thème -->
          <button @click="toggleTheme"
            class="px-2.5 py-1.5 rounded text-xs font-medium transition"
            :style="`background:${theme.btnBg};border:1px solid ${theme.border};color:${theme.sub}`">
            {{ isDark ? '☀️' : '🌙' }}
          </button>

          <!-- Traduction -->
          <div class="relative" data-translate-menu>
            <button @click="showTranslateMenu = !showTranslateMenu"
              class="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition"
              :style="translateLang
                ? 'background:#1B6EBF;color:#fff;border:1px solid #1B6EBF'
                : `background:${theme.btnBg};border:1px solid ${theme.border};color:${theme.sub}`">
              🌐
              <span class="hidden sm:inline">{{ translateLang ? translateLang.flag+' '+translateLang.short : 'Traduire' }}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <!-- Dropdown langues -->
            <div v-if="showTranslateMenu"
              class="absolute right-0 top-full mt-1 rounded-lg shadow-xl z-50 overflow-hidden"
              :style="`background:${theme.panel};border:1px solid ${theme.border};min-width:180px`">
              <div class="px-3 py-2" :style="`border-bottom:1px solid ${theme.border};background:${isDark?'#161B22':'#EBF5FB'}`">
                <p class="text-xs font-bold" style="color:#1B6EBF">Traduire le contenu</p>
                <p class="text-xs" :style="`color:${theme.sub}`">Via assistant IA</p>
              </div>
              <button v-for="lang in targetLanguages" :key="lang.code"
                @click="translatePage(lang)"
                class="w-full flex items-center gap-2.5 px-3 py-2 text-xs transition hover:opacity-80"
                :style="translateLang?.code===lang.code
                  ? `background:#EBF5FB;color:#1B6EBF;font-weight:700`
                  : `background:${theme.panel};color:${theme.body}`">
                <span class="text-base leading-none">{{ lang.flag }}</span>
                <span>{{ lang.name }}</span>
                <span class="ml-auto text-xs font-bold" :style="`color:${theme.sub}`">{{ lang.short }}</span>
              </button>
              <div v-if="translateLang" :style="`border-top:1px solid ${theme.border}`">
                <button @click="clearTranslation()"
                  class="w-full px-3 py-2 text-xs text-left transition hover:opacity-80"
                  :style="`color:#DC2626;background:${theme.panel}`">
                  ✕ Annuler la traduction
                </button>
              </div>
            </div>
          </div>

          <!-- Diapo : bouton plein écran dans la top bar -->
          <button v-if="readMode==='diapo'" @click="toggleFullscreen"
            class="px-3 py-1.5 rounded text-xs font-semibold transition"
            :style="isFullscreen ? 'background:#1B6EBF;color:#fff' : `background:${theme.btnBg};border:1px solid ${theme.border};color:${theme.sub}`">
            {{ isFullscreen ? '⛶ Réduire' : '⛶ Plein écran' }}
          </button>

          <!-- Badge aperçu -->
          <span v-if="isPreview" class="px-2.5 py-1.5 rounded text-xs font-bold"
            style="background:#FEF3C7;color:#92400E;border:1px solid #FDE68A">APERÇU</span>

          <!-- Pages -->
          <span v-if="bookUrl && readMode!=='diapo'"
            class="px-2.5 py-1.5 rounded text-xs"
            :style="`background:${isDark?'#1E3A6A':'#EBF5FB'};color:#1B6EBF;border:1px solid ${isDark?'#2A5298':'#BDD7EE'}`">
            {{ currentPage }} / {{ effectiveTotalPages }}<span v-if="isPreview"> (aperçu)</span>
          </span>
        </div>
      </div>
      <!-- Barre progression -->
      <div class="h-0.5" :style="`background:${theme.border}`">
        <div class="h-full transition-all duration-300" style="background:#1B6EBF" :style="`width:${progress}%`"></div>
      </div>
    </div>

    <!-- ══ LOADING ═══════════════════════════════════════════════════════════ -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3"
          style="border-color:#1B6EBF;border-top-color:transparent"></div>
        <p class="text-sm" :style="`color:${theme.sub}`">{{ $t('reader.loading') }}</p>
      </div>
    </div>

    <!-- ══ MODE NORMAL ════════════════════════════════════════════════════════ -->
    <div v-else-if="readMode==='normal'" class="flex-1 flex overflow-hidden" style="min-height:0">

      <!-- PDF viewer -->
      <div :class="translateLang ? 'w-1/2 flex-shrink-0' : 'flex-1'" class="flex flex-col" style="min-height:0">
        <iframe v-if="bookUrl"
          :src="`${bookUrl}#toolbar=1&navpanes=0&scrollbar=1&page=${currentPage}`"
          class="flex-1 w-full border-none" style="min-height:0"
          @load="loading=false"></iframe>
        <div v-else class="flex-1 flex items-center justify-center px-6">
          <div class="max-w-lg w-full rounded-lg p-10 text-center" :style="`background:${theme.panel};border:1px solid ${theme.border}`">
            <div class="text-5xl mb-4">📖</div>
            <h2 class="font-bold text-lg mb-2" :style="`color:${theme.text}`">Fichier non disponible</h2>
            <p class="text-sm mb-6" :style="`color:${theme.sub}`">Le PDF de ce livre n'est pas encore disponible en ligne.</p>
            <div v-if="book" class="text-left rounded-lg p-4 mt-6" :style="`background:${theme.bg};border:1px solid ${theme.border}`">
              <h3 class="font-semibold text-sm mb-2" :style="`color:${theme.text}`">{{ book.title }}</h3>
              <p :style="`font-size:${fontSize}px;line-height:1.8;color:${theme.body}`">{{ book.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Panneau traduction (visible quand une langue est sélectionnée) -->
      <div v-if="translateLang" class="w-1/2 flex flex-col flex-shrink-0 overflow-hidden"
        :style="`background:${theme.panel};border-left:2px solid #1B6EBF`">

        <!-- En-tête panneau traduction -->
        <div class="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
          :style="`background:${isDark?'#0D2137':'#EBF5FB'};border-bottom:1px solid #BDD7EE`">
          <div class="flex items-center gap-2">
            <span class="text-base">{{ translateLang.flag }}</span>
            <div>
              <p class="text-xs font-bold" style="color:#1B6EBF">Traduction — {{ translateLang.name }}</p>
              <p class="text-xs" :style="`color:${theme.sub}`">
                <span v-if="translationQueueActive">Traduction de tout le livre… {{ translationProgress.done }} / {{ translationProgress.total }} pages</span>
                <span v-else-if="translationProgress.total">{{ translationProgress.done }} / {{ translationProgress.total }} pages traduites</span>
                <span v-else>Page {{ currentPage }} / {{ effectiveTotalPages }}</span>
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button @click="translatePage(translateLang)"
              :disabled="translating || translationQueueActive"
              class="px-2.5 py-1 rounded text-xs font-semibold transition"
              :style="(translating || translationQueueActive) ? 'background:#1B6EBF;color:#fff;opacity:.5' : 'background:#1B6EBF;color:#fff;opacity:1'">
              {{ translationQueueActive ? '…' : '↺ Tout retraduire' }}
            </button>
            <button @click="clearTranslation()" class="text-xs px-2 py-1 rounded transition hover:opacity-80"
              :style="`color:#DC2626;background:${isDark?'#2D1B1B':'#FEF2F2'};border:1px solid #FCA5A5`">
              ✕ Fermer
            </button>
          </div>
        </div>

        <!-- Barre de progression de traduction globale -->
        <div v-if="translationProgress.total" class="h-1 flex-shrink-0" :style="`background:${theme.border}`">
          <div class="h-full transition-all duration-300" style="background:#1B6EBF"
            :style="`width:${Math.round(translationProgress.done / translationProgress.total * 100)}%`"></div>
        </div>

        <!-- Avertissement quota atteint -->
        <div v-if="translationQuotaHit" class="px-4 py-2 flex-shrink-0 text-xs"
          style="background:#FEF3C7;color:#92400E;border-bottom:1px solid #FDE68A">
          ⚠️ Quota de traduction quotidien atteint ({{ translationProgress.done }}/{{ translationProgress.total }} pages traduites). Les pages déjà traduites restent disponibles ; réessayez demain pour continuer.
        </div>

        <!-- Contenu traduit -->
        <div class="flex-1 overflow-y-auto px-5 py-5" style="min-height:0">
          <!-- Chargement -->
          <div v-if="translating" class="flex flex-col items-center justify-center h-full gap-3">
            <div class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style="border-color:#1B6EBF;border-top-color:transparent"></div>
            <p class="text-xs" :style="`color:${theme.sub}`">Traduction en cours…</p>
          </div>
          <!-- Texte traduit -->
          <div v-else-if="translatedContent">
            <div class="flex items-center gap-1.5 mb-4 pb-3" :style="`border-bottom:1px solid ${theme.border}`">
              <span class="text-base">{{ translateLang.flag }}</span>
              <span class="text-xs font-semibold" style="color:#1B6EBF">{{ translateLang.name }}</span>
            </div>
            <p :style="`font-size:${fontSize}px;line-height:1.9;color:${theme.body};white-space:pre-wrap`">{{ translatedContent }}</p>
          </div>
          <!-- Vide -->
          <div v-else class="flex flex-col items-center justify-center h-full gap-3 text-center">
            <span class="text-4xl">🌐</span>
            <p class="text-sm font-semibold" :style="`color:${theme.text}`">Prêt à traduire</p>
            <p class="text-xs" :style="`color:${theme.sub}`">Sélectionnez une langue dans le menu Traduire</p>
          </div>
        </div>

        <!-- Navigation pages dans le panneau traduction -->
        <div class="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
          :style="`background:${theme.panel};border-top:1px solid ${theme.border}`">
          <button @click="prevPage" :disabled="currentPage<=1"
            class="px-3 py-1.5 rounded text-xs font-medium transition disabled:opacity-40"
            :style="`background:${theme.btnBg};color:${theme.sub};border:1px solid ${theme.border}`">← Préc.</button>
          <span class="text-xs" :style="`color:${theme.sub}`">{{ currentPage }} / {{ effectiveTotalPages }}</span>
          <button @click="nextPage" :disabled="!isPreview && currentPage>=totalPages"
            class="px-3 py-1.5 rounded text-xs font-semibold text-white transition disabled:opacity-40"
            style="background:#1B6EBF">Suiv. →</button>
        </div>
      </div>
    </div>

    <!-- ══ MODE DIAPO ════════════════════════════════════════════════════════ -->
    <div v-else-if="readMode==='diapo'"
      ref="diapoRef"
      class="flex-1 flex flex-col overflow-hidden"
      style="background:#0a0a1a"
      @keydown.left.prevent="prevPage"
      @keydown.right.prevent="nextPage"
      @keydown.f.prevent="toggleFullscreen"
      @keydown.escape="isFullscreen && toggleFullscreen()"
      tabindex="0">

      <!-- Slide principale -->
      <div class="flex-1 flex items-center justify-center relative overflow-hidden" style="min-height:0">

        <!-- Halo décoratif -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="w-full max-w-4xl aspect-video rounded-3xl opacity-10"
            style="background:radial-gradient(ellipse,#1B6EBF,transparent 70%)"></div>
        </div>

        <!-- Page iframe -->
        <div class="relative flex-shrink-0"
          :style="isFullscreen
            ? 'width:100vw;height:100vh'
            : 'width:100%;max-width:900px;aspect-ratio:4/3;box-shadow:0 30px 80px rgba(0,0,0,.8);border-radius:10px;overflow:hidden'">

          <!-- Overlay chargement -->
          <Transition name="diapo-fade">
            <div v-if="diapoLoading" key="loader"
              class="absolute inset-0 z-10 flex items-center justify-center"
              style="background:#0a0a1a">
              <div class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style="border-color:#1B6EBF;border-top-color:transparent"></div>
            </div>
          </Transition>

          <iframe v-if="bookUrl"
            :key="'diapo-p'+currentPage"
            :src="`${bookUrl}?_p=${currentPage}#toolbar=0&navpanes=0&scrollbar=0&page=${currentPage}&zoom=page-fit`"
            class="w-full h-full border-none"
            style="pointer-events:none;border-radius:inherit"
            @load="diapoLoading=false">
          </iframe>
          <div v-else class="w-full h-full flex items-center justify-center" style="background:#1e2030">
            <div class="text-center px-8">
              <div class="text-7xl mb-5">📖</div>
              <p class="text-white font-bold text-xl">{{ book?.title }}</p>
              <p class="text-blue-300 text-sm mt-2">{{ book?.author?.name }}</p>
            </div>
          </div>
        </div>

        <!-- Flèche gauche -->
        <button @click="prevPage" :disabled="currentPage<=1"
          class="absolute left-5 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl transition-all hover:scale-110 disabled:opacity-20 z-20"
          style="background:rgba(27,110,191,.85);backdrop-filter:blur(6px);box-shadow:0 4px 20px rgba(0,0,0,.5)">
          ‹
        </button>
        <!-- Flèche droite -->
        <button @click="nextPage" :disabled="!isPreview && currentPage>=totalPages"
          class="absolute right-5 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl transition-all hover:scale-110 disabled:opacity-20 z-20"
          style="background:rgba(27,110,191,.85);backdrop-filter:blur(6px);box-shadow:0 4px 20px rgba(0,0,0,.5)">
          ›
        </button>

        <!-- Indicateur page (overlay) -->
        <div class="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold z-20"
          style="background:rgba(0,0,0,.5);color:#fff;backdrop-filter:blur(4px)">
          {{ currentPage }} / {{ effectiveTotalPages }}
        </div>
      </div>

      <!-- Barre bas diapo -->
      <div class="flex items-center justify-between px-5 py-3 flex-shrink-0 z-20"
        style="background:rgba(0,0,0,.6);backdrop-filter:blur(10px);border-top:1px solid rgba(255,255,255,.08)">

        <!-- Gauche : miniatures -->
        <div class="flex items-center gap-1.5 overflow-x-auto" style="max-width:40%">
          <button v-for="p in Math.min(effectiveTotalPages, 30)" :key="p" @click="goTo(p)"
            class="flex-shrink-0 rounded-full transition-all"
            :style="p===currentPage
              ? 'width:24px;height:8px;background:#1B6EBF'
              : 'width:8px;height:8px;background:rgba(255,255,255,.3)'">
          </button>
        </div>

        <!-- Centre : auto-play + intervalle -->
        <div class="flex items-center gap-2">
          <button @click="toggleAutoPlay"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            :style="autoPlay ? 'background:#1B6EBF;color:#fff' : 'background:rgba(255,255,255,.1);color:#fff'">
            {{ autoPlay ? '⏸ Stop' : '▶ Auto' }}
          </button>
          <select v-model="autoInterval" class="text-xs px-2 py-1.5 rounded-lg text-white"
            style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15)">
            <option value="5">5s</option>
            <option value="10">10s</option>
            <option value="20">20s</option>
            <option value="30">30s</option>
          </select>
        </div>

        <!-- Droite : plein écran -->
        <button @click="toggleFullscreen"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition hover:opacity-80"
          :style="isFullscreen
            ? 'background:#1B6EBF;color:#fff'
            : 'background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.15)'">
          <span>{{ isFullscreen ? '⛶' : '⛶' }}</span>
          {{ isFullscreen ? 'Réduire' : 'Plein écran' }}
        </button>
      </div>
    </div>

    <!-- ══ MODE IA ════════════════════════════════════════════════════════════ -->
    <div v-else-if="readMode==='ia'" class="flex-1 flex overflow-hidden" style="min-height:0">

      <!-- PDF gauche -->
      <div class="flex-1 flex flex-col" style="min-width:0">
        <iframe v-if="bookUrl" :src="`${bookUrl}#toolbar=1&navpanes=0&scrollbar=1&page=${currentPage}`"
          class="flex-1 w-full border-none" style="min-height:0" @load="loading=false"></iframe>
        <div v-else class="flex-1 flex items-center justify-center" :style="`background:${theme.bg}`">
          <div class="text-center p-8 rounded-lg" :style="`background:${theme.panel};border:1px solid ${theme.border}`">
            <div class="text-4xl mb-3">📖</div>
            <p class="font-semibold text-sm" :style="`color:${theme.text}`">{{ book?.title }}</p>
            <p class="text-xs mt-1" :style="`color:${theme.sub}`">{{ book?.author?.name }}</p>
            <div class="mt-4 text-left" :style="`font-size:${fontSize-1}px;line-height:1.7;color:${theme.body}`">
              <p>{{ book?.description }}</p>
            </div>
          </div>
        </div>
        <!-- Nav pages -->
        <div class="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
          :style="`background:${theme.panel};border-top:1px solid ${theme.border}`">
          <button @click="prevPage" :disabled="currentPage<=1"
            class="px-4 py-1.5 rounded text-xs font-medium transition disabled:opacity-40"
            :style="`background:${theme.btnBg};color:${theme.sub};border:1px solid ${theme.border}`">← Préc.</button>
          <span class="text-xs" :style="`color:${theme.sub}`">{{ currentPage }} / {{ effectiveTotalPages }}</span>
          <button @click="nextPage" :disabled="!isPreview && currentPage>=totalPages"
            class="px-4 py-1.5 rounded text-xs font-semibold text-white transition disabled:opacity-40"
            style="background:#1B6EBF">Suiv. →</button>
        </div>
      </div>

      <!-- Panneau IA droite -->
      <div class="flex flex-col flex-shrink-0 w-80" :style="`background:${theme.panel};border-left:1px solid ${theme.border}`">

        <!-- En-tête -->
        <div class="px-4 py-3 flex-shrink-0" :style="`border-bottom:1px solid ${theme.border};background:${isDark?'#161B22':'#EBF5FB'}`">
          <div class="flex items-center gap-2 mb-1">
            <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style="background:linear-gradient(135deg,#1B6EBF,#7C3AED)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div>
              <p class="font-bold text-xs" style="color:#1B6EBF">Assistant LireX IA</p>
              <p class="text-xs" :style="`color:${theme.sub}`">Propulsé par Claude</p>
            </div>
          </div>
        </div>

        <!-- Suggestions rapides / Traduction -->
        <div v-if="aiMessages.length===0" class="px-3 py-3 flex-shrink-0" :style="`border-bottom:1px solid ${theme.border}`">
          <!-- Bandeau traduction active -->
          <div v-if="translateLang" class="mb-2 flex items-center justify-between px-2.5 py-1.5 rounded-lg"
            style="background:#EBF5FB;border:1px solid #BDD7EE">
            <span class="text-xs font-bold" style="color:#1B6EBF">{{ translateLang.flag }} Traduction → {{ translateLang.name }}</span>
            <button @click="clearTranslation()" class="text-xs" style="color:#DC2626">✕</button>
          </div>
          <!-- Actions traduction -->
          <template v-if="translateLang">
            <p class="text-xs font-semibold mb-2" :style="`color:${theme.sub}`">Traduire en {{ translateLang.name }} :</p>
            <div class="space-y-1.5">
              <button @click="sendQuestion(`Traduis en ${translateLang.name} le contenu de la page ${currentPage} de ce livre.`)"
                class="w-full text-left px-3 py-2 rounded-lg text-xs transition hover:opacity-80"
                :style="`background:${theme.bg};border:1px solid ${theme.border};color:${theme.body}`">
                📄 Traduire la page {{ currentPage }}
              </button>
              <button @click="sendQuestion(`Traduis en ${translateLang.name} le résumé/description de ce livre : &quot;${book?.description}&quot;`)"
                class="w-full text-left px-3 py-2 rounded-lg text-xs transition hover:opacity-80"
                :style="`background:${theme.bg};border:1px solid ${theme.border};color:${theme.body}`">
                📋 Traduire le résumé
              </button>
              <button @click="sendQuestion(`Traduis en ${translateLang.name} le titre et donne un bref résumé traduit de ce livre.`)"
                class="w-full text-left px-3 py-2 rounded-lg text-xs transition hover:opacity-80"
                :style="`background:${theme.bg};border:1px solid ${theme.border};color:${theme.body}`">
                📚 Traduire l'introduction
              </button>
              <button @click="sendQuestion(`Traduis en ${translateLang.name} les mots clés et concepts importants de cet ouvrage.`)"
                class="w-full text-left px-3 py-2 rounded-lg text-xs transition hover:opacity-80"
                :style="`background:${theme.bg};border:1px solid ${theme.border};color:${theme.body}`">
                🔑 Termes clés traduits
              </button>
            </div>
          </template>
          <!-- Questions rapides normales -->
          <template v-else>
            <p class="text-xs font-semibold mb-2" :style="`color:${theme.sub}`">Questions rapides :</p>
            <div class="space-y-1.5">
              <button v-for="q in quickQuestions" :key="q" @click="sendQuestion(q)"
                class="w-full text-left px-3 py-2 rounded-lg text-xs transition hover:opacity-80"
                :style="`background:${theme.bg};border:1px solid ${theme.border};color:${theme.body}`">
                {{ q }}
              </button>
            </div>
          </template>
        </div>

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto px-3 py-3 space-y-3" ref="messagesRef" style="min-height:0">

          <!-- Bannière config IA si pas encore de clé -->
          <div v-if="aiNotConfigured" class="rounded-lg p-3" style="background:#FEF3C7;border:1px solid #FDE68A">
            <p class="font-bold text-xs mb-1" style="color:#92400E">🔑 Clé Gemini non configurée</p>
            <p class="text-xs mb-2" style="color:#B45309;line-height:1.6">
              <strong>1.</strong> Ouvrez <strong>aistudio.google.com</strong> (compte Google)<br>
              <strong>2.</strong> Cliquez <em>Get API Key</em> → copiez la clé <code>AIza...</code><br>
              <strong>3.</strong> Dans <code>backend/.env</code> :<br>
              <code style="display:block;margin-top:3px;padding:3px 5px;background:#FEF9C3;border-radius:4px">GEMINI_API_KEY=AIza...</code>
              <strong>4.</strong> Redémarrez le serveur backend
            </p>
            <a href="https://aistudio.google.com/app/apikey" target="_blank"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold text-white"
              style="background:#1B6EBF">
              Obtenir la clé Gemini (gratuit) →
            </a>
          </div>

          <div v-for="(msg, i) in aiMessages" :key="i">
            <!-- Question utilisateur -->
            <div v-if="msg.role==='user'" class="flex justify-end">
              <div class="max-w-xs px-3 py-2 rounded-lg text-xs leading-relaxed"
                style="background:#1B6EBF;color:#fff;border-radius:12px 12px 2px 12px">
                {{ msg.content }}
              </div>
            </div>
            <!-- Réponse IA -->
            <div v-else class="flex items-start gap-2">
              <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style="background:linear-gradient(135deg,#1B6EBF,#7C3AED)">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <div class="flex-1 px-3 py-2 rounded-lg text-xs leading-relaxed"
                :style="`background:${theme.bg};border:1px solid ${theme.border};color:${theme.body};border-radius:2px 12px 12px 12px`">
                <span v-if="msg.loading" class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"></span>
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style="animation-delay:.15s"></span>
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style="animation-delay:.3s"></span>
                </span>
                <span v-else>{{ msg.content }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Saisie -->
        <div class="px-3 py-3 flex-shrink-0" :style="`border-top:1px solid ${theme.border}`">
          <!-- Texte sélectionné à traduire -->
          <div v-if="selectedText" class="mb-2 rounded-lg p-2" :style="`background:${isDark?'#1E3A6A':'#EBF5FB'};border:1px solid ${isDark?'#2A5298':'#BDD7EE'}`">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-semibold" style="color:#1B6EBF">📋 Texte sélectionné</span>
              <button @click="selectedText=''" class="text-xs" :style="`color:${theme.sub}`">✕</button>
            </div>
            <p class="text-xs italic line-clamp-2" :style="`color:${theme.body}`">{{ selectedText }}</p>
            <div class="flex gap-1 mt-1.5 flex-wrap">
              <button v-for="lang in targetLanguages.slice(0,6)" :key="lang.code"
                @click="translateSelected(lang)"
                class="px-2 py-0.5 rounded text-xs font-medium transition hover:opacity-80"
                style="background:#1B6EBF;color:#fff">
                {{ lang.flag }} {{ lang.short }}
              </button>
            </div>
          </div>

          <div class="flex gap-2">
            <textarea v-model="aiQuestion" @keydown.enter.prevent="sendQuestion()"
              rows="2" placeholder="Posez une question ou collez un texte à traduire…"
              class="flex-1 px-3 py-2 rounded-lg text-xs resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
              :style="`background:${theme.input};border:1px solid ${theme.border};color:${theme.body}`"
              :placeholder="$t('reader.askAI')"></textarea>
            <button @click="sendQuestion()"
              class="px-3 py-2 rounded-lg text-xs font-semibold text-white flex-shrink-0 transition"
              :disabled="aiLoading || !aiQuestion.trim()"
              :style="`background:${aiLoading ? '#9CA3AF' : '#1B6EBF'}`">
              {{ $t('reader.send') }}
            </button>
          </div>
        </div>
      </div>
    </div><!-- end AI panel -->

    <!-- Paywall overlay -->
    <div v-if="showPaywall"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background:rgba(0,0,0,.65);backdrop-filter:blur(6px)">
      <div class="rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl" style="background:#ffffff">
        <div style="height:4px;background:linear-gradient(90deg,#1B6EBF,#7c3aed)"></div>
        <div class="p-7 text-center">
          <div style="font-size:48px;margin-bottom:12px">🔒</div>
          <h2 style="color:#16191F;font-size:20px;font-weight:700;margin-bottom:8px">Aperçu terminé</h2>
          <p style="color:#6B7280;font-size:14px;margin-bottom:24px">
            Vous avez lu les {{ previewPages }} premières pages gratuites. Achetez ce livre pour continuer la lecture.
          </p>
          <div class="flex gap-3">
            <button @click="showPaywall=false"
              class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
              style="border:1px solid #D5DBDB;color:#374151">
              {{ $t('common.close') }}
            </button>
            <router-link :to="book ? `/books/${book.id}` : '/books'"
              class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white text-center transition"
              style="background:#1B6EBF">
              {{ $t('reader.buy') }} →
            </router-link>
          </div>
        </div>
      </div>
    </div>

  </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { bookService } from '@/services/api'
import { useAuthStore } from '@/stores/index.js'
import AppLayout from '@/components/layout/AppLayout.vue'

const { t } = useI18n()
const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()

const book              = ref(null)
const bookUrl           = ref('')
const currentPage       = ref(1)
const totalPages        = ref(0)
const loading           = ref(true)
const error             = ref(null)
const readMode          = ref('normal')
const fontSize          = ref(16)
const isDark            = ref(false)
const isPreview         = ref(false)
const previewPages      = ref(null)
const autoPlay          = ref(false)
const showPaywall       = ref(false)
const aiQuestion        = ref('')
const aiLoading         = ref(false)
const aiMessages        = ref([])
const aiNotConfigured   = ref(false)
const translateLang       = ref(null)
const showTranslateMenu   = ref(false)
const pageTranslations    = ref({})   // { [pageNumber]: { text, error } }
const translating         = ref(false) // fetch en cours pour la page affichée
const translationQueueActive = ref(false) // balayage arrière-plan de tout le livre en cours
const translationProgress = ref({ done: 0, total: 0 })
const translationQuotaHit = ref(false)
let translationSweepToken = 0
const selectedText      = ref('')
const diapoLoading      = ref(false)
const diapoRef          = ref(null)
const isFullscreen      = ref(false)
const messagesRef       = ref(null)
const autoInterval      = ref(10)
let autoTimer = null

// ── Computed ──────────────────────────────────────────────────────────────────

const modes = computed(() => [
  { key: 'normal', icon: '📄', label: t('reader.normal') },
  { key: 'diapo',  icon: '🎞',  label: t('reader.slideshow') },
  { key: 'ia',     icon: '🤖', label: t('reader.ai') },
])

// Texte traduit de la page actuellement affichée (déjà en cache s'il a été
// traduit par le balayage arrière-plan ou une visite précédente).
const translatedContent = computed(() => pageTranslations.value[currentPage.value]?.text ?? '')

const theme = computed(() => isDark.value ? {
  bg: '#0D1117', panel: '#161B22', border: '#30363D',
  text: '#F0F6FC', sub: '#8B949E', body: '#C9D1D9',
  link: '#58A6FF', btnBg: '#21262D', input: '#0D1117',
} : {
  bg: '#F2F3F3', panel: '#FFFFFF', border: '#D5DBDB',
  text: '#16191F', sub: '#6B7280', body: '#374151',
  link: '#1B6EBF', btnBg: '#F8F9FA', input: '#FFFFFF',
})

const progress = computed(() => {
  if (!effectiveTotalPages.value) return 0
  return Math.round((currentPage.value / effectiveTotalPages.value) * 100)
})

// Nombre de pages réellement accessibles : plafonné par l'aperçu gratuit
// pour un livre payant non acquis, sinon le nombre total de pages du livre.
const effectiveTotalPages = computed(() => {
  return (isPreview.value && previewPages.value) ? previewPages.value : totalPages.value
})

const quickQuestions = computed(() => [
  `De quoi parle ce livre ?`,
  `Quels sont les thèmes principaux de "${book.value?.title ?? 'ce livre'}" ?`,
  `Résume le contenu de la page ${currentPage.value}.`,
  `Explique les concepts clés de la page ${currentPage.value}.`,
])

const targetLanguages = [
  { code:'fr', name:'Français',   flag:'🇫🇷', short:'FR' },
  { code:'en', name:'English',    flag:'🇬🇧', short:'EN' },
  { code:'es', name:'Español',    flag:'🇪🇸', short:'ES' },
  { code:'zh', name:'中文',        flag:'🇨🇳', short:'ZH' },
  { code:'pt', name:'Português',  flag:'🇧🇷', short:'PT' },
  { code:'ar', name:'العربية',    flag:'🇸🇦', short:'AR' },
  { code:'de', name:'Deutsch',    flag:'🇩🇪', short:'DE' },
  { code:'ru', name:'Русский',    flag:'🇷🇺', short:'RU' },
]

// ── Theme / Font ──────────────────────────────────────────────────────────────

// ── Plein écran diapo ────────────────────────────────────────────────────────

function toggleFullscreen() {
  if (!diapoRef.value) return
  if (!document.fullscreenElement) {
    diapoRef.value.requestFullscreen().then(() => {
      isFullscreen.value = true
    }).catch(() => {})
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false
    }).catch(() => {})
  }
}

function toggleTheme() { isDark.value = !isDark.value }
function increaseFont() { if (fontSize.value < 28) fontSize.value += 2 }
function decreaseFont() { if (fontSize.value > 10) fontSize.value -= 2 }

// ── Navigation pages ──────────────────────────────────────────────────────────

function prevPage() {
  if (currentPage.value > 1) { currentPage.value--; loadPage() }
}
function nextPage() {
  if (isPreview.value && currentPage.value >= effectiveTotalPages.value) { showPaywall.value = true; return }
  if (currentPage.value < totalPages.value) { currentPage.value++; loadPage() }
}
function goTo(p) {
  if (isPreview.value && p > effectiveTotalPages.value) { showPaywall.value = true; return }
  currentPage.value = p; diapoLoading.value = true; loadPage()
}

// ── Chargement page ───────────────────────────────────────────────────────────

async function loadPage() {
  // Si une langue est active et que la page affichée n'a pas encore été
  // traduite (le balayage arrière-plan ne l'a pas encore atteinte), on la
  // traduit en priorité tout de suite pour ne pas faire attendre le lecteur.
  if (translateLang.value && !pageTranslations.value[currentPage.value] && !translationQuotaHit.value) {
    translating.value = true
    await fetchPageTranslation(translateLang.value, currentPage.value)
    translating.value = false
  }
}

// ── Traduction — page unique (utilisée par le balayage complet du livre) ──────

async function fetchPageTranslation(lang, pageNum) {
  if (pageTranslations.value[pageNum]) return pageTranslations.value[pageNum]
  try {
    const res = await bookService.translate(route.params.id, {
      page:        pageNum,
      target_lang: lang.code,
    })
    const d = res.data?.data ?? {}
    const text = d.note ? `ℹ️ ${d.note}\n\n${d.original ?? ''}` : (d.translated ?? '')
    pageTranslations.value = { ...pageTranslations.value, [pageNum]: { text, error: false } }
    return pageTranslations.value[pageNum]
  } catch (err) {
    if (err.response?.status === 429) {
      translationQuotaHit.value = true
      throw err
    }
    const msg = err.response?.data?.message ?? err.message ?? 'Erreur inconnue'
    pageTranslations.value = { ...pageTranslations.value, [pageNum]: { text: '⚠️ ' + msg, error: true } }
    return pageTranslations.value[pageNum]
  }
}

// ── Traduction — balayage de tout le livre en arrière-plan ────────────────────

async function translateAllPages(lang) {
  const myToken = ++translationSweepToken
  translationQueueActive.value = true
  const total = effectiveTotalPages.value
  translationProgress.value = { done: Object.keys(pageTranslations.value).length, total }
  for (let p = 1; p <= total; p++) {
    if (translationSweepToken !== myToken) return // langue changée / traduction annulée entretemps
    if (!pageTranslations.value[p]) {
      try {
        await fetchPageTranslation(lang, p)
      } catch {
        translationQueueActive.value = false
        return // quota atteint : on s'arrête, les pages déjà traduites restent disponibles
      }
    }
    translationProgress.value = { done: Object.keys(pageTranslations.value).length, total }
  }
  translationQueueActive.value = false
}

async function translatePage(lang) {
  showTranslateMenu.value = false
  translateLang.value = lang
  pageTranslations.value = {}
  translationQuotaHit.value = false
  translationProgress.value = { done: 0, total: effectiveTotalPages.value }

  // Priorité à la page actuellement affichée pour un retour immédiat...
  translating.value = true
  await fetchPageTranslation(lang, currentPage.value)
  translating.value = false

  // ...puis on traduit le reste du livre en arrière-plan.
  translateAllPages(lang)
}

function clearTranslation() {
  translationSweepToken++ // annule un balayage en cours
  translateLang.value = null
  pageTranslations.value = {}
  translationQueueActive.value = false
  translationQuotaHit.value = false
  translationProgress.value = { done: 0, total: 0 }
}

// ── Diaporama ─────────────────────────────────────────────────────────────────

function toggleAutoPlay() {
  autoPlay.value = !autoPlay.value
  if (autoPlay.value) {
    const interval = Number(autoInterval.value || 10) * 1000
    autoTimer = setInterval(() => {
      if (currentPage.value >= effectiveTotalPages.value) {
        autoPlay.value = false
        clearInterval(autoTimer)
        if (isPreview.value) showPaywall.value = true
        return
      }
      nextPage()
    }, interval)
  } else {
    clearInterval(autoTimer)
  }
}

// ── Texte sélectionné ─────────────────────────────────────────────────────────

function translateSelected(lang) {
  if (!selectedText.value) return
  aiQuestion.value = `Traduis ce texte en ${lang.name} : "${selectedText.value}"`
  selectedText.value = ''
  readMode.value = 'ia'
  sendQuestion()
}

// ── Assistant IA ──────────────────────────────────────────────────────────────

async function sendQuestion(overrideQ) {
  const q = (overrideQ ?? aiQuestion.value ?? '').trim()
  if (!q || aiLoading.value) return
  aiMessages.value.push({ role: 'user', content: q })
  if (!overrideQ) aiQuestion.value = ''
  aiLoading.value = true
  await nextTick()
  if (messagesRef.value) messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  try {
    const res = await bookService.askAI(route.params.id, { question: q, page: currentPage.value })
    const answer = res.data?.data?.answer ?? res.data?.answer ?? res.data?.message ?? '…'
    aiMessages.value.push({ role: 'ai', content: answer })
    aiNotConfigured.value = false
  } catch (err) {
    const status = err.response?.status
    const msg = err.response?.data?.message ?? ''
    if (status === 503 || msg.toLowerCase().includes('gemini') ||      msg.toLowerCase().includes('quota')) {
      aiNotConfigured.value = true
    }
    aiMessages.value.push({ role: 'ai', content: '⚠️ ' + (msg || t('common.error')) })
  } finally {
    aiLoading.value = false
    await nextTick()
    if (messagesRef.value) messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

function onDocumentClick(e) {
  if (!e.target.closest('[data-translate-menu]')) showTranslateMenu.value = false
}

function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
  if (!isFullscreen.value && readMode.value === 'diapo') readMode.value = 'normal'
}

onMounted(async () => {
  try {
    const res = await bookService.get(route.params.id)
    book.value = res.data.data ?? res.data
    try {
      const linkRes = await bookService.readLink(route.params.id)
      const linkData = linkRes.data?.data ?? {}
      bookUrl.value       = linkData.url   ?? ''
      totalPages.value    = linkData.pages ?? book.value.pages ?? 1
      isPreview.value     = !!linkData.is_preview
      previewPages.value  = linkData.preview_pages ?? null
    } catch {
      totalPages.value = book.value.pages ?? 1
    }
    await loadPage()
  } catch (e) {
    error.value = e.response?.data?.message ?? e.message
  } finally {
    loading.value = false
  }

  document.addEventListener('click', onDocumentClick)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onUnmounted(() => {
  clearInterval(autoTimer)
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>
