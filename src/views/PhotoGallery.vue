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

      <div v-else class="photo-grid">
        <div
          v-for="folder in albums"
          :key="folder.id"
          class="photo-item"
          @click="goToFolder(folder.id)"
        >
          <img :src="folder.url" :alt="folder.title" loading="lazy" />
          <div class="photo-info">
             <p class="photo-title">{{ folder.title }}</p>
             <button class="view-folder-btn">View Folder</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWebsiteStore } from '@/stores/websiteStore'

const router = useRouter()
const websiteStore = useWebsiteStore()

const albums = computed(() => {
  return websiteStore.getPhotoGalleries.map(g => ({
    id: g.id,
    title: g.title,
    url: `https://web.academyims.com/storage/${g?.institute_id}/images/gallery/${g?.album_folder}/${g?.image}`
  }))
})

const goToFolder = (id) => {
  router.push(`/photogallery/${id}`)
}
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

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.photo-item {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: transform 0.3s;
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

.view-folder-btn {
  padding: 8px 16px;
  border-radius: 6px;
  background-color: #f0f4ff;
  color: #0d6efd;
  border: 1px solid #0d6efd;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.view-folder-btn:hover {
  background-color: #0d6efd;
  color: #fff;
}

@media (max-width: 768px) {
  .photo-grid { 
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
  }
}

@media (max-width: 480px) {
  .photo-grid { 
    grid-template-columns: 1fr; 
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
