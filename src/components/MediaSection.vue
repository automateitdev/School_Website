<template>
  <section class="media-section-wrapper">
    <div class="media-section">

      <h2 class="section-title">Video Gallery</h2>
      <div v-if="websiteStore.isLoading" class="loading-state">
        <div class="skeleton-card" v-for="n in 3" :key="'vid'+n"></div>
      </div>
      <div v-else-if="videos.length === 0" class="empty-state">No videos available.</div>
      <div v-else>
        <div class="video-grid">
          <div
            v-for="video in videos.slice(0,4)"
            :key="video.id"
            class="video-item"
            @click="goToVideo(video)"
            style="cursor:pointer"
          >
            <video v-if="/\.(mp4|webm|ogg)(\?.*)?$/i.test(video.url)" :src="video.url" controls class="video-preview" @click.stop></video>
            <iframe
              v-else
              :src="video.url"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="video-preview"
            ></iframe>
            <p class="video-title">{{ video.title }}</p>
          </div>
        </div>
        <div class="see-more" v-if="websiteStore.getVideoGalleries.length > 4">
          <router-link to="/videos" class="see-more-link">See More</router-link>
        </div>
      </div>

      <div v-if="activeVideo" class="video-modal" @click.self="activeVideo = null">
        <div class="video-modal-content" @click.stop>
          <button class="close-button" @click="activeVideo = null">×</button>
          <div class="video-modal-header">
            <h2>{{ activeVideo.title }}</h2>
          </div>
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

      <h2 class="section-title">Photo Gallery</h2>
      <div v-if="websiteStore.isLoading" class="loading-state">
        <div class="skeleton-card" v-for="n in 3" :key="'img'+n"></div>
      </div>
      <div v-else-if="photos.length === 0" class="empty-state">No photos available.</div>
      <div v-else>
        <div class="photo-grid">
          <div
            v-for="photo in photos"
            :key="photo.id"
            class="photo-item"
            @click="goToFolder(photo.id)"
            style="cursor:pointer"
          >
            <img :src="photo.url" :alt="photo.title" />
            <div class="photo-info">
               <p class="photo-title">{{ photo.title }}</p>
               <button class="view-folder-btn">View Folder</button>
            </div>
          </div>
        </div>
        <div class="see-more" v-if="websiteStore.getPhotoGalleries.length > 5">
          <router-link to="/photogallery" class="see-more-link">See More Folders</router-link>
        </div>
      </div>

      <h2 class="section-title">News & Events</h2>
      <div v-if="websiteStore.isLoading" class="loading-state">
        <div class="skeleton-card" v-for="n in 3" :key="'news'+n"></div>
      </div>
      <div v-else-if="latestNews.length === 0" class="empty-state">No news available.</div>
      <div v-else>
        <div class="news-card-grid">
          <router-link
            v-for="item in latestNews"
            :key="item.id"
            :to="item.link || `/news/${item.id}`"
            class="news-card-link"
          >
            <div class="news-card">
              <div v-if="item.image" class="news-card-image">
                <img :src="item.image" alt="news" />
              </div>
              <div class="news-card-body">
                <h3 class="news-card-title">{{ item.title }}</h3>
                <p class="news-card-date">{{ item.date }}</p>
                <div v-if="item.body" class="news-card-preview">
                  {{ item.body.replace(/<[^>]+>/g, '').slice(0, 100) }}...
                </div>
              </div>
            </div>
          </router-link>
        </div>
        <div class="see-more">
          <router-link to="/news" class="see-more-link">Explore All</router-link>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useGalleryImageUrl, useNoticeFileUrl, useVideoUrl, useNewsFileUrl } from '@/composables/useImageUrl'

const websiteStore = useWebsiteStore()
const router = useRouter()
const activeVideo = ref(null)
const newsItems = ref([])
const newsLoadError = ref('')

const slugify = (value) => String(value || '')
  .toLowerCase()
  .trim()
  .replace(/\s+/g, '-')
  .replace(/[^a-z0-9-]/g, '')

const getVideoRouteId = (video) => {
  if (!video) return ''
  if (video.id || video.slug) return String(video.id ?? video.slug)
  if (video.title) return slugify(video.title)
  return ''
}

const parseNewsResponse = (payload) => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.news)) return payload.news
  return []
}

const getVideoSource = (video) => {
  if (!video) return ''

  const resolveField = (field) => {
    if (Array.isArray(field)) return field.find(Boolean) || ''
    if (typeof field === 'string') return field.trim()
    if (field && typeof field === 'object') return field.url || field.video || field.path || ''
    return ''
  }

  return resolveField(video.contents)
    || resolveField(video.content)
    || video.video_url || video.embed_url || video.media_url || video.url || video.path || ''
}

const normalizeNewsItem = (item) => {
  if (!item) return null
  const dateValue = item.date || item.created_at || ''
  const summaryValue = item.summary || (item.content ? item.content.replace(/<[^>]+>/g, '').slice(0, 180) : '')
  return {
    id: item.id,
    title: item.title || item.name || 'Untitled News',
    date: dateValue,
    body: item.content || item.summary || '',
    summary: summaryValue,
    image: item.image ? useNewsFileUrl(item.image, item.institute_id) : '',
    file_url: item.file ? useNewsFileUrl(item.file, item.institute_id) : '',
    file_type: item.file_type || item.fileType || '',
    link: `/news/${item.id}`
  }
}

const loadLatestNews = async () => {
  try {
    const response = await axios.get('news')
    const items = parseNewsResponse(response.data)
    if (items.length === 0) {
      throw new Error('Empty news response')
    }
    newsItems.value = items
      .map(normalizeNewsItem)
      .filter(Boolean)
      .slice(0, 3)
  } catch (error) {
    newsLoadError.value = error?.message || 'Could not load news'
    try {
      const fallbackResponse = await axios.get('indexdata')
      const fallbackItems = parseNewsResponse(fallbackResponse.data)
      newsItems.value = fallbackItems
        .map(normalizeNewsItem)
        .filter(Boolean)
        .slice(0, 3)
    } catch (fallbackError) {
      newsLoadError.value = fallbackError?.message || 'Could not load news'
    }
  }
}

onMounted(() => {
  loadLatestNews()
})

const videos = computed(() =>
  websiteStore.getVideoGalleries
    .slice(0, 4)
    .map(g => {
      const source = getVideoSource(g)
      return {
        id: getVideoRouteId(g),
        title: g.title,
        url: useVideoUrl(source, g.institute_id),
        contents: g.contents || g.content || [],
        video_url: g.video_url,
        embed_url: g.embed_url,
        media_url: g.media_url,
        institute_id: g.institute_id
      }
    })
    .filter(video => video.id && video.url)
)

const photos = computed(() =>
  websiteStore.getPhotoGalleries.slice(0, 5).map(g => ({
    id: g.id,
    title: g.title,
    url: useGalleryImageUrl(g.album_folder, g.image || g.contents?.[0], g.institute_id)
  }))
)

const goToVideo = (video) => {
  if (!video) return
  activeVideo.value = video
}

const goToFolder = (id) => {
  if (!id) return
  router.push(`/photogallery/${id}`)
}

const getNoticeImage = (notice) => {
  if (!notice) return ''
  if (notice.image) return useNoticeFileUrl(notice.image, notice.institute_id)
  if (notice.file && /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(notice.file)) {
    return useNoticeFileUrl(notice.file, notice.institute_id)
  }
  return ''
}

const activeVideoSource = computed(() => {
  if (!activeVideo.value) return ''
  return useVideoUrl(getVideoSource(activeVideo.value), activeVideo.value.institute_id)
})

const isEmbedUrl = computed(() => {
  const url = activeVideoSource.value || ''
  return /embed|youtube|vimeo|\/video\//i.test(url)
})

const latestNews = computed(() => {
  if (newsItems.value.length > 0) return newsItems.value
  const notices = websiteStore.getNotices || []
  return notices.slice(0, 3).map(n => ({
    id: n.id,
    title: n.title,
    date: n.created_at ? new Date(n.created_at).toLocaleDateString() : '',
    body: n.content || n.description || '',
    image: getNoticeImage(n),
    link: `/notices/${n.id}`
  }))
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.video-preview {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 10px;
  object-fit: cover;
}

.media-section-wrapper {
  width: 100%;
  background-color: #ffffff;
  padding: 40px 0;
}

.media-section {
  max-width: 1200px;
  margin: auto;
  padding: 0 20px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #0d6efd;
  margin-bottom: 25px;
  text-align: center;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

@media (max-width: 1100px) {
  .video-grid {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
}

@media (max-width: 720px) {
  .video-grid {
    grid-template-columns: 1fr;
  }
}

.video-item {
  background: #fff;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s;
}

.video-item:hover {
  transform: translateY(-6px);
}

.video-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.video-modal-content {
  width: 100%;
  max-width: 1200px;
  height: 100%;
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.video-modal-header h2 {
  color: #fff;
  font-size: 1.4rem;
  margin: 0;
}

.close-button {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 999px;
  background: rgba(255,255,255,0.18);
  color: #fff;
  font-size: 1.8rem;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.video-frame {
  flex: 1;
  width: 100%;
  height: 100%;
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

.video-title {
  margin-top: 10px;
  text-align: center;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.photo-item {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s;
}

.photo-item:hover {
  transform: translateY(-6px);
}

.photo-item img {
  width: 100%;
  height: 180px;
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

.news-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.news-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  transition: transform 0.3s;
}

.news-card:hover {
  transform: translateY(-6px);
}

.news-card-image img {
  width: 100%;
  height: 190px;
  object-fit: cover;
}

.news-card-body {
  padding: 15px;
}

.news-card-title {
  color: #0d6efd;
  font-size: 16px;
}

.see-more {
  text-align: center;
  margin: 25px 0;
}

.see-more-link {
  padding: 10px 28px;
  border-radius: 50px;
  color: #fff;
  background: linear-gradient(135deg, #0d6efd, #6610f2);
  text-decoration: none;
  font-weight: 600;
}

.loading-state {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.skeleton-card {
  height: 250px;
  background: #f0f0f0;
  border-radius: 12px;
  animation: pulse 1.5s infinite;
}

.empty-state {
  text-align: center;
  color: #6c757d;
  padding: 40px 0;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>
