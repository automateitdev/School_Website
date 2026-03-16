<template>
  <div class="news-details">
    <div v-if="websiteStore.isLoading" class="loading-state">
      <div class="skeleton-card" v-for="n in 3" :key="n"></div>
    </div>

    <div v-else-if="!singleNews" class="news-cards">
      <router-link
        v-for="(item, index) in newsItems"
        :key="item.id"
        :to="{ path: '/news', query: { id: item.id } }"
        class="news-card-link"
      >
        <div class="news-card">
          <div class="news-header">
            <span class="news-sl">#{{ index + 1 }}</span>
            <span class="news-title">{{ item.title }}</span>
          </div>
          <div class="news-content">
            <div v-if="item.image" class="news-image">
              <img :src="item.image" />
            </div>
            <p v-if="item.date" class="news-date">{{ item.date }}</p>
            <div v-if="item.body" class="news-body">{{ item.body.replace(/<[^>]+>/g, '').slice(0, 150) }}...</div>
          </div>
        </div>
      </router-link>
    </div>

    <div v-else class="single-news">
      <div class="news-card highlighted">
        <div class="news-header">
          <span class="news-title">{{ singleNews.title }}</span>
        </div>
        <div class="news-content">
          <div v-if="singleNews.image" class="news-image">
            <img :src="singleNews.image" />
          </div>
          <p v-if="singleNews.date" class="news-date">{{ singleNews.date }}</p>
          <div v-if="singleNews.body" class="news-body" v-html="singleNews.body"></div>
          <a v-if="singleNews.pdf" :href="singleNews.pdf" target="_blank" class="download-btn">
            Download PDF
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useImageUrl } from '@/composables/useImageUrl'

const route = useRoute()
const websiteStore = useWebsiteStore()

const newsItems = computed(() => {
  const notices = websiteStore.getNotices || []
  return notices.map(n => ({
    id: n.id,
    title: n.title,
    date: n.created_at ? new Date(n.created_at).toLocaleDateString() : '',
    body: n.content || n.description || '',
    image: n.file ? useImageUrl(n.file, 'notices') : '',
    pdf: n.pdf || ''
  }))
})

const singleNews = computed(() => {
  const id = Number(route.query.id)
  return id ? newsItems.value.find(n => n.id === id) : null
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

* { font-family: 'Poppins', sans-serif; }

.news-details { 
  max-width: 900px; 
  margin: auto; 
  padding: 30px 15px; 
}

.page-title { 
  text-align: center; 
  color: #0d6efd; 
  margin-bottom: 30px; 
}

.news-card-link { 
  text-decoration: none; 
  color: inherit; 
  display: block; 
}

.news-card {
  border: 1px solid #ddd; 
  border-radius: 10px;
  padding: 15px; 
  margin-bottom: 20px; 
  background: #f8f9fc;
  transition: box-shadow 0.3s, 
  background 0.3s, transform 0.3s;
}

.news-card:hover { 
  transform: translateY(-3px); 
}

.news-card.highlighted { 
  background: #fff3cd;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
}

.news-header { 
  display: flex; 
  align-items: center; 
  margin-bottom: 10px; 
}

.news-sl { 
  font-weight: 600; 
  margin-right: 10px; 
  color: #0d6efd; 
}

.news-title { 
  font-size: 18px; 
  font-weight: 600; 
  color: #0d6efd; 
}

.news-content { 
  margin-top: 5px; 
}

.news-image img { 
  width: 100%; 
  max-height: 260px; 
  object-fit: cover; 
  border-radius: 8px; 
  margin-bottom: 10px; 
}

.news-date { 
  font-size: 14px; 
  color: #555; 
  margin-bottom: 8px; 
}

.news-body { 
  font-size: 15px; 
  color: #333; 
  line-height: 1.5; 
  margin-bottom: 10px; 
}

.download-btn {
  display: inline-block; 
  background: #0d6efd; 
  color: #fff;
  padding: 6px 14px; 
  border-radius: 6px; 
  text-decoration: none;
  font-size: 14px; 
  transition: background 0.3s;
}

.download-btn:hover { 
  background: #094ec6; 
}

.loading-state {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skeleton-card {
  height: 150px;
  background: #f0f0f0;
  border-radius: 10px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>
