<template>
  <section id="about-section" class="about-section">
    <div class="about-wrapper">
      
      <div v-if="websiteStore.isLoading" class="loading-placeholder">
        <div class="skeleton-text"></div>
        <div class="skeleton-image"></div>
      </div>

      <template v-else>
        <div class="about-text" v-show="visible" :class="{ 'animate-in': visible }">
        <div class="section-badge">About Us</div>
        <h2 class="institution-name">
          {{ schoolName }}
        </h2>
        <div class="title-underline"></div>
        
        <p class="description">
          {{ shortText }}
        </p>

        <div class="cta-group">
          <router-link to="/about-details" class="read-more-btn">
            <span>Discover More</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </router-link>
        </div>

        <div class="stats-row">
          <!--
          <div class="stat-item">
            <div class="stat-number">{{ establishedYear }}</div>
            <div class="stat-label">Established</div>
          </div>
          -->
          <div class="stat-item">
            <div class="stat-number">{{ eiinNumber }}</div>
            <div class="stat-label">EIIN</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ userAddress }}</div>
            <div class="stat-label">Address</div>
          </div>
        </div>
      </div>

      <div class="about-image" v-show="visible" :class="{ 'animate-in': visible }">
        <div class="image-container">
          <img :src="aboutImage" :alt="schoolName" />
          <div class="image-overlay">
            <div class="overlay-content">
              <h3>Building Future Leaders</h3>
              <!-- <p>Since {{ establishedYear }}</p> -->
            </div>
          </div>
        </div>
      </div>

      </template>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useAboutImageUrl } from '@/composables/useImageUrl'
import Map from '@/components/Map.vue'
import WidgetWeather from '@/components/widgets/WidgetWeather.vue'
import WidgetPrayer from '@/components/widgets/WidgetPrayer.vue'

const websiteStore = useWebsiteStore()
const visible = ref(false)

const getAbout = computed(() => websiteStore.getAbout)
const getBasic = computed(() => websiteStore.getBasic)
const getUser = computed(() => websiteStore.getUser)

const schoolName = computed(() =>
  getBasic.value?.name || getUser.value?.institute_name || 'Our School'
)

const fullText = computed(() =>
  getAbout.value?.description || ''
)

const affiliation = computed(() =>
  getAbout.value?.affiliation || 'National Education Board'
)

const boardName = computed(() =>
  getUser.value?.edu_board || getAbout.value?.board || getAbout.value?.affiliation || 'National Education Board'
)

const eiinNumber = computed(() =>
  getUser.value?.EIIN_number || getUser.value?.eiin_number || '—'
)
const instituteType = computed(() =>
  getUser.value?.institute_type || getUser.value?.type || '—'
)
const eduBoard = computed(() =>
  getUser.value?.edu_board || getUser.value?.education_board || '—'
)
const userAddress = computed(() =>
  getUser.value?.address || getBasic.value?.address || '—'
)

const excellenceValue = computed(() => {
  const raw = getAbout.value?.excellence ?? getAbout.value?.rating ?? '100%'
  return typeof raw === 'number' ? `${raw}%` : String(raw)
})

const shortText = computed(() => {
  const stripped = (fullText.value || '').replace(/<[^>]+>/g, '')
  return stripped.substring(0, 320) + (stripped.length > 320 ? '...' : '')
})

const establishedYear = computed(() =>
  getAbout.value?.established || '1998'
)

const yearsLegacy = computed(() => {
  const year = parseInt(establishedYear.value) || 1998
  return new Date().getFullYear() - year
})

const aboutImage = computed(() => useAboutImageUrl(getAbout.value) || '')

onMounted(() => {
  setTimeout(() => { visible.value = true }, 150)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.about-section { 
    background: linear-gradient(135deg, #f8fafc 0%, #e8f4f8 100%);
    padding: 100px 20px; 
    color: #1e293b; 
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
    min-height: 400px;
}

.about-section::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
}

.about-wrapper {
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    flex-wrap: wrap; 
    max-width: 1280px;
    margin: 0 auto;
    gap: 60px;
    position: relative;
    z-index: 1;
}

.about-text { 
    flex: 1; 
    min-width: 300px; 
    opacity: 0; 
    transform: translateX(-40px); 
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); 
}

.loading-placeholder {
    display: flex;
    width: 100%;
    gap: 60px;
    opacity: 1;
}

.skeleton-text {
    flex: 1;
    height: 300px;
    background: #f0f0f0;
    border-radius: 12px;
    animation: pulse 1.5s infinite;
}

.skeleton-image {
    flex: 1;
    height: 400px;
    background: #f0f0f0;
    border-radius: 20px;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
}

.about-text.animate-in { 
    opacity: 1; 
    transform: translateX(0); 
}

.section-badge {
    display: inline-block;
    padding: 8px 20px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.institution-name {
    font-size: 42px;
    font-weight: 800;
    margin-bottom: 15px;
    color: #0f172a;
    line-height: 1.2;
    letter-spacing: -0.5px;
}

.title-underline {
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
    border-radius: 2px;
    margin-bottom: 25px;
}

.description {
    font-size: 17px;
    line-height: 1.8;
    font-weight: 400;
    margin-bottom: 35px;
    color: #475569;
    text-align: justify;
}

.cta-group {
    margin-bottom: 40px;
}

.read-more-btn { 
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 32px; 
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: #fff; 
    border-radius: 50px;
    text-decoration: none; 
    font-weight: 600; 
    font-size: 16px;
    transition: all 0.3s ease; 
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    position: relative;
    overflow: hidden;
}

.read-more-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
}

.read-more-btn:hover::before {
    left: 100%;
}

.read-more-btn:hover { 
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(59, 130, 246, 0.5);
}

.read-more-btn svg {
    transition: transform 0.3s ease;
}

.read-more-btn:hover svg {
    transform: translateX(4px);
}

.stats-row {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    margin-top: 30px;
}

.stat-item {
    text-align: left;
}

.stat-number {
    font-size: 32px;
    font-weight: 800;
    color: #3b82f6;
    line-height: 1;
    margin-bottom: 5px;
}

.stat-label {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
}

.about-image { 
    flex: 1; 
    min-width: 300px; 
    opacity: 0; 
    transform: translateX(40px); 
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    transition-delay: 0.2s;
    position: relative;
}

.about-image.animate-in { 
    opacity: 1; 
    transform: translateX(0); 
}

.image-container {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.image-container img { 
    width: 100%; 
    height: auto;
    aspect-ratio: 4/3;
    object-fit: cover; 
    display: block;
    transition: transform 0.5s ease;
}

.image-container:hover img {
    transform: scale(1.05);
}

.image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    padding: 30px;
    transform: translateY(100%);
    transition: transform 0.4s ease;
}

.image-container:hover .image-overlay {
    transform: translateY(0);
}

.overlay-content h3 {
    color: white;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 5px;
}

.overlay-content p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
}

.about-widgets-section {
    max-width: 1280px;
    margin: 44px auto 0;
    padding: 30px 24px 26px;
    background: rgba(255,255,255,0.96);
    border-radius: 28px;
    box-shadow: 0 24px 64px rgba(15, 23, 42, 0.08);
    border: 1px solid rgba(15, 23, 42, 0.05);
}

.widgets-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 24px;
    flex-wrap: wrap;
}

.widgets-heading h3 {
    margin: 0;
    font-size: 1.35rem;
    color: #0f172a;
}

.widgets-heading p {
    margin: 4px 0 0;
    color: #475569;
    font-size: 0.98rem;
    max-width: 710px;
}

.about-widgets-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(260px, 1fr));
    gap: 22px;
    width: 100%;
}

.about-widgets-grid > * {
    min-height: 260px;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
}

@media (max-width: 992px) {
    .about-section {
        padding: 60px 20px;
    }

    .about-wrapper {
        flex-direction: column-reverse;
        gap: 40px;
    }

    .institution-name {
        font-size: 32px;
    }

    .stats-row {
        justify-content: center;
        gap: 30px;
    }

    .stat-item {
        text-align: center;
    }

    .about-text, .about-image { 
        transform: translateY(20px);
    }

    .about-text.animate-in, .about-image.animate-in { 
        transform: translateY(0); 
    }

    .description {
        text-align: left;
    }
}

@media (max-width: 640px) {
    .institution-name {
        font-size: 28px;
    }

    .stats-row {
        gap: 20px;
    }

    .stat-number {
        font-size: 24px;
    }

    .section-badge {
        font-size: 12px;
        padding: 6px 16px;
    }
}
</style>
