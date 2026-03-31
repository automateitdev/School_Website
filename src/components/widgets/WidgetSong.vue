<template>
  <div class="song-widget">
    <div class="widget-header">
      <div class="music-bars" :class="{ playing: isPlaying }">
        <span></span><span></span><span></span><span></span>
      </div>
      <div>
        <h3 class="widget-title">{{ songLabel }}</h3>
        <p class="widget-subtitle">National Anthem</p>
      </div>
    </div>

    <div class="player-body">
      <div class="waveform">
        <div
          v-for="n in 28"
          :key="n"
          class="wave-bar"
          :class="{ 'wave-bar--active': isPlaying }"
          :style="{ animationDelay: `${(n * 0.07) % 0.8}s`, height: `${12 + Math.sin(n * 0.9) * 10}px` }"
        ></div>
      </div>

      <div class="controls">
        <button class="ctrl-btn ctrl-btn--rewind" @click="seek(-10)" title="−10s">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V3zm-1-2.5V5l-4-4 4-4V.5z"/></svg>
          <span>10</span>
        </button>

        <button class="ctrl-btn ctrl-btn--play" @click="togglePlay" :aria-label="isPlaying ? 'Pause' : 'Play'">
          <transition name="icon-fade" mode="out-in">
            <svg v-if="!isPlaying" key="play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            <svg v-else key="pause" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          </transition>
        </button>

        <button class="ctrl-btn ctrl-btn--forward" @click="seek(10)" title="+10s">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 3a9 9 0 1 1-9 9h2a7 7 0 1 0 7-7V3zm1-2.5V5l4-4-4-4V.5z"/></svg>
          <span>10</span>
        </button>
      </div>

      <div class="progress-wrap" @click="onProgressClick">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressPct + '%' }"></div>
          <div class="progress-thumb" :style="{ left: progressPct + '%' }"></div>
        </div>
        <div class="time-row">
          <span>{{ fmtTime(currentTime) }}</span>
          <span>{{ fmtTime(duration) }}</span>
        </div>
      </div>

      <audio
        ref="audioEl"
        :src="audioSrc"
        preload="metadata"
        @timeupdate="onTimeUpdate"
        @loadedmetadata="onMeta"
        @play="isPlaying = true"
        @pause="isPlaying = false"
        @ended="isPlaying = false"
      ></audio>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'

const store     = useWebsiteStore()
const rawUrl    = computed(() => store.getWeb?.song_link || store.getBasic?.song_link || store.getWeb?.audio_link || '')
const songUrl   = computed(() => rawUrl.value || '/music/national_anthem-93c55a3e.mp3')
const songLabel = computed(() => store.getWeb?.song_label || store.getBasic?.song_label || 'National Anthem')
const audioSrc  = computed(() => {
  if (!songUrl.value) return ''
  return /\.(mp3|wav|ogg)$/i.test(songUrl.value) ? songUrl.value : '/music/national_anthem-93c55a3e.mp3'
})

const audioEl    = ref(null)
const isPlaying  = ref(false)
const currentTime = ref(0)
const duration   = ref(0)
const progressPct = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0)

const togglePlay = () => {
  if (!audioEl.value) return
  isPlaying.value ? audioEl.value.pause() : audioEl.value.play()
}

const seek = (delta) => {
  if (!audioEl.value) return
  audioEl.value.currentTime = Math.max(0, Math.min(duration.value, audioEl.value.currentTime + delta))
}

const onTimeUpdate = () => { currentTime.value = audioEl.value?.currentTime || 0 }
const onMeta = () => { duration.value = audioEl.value?.duration || 0 }

const onProgressClick = (e) => {
  if (!audioEl.value || !duration.value) return
  const rect = e.currentTarget.getBoundingClientRect()
  const pct  = (e.clientX - rect.left) / rect.width
  audioEl.value.currentTime = pct * duration.value
}

const fmtTime = (s) => {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}
</script>

<style scoped>
.song-widget {
  background: linear-gradient(145deg, #0c1f2d 0%, #0a3d52 100%);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(10, 40, 65, 0.3);
  color: #fff;
}

.widget-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px 10px;
}

.widget-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
}

.widget-subtitle {
  margin: 2px 0 0;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.5);
}

.music-bars {
  display: flex;
  align-items: flex-end;
  gap: 2.5px;
  height: 22px;
  padding: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  flex-shrink: 0;
}

.music-bars span {
  width: 3px;
  border-radius: 2px;
  background: #38bdf8;
  height: 6px;
  transition: height 0.1s;
}

.music-bars.playing span:nth-child(1) { animation: bar 0.7s ease infinite alternate; }
.music-bars.playing span:nth-child(2) { animation: bar 0.5s ease infinite alternate 0.1s; }
.music-bars.playing span:nth-child(3) { animation: bar 0.8s ease infinite alternate 0.2s; }
.music-bars.playing span:nth-child(4) { animation: bar 0.6s ease infinite alternate 0.05s; }

@keyframes bar {
  from { height: 4px; }
  to   { height: 16px; }
}

.player-body {
  padding: 4px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.waveform {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 36px;
  justify-content: center;
}

.wave-bar {
  width: 3px;
  border-radius: 2px;
  background: rgba(56,189,248,0.25);
  transition: background 0.3s;
}

.wave-bar--active {
  background: rgba(56,189,248,0.65);
  animation: wave 1s ease-in-out infinite alternate;
}

@keyframes wave {
  from { transform: scaleY(0.5); opacity: 0.5; }
  to   { transform: scaleY(1.3); opacity: 1; }
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.ctrl-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
  padding: 6px;
  border-radius: 50%;
}

.ctrl-btn:hover { color: #fff; transform: scale(1.1); }
.ctrl-btn svg { width: 18px; height: 18px; }
.ctrl-btn span { font-size: 0.55rem; font-weight: 700; line-height: 1; }

.ctrl-btn--play {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(14,165,233,0.4);
  color: #fff;
  flex-direction: row;
  gap: 0;
}

.ctrl-btn--play svg { width: 22px; height: 22px; }
.ctrl-btn--play:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(14,165,233,0.55); }

.icon-fade-enter-active,
.icon-fade-leave-active { transition: opacity 0.15s; }
.icon-fade-enter-from,
.icon-fade-leave-to { opacity: 0; }

.progress-wrap {
  cursor: pointer;
  user-select: none;
}

.progress-track {
  position: relative;
  height: 4px;
  background: rgba(255,255,255,0.15);
  border-radius: 4px;
  overflow: visible;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #0ea5e9);
  border-radius: 4px;
  transition: width 0.1s linear;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 6px rgba(0,0,0,0.4);
  opacity: 0;
  transition: opacity 0.2s;
}

.progress-wrap:hover .progress-thumb { opacity: 1; }

.time-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.68rem;
  color: rgba(255,255,255,0.45);
  margin-top: 5px;
}
</style>
