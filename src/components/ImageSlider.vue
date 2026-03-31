<template>
  <div v-if="websiteStore.isLoading" class="slider slider--skeleton">
    <div class="skeleton-shimmer"></div>
    <div class="skeleton-dots">
      <span v-for="n in 4" :key="n" class="skeleton-dot"></span>
    </div>
  </div>

  <div v-else-if="slides.length > 0" class="slider" @mouseenter="pauseAuto" @mouseleave="resumeAuto">
    <transition-group name="fade" tag="div" class="slides-track">
      <div
        v-for="(slide, i) in slides"
        :key="i"
        v-show="current === i"
        class="slide"
      >
        <img :src="slide.src" :alt="slide.caption || 'Slide image'" class="slide-img" />
        <div v-if="slide.caption" class="slide-caption">
          <span>{{ slide.caption }}</span>
        </div>
      </div>
    </transition-group>

    <div class="overlay overlay--bottom"></div>

    <button class="arrow arrow--left" @click="prevImage" aria-label="Previous slide">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <button class="arrow arrow--right" @click="nextImage" aria-label="Next slide">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
    </button>

    <div class="dots">
      <button
        v-for="(_, i) in slides"
        :key="i"
        class="dot"
        :class="{ 'dot--active': current === i }"
        @click="goTo(i)"
        :aria-label="`Go to slide ${i + 1}`"
      ></button>
    </div>

    <div class="progress-bar" :style="{ width: progressWidth + '%' }"></div>
  </div>

  <div v-else class="slider slider--empty">
    <div class="empty-icon">🖼️</div>
    <p>No slides available</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useSliderImageUrl } from '@/composables/useImageUrl'

const websiteStore = useWebsiteStore()

const slides = computed(() => {
  const storeSliders = websiteStore.getSliders
  return Array.isArray(storeSliders)
    ? storeSliders.map(s => ({
        src: useSliderImageUrl(s),
        caption: s.title || s.description || ''
      }))
    : []
})

const current = ref(0)
const progressWidth = ref(0)
let autoTimer = null
let progressTimer = null
const INTERVAL = 5000
const TICK = 50

const goTo = (i) => {
  current.value = i
  resetProgress()
}
const nextImage = () => goTo((current.value + 1) % slides.value.length)
const prevImage = () => goTo((current.value - 1 + slides.value.length) % slides.value.length)

const resetProgress = () => {
  progressWidth.value = 0
  clearInterval(progressTimer)
  progressTimer = setInterval(() => {
    progressWidth.value += (TICK / INTERVAL) * 100
    if (progressWidth.value >= 100) progressWidth.value = 100
  }, TICK)
}

const startAuto = () => {
  clearInterval(autoTimer)
  autoTimer = setInterval(nextImage, INTERVAL)
  resetProgress()
}

const pauseAuto = () => {
  clearInterval(autoTimer)
  clearInterval(progressTimer)
}

const resumeAuto = () => startAuto()

onMounted(() => startAuto())
onUnmounted(() => { clearInterval(autoTimer); clearInterval(progressTimer) })
</script>

<style scoped>
.slider {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 20px;
  background: #0d1f2d;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.25);
}

.slider--skeleton {
  background: #e2e8f0;
}

.skeleton-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, #e2e8f0 30%, #f0f4f8 50%, #e2e8f0 70%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-dots {
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.skeleton-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cbd5e1;
}

.slides-track {
  position: absolute;
  inset: 0;
}

.slide {
  position: absolute;
  inset: 0;
}

.slide-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-caption {
  position: absolute;
  bottom: 56px;
  left: 0;
  right: 0;
  padding: 0 20px 16px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 2px 12px rgba(0,0,0,0.7);
  line-height: 1.4;
}

.overlay {
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
}
.overlay--bottom {
  bottom: 0;
  height: 55%;
  background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%);
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.55);
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(6px);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s, background 0.2s, transform 0.3s;
  z-index: 10;
}

.arrow svg {
  width: 20px;
  height: 20px;
}

.arrow--left { left: 14px; }
.arrow--right { right: 14px; }

.slider:hover .arrow { opacity: 1; }
.arrow:hover {
  background: rgba(255,255,255,0.2);
  border-color: #fff;
  transform: translateY(-50%) scale(1.1);
}

.dots {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 7px;
  z-index: 10;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.45);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.dot--active {
  background: #fff;
  width: 24px;
  border-radius: 4px;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #38bdf8, #0ea5e9);
  transition: width 0.05s linear;
  z-index: 10;
}

.slider--empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #f8fafc;
  border: 2px dashed #e2e8f0;
}

.empty-icon { font-size: 2.5rem; }
.slider--empty p {
  color: #94a3b8;
  font-size: 0.95rem;
  margin: 0;
}

@media (max-width: 768px) {
  .slider { aspect-ratio: 4 / 3; border-radius: 14px; }
  .slide-caption { font-size: 0.88rem; }
  .arrow { width: 36px; height: 36px; }
}
</style>
