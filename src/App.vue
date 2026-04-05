<template>
  <PageLoader />
  <Header />
  <div class="page-wrapper">
    <main class="page-main">
      <router-view />
    </main>
  </div>
  <FooterSection />
</template>

<script setup>
import { onMounted, computed, watchEffect } from 'vue'
import Header from '@/components/Header.vue'
import FooterSection from '@/components/FooterSection.vue'
import PageLoader from '@/components/PageLoader.vue'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useHeaderLogoUrl } from '@/composables/useImageUrl'

const websiteStore = useWebsiteStore()

onMounted(async () => {
  await websiteStore.fetchAllData()
  if (!websiteStore.getMenuSubmenus.length) {
    await websiteStore.fetchMenuSubmenus().catch(() => {})
  }
  await websiteStore.fetchFooterData().catch(() => {})
})

const getBasic = computed(() => websiteStore.getBasic)

watchEffect(() => {
  if (getBasic.value?.name) {
    document.title = getBasic.value.name
  }
  if (getBasic.value?.logo) {
    const faviconSrc = useHeaderLogoUrl(getBasic.value.logo)
    let link = document.querySelector("link[rel~='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = faviconSrc
  }
})
</script>

<style>
/* Global: prevent horizontal overflow on all screens */
html, body {
  overflow-x: hidden;
  max-width: 100%;
}
</style>

<style scoped>
.page-wrapper {
  display: flex;
  gap: 0;
  align-items: flex-start;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.page-main {
  flex: 1;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 980px) {
  .page-wrapper {
    flex-direction: column;
    padding: 0;
  }
  .page-main {
    width: 100%;
  }
}
</style>
