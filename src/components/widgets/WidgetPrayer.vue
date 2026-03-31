<template>
  <div class="prayer-widget">
    <div class="widget-header">
      <div class="header-icon">🕌</div>
      <div>
        <h3 class="widget-title">Prayer Times</h3>
        <p v-if="locationLabel" class="widget-subtitle">{{ locationLabel }}, Bangladesh</p>
      </div>
    </div>

    <div v-if="loading" class="widget-loading">
      <div v-for="n in 5" :key="n" class="loading-skeleton"></div>
    </div>

    <div v-else-if="error" class="widget-error">{{ error }}</div>

    <div v-else-if="timings" class="prayer-list">
      <div
        v-for="item in prayerItems"
        :key="item.key"
        class="prayer-row"
        :class="{ 'prayer-row--next': item.key === nextPrayer }"
      >
        <span class="prayer-emoji">{{ item.icon }}</span>
        <span class="prayer-name">{{ item.label }}</span>
        <span class="prayer-time">{{ formatTime(timings[item.key]) }}</span>
        <span v-if="item.key === nextPrayer" class="next-badge">Next</span>
      </div>
    </div>

    <div v-else class="widget-empty">
      <p>Prayer times are not configured.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'

const store   = useWebsiteStore()
const basic   = computed(() => store.getBasic)
const city    = computed(() => basic.value?.district || basic.value?.city || basic.value?.location || 'Dhaka')
const date    = computed(() => new Date().toISOString().slice(0, 10))
const locationLabel = computed(() => city.value || 'Bangladesh')

const timings  = ref(null)
const loading  = ref(false)
const error    = ref('')

const prayerItems = [
  { key: 'Fajr',    label: 'Fajr',      icon: '🌅' },
  { key: 'Sunrise', label: 'Sunrise', icon: '🌄' },
  { key: 'Dhuhr',   label: 'Dhuhr',      icon: '☀️' },
  { key: 'Asr',     label: 'Asr',       icon: '🌤️' },
  { key: 'Maghrib', label: 'Maghrib',    icon: '🌇' },
  { key: 'Isha',    label: 'Isha',       icon: '🌙' },
]

const to24 = (value) => {
  if (!value) return 0
  const [h, m] = value.split(':').map(Number)
  return isNaN(h) ? 0 : h * 60 + (m || 0)
}

const nowMinutes = computed(() => {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
})

const nextPrayer = computed(() => {
  if (!timings.value) return null
  const prayerOnly = prayerItems.filter(p => p.key !== 'Sunrise')
  for (const p of prayerOnly) {
    if (to24(timings.value[p.key]) > nowMinutes.value) return p.key
  }
  return prayerOnly[0]?.key || null
})

const formatTime = (value) => {
  if (!value) return ''
  const [hourStr, minute] = value.split(':')
  const hour = Number(hourStr)
  if (isNaN(hour) || minute == null) return value
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const h12    = hour % 12 === 0 ? 12 : hour % 12
  return `${String(h12).padStart(2,'0')}:${minute} ${suffix}`
}

const loadPrayerTimes = async () => {
  timings.value = null; error.value = ''
  if (!city.value) { error.value = 'City or district is not configured.'; return }
  loading.value = true
  try {
    const res = await fetch(
      `https://api.aladhan.com/v1/timingsByCity/${date.value}?city=${encodeURIComponent(city.value)}&country=Bangladesh&method=1`
    )
    if (!res.ok) throw new Error('Prayer API error')
    const data = await res.json()
    timings.value = data.data?.timings || null
    if (!timings.value) throw new Error('No timings returned')
  } catch (err) {
    error.value = err.message || 'Prayer times could not be loaded.'
  } finally {
    loading.value = false
  }
}

onMounted(loadPrayerTimes)
watch([city, date], loadPrayerTimes)
</script>

<style scoped>
.prayer-widget {
  background: #fff;
  border: 1px solid #dde8ef;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 55, 80, 0.08);
}

.widget-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px 12px;
  background: linear-gradient(135deg, #003f4f 0%, #05768e 100%);
}

.header-icon {
  font-size: 1.4rem;
  line-height: 1;
}

.widget-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
}

.widget-subtitle {
  margin: 2px 0 0;
  font-size: 0.72rem;
  color: rgba(255,255,255,0.65);
}

.widget-loading {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.loading-skeleton {
  height: 34px;
  border-radius: 8px;
  background: linear-gradient(90deg, #eef4f7 25%, #f5fafb 50%, #eef4f7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.widget-error {
  padding: 14px 16px;
  font-size: 0.8rem;
  color: #b91c1c;
  background: #fef2f2;
}

.prayer-list {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.prayer-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 10px;
  transition: background 0.2s;
}

.prayer-row:hover {
  background: #f0f8fb;
}

.prayer-row--next {
  background: linear-gradient(135deg, #e8f7fb, #d0eef6);
  border: 1px solid #a8d8e8;
}

.prayer-emoji {
  font-size: 0.95rem;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.prayer-name {
  flex: 1;
  font-size: 0.82rem;
  font-weight: 600;
  color: #1a3540;
}

.prayer-time {
  font-size: 0.82rem;
  font-weight: 700;
  color: #0a728a;
  font-variant-numeric: tabular-nums;
}

.next-badge {
  font-size: 0.6rem;
  font-weight: 700;
  background: linear-gradient(135deg, #003f4f, #05768e);
  color: #fff;
  border-radius: 999px;
  padding: 2px 7px;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

.widget-empty {
  padding: 20px 16px;
  text-align: center;
  font-size: 0.82rem;
  color: #94a3b8;
}
</style>
