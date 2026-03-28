<template>
  <section class="media-section-wrapper">
    <div class="media-section">
      <h2 class="section-title">Photo Albums</h2>

      <div v-if="websiteStore.isLoading" class="loading-state">
        <div class="skeleton-card" v-for="n in 6" :key="n"></div>
      </div>
      
      <div v-else-if="websiteStore.error" class="error-msg">
        <p>Could not load photo albums: {{ websiteStore.error }}</p>
      </div>

      <div v-else class="photo-row">
        <router-link
          v-for="folder in albums"
          :key="folder.id"
          :to="`/photogallery/${folder.id}`"
          class="photo-item"
        >
          <img :src="folder.url" :alt="folder.title" loading="lazy" />
          <div class="photo-info">
             <p class="photo-title">{{ folder.title }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useGalleryImageUrl } from '@/composables/useImageUrl'

const websiteStore = useWebsiteStore()

const albums = computed(() => {
  return websiteStore.getPhotoGalleries.map(g => {
    const source = g.media_url || g.image || g.contents?.[0] || ''
    const url = typeof source === 'string' && /^(https?:)?\/\//.test(source)
      ? source
      : useGalleryImageUrl(g.album_folder, source, g.institute_id)

    return {
      id: g.id,
      title: g.title,
      url
    }
  })
})
</script>

<style scoped>
.media-section-wrapper {
  padding: 40px 20px;
  background-color: #ffffff;
  min-height: 60vh;
}

.media-section {
  max-width: 1200px;
  margin: auto;
}

.section-title {
  text-align: center;
  margin-bottom: 25px;
  font-size: 28px;
  font-weight: 700;
  color: #0d6efd;
}

.photo-row {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.photo-item {
  flex: 0 0 280px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: transform 0.3s;
  text-decoration: none;
  color: inherit;
}

.photo-item:hover {
  transform: translateY(-6px);
}

.photo-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.photo-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  gap: 10px;
}

.photo-title {
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  color: #333;
}


@media (max-width: 768px) {
  .photo-row {
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .photo-item {
    flex: 0 0 240px;
  }
}

.loading-state {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.skeleton-card {
  height: 270px;
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
