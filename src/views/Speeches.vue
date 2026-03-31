<template>
  <section class="speeches-page">
    <div class="page-header">
      <h1>Speeches</h1>
      <p class="page-description">Browse speeches with images, speaker names, and full text in a modal.</p>
    </div>

    <div v-if="loading" class="status-message">Loading speeches...</div>
    <div v-else-if="error" class="status-message error">{{ error }}</div>
    <WidgetSpeech />
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'
import WidgetSpeech from '@/components/widgets/WidgetSpeech.vue'

const store = useWebsiteStore()
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  if (store.getSpeech.length === 0) {
    loading.value = true
    error.value = ''
    try {
      await store.fetchSpeeches()
    } catch (err) {
      error.value = err?.message || 'Unable to load speeches.'
    } finally {
      loading.value = false
    }
  }
})
</script>

<style scoped>
.speeches-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 28px;
}

.page-header h1 {
  font-size: 2.4rem;
  margin-bottom: 8px;
  color: #0f4d5f;
}

.page-description {
  margin: 0;
  color: #475569;
  font-size: 1rem;
}

.status-message {
  text-align: center;
  color: #475569;
  margin-bottom: 26px;
  font-size: 1rem;
}

.status-message.error {
  color: #b91c1c;
}
</style>
