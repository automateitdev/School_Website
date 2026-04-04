<template>
  <section class="media-section-wrapper">
    <div class="media-section">
      <h2 class="section-title">{{ album?.title || 'Loading...' }}</h2>

      <div class="back-link">
        <router-link to="/photogallery" class="back-btn">← Back to Albums</router-link>
      </div>

      <div v-if="websiteStore.isLoading" class="loading-state">
        <div class="skeleton-card" v-for="n in 6" :key="n"></div>
      </div>
      
      <div v-else-if="websiteStore.error" class="error-msg">
        <p>Could not load album: {{ websiteStore.error }}</p>
      </div>

      <div class="photo-grid" v-else-if="album">
        <div
          v-for="(imageName, idx) in album.contents"
          :key="idx"
          class="photo-item"
          @click="openPhoto(idx)"
        >
          <img :src="getImageUrl(imageName, album.album_folder)" :alt="`Photo ${idx + 1}`" />
        </div>
      </div>
      
      <div v-else class="not-found">
        <p>Album not found.</p>
      </div>
    </div>

    <div v-if="selectedPhotoIndex !== null" class="modal" @click.self="closePhoto">
      <img class="modal-img" :src="getImageUrl(album.contents[selectedPhotoIndex], album.album_folder)" :alt="`Photo ${selectedPhotoIndex + 1}`" />

      <p class="modal-title">{{ album.title }} - Photo {{ selectedPhotoIndex + 1 }}</p>

      <button class="close-btn" @click="closePhoto">×</button>

      <button class="nav-btn prev-btn" @click.stop="prevPhoto">‹</button>
      <button class="nav-btn next-btn" @click.stop="nextPhoto">›</button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useGalleryImageUrl } from '@/composables/useImageUrl'

const route = useRoute()
const websiteStore = useWebsiteStore()

const albumId = computed(() => route.params.id)
const album = computed(() => websiteStore.getGalleryById(albumId.value))

const getImageUrl = (imageName, folder) => {
  return useGalleryImageUrl(folder, imageName, album.value?.institute_id)
}

const openPhoto = (idx) => {
  selectedPhotoIndex.value = idx
}

const closePhoto = () => {
  selectedPhotoIndex.value = null
}

const prevPhoto = () => {
  if (!album.value?.contents) return
  const len = album.value.contents.length
  selectedPhotoIndex.value = (selectedPhotoIndex.value - 1 + len) % len
}

const nextPhoto = () => {
  if (!album.value?.contents) return
  const len = album.value.contents.length
  selectedPhotoIndex.value = (selectedPhotoIndex.value + 1) % len
}

const handleKey = (e) => {
  if (selectedPhotoIndex.value === null) return
  if (e.key === 'ArrowRight') nextPhoto()
  if (e.key === 'ArrowLeft') prevPhoto()
  if (e.key === 'Escape') closePhoto()
}

onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => window.removeEventListener('keydown', handleKey))

watch(selectedPhotoIndex, (newVal) => {
  if (newVal !== null) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = ''
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
  margin-bottom: 15px;
  font-size: 28px;
  font-weight: 700;
  color: #0d6efd;
}

.back-link {
  margin-bottom: 25px;
  text-align: center;
}

.back-btn {
  color: #6c757d;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #0d6efd;
}

.not-found {
  text-align: center;
  color: #dc3545;
  font-size: 18px;
  margin-top: 50px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
}

.photo-item {
  background: #eee;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: transform 0.3s;
}

.photo-item:hover {
  transform: scale(1.03);
}

.photo-item img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
}

.loading-state {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
}

.skeleton-card {
  aspect-ratio: 4/3;
  background: #f0f0f0;
  border-radius: 8px;
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 9999;
}

.modal-img {
  max-width: 90%;
  max-height: 80%;
  object-fit: contain;
  border-radius: 4px;
}

.modal-title {
  color: #fff;
  margin-top: 15px;
  font-size: 16px;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #fff;
  color: #333;
  border: none;
  font-size: 28px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10000;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #f0f0f0;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.8);
  color: #333;
  border: none;
  font-size: 36px;
  width: 50px;
  height: 60px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  transition: background 0.2s;
}

.nav-btn:hover {
  background: rgba(255,255,255,1);
}

.prev-btn { left: 15px; }
.next-btn { right: 15px; }

@media (max-width: 768px) {
  .photo-grid { 
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); 
  }
  .nav-btn { 
    width: 40px; 
    height: 50px; 
    font-size: 28px; 
  }
}

@media (max-width: 480px) {
  .photo-grid { 
    grid-template-columns: 1fr 1fr; 
    gap: 10px; 
  }
  .nav-btn { 
    width: 35px; 
    height: 45px; 
    font-size: 24px; 
  }
  .close-btn { 
    width: 36px; 
    height: 36px; 
    font-size: 24px; 
  }
}
</style>
