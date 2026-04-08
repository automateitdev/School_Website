<template>
  <section class="institution-about-section">
    <div class="breadcrumb-container">
      <div class="breadcrumb-row">
        <router-link to="/" class="back-home-btn">
          <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          Back to Home
        </router-link>
        <div class="breadcrumb">
          <router-link to="/">Home</router-link>
          <span class="separator">/</span>
          <span class="current">About Us</span>
        </div>
      </div>
    </div>

    <div class="institution-about-container">
      
      <div v-if="websiteStore.isLoading" class="loading-state">
        <div class="skeleton-header"></div>
        <div class="content-grid">
          <div class="image-column">
            <div class="skeleton-image"></div>
            <div class="info-cards">
              <div class="info-card skeleton-card" v-for="n in 3" :key="n"></div>
            </div>
          </div>
          <div class="text-column">
            <div class="skeleton-text large"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text"></div>
          </div>
        </div>
      </div>

      <template v-else>
        <div class="about-header">
          <div class="header-badge">Our Story</div>
        <h1 class="main-title">{{ schoolName }}</h1>
        <div class="title-decoration"></div>
        <!-- <p class="subtitle">Building excellence in education since {{ establishedYear }}</p> -->
      </div>

      <div class="content-grid">
        
        <div class="image-column">
          <div class="main-image-wrapper">
            <img :src="aboutImageSrc" alt="School Campus" />
            <div class="image-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
              <span>Excellence in Education</span>
            </div>
          </div>

          <div class="info-cards">
            <!--
            <div class="info-card">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div class="info-content">
                <div class="info-label">Established</div>
                <div class="info-value">{{ establishedYear || '—' }}</div>
              </div>
            </div>
            -->

            <div class="info-card">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div class="info-content">
                <div class="info-label">Affiliation</div>
                <div class="info-value">{{ affiliation || '—' }}</div>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <div class="info-content">
                <div class="info-label">Level</div>
                <div class="info-value">{{ level || '—' }}</div>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"></path>
                  <path d="M12 8v4l2 2"></path>
                </svg>
              </div>
              <div class="info-content">
                <div class="info-label">EIIN</div>
                <div class="info-value">{{ eiinNumber }}</div>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3 6 6 .5-4.5 4.5L17 20l-5-2.5L7 20l.5-6.5L3 8.5 9 8z"></path>
                </svg>
              </div>
              <div class="info-content">
                <div class="info-label">Institute Type</div>
                <div class="info-value">{{ instituteType }}</div>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <div class="info-content">
                <div class="info-label">Board</div>
                <div class="info-value">{{ eduBoard }}</div>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3 6 6 .5-4.5 4.5L17 20l-5-2.5L7 20l.5-6.5L3 8.5 9 8z"></path>
                </svg>
              </div>
              <div class="info-content">
                <div class="info-label">Address</div>
                <div class="info-value">{{ userAddress }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-column">
          <div class="content-card">
            <div class="text-content" v-html="formattedText"></div>
          </div>

          <div class="map-section">
            <Map />
          </div>

          <div class="cta-section">
            <div class="cta-card">
              <h3>Ready to Join Us?</h3>
              <p>Discover a world-class education experience</p>
              <div class="cta-buttons">
                <router-link to="/contact" class="cta-btn secondary">
                  Contact Us
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      </template>

    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useAboutImageUrl } from '@/composables/useImageUrl'
import Map from '@/components/Map.vue'

const websiteStore = useWebsiteStore()
const getAbout = computed(() => websiteStore.getAbout)
const getBasic = computed(() => websiteStore.getBasic)
const getUser = computed(() => websiteStore.getUser)
const aboutImageSrc = computed(() => useAboutImageUrl(getAbout.value) || '')

const schoolName = computed(() => getBasic.value?.name || getUser.value?.institute_name || '')
const establishedYear = computed(() => getAbout.value?.established || '')
const affiliation = computed(() => getAbout.value?.affiliation || '')
const boardName = computed(() => getUser.value?.edu_board || getAbout.value?.board || getAbout.value?.affiliation || '')
const eiinNumber = computed(() => getUser.value?.EIIN_number || getUser.value?.eiin_number || '—')
const instituteType = computed(() => getUser.value?.institute_type || getUser.value?.type || '—')
const eduBoard = computed(() => getUser.value?.edu_board || getUser.value?.education_board || '—')
const userAddress = computed(() => getUser.value?.address || getBasic.value?.address || '—')
const excellenceValue = computed(() => {
  const raw = getAbout.value?.excellence ?? getAbout.value?.rating ?? '100%'
  return typeof raw === 'number' ? `${raw}%` : String(raw)
})
const level = computed(() => getAbout.value?.level || '')

const fullText = computed(() => getAbout.value?.description || '')
const formattedText = computed(() =>
  (fullText.value || '')
    .split('\n')
    .filter(p => p.trim())
    .map(p => `<p>${p.trim()}</p>`)
    .join('')
)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.institution-about-section {
  padding: 40px 20px 80px;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}

.breadcrumb-container {
  max-width: 1280px;
  margin: 0 auto 30px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #64748b;
}

.breadcrumb a {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb a:hover {
  color: #2563eb;
}

.breadcrumb .separator {
  color: #cbd5e1;
}

.breadcrumb .current {
  color: #0f172a;
  font-weight: 500;
}

.about-header {
  text-align: center;
  margin-bottom: 60px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.header-badge {
  display: inline-block;
  padding: 8px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.main-title {
  font-size: 48px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 15px;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.title-decoration {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
  margin: 0 auto 20px;
  border-radius: 2px;
}

.subtitle {
  font-size: 18px;
  color: #64748b;
  font-weight: 500;
}

.institution-about-container {
  max-width: 1280px;
  margin: 0 auto;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 50px;
  align-items: start;
}

.image-column {
  position: sticky;
  top: 100px;
}

.main-image-wrapper {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  margin-bottom: 30px;
}

.main-image-wrapper img {
  width: 100%;
  height: auto;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.main-image-wrapper:hover img {
  transform: scale(1.05);
}

.image-badge {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.image-badge svg {
  color: #3b82f6;
}

.image-badge span {
  font-weight: 600;
  color: #0f172a;
  font-size: 14px;
}

.info-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.info-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.info-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon svg {
  color: #3b82f6;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 3px;
}

.info-value {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.text-column {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.content-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.text-content {
  font-size: 17px;
  line-height: 1.9;
  color: #334155;
}

.text-content :deep(p) {
  margin-bottom: 20px;
  text-align: justify;
}

.text-content :deep(p:last-child) {
  margin-bottom: 0;
}

.map-section {
  margin-top: 24px;
}

.timeline-section {
  background: white;
  border-radius: 20px;
  padding: 35px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.timeline-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.timeline-title::before {
  content: '';
  width: 4px;
  height: 24px;
  background: linear-gradient(180deg, #3b82f6 0%, #06b6d4 100%);
  border-radius: 2px;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: linear-gradient(180deg, #3b82f6 0%, #06b6d4 100%);
}

.timeline-item {
  position: relative;
  margin-bottom: 25px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -26px;
  top: 5px;
  width: 16px;
  height: 16px;
  background: white;
  border: 3px solid #3b82f6;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.timeline-content {
  padding-left: 0;
}

.timeline-year {
  font-size: 18px;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 5px;
}

.timeline-text {
  font-size: 15px;
  color: #475569;
  line-height: 1.6;
}

.cta-section {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
}

.cta-card {
  padding: 40px;
  text-align: center;
  color: white;
}

.cta-card h3 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
}

.cta-card p {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 25px;
}

.cta-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 12px 28px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cta-btn.primary {
  background: white;
  color: #3b82f6;
}

.cta-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.cta-btn.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.cta-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.breadcrumb-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.back-home-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #3b82f6;
  color: #fff;
  text-decoration: none;
  border-radius: 20px;
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background 0.2s, transform 0.2s;
}
.back-home-btn:hover {
  background: #2563eb;
  transform: translateX(-2px);
}
.back-home-btn svg {
  width: 16px;
  height: 16px;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .image-column {
    position: static;
  }

  .info-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .institution-about-section {
    padding: 30px 15px 60px;
  }

  .main-title {
    font-size: 32px;
  }

  .content-card {
    padding: 25px;
  }

  .text-content {
    font-size: 16px;
  }

  .timeline-section {
    padding: 25px;
  }

  .info-cards {
    grid-template-columns: 1fr;
  }

  .cta-card {
    padding: 30px 20px;
  }

  .cta-card h3 {
    font-size: 24px;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .cta-btn {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 26px;
  }

  .subtitle {
    font-size: 16px;
  }

  .content-card {
    padding: 20px;
  }

  .text-content {
    font-size: 15px;
  }
}

.loading-state {
  width: 100%;
}

.skeleton-header {
  height: 100px;
  max-width: 600px;
  margin: 0 auto 60px;
  background: #f0f0f0;
  border-radius: 12px;
  animation: pulse 1.5s infinite;
}

.skeleton-image {
  height: 300px;
  width: 100%;
  background: #f0f0f0;
  border-radius: 20px;
  margin-bottom: 30px;
  animation: pulse 1.5s infinite;
}

.skeleton-card {
  height: 90px;
  background: #f0f0f0;
  border-radius: 15px;
  animation: pulse 1.5s infinite;
}

.skeleton-text {
  height: 20px;
  width: 100%;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 15px;
  animation: pulse 1.5s infinite;
}

.skeleton-text.large {
  height: 200px;
  border-radius: 20px;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>
