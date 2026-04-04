<template>
  <section class="notices-page">

    <div class="page-hero">
      <div class="hero-inner">
        <h1 class="hero-title">All Notices</h1>
        <div class="search-wrap">
          <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd"/>
          </svg>
          <input
            class="search-input"
            type="search"
            v-model="searchQuery"
            placeholder="Search by title or keyword…"
            autocomplete="off"
          />
        </div>
      </div>
    </div>

    <div class="controls-row">
      <select class="sort-select" v-model="sortMode">
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="az">A → Z</option>
      </select>
    </div>

    <div class="results-meta">
      <p class="results-count"><strong>{{ filteredNotices.length }}</strong> notice{{ filteredNotices.length !== 1 ? 's' : '' }} found</p>
      <div class="view-toggle">
        <button class="view-btn-icon" :class="{ active: isGrid }" @click="isGrid = true" title="Grid view">
          <svg viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3A1.5 1.5 0 0115 10.5v3A1.5 1.5 0 0113.5 15h-3A1.5 1.5 0 019 13.5v-3z"/></svg>
        </button>
        <button class="view-btn-icon" :class="{ active: !isGrid }" @click="isGrid = false" title="List view">
          <svg viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M2.5 12a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z" clip-rule="evenodd"/></svg>
        </button>
      </div>
    </div>

    <div class="cards-container">
      <div v-if="websiteStore.isLoading" class="skeleton-grid">
        <div v-for="i in 6" :key="i" class="skeleton-card">
          <div class="skel-top"></div>
          <div class="skel-body">
            <div class="skel skel-title"></div>
            <div class="skel skel-title-2"></div>
            <div class="skel skel-line"></div>
            <div class="skel skel-line-2"></div>
            <div class="skel skel-line-3"></div>
          </div>
          <div class="skel-footer">
            <div class="skel skel-btn"></div>
          </div>
        </div>
      </div>

      <div v-else-if="pagedNotices.length > 0" class="cards-grid" :class="{ 'list-view': !isGrid }">
        <article
          v-for="(notice, idx) in pagedNotices"
          :key="notice.id"
          class="notice-card"
          :style="{ animationDelay: `${idx * 0.05}s` }"
        >
          <div class="card-accent"></div>
          <div class="card-body">
            <div class="card-text">
              <div class="card-meta">
                <span class="card-date">
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M5 1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-1V1a1 1 0 0 0-2 0v1H5V1zm9 5H2V4h12v2z"/>
                  </svg>
                  {{ formatDate(notice.created_at || notice.date) }}
                </span>
              </div>
              <h2 class="card-title">{{ notice.name || notice.title }}</h2>
              <p class="card-desc">{{ stripHtml(notice.description || notice.content || '') }}</p>
            </div>
          </div>
          <div class="card-footer">
            <router-link :to="`/notices/${notice.id}`" class="btn btn-primary">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
              Read More
            </router-link>
            <a
              v-if="noticeFileUrl(notice)"
              :href="noticeFileUrl(notice)"
              :download="getDownloadFilename(noticeFileUrl(notice))"
              class="btn btn-download"
            >
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
              Download
            </a>
          </div>
        </article>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No notices found</h3>
        <p>Try adjusting your search or filter criteria.</p>
      </div>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button class="page-btn" @click="goPage(currentPage - 1)" :disabled="currentPage === 1">
        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
      </button>
      <template v-for="p in paginationRange" :key="p">
        <span v-if="p === '...'" class="page-ellipsis">…</span>
        <button v-else class="page-btn" :class="{ active: p === currentPage }" @click="goPage(p)">{{ p }}</button>
      </template>
      <button class="page-btn" @click="goPage(currentPage + 1)" :disabled="currentPage === totalPages">
        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
      </button>
    </div>

  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useNoticeFileUrl } from '@/composables/useImageUrl'

const websiteStore = useWebsiteStore()

const searchQuery = ref('')
const sortMode = ref('newest')
const isGrid = ref(true)
const currentPage = ref(1)
const ITEMS_PER_PAGE = 6

const filteredNotices = computed(() => {
  let list = [...(websiteStore.getNotices || [])]
  const q = searchQuery.value.trim().toLowerCase()
  if (q) list = list.filter(n =>
    String(n.title || n.name || '').toLowerCase().includes(q) ||
    String(n.description || n.content || '').toLowerCase().includes(q)
  )
  if (sortMode.value === 'newest') list.sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
  else if (sortMode.value === 'oldest') list.sort((a, b) => new Date(a.created_at || a.date) - new Date(b.created_at || b.date))
  else list.sort((a, b) => String(a.title || a.name || '').localeCompare(String(b.title || b.name || '')))
  return list
})

const totalPages = computed(() => Math.ceil(filteredNotices.value.length / ITEMS_PER_PAGE))

const pagedNotices = computed(() => {
  const s = (currentPage.value - 1) * ITEMS_PER_PAGE
  return filteredNotices.value.slice(s, s + ITEMS_PER_PAGE)
})

const paginationRange = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  const range = []
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || (p >= cur - 1 && p <= cur + 1)) range.push(p)
    else if (p === cur - 2 || p === cur + 2) range.push('...')
  }
  return range
})

const goPage = (p) => {
  if (p < 1 || p > totalPages.value) return
  currentPage.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch([searchQuery, sortMode], () => { currentPage.value = 1 })

const noticeFileUrl = (notice) => {
  const file = notice?.file || notice?.pdf
  if (!file) return ''
  if (file.startsWith('http')) return file
  return useNoticeFileUrl(file, notice.institute_id, notice.type)
}

const getDownloadFilename = (url) => {
  if (!url) return 'download'
  return String(url).split('/').pop()?.split('?')[0] || 'download'
}

const stripHtml = (value) => String(value || '').replace(/<[^>]+>/g, '').trim()

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''

onMounted(async () => {
  if (!websiteStore.getNotices?.length && !websiteStore.isLoading && !websiteStore.error) {
    await websiteStore.fetchAllData()
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --sky: #0ea5e9;
  --sky-dark: #0369a1;
  --sky-light: #e0f2fe;
  --sky-mid: #38bdf8;
  --green: #059669;
  --green-light: #d1fae5;
  --text: #0f2744;
  --text-muted: #64748b;
  --border: #e2eaf3;
  --bg: #f5f9fd;
  --card: #ffffff;
  --radius: 16px;
}

.notices-page {
  background: var(--bg);
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
}

.page-hero {
  background: linear-gradient(135deg, #0369a1 0%, #0ea5e9 55%, #38bdf8 100%);
  padding: 52px 24px 80px;
  position: relative;
  overflow: hidden;
}
.page-hero::before {
  content: '';
  position: absolute; inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E");
}
.page-hero::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0; right: 0;
  height: 60px;
  background: var(--bg);
  clip-path: ellipse(55% 100% at 50% 100%);
}
.hero-inner {
  max-width: 860px;
  margin: 0 auto;
  position: relative; z-index: 1;
  text-align: center;
}
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  backdrop-filter: blur(8px);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 5px 14px 5px 10px;
  border-radius: 999px;
  margin-bottom: 18px;
}
.live-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #7effc0;
  animation: blink 2s infinite;
}
@keyframes blink {
  0%,100% { box-shadow: 0 0 0 0 rgba(126,255,192,0.6); }
  50% { box-shadow: 0 0 0 5px rgba(126,255,192,0); }
}
.hero-title {
  font-family: 'Fraunces', serif;
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 900;
  color: #fff;
  line-height: 1.08;
  margin-bottom: 12px;
  margin-top: 0;
}
.hero-sub {
  color: rgba(255,255,255,0.75);
  font-size: 1rem;
  margin-bottom: 32px;
}
.search-wrap {
  position: relative;
  max-width: 560px;
  margin: 0 auto;
}
.search-icon {
  position: absolute;
  left: 18px; top: 50%;
  transform: translateY(-50%);
  width: 18px; height: 18px;
  color: var(--sky);
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 16px 18px 16px 50px;
  border: none;
  border-radius: 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  color: var(--text);
  background: #fff;
  box-shadow: 0 8px 32px rgba(3,105,161,0.18);
  outline: none;
  transition: box-shadow 0.2s;
}
.search-input:focus { box-shadow: 0 8px 32px rgba(3,105,161,0.3), 0 0 0 3px rgba(14,165,233,0.2); }
.search-input::placeholder { color: #a0b3c4; }

.controls-row {
  max-width: 960px;
  margin: -28px auto 0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  position: relative;
  z-index: 2;
}
.sort-select {
  padding: 8px 14px;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  background: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
  outline: none;
}

.results-meta {
  max-width: 960px;
  margin: 28px auto 0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}
.results-count { font-size: 0.82rem; color: var(--text-muted); font-weight: 500; }
.results-count strong { color: var(--sky-dark); }
.view-toggle { display: flex; gap: 6px; }
.view-btn-icon {
  width: 34px; height: 34px;
  border-radius: 8px;
  border: 1.5px solid var(--border);
  background: #ffffff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.18s;
}
.view-btn-icon.active, .view-btn-icon:hover { background: var(--sky-light); border-color: var(--sky); color: var(--sky-dark); }
.view-btn-icon svg { width: 15px; height: 15px; }

.cards-container { max-width: 960px; margin: 20px auto 0; padding: 0 24px; }

.skeleton-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 20px; }
.skeleton-card { background: #fff; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; padding-bottom: 16px; }
.skel-top { height: 4px; background: #e8f4fb; }
.skel-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 10px; }
.skel { border-radius: 6px; background: linear-gradient(90deg,#eaf5fb 25%,#f4fafd 50%,#eaf5fb 75%); background-size:300% 100%; animation: sh 1.5s infinite; }
@keyframes sh { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.skel-title { height: 22px; }
.skel-title-2 { height: 22px; width: 75%; }
.skel-line { height: 14px; }
.skel-line-2 { height: 14px; width: 85%; }
.skel-line-3 { height: 14px; width: 60%; }
.skel-footer { padding: 12px 22px 0; display: flex; gap: 10px; }
.skel-btn { height: 36px; border-radius: 10px; flex: 1; }

.cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 20px; }
.cards-grid.list-view { grid-template-columns: 1fr; }

.notice-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  animation: cardIn 0.35s ease both;
  box-shadow: 0 2px 12px rgba(14,90,140,0.06);
}
.notice-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(14,90,140,0.13); }
@keyframes cardIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

.card-accent { height: 4px; background: linear-gradient(90deg, var(--sky-dark), var(--sky-mid));  }
.card-body { padding: 20px 22px; flex: 1; display: flex; color: #030303; flex-direction: column; gap: 10px; }
.card-text { display: flex; flex-direction: column; gap: 10px; }
.card-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.card-date { display: flex; align-items: center; gap: 4px; font-size: 0.72rem; color: var(--text-muted); }
.card-date svg { width: 11px; height: 11px; opacity: 0.7; }
.card-title { font-family: 'Fraunces', serif; font-size: 1.05rem; font-weight: 700; color: var(--text); line-height: 1.4; display: -webkit-box; line-clamp: 2; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card-desc { font-size: 0.845rem; color: var(--text-muted); line-height: 1.65; display: -webkit-box; line-clamp: 3; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.card-footer { padding: 14px 22px 18px; display: flex; flex-wrap: wrap; gap: 8px; border-top: 1px solid #f0f6fb; align-items: center; }

.btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 14px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 600; text-decoration: none; cursor: pointer; border: none; transition: all 0.18s; white-space: nowrap; justify-content: center; flex: 1 1 auto; }
.btn svg { width: 13px; height: 13px; }
.btn-primary { background: linear-gradient(135deg, var(--sky-dark), var(--sky)); color: #110f0f; box-shadow: 0 4px 12px rgba(14,165,233,0.28); }
.btn-primary:hover { opacity: 0.95; transform: translateY(-1px); }
.btn-download { background: var(--sky-light); color: var(--sky-dark); padding: 10px 16px; }
.btn-download:hover { background: var(--sky-dark); color: #fff; }

.cards-grid.list-view .notice-card { flex-direction: row; align-items: stretch; }
.cards-grid.list-view .card-accent { width: 4px; height: auto; background: linear-gradient(180deg, var(--sky-dark), var(--sky-mid)); }
.cards-grid.list-view .card-body { flex-direction: row; align-items: center; gap: 20px; padding: 18px 22px; }
.cards-grid.list-view .card-text { flex: 1; min-width: 0; }
.cards-grid.list-view .card-title { line-clamp: 1; -webkit-line-clamp: 1; font-size: 0.95rem; }
.cards-grid.list-view .card-desc { line-clamp: 1; -webkit-line-clamp: 1; font-size: 0.82rem; margin-top: 4px; }
.cards-grid.list-view .card-footer { border-top: none; border-left: 1px solid #f0f6fb; padding: 16px; flex-direction: row; flex-wrap: wrap; justify-content: center; align-items: center; width: auto; min-width: 160px; flex-shrink: 0; }
.cards-grid.list-view .card-meta { margin-bottom: 4px; }

.empty-state { text-align: center; padding: 64px 24px; color: var(--text-muted); }
.empty-icon { font-size: 3rem; margin-bottom: 16px; opacity: 0.5; }
.empty-state h3 { font-family: 'Fraunces', serif; font-size: 1.4rem; color: var(--text); margin-bottom: 8px; }

.pagination { max-width: 960px; margin: 36px auto 48px; padding: 0 24px; display: flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap; }
.page-btn { min-width: 38px; height: 38px; border-radius: 10px; border: 1.5px solid var(--border); background: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; transition: all 0.18s; padding: 0 10px; }
.page-btn:hover { border-color: var(--sky); color: var(--sky); background: var(--sky-light); }
.page-btn.active { background: var(--sky); border-color: var(--sky); color: #fff; box-shadow: 0 4px 12px rgba(14,165,233,0.28); }
.page-btn:disabled { opacity: 0.4; cursor: default; }
.page-btn svg { width: 14px; height: 14px; }
.page-ellipsis { color: var(--text-muted); font-size: 0.85rem; padding: 0 4px; }

@media (max-width: 640px) {
  .cards-grid.list-view .notice-card { flex-direction: column; }
  .cards-grid.list-view .card-accent { width: 100%; height: 4px; background: linear-gradient(90deg, var(--sky-dark), var(--sky-mid)); }
  .cards-grid.list-view .card-body { flex-direction: column; align-items: flex-start; }
  .cards-grid.list-view .card-footer { border-left: none; border-top: 1px solid #f0f6fb; width: 100%; flex-direction: row; }
  .controls-row { flex-direction: column; align-items: flex-start; }
}
</style>