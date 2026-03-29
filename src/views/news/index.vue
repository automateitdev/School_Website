<template>
  <section class="news-list-page">
    <div class="page-header">
      <h1>News</h1>
    </div>

    <div class="search-bar">
      <input
        type="search"
        v-model="searchTerm"
        placeholder="Search news by title, summary or content"
        aria-label="Search news"
      />
    </div>

    <div v-if="isLoading" class="status-message">Loading news...</div>
    <div v-else-if="error" class="status-message error">{{ error }}</div>
    <div v-else-if="filteredNews.length === 0" class="status-message">No news available.</div>

    <div v-else class="news-list">
      <article v-for="item in filteredNews" :key="item.id" class="news-card">
        <div class="news-card-body">
          <h2>{{ item.title }}</h2>
          <p class="news-date">{{ formatDate(item.date) }}</p>
          <p class="news-summary">{{ item.summary }}</p>
        </div>

        <div class="news-card-actions">
          <router-link :to="`/news/${item.id}`" class="btn view-btn">View</router-link>
          <a
            v-if="item.file_url && item.file_type.toLowerCase() === 'pdf'"
            :href="item.file_url"
            :download="getDownloadFilename(item.file_url)"
            rel="noreferrer noopener"
            class="btn download-btn"
          >
            Download
          </a>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/plugins/axios'
import { useNewsFileUrl } from '@/composables/useImageUrl'

const searchTerm = ref('')
const newsItems = ref([])
const isLoading = ref(false)
const error = ref('')

const normalizeNews = (item) => {
  const dateValue = item.date || item.created_at || ''
  const summaryValue = item.summary || (item.content ? item.content.replace(/<[^>]+>/g, '').slice(0, 220) : '')
  return {
    id: item.id,
    slug: item.slug || '',
    title: item.title || 'Untitled News',
    summary: summaryValue,
    content: item.content || '',
    date: dateValue,
    file: item.file || '',
    file_type: item.file_type || '',
    institute_id: item.institute_id || item.instituteID || '',
    file_url: item.file ? useNewsFileUrl(item.file, item.institute_id || item.instituteID) : ''
  }
}

const parseResponse = (payload) => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.data?.news)) return payload.data.news
  if (Array.isArray(payload.news)) return payload.news
  if (Array.isArray(payload.notices)) return payload.notices
  if (Array.isArray(payload.data?.notices)) return payload.data.notices
  return []
}

const getDownloadFilename = (url) => {
  if (!url) return 'download'
  const parts = String(url).split('/').pop()?.split('?')[0] || 'download'
  return parts || 'download'
}

const fetchNews = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const response = await axios.get('news')
    const data = parseResponse(response.data)
    if (data.length === 0) {
      throw new Error('Empty news response')
    }
    newsItems.value = data.map(normalizeNews)
    return
  } catch (err) {
    // Fallback to indexdata if /news is unavailable or empty.
  }

  try {
    const fallbackResponse = await fetch('/indexdata.json')
    if (!fallbackResponse.ok) {
      throw new Error('Fallback news source unavailable')
    }
    const fallbackData = parseResponse(await fallbackResponse.json())
    newsItems.value = fallbackData.map(normalizeNews)
  } catch (fallbackError) {
    error.value = fallbackError?.message || 'Could not load news.'
  } finally {
    isLoading.value = false
  }
}

const filteredNews = computed(() => {
  const query = searchTerm.value.trim().toLowerCase()
  if (!query) return newsItems.value
  return newsItems.value.filter((item) => {
    return [item.title, item.summary, item.content]
      .join(' ')
      .toLowerCase()
      .includes(query)
  })
})

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(fetchNews)
</script>

<style scoped>
.news-list-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0d6efd;
  margin-bottom: 24px;
  text-align: center;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.search-bar input {
  width: min(100%, 560px);
  padding: 12px 16px;
  border: 1px solid #ced4da;
  border-radius: 999px;
  font-size: 1rem;
  outline: none;
}

.search-bar input:focus {
  border-color: #0d6efd;
}

.status-message {
  text-align: center;
  color: #495057;
  margin: 36px 0;
  font-size: 1rem;
}

.status-message.error {
  color: #d63384;
}

.news-list {
  display: grid;
  gap: 22px;
}

.news-card {
  padding: 24px;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  background: #fff;
  display: grid;
  gap: 18px;
}

.news-card-body h2 {
  margin: 0 0 10px;
  font-size: 1.5rem;
  color: #212529;
}

.news-date {
  margin: 0 0 14px;
  color: #6c757d;
  font-size: 0.95rem;
}

.news-summary {
  color: #495057;
  line-height: 1.7;
}

.news-card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
}

.view-btn {
  background: #0d6efd;
  color: #fff;
}

.download-btn {
  background: #198754;
  color: #fff;
}

.view-btn:hover,
.download-btn:hover {
  opacity: 0.95;
}
</style>
