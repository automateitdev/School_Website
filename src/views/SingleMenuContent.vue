<template>
  <section class="single-menu-page">
    <div class="bg-blob bg-blob--1" aria-hidden="true"></div>
    <div class="bg-blob bg-blob--2" aria-hidden="true"></div>

    <div class="smp__container">

      <div v-if="loading" class="smp__status">
        <span class="smp__spinner"></span>
        <span>Loading...</span>
      </div>

      <div v-else-if="!menuItem" class="smp__status smp__status--error">
        <span class="smp__status-icon">⚠</span>
        Page not found.
      </div>

      <template v-else>
        <header class="smp__header">
          <span class="smp__eyebrow">Menu Information</span>
          <h1 class="smp__title">
            {{ menuTitle }}
          </h1>
          <div class="smp__divider"></div>
        </header>

        <div
          v-if="menuItem.menu_content"
          class="smp__prose prose-content"
          v-html="menuItem.menu_content"
        ></div>

        <div v-else class="smp__empty">
          <span class="smp__empty-icon">📄</span>
          <p>No content available for this page.</p>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWebsiteStore } from '@/stores/websiteStore'

const props = defineProps({ id: String })
const route = useRoute()
const store = useWebsiteStore()
const loading = ref(false)

const pageId = computed(() => props.id || route.params.id)
const menuItem = computed(() => store.getSingleNavContentId(pageId.value))

const init = async () => {
  if (!store.data) {
    loading.value = true
    try { await store.fetchAllData() } finally { loading.value = false }
  }
}

onMounted(init)
watch(pageId, init)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600&family=DM+Sans:wght@300;400;600&display=swap');

.single-menu-page {
  position: relative;
  min-height: 70vh;
  background: #f8fafb;
  font-family: 'Hind Siliguri', 'DM Sans', sans-serif;
  overflow-x: hidden;
}

.bg-blob {
  position: fixed;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  z-index: 0;
  opacity: 0.18;
}
.bg-blob--1 {
  width: 500px; height: 500px;
  top: -150px; left: -180px;
  background: radial-gradient(circle, #0a728a 0%, transparent 70%);
}
.bg-blob--2 {
  width: 400px; height: 400px;
  bottom: 60px; right: -120px;
  background: radial-gradient(circle, #004d62 0%, transparent 70%);
}

.smp__container {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 56px 28px 80px;
}

.smp__status {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #5c6880;
  font-size: 1rem;
  padding: 48px 0;
  justify-content: center;
}
.smp__status--error { color: #c0392b; }
.smp__status-icon { font-size: 1.4rem; }

.smp__spinner {
  width: 22px; height: 22px;
  border: 3px solid #dde3ea;
  border-top-color: #0a728a;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

.smp__header { margin-bottom: 40px; }

.smp__eyebrow {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #0a728a;
  background: rgba(10,114,138,0.08);
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 14px;
}

.smp__title {
  font-size: clamp(1.7rem, 4vw, 2.4rem);
  font-weight: 700;
  color: #003f4f;
  line-height: 1.25;
  margin: 0 0 20px;
}

.smp__divider {
  width: 56px; height: 4px;
  background: linear-gradient(90deg, #0a728a, #00b4d8);
  border-radius: 4px;
}

.smp__prose {
  background: #fff;
  border: 1px solid #d8e4ea;
  border-radius: 16px;
  padding: 36px 40px;
  font-size: 1.02rem;
  line-height: 1.85;
  color: #2d3f4a;
  box-shadow: 0 4px 20px rgba(0,62,79,0.07);
}
.smp__prose :deep(p)  { margin: 0 0 1em; }
.smp__prose :deep(p:last-child) { margin-bottom: 0; }
.smp__prose :deep(h2),
.smp__prose :deep(h3) { color: #003f4f; margin: 1.4em 0 0.6em; font-weight: 700; }
.smp__prose :deep(a)  { color: #0a728a; text-underline-offset: 3px; }
.smp__prose :deep(ul),
.smp__prose :deep(ol) { padding-left: 1.5em; margin: 0.7em 0; }
.smp__prose :deep(li) { margin-bottom: 0.4em; }
.smp__prose :deep(table) { width: 100%; border-collapse: collapse; margin: 1em 0; }
.smp__prose :deep(th),
.smp__prose :deep(td) { padding: 10px 14px; border: 1px solid #d1dde5; text-align: left; }
.smp__prose :deep(th) { background: #f0f7fa; font-weight: 600; }
.smp__prose :deep(img) { max-width: 100%; border-radius: 8px; }

.smp__empty {
  text-align: center;
  padding: 64px 24px;
  color: #8a9baa;
}
.smp__empty-icon { font-size: 3rem; display: block; margin-bottom: 12px; }
.smp__empty p { margin: 0; font-size: 1rem; }

@media (max-width: 600px) {
  .smp__container { padding: 36px 16px 60px; }
  .smp__prose { padding: 22px 18px; }
}
</style>
