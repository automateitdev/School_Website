<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWebsiteStore } from '@/stores/websiteStore'

const router = useRouter()
const websiteStore = useWebsiteStore()

const videos = computed(() => {
  const storeVideos = websiteStore.getVideoGalleries
  return storeVideos.map(g => ({
    id: g.id,
    title: g.title,
    url: g.contents?.[0] || ''
  }))
})

const goToVideo = (id) => {
  router.push({ name: 'VideoDetail', params: { id } })
}
</script>

<template>
  <section class="media-section">
    <div v-if="websiteStore.isLoading" class="loading-state">
      <div class="skeleton-card" v-for="n in 6" :key="n"></div>
    </div>
    <div v-else-if="websiteStore.error" class="error-msg">
      Could not load video gallery: {{ websiteStore.error }}
    </div>
    <div v-else class="video-grid">
      <div
        v-for="video in videos"
        :key="video.id"
        class="video-item"
        @click="goToVideo(video.id)"
        style="cursor:pointer"
      >
        <video v-if="video.url.endsWith('.mp4')" :src="video.url" controls class="video-preview" @click.stop></video>
        <iframe v-else :src="video.url" frameborder="0" allowfullscreen class="video-preview"></iframe>
        <p class="video-title">{{ video.title }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.media-section {
  max-width: 1200px;
  margin: auto;
  padding: 40px 20px;
}

.section-title {
  text-align: center;
  color: #007bff;
  margin-bottom: 30px;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.video-item {
  background: #fff;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.video-preview {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  object-fit: cover;
}

.video-title {
  margin-top: 10px;
  text-align: center;
  font-weight: 500;
}

.loading-state {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.skeleton-card {
  height: 200px;
  background: #f0f0f0;
  border-radius: 12px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

.error-msg {
  text-align: center;
  color: #dc3545;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
</style>
