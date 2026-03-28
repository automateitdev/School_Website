<template>
  <div
    class="updates-notice full-width"
    @mouseenter="pauseScroll"
    @mouseleave="startScroll"
  >
    <div class="notice-container">
      <div class="notice-label">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
        </svg>
        <span>Latest Updates</span>
      </div>
      
      <div class="notice-wrapper">
        <div
          class="notice-track"
          :style="{ transform: `translateX(${translateX}px)` }"
          ref="track"
        >
          <span v-if="websiteStore.isLoading" class="loading-text">
            Fetching latest updates...
          </span>
          <span
            v-else-if="repeatedNotices.length > 0"
            v-for="notice in repeatedNotices"
            :key="notice.uid"
            class="notice-item"
            @click="goToNotice(notice)"
          >
            <span class="notice-dot"></span>
            <span class="notice-text">{{ notice.title }}</span>
            <svg class="notice-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
          <span v-else class="loading-text">No updates available.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useWebsiteStore } from '@/stores/websiteStore'

const router = useRouter()
const track = ref(null)
const websiteStore = useWebsiteStore()

const speed = 1
const translateX = ref(-1000)
let animationId = null

const recentNotices = computed(() =>
  [...websiteStore.getNotices]
    .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
    .slice(0, 3)
)

const repeatedNotices = computed(() =>
  [...recentNotices.value, ...recentNotices.value].map((n, i) => ({
    ...n,
    uid: `${n.id}-${i}`
  }))
)

const goToNotice = (notice) => {
  router.push(`/notices/${notice.id}`)
}

const startScroll = () => {
  if (animationId) return

  const animate = () => {
    translateX.value += speed
    const trackWidth = track.value.offsetWidth / 2
    if (translateX.value >= 0) translateX.value = -trackWidth
    animationId = requestAnimationFrame(animate)
  }

  animationId = requestAnimationFrame(animate)
}

const pauseScroll = () => {
  cancelAnimationFrame(animationId)
  animationId = null
}

onMounted(startScroll)
onBeforeUnmount(pauseScroll)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap');

.updates-notice {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 0;
  overflow: hidden;
  border: none;
  border-radius: 0;
  position: relative;
  font-family: 'Inter', sans-serif;
}

.updates-notice::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.5) 50%, 
    transparent 100%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.notice-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 20px;
}

.notice-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.notice-label svg {
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.notice-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.notice-wrapper::before,
.notice-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100px;
  z-index: 2;
  pointer-events: none;
}

.notice-wrapper::before {
  left: 0;
  background: linear-gradient(to right, 
    rgba(30, 58, 138, 1) 0%, 
    rgba(30, 58, 138, 0) 100%);
}

.notice-wrapper::after {
  right: 0;
  background: linear-gradient(to left, 
    rgba(59, 130, 246, 1) 0%, 
    rgba(59, 130, 246, 0) 100%);
}

.notice-track {
  display: inline-flex;
  white-space: nowrap;
  will-change: transform;
  gap: 50px;
}

.notice-item {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.notice-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.2), 
    transparent);
  transition: left 0.5s ease;
}

.notice-item:hover::before {
  left: 100%;
}

.notice-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.notice-dot {
  width: 8px;
  height: 8px;
  background: #fbbf24;
  border-radius: 50%;
  flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.6; 
    transform: scale(1.2);
  }
}

.loading-text {
  color: white;
  opacity: 0.8;
  font-size: 15px;
  font-style: italic;
  padding: 0 20px;
}

.notice-text {
  flex: 1;
}

.notice-arrow {
  opacity: 0.7;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.notice-item:hover .notice-arrow {
  opacity: 1;
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .notice-container {
    gap: 15px;
    padding: 12px 15px;
  }

  .notice-label {
    padding: 8px 16px;
    font-size: 13px;
  }

  .notice-label span {
    display: none;
  }

  .notice-item {
    font-size: 14px;
    padding: 6px 16px;
  }
  
  .notice-wrapper::before,
  .notice-wrapper::after {
    width: 50px;
  }
}

@media (max-width: 480px) {
  .notice-label {
    padding: 8px;
  }
}
</style>