<template>
  <section class="map-card">
    <h2>Location Map</h2>
    <div v-if="iframeUrl" class="map-frame">
      <iframe
        :src="iframeUrl"
        title="Institute Location"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
    <div v-else class="map-empty">
      <p>Map URL is not configured yet.</p>
      <p>Provide <code>getBasic.google_map</code> in the API response.</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'

const store = useWebsiteStore()
const mapUrl = computed(() =>
  store.getBasic?.google_map ||
  store.getBasic?.map_url ||
  store.getBasic?.google_map_url ||
  ''
)

const iframeUrl = computed(() => {
  if (!mapUrl.value) return ''
  if (/^https?:\/\//i.test(mapUrl.value)) return mapUrl.value
  return `https://${mapUrl.value}`
})
</script>

<style scoped>
.map-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 16px 38px rgba(15, 23, 42, 0.08);
}

.map-card h2 {
  margin: 0 0 16px;
  font-size: 1.15rem;
  color: #0f5364;
}

.map-frame,
.map-empty {
  min-height: 240px;
}

.map-frame iframe {
  width: 100%;
  height: 280px;
  border: 0;
  border-radius: 16px;
}

.map-empty {
  display: grid;
  place-items: center;
  color: #475569;
  font-size: 0.96rem;
  line-height: 1.6;
}

.map-empty code {
  display: block;
  margin-top: 8px;
  padding: 4px 8px;
  background: #f8fafc;
  border-radius: 6px;
  color: #0f766e;
}
</style>
