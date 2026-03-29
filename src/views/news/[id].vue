<template>
  <section class="news-detail-page">
    <div class="detail-header">
      <button class="back-button" @click="goBack">Back</button>
      <h1>News</h1>
    </div>

    <div v-if="isLoading" class="status-message">Loading news details...</div>
    <div v-else-if="error" class="status-message error">{{ error }}</div>
    <div v-else-if="!newsItem" class="status-message">News item not found.</div>

    <div v-else class="news-detail-card">
      <h2>{{ newsItem.title }}</h2>
      <p class="news-date">{{ formatDate(newsItem.date) }}</p>

      <div v-if="newsItem.file_url && isImageFile" class="news-media">
        <img :src="newsItem.file_url" alt="News" />
      </div>

      <div v-if="newsItem.file_url && isPdfFile" class="news-media pdf-preview">
        <iframe
          :src="newsItem.file_url"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>

      <div v-if="newsItem.content" class="news-content" v-html="newsItem.content"></div>

      <div class="detail-actions">
        <a
          v-if="newsItem.file_url && isPdfFile"
          :href="newsItem.file_url"
          :download="getDownloadFilename(newsItem.file_url)"
          rel="noreferrer noopener"
          class="btn download-btn"
        >
          Download PDF
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { useNewsFileUrl } from '@/composables/useImageUrl'

const route = useRoute()
const router = useRouter()
const newsId = ref(route.params.id)
const newsItem = ref(null)
const isLoading = ref(false)
const error = ref('')

const normalizeNewsItem = (item) => {
  const dateValue = item.date || item.created_at || ''
  return {
    id: item.id,
    slug: item.slug || '',
    title: item.title || 'Untitled News',
    date: dateValue,
    content: item.content || item.summary || '',
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

const loadNewsItem = async (identifier) => {
  if (!identifier) return
  isLoading.value = true
  error.value = ''
  newsItem.value = null

  try {
    const response = await axios.get(`news/${identifier}`)
    const payload = response.data
    const item = payload?.data || payload || null
    if (!item || Object.keys(item).length === 0) {
      throw new Error('News item not found.')
    }
    newsItem.value = normalizeNewsItem(item)
    return
  } catch (err) {
    // Fallback to indexdata if /news/{id} fails
  }

  try {
    const fallbackResponse = await fetch('/indexdata.json')
    if (!fallbackResponse.ok) {
      throw new Error('Fallback news source unavailable')
    }
    const fallbackData = parseResponse(await fallbackResponse.json())
    const item = fallbackData.find((entry) => String(entry.id) === String(identifier)) || null
    if (!item) {
      throw new Error('News item not found.')
    }
    newsItem.value = normalizeNewsItem(item)
  } catch (fallbackError) {
    error.value = fallbackError?.message || 'Could not load news details.'
  } finally {
    isLoading.value = false
  }
}

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

const isPdfFile = computed(() => {
  return String(newsItem.value?.file_type || '').toLowerCase() === 'pdf'
})

const goBack = () => {
  router.push('/news')
}

watch(
  () => route.params.id,
  (newId) => {
    newsId.value = newId
    if (newId) loadNewsItem(newId)
  }
)

onMounted(() => {
  if (newsId.value) {
    loadNewsItem(newsId.value)
  }
})
</script>

<style scoped>
.news-detail-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 20px;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 26px;
}

.detail-header h1 {
  margin: 0;
  font-size: 2.25rem;
  color: #0d6efd;
}

.back-button {
  padding: 10px 18px;
  border: 1px solid #0d6efd;
  background: transparent;
  color: #0d6efd;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
}

.status-message {
  text-align: center;
  margin: 40px 0;
  color: #495057;
}

.status-message.error {
  color: #d63384;
}

.news-detail-card {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  padding: 28px;
}

.news-detail-card h2 {
  margin-top: 0;
  color: #212529;
  font-size: 2rem;
}

.news-date {
  display: block;
  margin: 14px 0 24px;
  color: #6c757d;
}

.news-media img {
  width: 100%;
  max-height: 420px;
  object-fit: cover;
  border-radius: 14px;
  margin-bottom: 24px;
}

.news-content {
  color: #343a40;
  line-height: 1.8;
}

.detail-actions {
  margin-top: 28px;
  display: flex;
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

.download-btn {
  background: #198754;
  color: #fff;
}

.view-btn {
  background: #0d6efd;
  color: #fff;
}
</style>
