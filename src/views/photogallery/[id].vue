<template>
  <section class="photo-album-page">
    <div class="photo-album__container">
      <button class="back-btn" @click="router.back()">← Back</button>

      <div v-if="websiteStore.isLoading" class="status">Loading album...</div>
      <div v-else-if="error" class="status status--error">{{ error }}</div>
      <div v-else-if="!album" class="status">Album not found.</div>
      <div v-else-if="album.content_type !== 'image'" class="status">
        This gallery is not a photo album. Visit the video gallery instead.
      </div>
      <div v-else>
        <header class="photo-album__header">
          <h1>{{ album.title }}</h1>
          <p v-if="album.description || album.content || album.summary">{{ album.description || album.content || album.summary }}</p>
        </header>

        <div class="photo-album__grid">
          <button
            v-for="(imageName, idx) in album.contents"
            :key="idx"
            type="button"
            class="photo-card"
            @click="openZoom(idx)"
          >
            <img :src="getImageUrl(imageName)" :alt="`Photo ${idx + 1}`" />
            <div class="photo-card__label">Photo {{ idx + 1 }}</div>
          </button>
        </div>
      </div>

      <div v-if="activeIndex !== null" class="photo-modal" @click.self="closeZoom" @touchstart="onTouchStart" @touchend="onTouchEnd">
        <div class="photo-modal__content">
          <button class="close-button" @click="closeZoom">✕</button>
          <button class="nav-button prev" @click="previousPhoto" aria-label="Previous photo">←</button>
          <img
            v-if="selectedPhotoUrl"
            :src="selectedPhotoUrl"
            :alt="`Photo ${activeIndex + 1}`"
            class="modal-image"
          />
          <button class="nav-button next" @click="nextPhoto" aria-label="Next photo">→</button>
          <div class="modal-caption">Photo {{ activeIndex + 1 }} of {{ album.contents.length }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useGalleryImageUrl } from '@/composables/useImageUrl'

const route = useRoute()
const router = useRouter()
const websiteStore = useWebsiteStore()
const error = ref('')
const activeIndex = ref(null)

const albumIdentifier = computed(() => String(route.params.id || '').trim())

const album = computed(() => {
  const galleries = websiteStore.getPhotoGalleries
  return galleries.find(item =>
    String(item.id) === albumIdentifier.value ||
    String(item.slug || '').toLowerCase() === albumIdentifier.value.toLowerCase()
  ) || null
})

const getImageUrl = (imageName) => {
  if (!album.value || !imageName) return ''
  return useGalleryImageUrl(album.value.album_folder, imageName, album.value.institute_id)
}

const selectedPhotoName = computed(() => {
  if (!album.value?.contents?.length || activeIndex.value === null) return ''
  const index = Math.max(0, Math.min(activeIndex.value, album.value.contents.length - 1))
  return album.value.contents[index]
})

const selectedPhotoUrl = computed(() => getImageUrl(selectedPhotoName.value))

const openZoom = (index) => {
  if (!album.value?.contents?.length) return
  activeIndex.value = index
}

const closeZoom = () => {
  activeIndex.value = null
}

const nextPhoto = () => {
  if (!album.value?.contents?.length || activeIndex.value === null) return
  activeIndex.value = (activeIndex.value + 1) % album.value.contents.length
}

const previousPhoto = () => {
  if (!album.value?.contents?.length || activeIndex.value === null) return
  activeIndex.value = (activeIndex.value - 1 + album.value.contents.length) % album.value.contents.length
}

const onKeydown = (event) => {
  if (activeIndex.value === null) return
  if (event.key === 'ArrowRight') nextPhoto()
  if (event.key === 'ArrowLeft') previousPhoto()
  if (event.key === 'Escape') closeZoom()
}

let touchStartX = 0
let touchEndX = 0

const onTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX
}

const onTouchEnd = (e) => {
  touchEndX = e.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  if (activeIndex.value === null) return
  const swipeThreshold = 50
  if (touchStartX - touchEndX > swipeThreshold) {
    nextPhoto()
  } else if (touchEndX - touchStartX > swipeThreshold) {
    previousPhoto()
  }
}

const loadAlbum = async () => {
  if (!websiteStore.getPhotoGalleries.length) {
    try {
      await websiteStore.fetchAllData()
    } catch (e) {
      error.value = e?.message || 'Unable to load album.'
    }
  }
  if (album.value && album.value.content_type !== 'image') {
    error.value = 'This gallery is not a photo album.'
  }
  activeIndex.value = null
}

onMounted(async () => {
  await loadAlbum()
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

watch(albumIdentifier, () => {
  activeIndex.value = null
  loadAlbum()
})
</script>

<style scoped>
.photo-album__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.back-btn {
  margin-bottom: 24px;
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  background: #0d6efd;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.status {
  color: #374151;
  padding: 28px 0;
  text-align: center;
}

.status--error {
  color: #b91c1c;
}

.photo-album__header h1 {
  margin: 0 0 10px;
  font-size: clamp(2rem, 3vw, 2.6rem);
  color: #111827;
}

.photo-album__header p {
  margin: 0;
  color: #4b5563;
  line-height: 1.75;
}

.photo-album__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.photo-card {
  display: block;
  width: 100%;
  background: #fff;
  border: none;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
  transition: transform 0.2s;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.photo-card:hover {
  transform: translateY(-4px);
}

.photo-card.active {
  outline: 3px solid #0d6efd;
}

.album-viewer {
  display: grid;
  gap: 24px;
}

.viewer-frame {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 20px;
  overflow: hidden;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.72);
  color: #fff;
  font-size: 1.25rem;
  cursor: pointer;
  z-index: 1;
}

.nav-button.prev {
  left: 12px;
}

.nav-button.next {
  right: 12px;
}

.selected-photo {
  width: 100%;
  object-fit: contain;
  max-height: 60vh;
}

.viewer-meta {
  font-size: 0.95rem;
  color: #475569;
  text-align: center;
}

.photo-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.photo-card__label {
  padding: 14px;
  font-weight: 600;
  color: #111827;
}

.photo-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.photo-modal__content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}

.modal-image {
  width: 100%;
  max-width: 1080px;
  max-height: calc(100vh - 160px);
  object-fit: contain;
  border-radius: 20px;
  box-shadow: 0 36px 90px rgba(0, 0, 0, 0.35);
}

.photo-modal .nav-button {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 1.55rem;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  cursor: pointer;
}

.photo-modal .nav-button:hover {
  background: rgba(255, 255, 255, 0.25);
}

.photo-modal .nav-button.prev {
  left: 24px;
}

.photo-modal .nav-button.next {
  right: 24px;
}

.close-button {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.28);
}

.modal-caption {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  color: #f8fafc;
  font-weight: 600;
  text-align: center;
}

@media (max-width: 768px) {
  .nav-button,
  .photo-modal .nav-button {
    display: none;
  }

  .photo-album__grid {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 16px;
    padding-bottom: 20px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  
  .photo-album__grid::-webkit-scrollbar {
    display: none;
  }
  
  .photo-card {
    flex: 0 0 85%;
    scroll-snap-align: center;
  }
}
</style>
