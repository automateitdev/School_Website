<template>
  <div class="notice-board">
    <div class="board-header">
      <div class="header-left">
        <span class="live-badge">
          <span class="live-dot"></span>Live
        </span>
        <h3 class="board-title">Notice Board</h3>
      </div>
      <router-link to="/notices" class="header-all-link">See all →</router-link>
    </div>

    <div v-if="websiteStore.isLoading" class="skeleton-wrap">
      <div class="skeleton-item" v-for="n in 6" :key="n"></div>
    </div>

    <ul v-else-if="visibleNotices.length > 0" class="notice-list" ref="listEl">
      <li
        v-for="(n, idx) in visibleNotices"
        :key="n.id"
        class="notice-item"
        :style="{ animationDelay: `${idx * 0.04}s` }"
      >
        <router-link :to="`/notices/${n.id}`" class="notice-link">
          <span class="notice-index">{{ String(idx + 1).padStart(2, '0') }}</span>
          <span class="notice-body">
            <span class="notice-title">{{ n.name || n.title }}</span>
            <span class="notice-date">
              <svg viewBox="0 0 16 16" fill="currentColor" class="date-icon"><path d="M5 1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-1V1a1 1 0 0 0-2 0v1H5V1zm9 5H2V4h12v2z"/></svg>
              {{ formatDate(n.created_at || n.date) }}
            </span>
          </span>
          <span class="notice-chevron">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
          </span>
        </router-link>
      </li>
    </ul>

    <div v-else class="empty-state">
      <div class="empty-icon">📋</div>
      <p>No notices found.</p>
    </div>

    <router-link to="/notices" class="see-all-btn">
      <span>View all notices</span>
      <svg viewBox="0 0 20 20" fill="currentColor" class="btn-icon"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
    </router-link>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'

const websiteStore = useWebsiteStore()
const listEl = ref(null)

const visibleNotices = computed(() =>
  [...(websiteStore.getNotices || [])]
    .sort((a, b) => new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0))
    .slice(0, 9)
)

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');

.notice-board {
  background: #fff;
  border-radius: 20px;
  border: 1px solid #dde8ef;
  box-shadow: 0 4px 32px rgba(0, 55, 80, 0.08);
  overflow: hidden;
  font-family: 'Hind Siliguri', sans-serif;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.board-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding: 14px 18px 12px;
  background: linear-gradient(135deg, #003f4f 0%, #05768e 100%);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: 999px;
  text-transform: uppercase;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 2px rgba(74,222,128,0.35);
  animation: pulse-dot 1.8s infinite;
}

@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 2px rgba(74,222,128,0.35); }
  50%       { box-shadow: 0 0 0 5px rgba(74,222,128,0.1); }
}

.board-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.01em;
}

.header-all-link {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  transition: color 0.2s;
  white-space: nowrap;
  margin-left: auto;
}
.header-all-link:hover { color: #fff; }

.skeleton-wrap {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
}

.skeleton-item {
  height: 52px;
  background: linear-gradient(90deg, #eef4f7 25%, #f5fafb 50%, #eef4f7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 12px;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.notice-list {
  list-style: none;
  padding: 8px 0 4px;
  margin: 0;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #c8dce4 transparent;
}

.notice-list::-webkit-scrollbar { width: 4px; }
.notice-list::-webkit-scrollbar-thumb { background: #c8dce4; border-radius: 4px; }

.notice-item {
  border-bottom: 1px solid #eef4f7;
  animation: slideIn 0.35s ease both;
}
.notice-item:last-child { border-bottom: none; }

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}

.notice-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  text-decoration: none;
  color: inherit;
  transition: background 0.18s;
}
.notice-link:hover { background: #f0f8fb; }
.notice-link:hover .notice-chevron { opacity: 1; transform: translateX(3px); }

.notice-index {
  flex-shrink: 0;
  font-size: 0.7rem;
  font-weight: 700;
  color: #0a728a;
  min-width: 22px;
  opacity: 0.7;
}

.notice-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.notice-title {
  font-size: 0.845rem;
  font-weight: 600;
  color: #1a3540;
  line-height: 1.35;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notice-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  color: #7a9baa;
  font-weight: 400;
}

.date-icon {
  width: 11px;
  height: 11px;
  opacity: 0.7;
}

.notice-chevron {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  color: #0a728a;
  opacity: 0;
  transition: opacity 0.2s, transform 0.2s;
}

.notice-chevron svg { width: 16px; height: 16px; }

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 16px;
}
.empty-icon { font-size: 2rem; }
.empty-state p {
  margin: 0;
  color: #9ab3be;
  font-size: 0.9rem;
}

.see-all-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 20px;
  background: linear-gradient(135deg, #003f4f, #05768e);
  color: #fff;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: opacity 0.2s, gap 0.2s;
  margin-top: auto;
}
.see-all-btn:hover { opacity: 0.9; gap: 12px; }
.btn-icon { width: 17px; height: 17px; }
</style>
