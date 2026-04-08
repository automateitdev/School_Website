<template>
  <section class="media-wrapper">



    <div class="ms-section video-section">
      <div class="ms-section-inner">
        <div class="ms-heading">
          <div class="ms-label-row">
            <span class="ms-eyebrow">Video</span>
            <span class="ms-eyebrow-line"></span>
          </div>
          <h2 class="ms-title">Video Gallery</h2>
        </div>

        <div v-if="websiteStore.isLoading" class="ms-skeleton-grid">
          <div class="ms-skeleton" v-for="n in 4" :key="'vs'+n"></div>
        </div>

        <div v-else-if="videos.length === 0" class="ms-empty">
          <span class="ms-empty-icon">▷</span>
          <p>No videos available yet.</p>
        </div>

        <div v-else class="video-grid">
          <div
            v-for="(video, idx) in videos.slice(0, 4)"
            :key="video.id"
            class="video-card"
            :class="{ 'video-card--featured': idx === 0 }"
            @click="goToVideo(video)"
          >
            <div class="video-card__thumb">
              <video
                v-if="/\.(mp4|webm|ogg)(\?.*)?$/i.test(video.url)"
                :src="video.url"
                class="video-card__media"
                @click.stop
                muted
                preload="metadata"
              ></video>
              <iframe
                v-else
                :src="video.url"
                loading="lazy"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="video-card__media"
              ></iframe>
              <div class="video-card__play-overlay" @click.stop="goToVideo(video)">
                <div class="video-card__play-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
              <span class="video-card__badge" v-if="idx === 0">Featured</span>
            </div>
            <div class="video-card__info">
              <p class="video-card__title">{{ video.title }}</p>
              <span class="video-card__cta">Watch Now →</span>
            </div>
          </div>
        </div>

        <div class="ms-see-more" v-if="websiteStore.getVideoGalleries.length > 4">
          <router-link to="/videos" class="ms-btn">See All Videos</router-link>
        </div>
      </div>
    </div>

    <!-- Video Modal -->
    <transition name="modal-fade">
      <div v-if="activeVideo" class="video-modal" @click.self="activeVideo = null">
        <div class="video-modal__box">
          <button class="video-modal__close" @click="activeVideo = null" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <div class="video-modal__header">
            <h3>{{ activeVideo.title }}</h3>
          </div>
          <div class="video-modal__player">
            <iframe
              v-if="isEmbedUrl"
              :src="activeVideoSource"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
            <video v-else :src="activeVideoSource" controls autoplay></video>
          </div>
        </div>
      </div>
    </transition>



    <div class="ms-section photo-section">
      <div class="ms-section-inner">
        <div class="ms-heading ms-heading--right">
          <div class="ms-label-row ms-label-row--right">
            <span class="ms-eyebrow-line"></span>
            <span class="ms-eyebrow ms-eyebrow--coral">Photos</span>
          </div>
          <h2 class="ms-title ms-title--right">Photo Gallery</h2>
        </div>

        <div v-if="websiteStore.isLoading" class="ms-skeleton-grid ms-skeleton-grid--masonry">
          <div class="ms-skeleton ms-skeleton--tall" v-for="n in 5" :key="'ps'+n"></div>
        </div>

        <div v-else-if="photos.length === 0" class="ms-empty">
          <span class="ms-empty-icon">⬛</span>
          <p>No photos available yet.</p>
        </div>

        <div v-else class="photo-grid">
          <div
            v-for="(photo, idx) in photos"
            :key="photo.id"
            class="photo-card"
            :class="{ 'photo-card--wide': idx === 0 || idx === 3 }"
            @mouseenter="startSlide(photo.id)"
            @click="goToFolder(photo.id)"
          >
            <div class="photo-card__slider">
              <div
                v-for="(imgUrl, sIdx) in getSlides(photo)"
                :key="sIdx"
                class="photo-card__slide"
                :class="{ 'photo-card__slide--active': getActiveSlide(photo.id) === sIdx }"
              >
                <img :src="imgUrl" :alt="photo.title" loading="lazy" />
              </div>

              <div class="photo-card__dots" v-if="getSlides(photo).length > 1">
                <span
                  v-for="(_, dIdx) in getSlides(photo)"
                  :key="dIdx"
                  class="photo-card__dot"
                  :class="{ 'photo-card__dot--active': getActiveSlide(photo.id) === dIdx }"
                ></span>
              </div>

              <div class="photo-card__overlay">
                <div class="photo-card__overlay-inner">
                  <svg class="photo-card__folder-svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 5h-8.59L9.59 3H4C2.9 3 2 3.9 2 5v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z"/>
                  </svg>
                  <span class="photo-card__action">Open Folder</span>
                </div>
              </div>

            </div>

            <div class="photo-card__caption">
              <span class="photo-card__title">{{ photo.title }}</span>
              <button class="photo-card__btn">View →</button>
            </div>
          </div>
        </div>

        <div class="ms-see-more" v-if="websiteStore.getPhotoGalleries.length > 5">
          <router-link to="/photogallery" class="ms-btn ms-btn--coral">All Folders</router-link>
        </div>
      </div>
    </div>

    


    <!-- News content has been commented out pending API availability -->
    <!--
    <div class="ms-section news-section">
      <div class="ms-section-inner">
        <div class="ms-heading ms-heading--center">
          <div class="ms-label-row ms-label-row--center">
            <span class="ms-eyebrow-line ms-eyebrow-line--half"></span>
            <span class="ms-eyebrow ms-eyebrow--amber">News</span>
            <span class="ms-eyebrow-line ms-eyebrow-line--half"></span>
          </div>
          <h2 class="ms-title ms-title--center">News &amp; Events</h2>
        </div>

        <div v-if="websiteStore.isLoading" class="news-skeleton-row">
          <div class="ms-skeleton ms-skeleton--news" v-for="n in 3" :key="'ns'+n"></div>
        </div>

        <div v-else-if="latestNews.length === 0" class="ms-empty">
          <span class="ms-empty-icon">✦</span>
          <p>No news available yet.</p>
        </div>

        <div v-else class="news-grid">
          <router-link
            v-for="(item, idx) in latestNews"
            :key="item.id"
            :to="item.link || `/news/${item.id}`"
            class="news-card"
            :class="{ 'news-card--hero': idx === 0 }"
          >
            <div class="news-card__media" v-if="item.image">
              <img :src="item.image" alt="news image" loading="lazy" />
              <div class="news-card__media-overlay"></div>
            </div>
            <div class="news-card__no-img" v-else>
              <span class="news-card__initial">{{ item.title?.charAt(0) }}</span>
            </div>
            <div class="news-card__body">
              <time class="news-card__date">{{ item.date }}</time>
              <h3 class="news-card__title">{{ item.title }}</h3>
              <p v-if="item.body" class="news-card__preview">
                {{ item.body.replace(/<[^>]+>/g, '').slice(0, 120) }}…
              </p>
              <p v-if="item.comments" class="news-card__comments">{{ item.comments }}</p>
              <span class="news-card__read-more">Read more →</span>
            </div>
          </router-link>
        </div>

        <div class="ms-see-more">
          <router-link to="/news" class="ms-btn ms-btn--amber">Explore All News</router-link>
        </div>
      </div>
    </div>
    -->

  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { useWebsiteStore } from '@/stores/websiteStore'
import {
  useGalleryImageUrl,
  useNoticeFileUrl,
  useVideoUrl,
  useNewsFileUrl
} from '@/composables/useImageUrl'

const websiteStore = useWebsiteStore()
const router = useRouter()

const activeVideo = ref(null)

const slugify = (value) =>
  String(value || '').toLowerCase().trim()
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

const getVideoRouteId = (video) => {
  if (!video) return ''
  if (video.id || video.slug) return String(video.id ?? video.slug)
  if (video.title) return slugify(video.title)
  return ''
}

const getVideoSource = (video) => {
  if (!video) return ''
  const resolveField = (field) => {
    if (Array.isArray(field)) return field.find(Boolean) || ''
    if (typeof field === 'string') return field.trim()
    if (field && typeof field === 'object') return field.url || field.video || field.path || ''
    return ''
  }
  return resolveField(video.contents)
    || resolveField(video.content)
    || video.video_url || video.embed_url || video.media_url || video.url || video.path || ''
}

const videos = computed(() =>
  websiteStore.getVideoGalleries.slice(0, 4).map(g => {
    const source = getVideoSource(g)
    return {
      id: getVideoRouteId(g),
      title: g.title,
      url: useVideoUrl(source, g.institute_id),
      contents: g.contents || g.content || [],
      video_url: g.video_url,
      embed_url: g.embed_url,
      media_url: g.media_url,
      institute_id: g.institute_id
    }
  }).filter(v => v.id && v.url)
)

const goToVideo = (video) => { if (video) activeVideo.value = video }

const activeVideoSource = computed(() => {
  if (!activeVideo.value) return ''
  return useVideoUrl(getVideoSource(activeVideo.value), activeVideo.value.institute_id)
})

const isEmbedUrl = computed(() => {
  const url = activeVideoSource.value || ''
  return /embed|youtube|vimeo|\/video\//i.test(url)
})

const activeSlides = ref({})
const slideTimers  = ref({})
const autoTimers   = ref({})
const SLIDE_INTERVAL = 1800
const AUTO_DELAY     = 800

const photos = computed(() =>
  websiteStore.getPhotoGalleries.slice(0, 5).map(g => ({
    id: g.id,
    title: g.title,
    album_folder: g.album_folder,
    institute_id: g.institute_id,
    allImages: Array.isArray(g.contents) ? g.contents.filter(Boolean) : (g.image ? [g.image] : []),
    coverImage: g.image || (Array.isArray(g.contents) ? g.contents[0] : null)
  }))
)

const getSlides = (photo) => {
  const all = photo.allImages.length
    ? photo.allImages
    : (photo.coverImage ? [photo.coverImage] : [])
  const urls = all.slice(0, 6).map(img =>
    useGalleryImageUrl(photo.album_folder, img, photo.institute_id)
  )
  return [...new Map(urls.map(u => [u, u])).values()]
}

const getActiveSlide = (id) => activeSlides.value[id] ?? 0

const startSlide = (id) => {
  if (autoTimers.value[id]) return
  autoTimers.value[id] = setTimeout(() => {
    if (!slideTimers.value[id]) {
      slideTimers.value[id] = setInterval(() => {
        const photo = photos.value.find(p => p.id === id)
        if (!photo) return
        const total = getSlides(photo).length
        if (total <= 1) return
        activeSlides.value[id] = ((activeSlides.value[id] ?? 0) + 1) % total
      }, SLIDE_INTERVAL)
    }
  }, AUTO_DELAY)
}

const stopSlide = (id) => {
  clearTimeout(autoTimers.value[id])
  clearInterval(slideTimers.value[id])
  delete autoTimers.value[id]
  delete slideTimers.value[id]
  activeSlides.value[id] = 0
}

watch(photos, (newPhotos) => {
  newPhotos.forEach(photo => startSlide(photo.id))
}, { immediate: true })

onUnmounted(() => {
  photos.value.forEach(photo => stopSlide(photo.id))
})

const goToFolder = (id) => { if (id) router.push(`/photogallery/${id}`) }

/* News section logic commented out due to no API
const newsItems     = ref([])
const newsLoadError = ref('')

const parseNewsResponse = (payload) => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.news)) return payload.news
  return []
}

const normalizeNewsItem = (item) => {
  if (!item) return null
  const commentsValue = Array.isArray(item.comments)
    ? item.comments.join(' ')
    : item.comments || item.side_comments || item.note || item.notes || ''
  return {
    id: item.id,
    title: item.title || item.name || 'Untitled News',
    date: item.date || item.created_at || '',
    body: item.content || item.summary || '',
    comments: commentsValue,
    image: item.image ? useNewsFileUrl(item.image, item.institute_id) : '',
    link: `/news/${item.id}`
  }
} 

const loadLatestNews = async () => {
  try {
    const response = await axios.get('news')
    const items = parseNewsResponse(response.data)
    if (items.length === 0) throw new Error('Empty')
    newsItems.value = items.map(normalizeNewsItem).filter(Boolean).slice(0, 3)
    return
  } catch {}
  try {
    const fallbackUrl = `${import.meta.env.BASE_URL}indexdata.json`
    const fb = await fetch(fallbackUrl)
    if (!fb.ok) throw new Error('Unavailable')
    const items = parseNewsResponse(await fb.json())
    newsItems.value = items.map(normalizeNewsItem).filter(Boolean).slice(0, 3)
  } catch (e) {
    newsLoadError.value = e?.message || 'Could not load news'
  }
}

const getNoticeImage = (notice) => {
  if (!notice) return ''
  if (notice.image) return useNoticeFileUrl(notice.image, notice.institute_id, notice.type)
  if (notice.file && /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(notice.file))
    return useNoticeFileUrl(notice.file, notice.institute_id, notice.type)
  return ''
}

const latestNews = computed(() => {
  if (newsItems.value.length > 0) return newsItems.value
  const notices = websiteStore.getNotices || []
  return notices.slice(0, 3).map(n => ({
    id: n.id,
    title: n.title,
    date: n.created_at ? new Date(n.created_at).toLocaleDateString() : '',
    body: n.content || n.description || '',
    image: getNoticeImage(n),
    link: `/notices/${n.id}`
  }))
})

// onMounted(() => { loadLatestNews() })
*/

onUnmounted(() => {
  Object.values(autoTimers.value).forEach(clearTimeout)
  Object.values(slideTimers.value).forEach(clearInterval)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');


.media-wrapper {
  --clr-blue:        #1a3cff;
  --clr-blue-light:  #e8eeff;
  --clr-coral:       #e8431e;
  --clr-coral-light: #fff1ee;
  --clr-amber:       #d97706;
  --clr-amber-light: #fffbeb;
  --clr-ink:         #0e0e1a;
  --clr-ink-80:      #2d2d3a;
  --clr-ink-50:      #7a7a8a;
  --clr-ink-20:      #c8c8d0;
  --clr-ink-05:      #f4f4f6;
  --clr-white:       #ffffff;
  --ff-display:      'DM Serif Display', Georgia, serif;
  --ff-body:         'DM Sans', system-ui, sans-serif;
  --radius-card:     20px;
  --shadow-card:     0 2px 20px rgba(14,14,26,.07), 0 1px 4px rgba(14,14,26,.04);
  --shadow-hover:    0 8px 40px rgba(14,14,26,.14), 0 2px 8px rgba(14,14,26,.07);
  --ease:            cubic-bezier(.16,1,.3,1);
  font-family: var(--ff-body);
}

.media-wrapper *,
.media-wrapper *::before,
.media-wrapper *::after {
  box-sizing: border-box; margin: 0; padding: 0;
}
.media-wrapper a       { text-decoration: none; color: inherit; }
.media-wrapper button  { cursor: pointer; font-family: var(--ff-body); }
.media-wrapper img,
.media-wrapper video,
.media-wrapper iframe  { display: block; }


.media-wrapper {
  width: 100%;
  background:
    radial-gradient(circle at top left, rgba(96, 165, 250, 0.18), transparent 28%),
    radial-gradient(circle at bottom right, rgba(34, 211, 238, 0.14), transparent 30%),
    linear-gradient(180deg, #0a2e4d 0%, #083153 48%, #062844 100%);
}

.ms-section { width: 100%; padding: 80px 0; }
.ms-section:nth-child(odd)  { background: transparent; }
.ms-section:nth-child(even) { background: rgba(255, 255, 255, 0.03); }

.ms-section-inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;
}


.ms-heading           { margin-bottom: 52px; }
.ms-heading--center   { text-align: center; }
.ms-heading--right    { text-align: right; }

.ms-label-row         { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
.ms-label-row--center { justify-content: center; }
.ms-label-row--right  { justify-content: flex-end; }

.ms-eyebrow {
  font-size: 11px; font-weight: 600; letter-spacing: .14em;
  text-transform: uppercase; color: #d7efff;
  background: rgba(148, 210, 255, 0.16);
  padding: 5px 14px; border-radius: 100px; flex-shrink: 0;
}
.ms-eyebrow--coral { color: var(--clr-coral); background: var(--clr-coral-light); }
.ms-eyebrow--amber { color: var(--clr-amber); background: var(--clr-amber-light); }

.ms-eyebrow-line       { flex: 1; height: 1px; background: rgba(255, 255, 255, 0.22); }
.ms-eyebrow-line--half { flex: 0 0 60px; }

.ms-title {
  font-family: var(--ff-display);
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 400; color: #f7fbff;
  line-height: 1.1; margin-bottom: 14px;
}
.ms-title--center { text-align: center; }
.ms-title--right  { text-align: right; }

.ms-subtitle {
  font-size: 16px; line-height: 1.6;
  color: rgba(235, 245, 255, 0.82); font-weight: 300; max-width: 520px;
}
.ms-subtitle--center { margin: 0 auto; text-align: center; }
.ms-subtitle--right  { margin-left: auto; text-align: right; }

.ms-skeleton-grid {
  display: grid; grid-template-columns: repeat(4,1fr);
  gap: 20px; margin-bottom: 40px;
}
.ms-skeleton-grid--masonry { grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); }

.ms-skeleton {
  height: 240px; border-radius: var(--radius-card);
  background: linear-gradient(90deg, #e8e8ed 25%, #f2f2f5 50%, #e8e8ed 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
}
.ms-skeleton--tall { height: 280px; }
.ms-skeleton--news { height: 360px; }

.news-skeleton-row {
  display: grid; grid-template-columns: repeat(3,1fr); gap: 24px;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.ms-empty {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 80px 0; gap: 12px;
  color: rgba(235, 245, 255, 0.82); font-size: 15px;
}
.ms-empty-icon { font-size: 28px; opacity: .35; }


.ms-see-more { text-align: center; margin-top: 48px; }

.ms-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 36px; border-radius: 100px;
  font-size: 14px; font-weight: 600; letter-spacing: .02em;
  background: var(--clr-ink); color: var(--clr-white);
  border: 2px solid var(--clr-ink);
  transition: all .28s var(--ease);
  text-decoration: none;
}
.ms-btn:hover {
  background: var(--clr-white); color: var(--clr-ink);
  transform: translateY(-2px); box-shadow: var(--shadow-hover);
}
.ms-btn--coral { background: var(--clr-coral); border-color: var(--clr-coral); color: #fff; }
.ms-btn--coral:hover { background: var(--clr-white); color: var(--clr-coral); }
.ms-btn--amber { background: var(--clr-amber); border-color: var(--clr-amber); color: #fff; }
.ms-btn--amber:hover { background: var(--clr-white); color: var(--clr-amber); }


.video-section { background: var(--clr-white); }

.video-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.video-card {
  border-radius: var(--radius-card);
  overflow: hidden;
  background: var(--clr-white);
  border: 1px solid var(--clr-ink-20);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: transform .28s var(--ease), box-shadow .28s var(--ease), border-color .28s;
}
.video-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-hover);
  border-color: transparent;
}
.video-card--featured { grid-column: span 2; }

.video-card__thumb { position: relative; overflow: hidden; }

.video-card__media {
  width: 100%; aspect-ratio: 16/9;
  object-fit: cover; display: block;
  background: var(--clr-ink);
  transition: transform .28s var(--ease);
}
.video-card:hover .video-card__media { transform: scale(1.04); }

.video-card__play-overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(14,14,26,.35);
  opacity: 0; transition: opacity .28s;
}
.video-card:hover .video-card__play-overlay { opacity: 1; }

.video-card__play-btn {
  width: 54px; height: 54px; border-radius: 50%;
  background: var(--clr-white);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 24px rgba(0,0,0,.4);
  transition: transform .28s var(--ease);
}
.video-card__play-btn svg {
  width: 22px; height: 22px;
  color: var(--clr-ink); margin-left: 3px;
}
.video-card:hover .video-card__play-btn { transform: scale(1.12); }

.video-card__badge {
  position: absolute; top: 12px; left: 12px;
  font-size: 11px; font-weight: 600; letter-spacing: .08em;
  text-transform: uppercase;
  background: var(--clr-blue); color: var(--clr-white);
  padding: 4px 12px; border-radius: 100px;
}

.video-card__info {
  padding: 16px 18px 18px;
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 12px;
}
.video-card__title {
  font-size: 14px; font-weight: 500;
  color: var(--clr-ink); line-height: 1.45; flex: 1;
}
.video-card__cta {
  font-size: 12px; font-weight: 600;
  color: var(--clr-blue); white-space: nowrap; flex-shrink: 0;
}

.video-modal {
  position: fixed; inset: 0;
  background: rgba(10,10,20,.96);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999; padding: 24px;
}
.video-modal__box {
  position: relative; width: 100%; max-width: 1100px;
  background: #111118; border-radius: 24px; overflow: hidden;
  border: 1px solid rgba(255,255,255,.08);
}
.video-modal__header {
  padding: 20px 60px 20px 28px;
  border-bottom: 1px solid rgba(255,255,255,.07);
}
.video-modal__header h3 {
  font-family: var(--ff-display); font-size: 20px;
  font-weight: 400; color: var(--clr-white);
}
.video-modal__close {
  position: absolute; top: 16px; right: 16px;
  width: 40px; height: 40px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,.15);
  background: rgba(255,255,255,.06);
  color: rgba(255,255,255,.7);
  display: flex; align-items: center; justify-content: center;
  transition: background .2s; z-index: 1;
}
.video-modal__close:hover { background: rgba(255,255,255,.14); color: #fff; }
.video-modal__close svg { width: 18px; height: 18px; }

.video-modal__player { position: relative; padding-bottom: 56.25%; height: 0; }
.video-modal__player iframe,
.video-modal__player video {
  position: absolute; inset: 0;
  width: 100%; height: 100%; border: 0; background: #000;
}

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .22s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }


.photo-section { background: var(--clr-ink-05); }

.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 300px;
  gap: 20px;
}
.photo-card--wide { grid-column: span 2; }

.photo-card {
  border-radius: var(--radius-card);
  overflow: hidden;
  background: var(--clr-white);
  border: 1px solid var(--clr-ink-20);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  display: flex; flex-direction: column;
  transition: transform .28s var(--ease), box-shadow .28s var(--ease), border-color .28s;
}
.photo-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-hover);
  border-color: transparent;
}

.photo-card__slider {
  position: relative; flex: 1; min-height: 0;
  overflow: hidden; background: var(--clr-ink);
}

.photo-card__slide {
  position: absolute; inset: 0;
  opacity: 0;
  transition: opacity .6s ease, transform .6s ease;
  transform: scale(1.04);
}
.photo-card__slide--active {
  opacity: 1; transform: scale(1); z-index: 1;
}
.photo-card__slide--active img {
  animation: kenburns 4s ease forwards;
}
@keyframes kenburns {
  0%   { transform: scale(1)    translate(0, 0); }
  100% { transform: scale(1.08) translate(-1%, -1%); }
}
.photo-card__slide img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}

.photo-card__overlay {
  position: absolute; inset: 0;
  background: rgba(14,14,26,.5);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity .28s; z-index: 3;
}
.photo-card:hover .photo-card__overlay { opacity: 1; }

.photo-card__overlay-inner {
  display: flex; flex-direction: column;
  align-items: center; gap: 10px;
}
.photo-card__folder-svg { width: 32px; height: 32px; color: #fff; opacity: .9; }
.photo-card__action {
  font-size: 13px; font-weight: 600;
  color: #fff; letter-spacing: .04em;
}

.photo-card__dots {
  position: absolute; bottom: 10px; left: 50%;
  transform: translateX(-50%);
  display: flex; gap: 5px; z-index: 4;
}
.photo-card__dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(255,255,255,.45);
  transition: background .3s, transform .3s;
}
.photo-card__dot--active { background: #fff; transform: scale(1.3); }

.photo-card__count {
  position: absolute; top: 10px; right: 10px;
  font-size: 11px; font-weight: 600; color: #fff;
  background: rgba(14,14,26,.55);
  padding: 3px 9px; border-radius: 100px; z-index: 4;
  backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
}

.photo-card__caption {
  padding: 14px 18px;
  display: flex; align-items: center;
  justify-content: space-between; gap: 10px;
  background: var(--clr-white); flex-shrink: 0;
}
.photo-card__title {
  font-size: 14px; font-weight: 500;
  color: var(--clr-ink); line-height: 1.4; flex: 1;
}
.photo-card__btn {
  font-size: 12px; font-weight: 600;
  color: var(--clr-coral); background: var(--clr-coral-light);
  border: none; padding: 6px 14px; border-radius: 100px;
  transition: background .22s, color .22s; white-space: nowrap;
}
.photo-card:hover .photo-card__btn { background: var(--clr-coral); color: #fff; }


.news-section { background: var(--clr-white); }

.news-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  gap: 24px; align-items: stretch;
}

.news-card {
  border-radius: var(--radius-card); overflow: hidden;
  background: var(--clr-white);
  border: 1px solid var(--clr-ink-20);
  box-shadow: var(--shadow-card);
  display: flex; flex-direction: column;
  transition: transform .28s var(--ease), box-shadow .28s var(--ease), border-color .28s;
  text-decoration: none; color: inherit;
}
.news-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-hover);
  border-color: transparent;
}

.news-card__media { position: relative; overflow: hidden; flex-shrink: 0; }
.news-card--hero .news-card__media                 { height: 260px; }
.news-card:not(.news-card--hero) .news-card__media { height: 180px; }

.news-card__media img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform .28s var(--ease);
}
.news-card:hover .news-card__media img { transform: scale(1.05); }

.news-card__media-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(14,14,26,.18));
}

.news-card__no-img {
  height: 140px; background: var(--clr-ink-05);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.news-card--hero .news-card__no-img { height: 220px; }

.news-card__initial {
  font-family: var(--ff-display); font-size: 72px;
  font-weight: 400; color: var(--clr-ink-20);
  line-height: 1; text-transform: uppercase;
}

.news-card__body {
  padding: 22px 24px 26px;
  display: flex; flex-direction: column; gap: 10px; flex: 1;
}

.news-card__date {
  font-size: 11px; font-weight: 600; letter-spacing: .1em;
  text-transform: uppercase; color: var(--clr-amber); display: block;
}
.news-card--hero .news-card__date { color: var(--clr-blue); }

.news-card__title {
  font-family: var(--ff-display); font-weight: 400;
  color: var(--clr-ink); line-height: 1.3;
}
.news-card--hero .news-card__title                 { font-size: 24px; }
.news-card:not(.news-card--hero) .news-card__title { font-size: 17px; }

.news-card__preview {
  font-size: 14px; line-height: 1.7;
  color: var(--clr-ink-50); flex: 1;
}

.news-card__comments {
  margin-top: 10px;
  font-size: 13px;
  color: rgba(15, 23, 42, 0.75);
  line-height: 1.6;
}

.news-card__read-more {
  font-size: 13px; font-weight: 600; color: var(--clr-blue);
  margin-top: auto; transition: letter-spacing .28s var(--ease);
}
.news-card:hover .news-card__read-more { letter-spacing: .03em; }

@media (max-width: 1024px) {
  .video-grid                { grid-template-columns: repeat(2, 1fr); }
  .video-card--featured      { grid-column: span 2; }
  .photo-grid                { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 260px; }
  .photo-card--wide          { grid-column: span 2; }
  .news-grid                 { grid-template-columns: 1fr 1fr; }
  .news-card--hero           { grid-column: span 2; }
  .ms-section-inner          { padding: 0 24px; }
  .ms-heading                { margin-bottom: 36px; }
}

@media (max-width: 720px) {
  .ms-section                { padding: 56px 0; }
  .ms-section-inner          { padding: 0 16px; }
  .video-grid                { grid-template-columns: 1fr; }
  .video-card--featured      { grid-column: span 1; }
  .photo-grid                { grid-template-columns: 1fr; grid-auto-rows: auto; }
  .photo-card                { height: 280px; }
  .photo-card--wide          { grid-column: span 1; }
  .news-grid                 { grid-template-columns: 1fr; }
  .news-card--hero           { grid-column: span 1; }
  .ms-skeleton-grid          { grid-template-columns: repeat(2, 1fr); }
  .news-skeleton-row         { grid-template-columns: 1fr; }
}
</style>
