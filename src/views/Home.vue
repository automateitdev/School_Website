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
  gap: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;
}

@media (max-width: 980px) {
  .home-page {
    padding: 0;
    gap: 0;
  }
}

@media (max-width: 640px) {
  .home-page {
    padding: 0;
    gap: 0;
  }
}
</style>
