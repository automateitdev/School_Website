<template>
  <div class="notice-board">
    <div class="board-header">
      <div class="header-left">
        <span class="live-badge">
          <span class="live-dot"></span>Live Updates
        </span>
        <h3 class="board-title">Notice Board</h3>
      </div>
      <router-link to="/notices" class="header-all-link">All notices →</router-link>
    </div>

    <div class="section-divider"></div>

    <div v-if="websiteStore.isLoading" class="skeleton-wrap">
      <div class="skeleton-item" v-for="n in 6" :key="n"></div>
    </div>

    <marquee
      v-else-if="visibleNotices.length > 0"
      direction="up"
      scrollamount="4"
      onmouseover="this.stop();"
      onmouseout="this.start();"
      class="notice-marquee"
    >
      <ul class="notice-list" ref="listEl">
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
                <svg viewBox="0 0 16 16" fill="currentColor" class="date-icon">
                  <path d="M5 1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-1V1a1 1 0 0 0-2 0v1H5V1zm9 5H2V4h12v2z"/>
                </svg>
                {{ formatDate(n.created_at || n.date) }}
              </span>
            </span>
            <span class="notice-chevron">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
              </svg>
            </span>
          </router-link>
        </li>
      </ul>
    </marquee>

    <div v-else class="empty-state">
      <div class="empty-icon">📋</div>
      <p>No notices found.</p>
    </div>

    <router-link to="/notices" class="see-all-btn">
      <span>View All Notices</span>
      <svg viewBox="0 0 20 20" fill="currentColor" class="btn-icon">
        <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
      </svg>
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
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

.notice-board {
  background: #ffffff;
  border-radius: 0;
  border: 1px solid #cce3f0;
  border-top: none;
  box-shadow: 0 8px 40px rgba(14, 90, 140, 0.13), 0 2px 8px rgba(14, 90, 140, 0.07);
  overflow: hidden;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.board-header {
  background: linear-gradient(135deg, #0e5a8c 0%, #1a8dbf 60%, #38b6e0 100%);
  padding: 18px 16px 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.board-header::before {
  content: '';
  position: absolute;
  right: -40px;
  top: -40px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.07);
}

.board-header::after {
  content: '';
  position: absolute;
  right: 30px;
  bottom: -50px;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 7px;
  position: relative;
  z-index: 1;
}

.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 3px 10px 3px 7px;
  border-radius: 999px;
  width: fit-content;
  backdrop-filter: blur(6px);
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #7effc0;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(126, 255, 192, 0.6); }
  50%       { box-shadow: 0 0 0 5px rgba(126, 255, 192, 0); }
}

.board-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
  letter-spacing: -0.01em;
  margin: 0;
  position: relative;
  z-index: 1;
}

.header-all-link {
  font-size: 0.72rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  letter-spacing: 0.04em;
  transition: color 0.2s;
  margin-top: 5px;
  white-space: nowrap;
  position: relative;
  z-index: 1;
}

.header-all-link:hover { color: #fff; }

.section-divider {
  height: 3px;
  background: linear-gradient(90deg, #0e5a8c, #38b6e0, #cce3f0);
}

.skeleton-wrap {
  padding: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.skeleton-item {
  height: 62px;
  border-bottom: 1px solid #edf5fa;
  background: linear-gradient(90deg, #eaf5fb 25%, #f4fafd 50%, #eaf5fb 75%);
  background-size: 300% 100%;
  animation: shimmer 1.6s infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.notice-marquee {
  flex: 1;
  overflow: hidden;
}

.notice-list {
  list-style: none;
  padding: 6px 0 4px;
  margin: 0;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #b8d9ed transparent;
}

.notice-list::-webkit-scrollbar { width: 3px; }
.notice-list::-webkit-scrollbar-thumb { background: #b8d9ed; border-radius: 3px; }

.notice-item {
  border-bottom: 1px solid #edf5fa;
  animation: fadeUp 0.32s ease both;
}

.notice-item:last-child { border-bottom: none; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.notice-link {
  display: grid;
  grid-template-columns: 34px 1fr 18px;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  text-decoration: none;
  color: inherit;
  transition: background 0.15s;
  position: relative;
}

.notice-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #1a8dbf, #38b6e0);
  border-radius: 0 2px 2px 0;
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.22s ease;
}

.notice-link:hover::before { transform: scaleY(1); }
.notice-link:hover { background: #f0f9fd; }
.notice-link:hover .notice-chevron { opacity: 1; transform: translateX(3px); }
.notice-link:hover .notice-index { color: #1a8dbf; }

.notice-index {
  font-family: 'Playfair Display', serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: #aecfe3;
  line-height: 1;
  text-align: right;
  transition: color 0.2s;
}

.notice-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.notice-title {
  font-size: 0.845rem;
  font-weight: 500;
  color: #1a3a4a;
  line-height: 1.45;
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
  font-size: 0.7rem;
  color: #7aafc8;
  font-weight: 400;
}

.date-icon {
  width: 10px;
  height: 10px;
  opacity: 0.7;
}

.notice-chevron {
  width: 15px;
  height: 15px;
  color: #1a8dbf;
  opacity: 0;
  transition: opacity 0.2s, transform 0.2s;
  flex-shrink: 0;
}

.notice-chevron svg { width: 15px; height: 15px; }

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 16px;
}

.empty-icon { font-size: 2rem; opacity: 0.4; }

.empty-state p {
  color: #8cb8cc;
  font-size: 0.875rem;
  margin: 0;
}

.see-all-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #0e5a8c, #1a8dbf);
  color: #fff;
  text-decoration: none;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: opacity 0.2s;
}

.see-all-btn:hover { opacity: 0.92; }
.see-all-btn:hover .btn-icon { transform: translateX(4px); }

.btn-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
}

@media (max-width: 640px) {
  .board-header {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
    padding: 16px 14px 14px;
  }

  .header-all-link {
    margin-top: 0;
    white-space: normal;
  }

  .board-title {
    font-size: 1.35rem;
  }

  .notice-link {
    grid-template-columns: 28px 1fr;
    gap: 8px;
    padding: 10px 10px 10px 12px;
  }

  .notice-chevron {
    display: none;
  }

  .notice-title {
    font-size: 0.8rem;
  }

  .notice-date {
    font-size: 0.68rem;
    flex-wrap: wrap;
  }

  .see-all-btn {
    padding: 12px 14px;
    font-size: 0.72rem;
    letter-spacing: 0.05em;
  }
}
</style>
