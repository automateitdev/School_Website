<template>
  <div v-if="isLoading" class="loader-overlay">
    <div class="spinner"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'

const websiteStore = useWebsiteStore()
const isLoading = computed(() => websiteStore.isLoading)
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.spinner {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 4px solid rgba(30, 136, 229, 0.2);
  border-top-color: #1e88e5;
  animation: spin 1s linear infinite;
  box-shadow: 0 0 15px rgba(30, 136, 229, 0.35);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
