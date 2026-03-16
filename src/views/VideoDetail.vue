<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWebsiteStore } from '@/stores/websiteStore'

const route = useRoute()
const router = useRouter()
const websiteStore = useWebsiteStore()

const videoId = Number(route.params.id)

const video = computed(() => {
  const storeVideo = websiteStore.getGalleryById(videoId)
  if (storeVideo) {
    return {
      id: storeVideo.id,
      title: storeVideo.title,
      url: storeVideo.contents?.[0] || ''
    }
  }
  return null
})
</script>

<template>
  <section class="media-section">
    <button @click="router.back()" class="back-btn">← Back</button>

    <div v-if="websiteStore.isLoading" class="loading-text">Loading video details...</div>
    <div class="video-container" v-else-if="video">
      <h1 class="video-title">{{ video.title }}</h1>
      <video 
        v-if="video.url.endsWith('.mp4')" 
        :src="video.url" 
        controls 
        class="video-preview" 
        autoplay
      ></video>
      <iframe 
        v-else 
        :src="video.url" 
        frameborder="0" 
        allowfullscreen
        class="video-preview"
      ></iframe>
    </div>

    <p v-else class="not-found">Video not found</p>
  </section>
</template>

<style scoped>
.media-section {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.back-btn {
  align-self: flex-start;
  margin-bottom: 30px;
  padding: 10px 20px;
  border: none;
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  color: white;
  font-weight: 600;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.video-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.video-preview {
  width: 100%;
  max-width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  border: 2px solid #ddd;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  background: #000;
}

.not-found {
  color: #ff4d4f;
  font-weight: 600;
  margin-top: 40px;
}

.loading-text {
  font-size: 18px;
  color: #666;
  margin-top: 40px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>
