<template>
  <div v-if="websiteStore.isLoading" class="content-page loading-state">
    <div class="skeleton-title"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text"></div>
  </div>

  <div class="content-page" v-else-if="content">
    <h1>{{ content.name || content.title }}</h1>
    <div class="content-body" v-html="content.content || content.body"></div>
  </div>

  <div v-else class="content-page">
    <h1>Content Not Found</h1>
    <p>Please contact administration.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useWebsiteStore } from '@/stores/websiteStore'

const route = useRoute()
const websiteStore = useWebsiteStore()

const content = computed(() => {
  const param = route.params.slug
  if (/^\d+$/.test(param)) {
    return websiteStore.getContentById(param) || null
  } else {
    return websiteStore.getContentBySlug(param) || null
  }
})
</script>

<style scoped>
.content-page {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.content-page h1 {
  color: #0a728a;
  margin-bottom: 20px;
}

.content-body p,
.content-body li {
  font-size: 16px;
  line-height: 1.8;
}

.loading-state {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.skeleton-title {
  height: 40px;
  width: 60%;
  background: #f0f0f0;
  border-radius: 6px;
  animation: pulse 1.5s infinite;
  margin-bottom: 20px;
}

.skeleton-text {
  height: 20px;
  width: 100%;
  background: #f0f0f0;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>
