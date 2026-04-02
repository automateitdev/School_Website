<template>
  <section class="speech-widget">
    <div class="widget-header">
      <div class="header-icon">🎙️</div>
      <h3 class="widget-title">Speeches and Messages</h3>
    </div>

    <div v-if="speeches.length === 0" class="widget-empty">
      <div class="empty-icon">💬</div>
      <p>No Speech</p>
    </div>

    <div v-else class="speech-grid">
      <article
        v-for="(speech, index) in speeches"
        :key="speech.id || speech.slug || index"
        class="speech-card"
        :style="{ animationDelay: `${index * 0.07}s` }"
      >
        <div class="speech-avatar">
          <img :src="getProfileImage(speech)" :alt="speech.name || 'Speaker'" />
          <div class="avatar-ring"></div>
        </div>

        <div class="speech-info">
          <h4 class="speech-name">{{ speech.name || speech.title || 'Guest Speaker' }}</h4>
          <p class="speech-role">{{ speech.designation || speech.designation_name || speech.role || '—' }}</p>
          <button type="button" class="read-btn" @click="openModal(speech)">
            <svg viewBox="0 0 20 20" fill="currentColor" class="btn-icon"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/></svg>
            Read the Speech
          </button>
        </div>
      </article>
    </div>

    <teleport to="body">
      <transition name="modal-fade">
        <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
          <div class="modal-panel" role="dialog" aria-modal="true">
            <div class="modal-header">
              <div class="modal-avatar">
                <img :src="getProfileImage(selectedSpeech)" :alt="selectedSpeech.name || 'Speaker'" />
              </div>
              <div class="modal-meta">
                <h4 class="modal-name">{{ selectedSpeech.name || selectedSpeech.title || 'Speaker' }}</h4>
                <p class="modal-role">{{ selectedSpeech.designation || selectedSpeech.designation_name || selectedSpeech.role }}</p>
              </div>
              <button class="modal-close" @click="closeModal" aria-label="Close">
                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
              </button>
            </div>

            <div class="modal-body">
              <div
                class="modal-message"
                v-html="selectedSpeech.message || selectedSpeech.content || selectedSpeech.description || '<em> No speech available.</em>'"
              ></div>
            </div>

            <div class="modal-footer">
              <button class="close-btn" @click="closeModal">Close</button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useSpeechProfileUrl } from '@/composables/useImageUrl'

const store          = useWebsiteStore()
const showModal      = ref(false)
const selectedSpeech = ref({})
const speeches       = computed(() => store.getSpeech)

const getProfileImage = (speech) => {
  if (!speech) return ''
  const img = speech.pro_img || speech.image || speech.photo || speech.profile_image || ''
  return useSpeechProfileUrl(img)
}

const openModal = (speech) => {
  selectedSpeech.value = speech || {}
  showModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  showModal.value = false
  selectedSpeech.value = {}
  document.body.style.overflow = ''
}

onMounted(async () => {
  if (!speeches.value?.length) {
    await store.fetchSpeeches?.().catch(() => {})
  }
})
</script>

<style scoped>
.speech-widget {
  background: #fff;
  border-radius: 20px;
  border: 1px solid #dde8ef;
  box-shadow: 0 4px 32px rgba(0, 55, 80, 0.08);
  overflow: hidden;
  --accent: #aecfe3;
}

.widget-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px 12px;
  background: linear-gradient(135deg, #0e5a8c 0%, #1a8dbf 60%, #38b6e0 100%);
}

.header-icon { font-size: 1.25rem; }

.widget-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
}

.widget-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 36px 16px;
}

.empty-icon { font-size: 2rem; }
.widget-empty p { margin: 0; color: #94a3b8; font-size: 0.9rem; }

.speech-grid {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.speech-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border: 1px solid #e8f2f6;
  border-radius: 16px;
  background: #f8fbfd;
  transition: box-shadow 0.2s, transform 0.2s;
  animation: slideUp 0.4s ease both;
}

.speech-card:hover {
  box-shadow: 0 6px 24px rgba(0, 80, 100, 0.1);
  transform: translateY(-1px);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.speech-avatar {
  position: relative;
  width: 70px;
  height: 70px;
  flex-shrink: 0;
}

.speech-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  position: relative;
  z-index: 1;
  border: 3px solid #fff;
  box-shadow: 0 2px 12px rgba(0,80,100,0.15);
}

.avatar-ring {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0e5a8c, #38b6e0);
  z-index: 0;
}

.speech-info {
  flex: 1;
  min-width: 0;
}

.speech-name {
  margin: 0 0 3px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.speech-role {
  margin: 0 0 10px;
  font-size: 0.76rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.read-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  background: linear-gradient(135deg, #003f4f, #05768e);
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
}

.read-btn:hover { opacity: 0.88; transform: scale(1.03); }
.btn-icon { width: 14px; height: 14px; }

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 20, 30, 0.72);
  backdrop-filter: blur(6px);
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-panel {
  width: min(100%, 680px);
  max-height: 88vh;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 32px 80px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 22px;
  background: linear-gradient(135deg, #003f4f 0%, #05768e 100%);
  flex-shrink: 0;
}

.modal-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255,255,255,0.4);
  flex-shrink: 0;
}

.modal-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-meta { flex: 1; min-width: 0; }

.modal-name {
  margin: 0 0 3px;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}

.modal-role {
  margin: 0;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.7);
}

.modal-close {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  color: #fff;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}

.modal-close:hover { background: rgba(255,255,255,0.25); }
.modal-close svg { width: 16px; height: 16px; }

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 22px;
  scrollbar-width: thin;
  scrollbar-color: #c8dce4 transparent;
}

.modal-message {
  font-size: 0.95rem;
  line-height: 1.8;
  color: #334155;
}

.modal-footer {
  padding: 14px 22px;
  border-top: 1px solid #eef4f7;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

.close-btn {
  padding: 9px 22px;
  background: linear-gradient(135deg, #003f4f, #05768e);
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.close-btn:hover { opacity: 0.88; }

.modal-fade-enter-active { animation: modalIn 0.28s ease; }
.modal-fade-leave-active { animation: modalIn 0.2s ease reverse; }

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
</style>
