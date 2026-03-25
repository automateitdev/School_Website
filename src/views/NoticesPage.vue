<template>
  <div class="notice-details">
    <h2 class="page-title">Notices - {{ noticeType }}</h2>

    <table class="notice-table">
      <thead>
        <tr>
          <th>SL</th>
          <th>Title</th>
          <th>Description</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(notice, index) in filteredNotices" :key="notice.id">
          <td>{{ index + 1 }}</td>

          <td class="title-cell">
            {{ notice.name || notice.title }}
          </td>

          <td>
            <div v-if="getNoticeFileUrl(notice)" class="pdf-preview">
              <PdfPreview :src="getNoticeFileUrl(notice)" />
            </div>
          </td>

          <td class="action-cell">
            <router-link :to="`/notice/${notice.id}`" class="action-btn view-btn" title="View Notice">
              👁
            </router-link>
          </td>
        </tr>

        <tr v-if="websiteStore.isLoading">
          <td colspan="4" class="loading-state">
            <div class="skeleton-row" v-for="n in 5" :key="n"></div>
          </td>
        </tr>

        <tr v-else-if="filteredNotices.length === 0">
          <td colspan="4" class="no-data">No notices found</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useNoticeFileUrl } from '@/composables/useImageUrl'
import PdfPreview from '@/components/PdfPreview.vue'

const route = useRoute()
const websiteStore = useWebsiteStore()
const noticeType = route.params.type || 'general'

const filteredNotices = computed(() =>
  websiteStore.getNotices
    .filter(n => n.type === noticeType)
    .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
)

// Resolve the correct storage URL for a notice file
const getNoticeFileUrl = (notice) => {
  const file = notice.file || notice.pdf
  if (!file) return null
  if (file.startsWith('http')) return file
  return useNoticeFileUrl(file, notice.institute_id)
}
</script>

<style scoped>
.notice-details {
  max-width: 1100px;
  margin: auto;
  padding: 30px;
}

.page-title {
  color: #0d6efd;
  margin-bottom: 25px;
  text-align: center;
  font-weight: 600;
}

.notice-table {
  width: 100%;
  border-collapse: collapse;
}

.notice-table th,
.notice-table td {
  border: 1px solid #dcdcdc;
  padding: 10px;
  vertical-align: middle;
}

.notice-table th {
  background: #0d6efd;
  color: #fff;
  font-size: 15px;
}

.notice-table tr:nth-child(even) {
  background: #f8f9fc;
}

.title-cell {
  font-weight: 500;
}

.pdf-preview {
  max-height: 150px;
  overflow: hidden;
}

.action-cell {
  text-align: center;
}

.action-btn {
  font-size: 18px;
  padding: 6px 10px;
  border-radius: 5px;
  text-decoration: none;
  border: none;
  background-color: #0d6efd;
  color: #ffffff;
  transition: background 0.3s;
}

.action-btn:hover {
  background-color: #0b5ed7;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #777;
}

.loading-state {
  padding: 20px;
}

.skeleton-row {
  height: 40px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 10px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>
