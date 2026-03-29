<script setup>
import { computed, onMounted, ref } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useVideoUrl } from '@/composables/useImageUrl'

const websiteStore = useWebsiteStore()
const activeVideo = ref(null)
const searchQuery = ref('')

const slugify = (value) => String(value || '')
  .toLowerCase()
  .trim()
  .replace(/\s+/g, '-')
  .replace(/[^a-z0-9-]/g, '')

const normalizeVideoItem = (item) => {
  const contents = Array.isArray(item.contents)
    ? item.contents
    : item.contents
      ? [item.contents]
      : item.content
        ? Array.isArray(item.content)
          ? item.content
          : [item.content]
        : []

  const rawContent = Array.isArray(contents)
    ? contents.find(Boolean) || ''
    : contents || ''

  const rawUrl = item.video_url || item.embed_url || item.media_url || item.url || rawContent || ''

  return {
    id: item.id || slugify(item.slug || item.title) || 'unknown',
    title: item.title || 'Untitled Video',
    description: item.description || item.desc || item.summary || '',
    content_type: item.content_type || 'video',
    contents,
    video_url: rawUrl,
    thumbnail_url: item.thumbnail_url || item.thumb || item.image || '',
    slug: item.slug || slugify(item.title) || String(item.id ?? ''),
    category: item.category || item.video_category || '',
    tags: Array.isArray(item.tags)
      ? item.tags
      : item.tags
        ? String(item.tags).split(',').map(tag => tag.trim()).filter(Boolean)
        : [],
    author: item.author || item.created_by || '',
    institute_id: item.institute_id || null,
    created_at: item.created_at || item.updated_at || ''
  }
}

const videos = computed(() => {
  return (websiteStore.getVideoGalleries || [])
    .map(normalizeVideoItem)
    .filter(video => video.content_type === 'video')
})

const filteredVideos = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return videos.value.filter(video => {
    if (!query) return true
    return [video.title, video.description, video.category, ...(video.tags || [])]
      .join(' ')
      .toLowerCase()
      .includes(query)
  })
})

const openVideo = (video) => {
  activeVideo.value = video
}

const closeVideo = () => {
  activeVideo.value = null
}

const activeVideoSource = computed(() => {
  if (!activeVideo.value) return ''
  const rawSource = Array.isArray(activeVideo.value.contents)
    ? activeVideo.value.contents.find(Boolean) || activeVideo.value.video_url || activeVideo.value.content?.[0] || activeVideo.value.embed_url || activeVideo.value.media_url || activeVideo.value.url || activeVideo.value.path || ''
    : activeVideo.value.contents || activeVideo.value.content?.[0] || activeVideo.value.video_url || activeVideo.value.embed_url || activeVideo.value.media_url || activeVideo.value.url || activeVideo.value.path || ''
  return useVideoUrl(rawSource, activeVideo.value.institute_id)
})

const isEmbedUrl = computed(() => {
  const url = activeVideoSource.value || ''
  return /embed|youtube|vimeo|\/video\//i.test(url)
})

const thumbnailPlaceholder = 'https://via.placeholder.com/560x315?text=No+Thumbnail'

const isLoading = computed(() => websiteStore.isLoading)
const error = computed(() => websiteStore.error || '')

onMounted(async () => {
  if (!websiteStore.getVideoGalleries.length && !websiteStore.isLoading) {
    await websiteStore.fetchAllData()
  }
})
</script>

<template>
  <section class="video-gallery-page">
    <h1>Video Gallery</h1>

    <div class="gallery-actions">
      <input
        type="search"
        v-model="searchQuery"
        placeholder="Search videos by title, category or tags"
        aria-label="Search videos"
      />
    </div>

    <div v-if="isLoading" class="gallery-message">Loading videos...</div>
    <div v-else-if="error" class="gallery-message error">{{ error }}</div>
    <div v-else-if="filteredVideos.length === 0" class="gallery-message">No videos found.</div>

    <div v-else class="video-carousel">
      <article
        v-for="video in filteredVideos"
        :key="video.id"
        class="video-card"
        @click="openVideo(video)"
      >
        <div class="video-thumb">
          <img
            :src="video.thumbnail_url || thumbnailPlaceholder"
            :alt="video.title"
          />
          <span class="play-badge">Play</span>
        </div>
        <div class="video-card-body">
          <h2 class="video-card-title">{{ video.title }}</h2>
          <p class="video-card-description">{{ video.description || 'Click to open the video.' }}</p>
        </div>
      </article>
    </div>

    <div v-if="activeVideo" class="video-modal" @click.self="closeVideo">
      <div class="video-modal-content" @click.stop>
        <button class="close-button" @click="closeVideo">×</button>
        <div class="video-modal-header">
          <h2>{{ activeVideo.title }}</h2>
        </div>
        <p class="video-description">{{ activeVideo.description }}</p>
        <div class="video-frame">
          <iframe
            v-if="isEmbedUrl"
            :src="activeVideoSource"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <video
            v-else
            :src="activeVideoSource"
            controls
            autoplay
          ></video>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.video-gallery-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.video-gallery-page h1 {
  margin-bottom: 24px;
  font-size: 2rem;
  font-weight: 700;
  color: #0b4d91;
  text-align: center;
}

.gallery-message {
  text-align: center;
  color: #444;
  margin: 32px 0;
  font-size: 1rem;
}

.gallery-message.error {
  color: #d33;
}

.gallery-actions {
  display: flex;
  justify-content: center;
  margin-bottom: 22px;
}

.gallery-actions input {
  width: min(100%, 520px);
  padding: 12px 16px;
  border: 1px solid #d3dce6;
  border-radius: 999px;
  outline: none;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.gallery-actions input:focus {
  border-color: #0d6efd;
}

.details-button {
  margin-top: 14px;
  padding: 10px 18px;
  border: none;
  border-radius: 999px;
  background: #0d6efd;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.details-button:hover {
  background: #0b5ed7;
  transform: translateY(-1px);
}

.video-carousel {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
  scroll-snap-type: x proximity;
}

.video-carousel::-webkit-scrollbar {
  height: 10px;
}

.video-carousel::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 999px;
}

.video-card {
  scroll-snap-align: start;
  flex: 0 0 min(320px, 80%);
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.video-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 22px 50px rgba(0, 0, 0, 0.12);
}

.video-thumb {
  position: relative;
}

.video-thumb img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

.play-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.85rem;
  letter-spacing: 0.02em;
}

.video-card-body {
  padding: 18px;
}

.video-card-title {
  margin: 0 0 10px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #111;
}

.video-card-description {
  margin: 0;
  color: #555;
  line-height: 1.5;
  min-height: 3rem;
}

.video-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 12px;
}

.video-modal-content {
  width: 100%;
  height: 100%;
  max-width: 1200px;
  max-height: 100%;
  background: #111;
  border-radius: 16px;
  padding: 24px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.video-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.video-modal-header h2 {
  color: #fff;
  font-size: 1.5rem;
  margin: 0;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 1.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.24);
}

.video-description {
  color: #e5e7eb;
  margin-bottom: 18px;
}

.video-frame {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  border-radius: 14px;
  overflow: hidden;
}

.video-frame iframe,
.video-frame video {
  width: 100%;
  height: 100%;
  border: 0;
}

.close-button {
  position: absolute;
  top: 18px;
  right: 18px;
  border: none;
  background: #111;
  color: #fff;
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
}

.video-modal-content h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #111;
}

.video-description {
  margin: 12px 0 0;
  color: #555;
  line-height: 1.6;
}

.video-frame {
  width: 100%;
  aspect-ratio: 16 / 9;
  margin-top: 22px;
  background: #000;
  border-radius: 16px;
  overflow: hidden;
}

.video-frame iframe,
.video-frame video {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
