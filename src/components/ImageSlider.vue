<template>
  <div class="slider" v-if="websiteStore.isLoading">
    <div class="loading-placeholder"></div>
  </div>
  <div class="slider" v-else-if="slides.length > 0">
    <img :src="slides[current].src" alt="Slider Image" />

    <div class="timestamp">{{ slides[current].time }}</div>

    <div class="arrow left" @click="prevImage">&#10094;</div>
    <div class="arrow right" @click="nextImage">&#10095;</div>

    <div class="scroll-indicator" @click="scrollToAbout">
      <div class="scroll-arrow">▼</div>
    </div>
  </div>
  <div class="slider slider--empty" v-else>
    <div class="empty-placeholder">No slides available</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useSliderImageUrl } from '@/composables/useImageUrl'

const websiteStore = useWebsiteStore()

const slides = computed(() => {
  const storeSliders = websiteStore.getSliders
  return Array.isArray(storeSliders)
    ? storeSliders.map(s => ({
        src: useSliderImageUrl(s.slider_img),
        time: s.title || s.description || ''
      }))
    : []
})

const current = ref(0)

const nextImage = () => {
  current.value = (current.value + 1) % slides.value.length
}

const prevImage = () => {
  current.value = (current.value - 1 + slides.value.length) % slides.value.length
}

const scrollToAbout = () => {
  const about = document.getElementById('about-section')
  if (about) {
    const yOffset = -20
    const y = about.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

onMounted(() => {
  setInterval(nextImage, 5000)
})
</script>

<style scoped>
.slider {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9; 
  overflow: hidden;
  cursor: pointer;
}

.loading-placeholder {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

.empty-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  color: #64748b;
  font-weight: 500;
}

.slider img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.timestamp {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 1rem;
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(0);
  color: white;
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255,255,255,0.5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.4s ease;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}


.slider:hover .arrow.left {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

.slider:hover .arrow.right {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}


.arrow.left {
  left: 10px;
  transform: translateY(-50%) translateX(-50px);
}

.arrow.right {
  right: 10px;
  transform: translateY(-50%) translateX(50px);
}

.arrow:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-50%) scale(1.15);
  border-color: white;
}

.scroll-indicator {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 35px;
  height: 60px;
  border: 2px solid white;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  cursor: pointer;
}

.scroll-arrow {
  color: white;
  font-size: 18px;
  animation: scrollMove 1.5s infinite;
}

@keyframes scrollMove {
  0% { transform: translateY(8px); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(30px); opacity: 0; }
}

@media (max-width: 768px) {
  .slider { 
    aspect-ratio: 4 / 3; 
  }
  .timestamp { 
    font-size: 0.9rem; 
    padding: 4px 8px; 
  }
  .arrow { 
    font-size: 2rem; 
    width: 50px;
    height: 50px;
  }
  .scroll-indicator { 
    width: 30px; 
    height: 50px; 
  }
  .scroll-arrow { 
    font-size: 16px; 
  }
}
</style>
