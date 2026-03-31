<template>
  <section class="widget-card widget-links">
    <header>
      <h3>Essential Links</h3>
    </header>

    <div v-if="links.length" class="links-list">
      <a v-for="link in links" :key="link.link || link.title" :href="link.link" target="_blank" rel="noopener noreferrer" class="link-item">
        <span>{{ link.title || 'Link' }}</span>
        <span>↗</span>
      </a>
    </div>
    <div v-else class="widget-empty">
      <p>No essential links configured yet.</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'

const store = useWebsiteStore()
const links = computed(() => store.getWeb?.essential_links || [])
</script>

<style scoped>
.widget-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 16px 38px rgba(15, 23, 42, 0.08);
}

.widget-card h3 {
  margin: 0 0 12px;
  font-size: 1rem;
  color: #0f4d5f;
}

.links-list {
  display: grid;
  gap: 10px;
}

.link-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-radius: 14px;
  background: #f8fafc;
  color: #0f4d5f;
  text-decoration: none;
  transition: background 0.2s ease;
}

.link-item:hover {
  background: #eef6f7;
}

.widget-empty {
  color: #475569;
  font-size: 0.95rem;
}
</style>
