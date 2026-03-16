<template>
  <div v-if="websiteStore.isLoading" class="notice-details loading-state">
    <div class="skeleton-title"></div>
    <div class="skeleton-pdf"></div>
  </div>

  <div v-else-if="notice" class="notice-details">
    <h2 class="page-title">{{ notice.name || notice.title }}</h2>

    <div v-if="noticePdf" class="pdf-embed">
      <PdfPreview :src="noticePdf" />
    </div>

    <div class="notice-footer">
      <p class="notice-date"><strong>Date:</strong> {{ formatDate(notice.created_at || notice.date) }}</p>
      <a v-if="noticePdf" :href="noticePdf" download class="action-btn download-btn">
        Download PDF
      </a>
    </div>

    <div v-if="notice.description" class="notice-body" v-html="notice.description"></div>
  </div>

  <div v-else class="no-data">
    Notice not found.
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useWebsiteStore } from '@/stores/websiteStore'
import PdfPreview from '@/components/PdfPreview.vue'

const route = useRoute()
const websiteStore = useWebsiteStore()

const notice = computed(() => websiteStore.getNoticeById(route.params.id))

const noticePdf = computed(() => notice.value?.pdf || notice.value?.file || null)

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : ''
</script>

<style scoped>
.notice-details {
  max-width: 800px;
  margin: auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
}

.page-title {
  color: #0d6efd;
  margin-bottom: 25px;
  text-align: center;
  font-weight: 600;
  font-size: 28px;
}

.pdf-embed {
  max-width: 100%;
  max-height: 600px;
  overflow: auto;
  margin-bottom: 25px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
}

.notice-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #e9f2ff;
  border-radius: 8px;
  margin-top: 20px;
}

.notice-date {
  font-size: 16px;
  color: #333;
  margin: 0;
}

.notice-body {
  margin-top: 20px;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

.action-btn {
  padding: 8px 18px;
  background-color: #0d6efd;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.action-btn:hover {
  background-color: #0b5ed7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
}

.no-data {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #777;
}

.loading-state {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.skeleton-title {
  height: 40px;
  width: 70%;
  background: #f0f0f0;
  border-radius: 8px;
  animation: pulse 1.5s infinite;
}

.skeleton-pdf {
  height: 400px;
  width: 100%;
  background: #f0f0f0;
  border-radius: 8px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>
