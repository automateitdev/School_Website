<template>
  <section class="top-section">

    <div class="row-top">
      <div class="slider-col">
        <ImageSlider />
      </div>
      <div class="notice-col">
        <NoticeBoard />
      </div>
    </div>

    <div class="row-widgets">
      <!-- <div class="widget-cell">
        <WidgetSpeech />
      </div>
      <div class="widget-cell">
        <WidgetWeather />
      </div>
      <div class="widget-cell">
        <WidgetPrayer />
      </div>
      <div class="widget-cell">
        <WidgetSong />
      </div> -->
    </div>

  </section>
</template>

<script setup>
import ImageSlider   from './ImageSlider.vue'
import NoticeBoard   from './NoticeBoard.vue'
// import WidgetSpeech  from './widgets/WidgetSpeech.vue'
// import WidgetWeather from './widgets/WidgetWeather.vue'
// import WidgetPrayer  from './widgets/WidgetPrayer.vue'
// import WidgetSong    from './widgets/WidgetSong.vue'
</script>

<style scoped>
.top-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
}

.row-top {
  display: grid;
  grid-template-columns: minmax(0, 2.75fr) minmax(320px, 1.15fr);
  gap: 0;
  align-items: stretch;
}

.slider-col {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.notice-col {
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
}

.slider-col > :deep(.slider) {
  height: 100%;
  min-height: 100%;
  border-radius: 0;
}

.notice-col > :deep(.notice-board) {
  flex: 1;
  height: 100%;
  border-radius: 0;
}

.row-widgets {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  align-items: start;
}

.widget-cell {
  display: flex;
  flex-direction: column;
}

@media (max-width: 1024px) {
  .row-top {
    grid-template-columns: 1fr;
  }

  .row-widgets {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .row-widgets {
    grid-template-columns: 1fr;
  }
}
</style>
