<template>
  <section v-if="banner" class="header-banner" :style="bannerStyle">
    <div class="header-text">
      <h1>{{ banner.title }}</h1>
      <p v-if="banner.subtitle">{{ banner.subtitle }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useHeaderLogoUrl } from '@/composables/useImageUrl'

const route = useRoute()
const websiteStore = useWebsiteStore()

const storeBannerImg = computed(() => {
  const header = websiteStore.getHeader
  return header?.banner_img ? useHeaderLogoUrl(header.banner_img) : ''
})

const banner = computed(() => {
  const slug = route.params.slug
  if (slug && /^\d+$/.test(slug)) {
    const storeContent = websiteStore.getContentById(slug)
    if (storeContent) return { title: storeContent.name || storeContent.title || 'Page' }
  }
  const meta = route.meta.banner
  return meta || null
})

const bannerStyle = computed(() => {
  const img = storeBannerImg.value
  return img
    ? { backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: 'linear-gradient(135deg, #002d3a 0%, #0a728a 100%)' }
})
</script>

<style scoped>
.header-banner {
  position: relative;
  width: 100%;
  height: 150px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-text {
  position: relative;
  z-index: 1;
  color: #fff;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

.header-text h1 {
  font-size: 36px;
  margin: 0;
  font-weight: 600;
}

.header-text p {
  font-size: 18px;
  margin: 5px 0 0 0;
  line-height: 1.4;
}
</style>
