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
            v-for="video in videos.slice(0,3)"
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
        <div class="see-more">
          <router-link to="/videos" class="see-more-link">See More</router-link>
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
        <div class="see-more">
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
            :to="{ path: '/news', query: { id: item.id } }"
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useGalleryImageUrl, useNoticeFileUrl } from '@/composables/useImageUrl'

const router = useRouter()
const websiteStore = useWebsiteStore()

const videos = computed(() =>
  websiteStore.getVideoGalleries.slice(0, 3).map(g => ({
    id: g.id,
    title: g.title,
    url: g.contents?.[0] || ''
  }))
)

const photos = computed(() =>
  websiteStore.getPhotoGalleries.slice(0, 3).map(g => ({
    id: g.id,
    title: g.title,
    url: g.contents?.[0]
      ? useGalleryImageUrl(g.album_folder, g.contents[0])
      : ''
  }))
)

const goToVideo = (id) => {
  router.push({ name: 'VideoDetail', params: { id } })
}

const goToFolder = (id) => {
  router.push(`/photogallery/${id}`)
}
const latestNews = computed(() => {
  const notices = websiteStore.getNotices || []
  return notices.slice(0, 3).map(n => ({
    id: n.id,
    title: n.title,
    date: n.created_at ? new Date(n.created_at).toLocaleDateString() : '',
    body: n.content || '',
    image: n.file ? useNoticeFileUrl(n.file) : ''
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
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
