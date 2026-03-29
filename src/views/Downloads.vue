<template>
  <div class="downloads-page">
    <div class="page-header">
      <div class="header-content">
        <div class="header-badge">Resources</div>
        <h1>Downloads</h1>
        <p class="header-subtitle">Access important forms, documents, and resources.</p>
      </div>
    </div>

    <div class="downloads-container">
      <div v-if="websiteStore.isLoading" class="downloads-list">
        <div v-for="n in 3" :key="n" class="download-card loading-skeleton">
          <div class="file-info">
            <div class="file-icon skeleton"></div>
            <div class="file-details">
              <div class="skeleton-text title"></div>
              <div class="skeleton-text date"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="downloads.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/>
          </svg>
        </div>
        <h2>No downloads available</h2>
        <p>There are currently no documents available for download. Please check back later.</p>
      </div>

      <div v-else class="downloads-list">
        <div v-for="item in downloads" :key="item.id" class="download-card">
          <div class="file-info">
            <div class="file-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
            </div>
            <div class="file-details">
              <h3>{{ item.title || item.name || 'Document File' }}</h3>
              <span v-if="item.date || item.created_at" class="file-date">{{ formatDate(item.date || item.created_at) }}</span>
            </div>
          </div>
          
          <a :href="getFileUrl(item)" :download="getDownloadFilename(item)" class="download-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Download</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useDocumentUrl } from '@/composables/useImageUrl'

const websiteStore = useWebsiteStore()
const downloads = computed(() => websiteStore.getDownloads || [])

const getFileUrl = (item) => {
  if (item.file_url) return item.file_url
  if (item.file) return useDocumentUrl(item.file)
  return '#'
}

const getDownloadFilename = (item) => {
  if (item.file) return item.file
  if (item.file_url) return item.file_url.split('/').pop() || 'download'
  return 'download'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return dateString
  return d.toLocaleDateString('en-US', {
    target: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.downloads-page {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 80px 20px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.header-content {
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.header-badge {
  display: inline-block;
  padding: 8px 24px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.page-header h1 {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 15px;
  letter-spacing: -0.5px;
}

.header-subtitle {
  font-size: 18px;
  opacity: 0.9;
  line-height: 1.6;
}

.downloads-container {
  max-width: 1000px;
  margin: -40px auto 60px;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}

.empty-state {
  background: white;
  border-radius: 20px;
  padding: 60px 20px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.empty-state h2 {
  color: #0f172a;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
}

.empty-state p {
  color: #64748b;
  font-size: 16px;
  max-width: 400px;
  margin: 0 auto;
}

.downloads-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.download-card {
  background: white;
  border-radius: 16px;
  padding: 20px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.download-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.file-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  flex-shrink: 0;
}

.file-details h3 {
  color: #0f172a;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 5px 0;
}

.file-date {
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #f8fafc;
  color: #3b82f6;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.download-btn:hover {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

@media (max-width: 768px) {
  .page-header {
    padding: 60px 20px;
  }

  .page-header h1 {
    font-size: 32px;
  }

  .downloads-container {
    margin-top: -30px;
  }

  .download-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .download-btn {
    width: 100%;
    justify-content: center;
  }
}

.loading-skeleton .skeleton {
  background: #f0f0f0;
  animation: pulse 1.5s infinite;
}

.loading-skeleton .skeleton-text {
  background: #f0f0f0;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
  margin-bottom: 8px;
}

.loading-skeleton .skeleton-text.title {
  height: 20px;
  width: 200px;
}

.loading-skeleton .skeleton-text.date {
  height: 14px;
  width: 100px;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>
