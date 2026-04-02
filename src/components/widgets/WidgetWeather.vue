<template>
  <div class="weather-widget">
    <div class="widget-header">
      <div class="header-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="2" x2="12" y2="4"/>
          <line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/>
          <line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      </div>
      <div>
        <h3 class="widget-title">Weather</h3>
        <p v-if="locationLabel" class="widget-subtitle">{{ locationLabel }}</p>
      </div>
    </div>

    <div v-if="loading" class="widget-loading">
      <div class="loading-skeleton sk-temp"></div>
      <div class="loading-row">
        <div class="loading-skeleton sk-sm"></div>
        <div class="loading-skeleton sk-sm"></div>
      </div>
    </div>

    <div v-else-if="error" class="widget-error">
      <svg viewBox="0 0 20 20" fill="currentColor" class="error-icon"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
      <span>{{ error }}</span>
    </div>

    <div v-else-if="weather.name" class="weather-body">
      <div class="temp-row">
        <div class="weather-icon-big">{{ conditionIcon }}</div>
        <div class="temp-block">
          <span class="temp-value">{{ weather.temp }}<sup>°C</sup></span>
          <span class="temp-cond">{{ weather.w }}</span>
        </div>
      </div>
      <div class="weather-stats">
        <div class="stat">
          <svg viewBox="0 0 20 20" fill="currentColor" class="stat-icon"><path fill-rule="evenodd" d="M5.5 10a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zm7-4.243a1 1 0 00-1.414-1.414l-4 4a1 1 0 001.414 1.414l4-4z" clip-rule="evenodd"/></svg>
          <span class="stat-label">Humidity</span>
          <span class="stat-value">{{ weather.humidity }}%</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <svg viewBox="0 0 20 20" fill="currentColor" class="stat-icon"><path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm3.5 9.5A1.5 1.5 0 1012 13l-2.5-2.5A1.5 1.5 0 0110 8a1.5 1.5 0 011.5 1.5c0 .4-.16.76-.41 1.03L13.5 13a1.5 1.5 0 010 0z"/></svg>
          <span class="stat-label">Wind</span>
          <span class="stat-value">{{ weather.wind }} m/s</span>
        </div>
      </div>
    </div>

    <div v-else class="widget-empty">
      <span>No Weather update available</span>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'

const store = useWebsiteStore()
const basic = computed(() => store.getBasic)
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || ''
const lat  = computed(() => basic.value?.latitude  || basic.value?.lat || basic.value?.google_lat || '')
const lon  = computed(() => basic.value?.longitude || basic.value?.lon || basic.value?.google_lon || '')
const city = computed(() => basic.value?.district  || basic.value?.city || basic.value?.location || '')

const weather  = reactive({ name: '', temp: null, w: '', humidity: null, wind: null })
const loading  = ref(false)
const error    = ref('')

const locationLabel = computed(() => {
  if (weather.name) return weather.name
  if (city.value)   return city.value
  if (lat.value && lon.value) return `${lat.value}, ${lon.value}`
  return ''
})

const conditionIcon = computed(() => {
  const c = (weather.w || '').toLowerCase()
  if (c.includes('rain') || c.includes('drizzle')) return '🌧️'
  if (c.includes('thunder') || c.includes('storm'))  return '⛈️'
  if (c.includes('snow'))  return '❄️'
  if (c.includes('cloud')) return '☁️'
  if (c.includes('haze') || c.includes('mist') || c.includes('fog')) return '🌫️'
  if (c.includes('clear')) return '☀️'
  return '🌤️'
})

const buildQuery = () => {
  if (lat.value && lon.value) return `lat=${encodeURIComponent(lat.value)}&lon=${encodeURIComponent(lon.value)}`
  if (city.value) return `q=${encodeURIComponent(city.value)},BD`
  return ''
}

const loadWeather = async () => {
  error.value = ''
  weather.name = ''; weather.temp = null; weather.w = ''; weather.humidity = null; weather.wind = null
  if (!apiKey) { error.value = 'API key not configured.'; return }
  const query = buildQuery()
  if (!query)  { error.value = 'Location not configured.'; return }
  loading.value = true
  try {
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`)
    weather.name     = data.name || ''
    weather.temp     = data.main?.temp   != null ? Math.round(data.main.temp) : null
    weather.w        = data.weather?.[0]?.main || ''
    weather.humidity = data.main?.humidity ?? null
    weather.wind     = data.wind?.speed ?? null
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Unable to load weather.'
  } finally {
    loading.value = false
  }
}

onMounted(loadWeather)
watch([city, lat, lon], loadWeather)
</script>

<style scoped>
.weather-widget {
  background: linear-gradient(145deg, #0e5a8c 0%, #1a8dbf 60%, #38b6e0 100%);
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 8px 32px rgba(10, 55, 80, 0.25);
  color: #fff;
  position: relative;
  overflow: hidden;
  --accent: #38b6e0;
}

.weather-widget::before {
  content: '';
  position: absolute;
  top: -30px;
  right: -30px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255,255,255,0.05);
}

.widget-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.header-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.header-icon svg { width: 18px; height: 18px; color: var(--accent); }

.widget-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
}

.widget-subtitle {
  margin: 2px 0 0;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.65);
}

.widget-loading { display: flex; flex-direction: column; gap: 10px; }
.loading-skeleton {
  background: rgba(255,255,255,0.12);
  border-radius: 8px;
  animation: pulse 1.5s infinite;
}
.sk-temp { height: 52px; width: 70%; }
.loading-row { display: flex; gap: 10px; }
.sk-sm { height: 28px; flex: 1; }

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
}

.widget-error {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: rgba(239,68,68,0.15);
  border: 1px solid rgba(239,68,68,0.3);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 0.8rem;
  color: #fca5a5;
}
.error-icon { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; }

.temp-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.weather-icon-big {
  font-size: 3rem;
  line-height: 1;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
}

.temp-block {
  display: flex;
  flex-direction: column;
}

.temp-value {
  font-size: 2.6rem;
  font-weight: 800;
  line-height: 1;
  color: #fff;
  letter-spacing: -1px;
}

.temp-value sup {
  font-size: 1.2rem;
  font-weight: 600;
  vertical-align: super;
}

.temp-cond {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.7);
  margin-top: 4px;
  text-transform: capitalize;
}

.weather-stats {
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 10px 14px;
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.stat-icon { width: 14px; height: 14px; color: rgba(255,255,255,0.6); }
.stat-label { font-size: 0.68rem; color: rgba(255,255,255,0.55); }
.stat-value { font-size: 0.9rem; font-weight: 700; color: #fff; }

.stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255,255,255,0.2);
  margin: 0 4px;
}

.widget-empty {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.55);
  text-align: center;
  padding: 10px 0;
}
</style>
