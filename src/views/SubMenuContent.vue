<template>
  <section class="submenu-content-page">
    <div class="bg-blob bg-blob--1" aria-hidden="true"></div>
    <div class="bg-blob bg-blob--2" aria-hidden="true"></div>

    <div class="smc__container">

      <div v-if="loading" class="smc__status">
        <span class="smc__spinner"></span>
        <span>Loading...</span>
      </div>

      <div v-else-if="!content" class="smc__status smc__status--error">
        <span class="smc__status-icon">⚠</span>
        No Content found.
      </div>

      <template v-else>
        <header class="smc__header">
          <span class="smc__eyebrow">Menu Information</span>
          <h1 class="smc__title">
            {{ content["subItems"][0]["mm"].submenuassign?.submenu_title_bangla
              || content["subItems"][0]["mm"].submenuassign?.submenu_title
              || 'Details' }}
          </h1>
          <div class="smc__divider"></div>
        </header>

        <div
          v-if="content['subItems'][0]['mm'].sub_document"
          class="smc__iframe-wrap"
        >
          <iframe
            :src="documentUrl(content['subItems'][0]['mm'].sub_document)"
            class="smc__iframe"
            frameborder="0"
            loading="lazy"
            title="Document"
          ></iframe>
        </div>

        <div
          v-if="content['subItems'][0]['mm'].sub_content"
          class="smc__prose prose-content"
          v-html="content['subItems'][0]['mm'].sub_content"
        ></div>
        <div
          v-if="!content['subItems'][0]['mm'].sub_document && !content['subItems'][0]['mm'].sub_content"
          class="smc__empty"
        >
          <span class="smc__empty-icon">📄</span>
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
import { useDocumentUrl } from '@/composables/useImageUrl'

const props = defineProps({ id: String })
const route = useRoute()
const store = useWebsiteStore()
const loading = ref(false)

const pageId = computed(() => props.id || route.params.id)

const content = computed(() => store.getContentById(pageId.value))

const documentUrl = (filename) => useDocumentUrl(filename)

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

.submenu-content-page {
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

.smc__container {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 56px 28px 80px;
}

.smc__status {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #5c6880;
  font-size: 1rem;
  padding: 48px 0;
  justify-content: center;
}
.smc__status--error { color: #c0392b; }
.smc__status-icon { font-size: 1.4rem; }
.smc__spinner {
  width: 22px; height: 22px;
  border: 3px solid #dde3ea;
  border-top-color: #0a728a;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

.smc__header { margin-bottom: 40px; }
.smc__eyebrow {
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
.smc__title {
  font-size: clamp(1.7rem, 4vw, 2.4rem);
  font-weight: 700;
  color: #003f4f;
  line-height: 1.25;
  margin: 0 0 20px;
}
.smc__divider {
  width: 56px; height: 4px;
  background: linear-gradient(90deg, #0a728a, #00b4d8);
  border-radius: 4px;
}

.smc__iframe-wrap {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #d1dde5;
  box-shadow: 0 8px 32px rgba(0,62,79,0.10);
  margin-bottom: 32px;
  background: #fff;
}
.smc__iframe {
  width: 100%;
  height: 640px;
  display: block;
  border: none;
}

.smc__prose {
  background: #fff;
  border: 1px solid #d8e4ea;
  border-radius: 16px;
  padding: 36px 40px;
  font-size: 1.02rem;
  line-height: 1.85;
  color: #2d3f4a;
  box-shadow: 0 4px 20px rgba(0,62,79,0.07);
}
.smc__prose :deep(p)  { margin: 0 0 1em; }
.smc__prose :deep(p:last-child) { margin-bottom: 0; }
.smc__prose :deep(h2),
.smc__prose :deep(h3) { color: #003f4f; margin: 1.4em 0 0.6em; font-weight: 700; }
.smc__prose :deep(a)  { color: #0a728a; text-underline-offset: 3px; }
.smc__prose :deep(ul),
.smc__prose :deep(ol) { padding-left: 1.5em; margin: 0.7em 0; }
.smc__prose :deep(li) { margin-bottom: 0.4em; }
.smc__prose :deep(table) { width: 100%; border-collapse: collapse; margin: 1em 0; }
.smc__prose :deep(th),
.smc__prose :deep(td) {
  padding: 10px 14px;
  border: 1px solid #d1dde5;
  text-align: left;
}
.smc__prose :deep(th) { background: #f0f7fa; font-weight: 600; }
.smc__prose :deep(img) { max-width: 100%; border-radius: 8px; }

.smc__empty {
  text-align: center;
  padding: 64px 24px;
  color: #8a9baa;
}
.smc__empty-icon { font-size: 3rem; display: block; margin-bottom: 12px; }
.smc__empty p { margin: 0; font-size: 1rem; }

@media (max-width: 600px) {
  .smc__container { padding: 36px 16px 60px; }
  .smc__prose { padding: 22px 18px; }
  .smc__iframe { height: 420px; }
}
</style>
