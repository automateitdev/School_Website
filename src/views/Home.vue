<template>
  <div class="home-page">
    <TopSection />
    <UpdatesNotice />
    <AboutSection />
    <MediaSection />
  </div>
</template>

<script setup>
import TopSection from '@/components/TopSection.vue'
import UpdatesNotice from '@/components/UpdatesNotice.vue'
import AboutSection from '@/components/AboutSection.vue'
import MediaSection from '@/components/MediaSection.vue'
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 24px 24px 48px;
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;
}

@media (max-width: 980px) {
  .home-page {
    padding: 16px 16px 32px;
    gap: 20px;
  }
}

@media (max-width: 640px) {
  .home-page {
    padding: 12px 12px 28px;
    gap: 16px;
  }
}
</style>
