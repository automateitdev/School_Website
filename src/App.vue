<template>
  <PageLoader />
  <Header />
  <div class="page-wrapper">
    <router-view />
    <FooterSection />
  </div>
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
