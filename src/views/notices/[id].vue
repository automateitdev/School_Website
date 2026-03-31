<template>
  <section class="notice-detail-page">
    <div v-if="loading" class="loading-state">
      <div class="skeleton-title"></div>
      <div class="skeleton-body"></div>
    </div>

    <div v-else-if="notice" class="notice-detail-card">
      <div class="notice-detail-header">
        <div>
          <span class="notice-badge">Notice</span>
          <h1>{{ notice.name || notice.title }}</h1>
          <p class="notice-meta">Published {{ formatDate(notice.created_at || notice.date) }}</p>
        </div>

        <div class="notice-actions-top">
          <a
            v-if="noticeFileUrl"
            :href="noticeFileUrl"
            :download="getDownloadFilename(noticeFileUrl)"
            rel="noopener noreferrer"
            class="action-btn download-btn"
          >
            Download
          </a>
          <router-link to="/notices" class="action-btn back-btn">Back to all notices</router-link>
        </div>
      </div>

      <div class="notice-body">
        <div class="notice-description" v-html="notice.description || notice.content || notice.details || '<p>No details available.</p>'"></div>

        <div v-if="noticeFileUrl" class="notice-preview">
          <iframe :src="noticeFileUrl" frameborder="0" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
        </div>
      </div>

    </div>

    <div v-else class="no-data">No notice found.</div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/plugins/axios.js'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useNoticeFileUrl } from '@/composables/useImageUrl'
const route = useRoute()
const websiteStore = useWebsiteStore()
const notice = ref(null)
const loading = ref(false)

const noticeId = computed(() => route.params.id)

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : ''

const getDownloadFilename = (url) => {
  if (!url) return 'download'
  const parts = String(url).split('/').pop()?.split('?')[0] || 'download'
  return parts || 'download'
}

const loadNotice = async (id) => {
  loading.value = true
  notice.value = websiteStore.getNoticeById(id)

  if (!notice.value) {
    try {
      const response = await axios.get(`notices/${id}`)
      const payload = Array.isArray(response.data)
        ? response.data[0]
        : response.data.data ?? response.data
      notice.value = payload ?? null
    } catch (error) {
      notice.value = null
      console.warn('[NoticeDetail] failed to fetch notice:', error)
    }
  }

  loading.value = false
}

onMounted(() => {
  if (noticeId.value) loadNotice(noticeId.value)
})

watch(noticeId, (id) => {
  if (id) loadNotice(id)
})

const noticeFileUrl = computed(() => {
  if (!notice.value) return ''
  const file = notice.value.file || notice.value.pdf
  if (!file) return ''
  if (file.startsWith('http')) return file
  return useNoticeFileUrl(file, notice.value.institute_id, notice.value.type)
})
</script>

<style scoped>
.notice-detail-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px;
}

.notice-detail-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
}

.notice-detail-card h1 {
  margin: 0 0 16px;
  font-size: 2rem;
  color: #0d6efd;
}

.notice-meta {
  margin: 0 0 24px;
  color: #3d4857;
  font-size: 1rem;
}

.notice-description {
  line-height: 1.9;
  color: #2c3e50;
}

.notice-preview {
  margin: 26px 0;
  border: 1px solid #dce1e8;
  border-radius: 16px;
  overflow: hidden;
  min-height: 420px;
}

.notice-preview iframe {
  width: 100%;
  min-height: 420px;
}

.notice-detail-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: 24px;
}

.notice-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  border-radius: 999px;
  padding: 8px 14px;
  margin-bottom: 14px;
}

.notice-detail-header h1 {
  margin: 0;
  font-size: 2.1rem;
  line-height: 1.1;
  color: #0f4d5f;
}

.notice-actions-top {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.notice-body {
  display: grid;
  gap: 28px;
}

.notice-description {
  color: #334155;
  line-height: 1.85;
  font-size: 1rem;
}

.notice-preview {
  border: 1px solid #d8e2ec;
  border-radius: 20px;
  overflow: hidden;
  min-height: 420px;
}

.notice-preview iframe {
  width: 100%;
  min-height: 420px;
}

.action-btn {
  padding: 12px 22px;
  border-radius: 12px;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.download-btn {
  background: #198754;
}

.back-btn {
  background: #0d6efd;
}

.action-btn:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

.notice-song-widget {
  margin-top: 32px;
}

.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
  font-size: 1.1rem;
}

.loading-state {
  display: grid;
  gap: 20px;
}

.skeleton-title,
.skeleton-body {
  background: #eef2f6;
  border-radius: 14px;
  animation: shimmer 1.6s infinite;
}

.skeleton-title {
  height: 42px;
  width: 70%;
}

.skeleton-body {
  height: 360px;
  width: 100%;
}

@keyframes shimmer {
  0% { background-position: 200% 0 }
  100% { background-position: -200% 0 }
}
</style>
