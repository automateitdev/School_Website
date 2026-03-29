<template>
  <section class="notices-page">
    <header class="page-header">
      <div>
        <h1>All Notices</h1>
        <p class="subtitle">Browse all published notices and download any available file.</p>
      </div>

      <div class="search-box">
        <label for="notice-search">Search</label>
        <input
          id="notice-search"
          type="search"
          v-model="searchQuery"
          placeholder="Search by title or name"
          aria-label="Search notices"
        />
      </div>
    </header>

    <div v-if="websiteStore.isLoading" class="loading-state">
      <div class="skeleton-row" v-for="i in 4" :key="i"></div>
    </div>

    <table v-else class="notice-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Date</th>
          <th>View</th>
          <th>Download</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="notice in filteredNotices" :key="notice.id">
          <td>{{ notice.name || notice.title }}</td>
          <td>{{ formatDate(notice.date || notice.created_at) }}</td>
          <td>
            <router-link :to="`/notices/${notice.id}`" class="action-btn view-btn">View</router-link>
          </td>
          <td>
            <a
              v-if="noticeFileUrl(notice)"
              :href="noticeFileUrl(notice)"
              :download="getDownloadFilename(noticeFileUrl(notice))"
              rel="noopener noreferrer"
              class="action-btn download-btn"
            >
              Download
            </a>
            <span v-else class="no-file">—</span>
          </td>
        </tr>

        <tr v-if="!websiteStore.isLoading && filteredNotices.length === 0">
          <td colspan="4" class="no-data">No Notice Found</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useNoticeFileUrl } from '@/composables/useImageUrl'

const websiteStore = useWebsiteStore()
const searchQuery = ref('')

const noticeList = computed(() => websiteStore.getNotices || [])

const filteredNotices = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const list = [...noticeList.value]
    .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))

  if (!query) return list

  return list.filter((notice) => {
    const title = String(notice.title || notice.name || '').toLowerCase()
    return title.includes(query)
  })
})

const noticeFileUrl = (notice) => {
  const file = notice?.file || notice?.pdf
  if (!file) return ''
  if (file.startsWith('http')) return file
  return useNoticeFileUrl(file, notice.institute_id)
}

const getDownloadFilename = (url) => {
  if (!url) return 'download'
  const parts = String(url).split('/').pop()?.split('?')[0] || 'download'
  return parts || 'download'
}

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : ''

const loadNotices = async () => {
  if (!websiteStore.getNotices.length && !websiteStore.isLoading && !websiteStore.error) {
    await websiteStore.fetchAllData()
  }
}

onMounted(loadNotices)
</script>

<style scoped>
.notices-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.page-header h1 {
  font-size: 2rem;
  color: #0d6efd;
  margin: 0 0 8px;
}

.subtitle {
  margin: 0;
  color: #555;
}

.search-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: min(100%, 320px);
}

.search-box input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d3dce6;
  border-radius: 10px;
  font-size: 1rem;
}

.notice-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
}

.notice-table th,
.notice-table td {
  padding: 16px 18px;
  text-align: left;
  border-bottom: 1px solid #eef2f6;
}

.notice-table th {
  background: #0d6efd;
  color: #fff;
  font-weight: 600;
}

.notice-table tbody tr:hover {
  background: #f4f8ff;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: 8px;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.view-btn {
  background: #0d6efd;
}

.download-btn {
  background: #198754;
}

.action-btn:hover {
  opacity: 0.92;
}

.no-file {
  color: #888;
  font-size: 0.95rem;
}

.no-data {
  text-align: center;
  padding: 28px 0;
  color: #666;
}

.loading-state {
  display: grid;
  gap: 16px;
}

.skeleton-row {
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f1f3f6 25%, #e2e5ea 50%, #f1f3f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0 }
  100% { background-position: -200% 0 }
}
</style>
