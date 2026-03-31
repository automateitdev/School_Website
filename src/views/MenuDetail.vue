<template>
  <section class="menu-detail-page">
    <!-- Ambient background blobs -->
    <div class="bg-orb bg-orb--1" aria-hidden="true"></div>
    <div class="bg-orb bg-orb--2" aria-hidden="true"></div>

    <div class="menu-detail__container">

      <!-- ── HEADER ── -->
      <div class="menu-detail__header">
        <div v-if="currentIcon" class="menu-detail__icon-wrap">
          <img
            :src="currentIcon"
            :alt="currentTitle"
            class="menu-detail__icon"
          />
          <div class="menu-detail__icon-glow" aria-hidden="true"></div>
        </div>

        <div class="menu-detail__meta">
          <p class="menu-detail__eyebrow">Menu Detail</p>
          <h1 class="menu-detail__title">{{ currentTitle }}</h1>

          <a
            v-if="currentLink"
            :href="currentLink"
            target="_blank"
            rel="noopener"
            class="menu-detail__link"
          >
            <span class="menu-detail__link-icon">↗</span>
            {{ currentLink }}
          </a>

          <p v-if="currentDescription" class="menu-detail__summary">
            {{ currentDescription }}
          </p>
        </div>
      </div>

      <!-- ── STATES ── -->
      <div v-if="loading" class="menu-detail__state">
        <span class="spinner"></span>
        Loading menu details…
      </div>
      <div v-else-if="error" class="menu-detail__state menu-detail__state--error">
        <span class="state-icon">⚠</span> {{ error }}
      </div>

      <!-- ── CONTENT ── -->
      <div v-else>
        <template v-if="menu">

          <!-- About section -->
          <div class="menu-detail__section">
            <h2 class="section-heading">
              <span class="section-heading__line"></span>
              About this menu
            </h2>
            <div class="prose-content" v-html="currentDocument"></div>
          </div>

          <!-- Related submenus -->
          <div class="menu-detail__section" v-if="relatedSubmenus.length">
            <h2 class="section-heading">
              <span class="section-heading__line"></span>
              Related submenus
            </h2>
            <ul class="submenu-grid">
              <li
                v-for="sub in relatedSubmenus"
                :key="sub.slug || sub.id"
                class="submenu-item"
              >
                <router-link
                  :to="`/menus/${menu.slug || menu.id}/${sub.slug || sub.id}`"
                  class="submenu-card"
                >
                  <div v-if="submenuIcon(sub)" class="submenu-card__icon-wrap">
                    <img
                      :src="submenuIcon(sub)"
                      :alt="sub.title"
                      class="submenu-card__icon"
                    />
                  </div>
                  <div class="submenu-card__body">
                    <h3 class="submenu-card__title">{{ sub.title }}</h3>
                    <p v-if="sub.description || sub.summary" class="submenu-card__desc">
                      {{ sub.description || sub.summary }}
                    </p>
                  </div>
                  <span class="submenu-card__arrow" aria-hidden="true">→</span>
                </router-link>
              </li>
            </ul>
          </div>

        </template>
        <div v-else class="menu-detail__state">
          <span class="state-icon">∅</span> Menu item not found.
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useMenuIconUrl } from '@/composables/useImageUrl'

const route = useRoute()
const websiteStore = useWebsiteStore()
const loading = ref(false)
const error = ref('')

const menuSlug = computed(() => route.params.menuSlug || '')
const submenuSlug = computed(() => route.params.submenuSlug || '')

const menu = computed(() => websiteStore.getMenuBySlugOrId(menuSlug.value))
const submenu = computed(() => (
  submenuSlug.value
    ? websiteStore.getSubmenuBySlugOrId(menuSlug.value, submenuSlug.value)
    : null
))

const currentItem = computed(() => submenu.value || menu.value || {})
const currentTitle = computed(() => currentItem.value?.title || 'Menu Detail')
const currentLink = computed(() => currentItem.value?.link || currentItem.value?.url || '')
const currentDescription = computed(() => currentItem.value?.description || currentItem.value?.summary || '')
const currentDocument = computed(() => {
  return (
    currentItem.value?.content ||
    currentItem.value?.description ||
    currentItem.value?.summary ||
    '<p>No description available.</p>'
  )
})

const currentIcon = computed(() => {
  if (submenu.value) {
    return useMenuIconUrl(
      submenu.value?.submenuassign?.submenu_icon ||
      submenu.value?.mm?.submenuassign?.submenu_icon ||
      submenu.value?.icon
    )
  }
  return useMenuIconUrl(menu.value?.menuassign?.menu_icon || menu.value?.menu_icon)
})

const relatedSubmenus = computed(() => menu.value?.submenus ?? [])

const submenuIcon = (submenuItem) => useMenuIconUrl(
  submenuItem?.submenuassign?.submenu_icon ||
  submenuItem?.mm?.submenuassign?.submenu_icon ||
  submenuItem?.icon
)

const loadMenuData = async () => {
  if (websiteStore.getMenuSubmenus?.length) {
    if (!menu.value && !submenu.value) {
      error.value = 'Menu not found.'
    }
    return
  }

  loading.value = true
  error.value = ''
  try {
    await websiteStore.fetchMenuSubmenus()
    if (!menu.value && !submenu.value) {
      error.value = 'Menu not found.'
    }
  } catch (e) {
    error.value = e?.message || 'Unable to load menu details.'
  } finally {
    loading.value = false
  }
}

onMounted(loadMenuData)
watch([menuSlug, submenuSlug], loadMenuData)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

/* ── CSS Variables ── */
:root {
  --c-bg: #0d0f14;
  --c-surface: #13161e;
  --c-surface-2: #1a1e2a;
  --c-border: rgba(255, 255, 255, 0.07);
  --c-border-hover: rgba(255, 255, 255, 0.14);
  --c-text: #e8eaf0;
  --c-text-muted: #7c8299;
  --c-text-faint: #44485a;
  --c-accent: #6c8aff;
  --c-accent-warm: #ff8c5a;
  --c-accent-glow: rgba(108, 138, 255, 0.18);
  --c-error: #f87171;
  --font-display: 'DM Serif Display', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --radius-card: 20px;
  --radius-icon: 16px;
  --shadow-card: 0 2px 24px rgba(0, 0, 0, 0.45);
  --transition: 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── Page shell ── */
.menu-detail-page {
  position: relative;
  min-height: 100vh;
  background: var(--c-bg);
  font-family: var(--font-body);
  color: var(--c-text);
  overflow-x: hidden;
}

/* ── Ambient background orbs ── */
.bg-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  z-index: 0;
  opacity: 0.35;
}
.bg-orb--1 {
  width: 600px;
  height: 600px;
  top: -180px;
  left: -200px;
  background: radial-gradient(circle, #2a3a8a 0%, transparent 70%);
}
.bg-orb--2 {
  width: 500px;
  height: 500px;
  bottom: 40px;
  right: -160px;
  background: radial-gradient(circle, #5a2a4a 0%, transparent 70%);
}

/* ── Container ── */
.menu-detail__container {
  position: relative;
  z-index: 1;
  max-width: 880px;
  margin: 0 auto;
  padding: 64px 28px 96px;
}

/* ── Header ── */
.menu-detail__header {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  margin-bottom: 56px;
  padding-bottom: 48px;
  border-bottom: 1px solid var(--c-border);
}

/* Icon */
.menu-detail__icon-wrap {
  position: relative;
  flex-shrink: 0;
}
.menu-detail__icon {
  display: block;
  width: 88px;
  height: 88px;
  object-fit: contain;
  border-radius: var(--radius-icon);
  background: var(--c-surface-2);
  padding: 16px;
  border: 1px solid var(--c-border);
  position: relative;
  z-index: 1;
}
.menu-detail__icon-glow {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  background: var(--c-accent-glow);
  filter: blur(20px);
  z-index: 0;
}

/* Meta */
.menu-detail__meta {
  flex: 1;
  min-width: 0;
}
.menu-detail__eyebrow {
  margin: 0 0 8px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c-accent);
}
.menu-detail__title {
  margin: 0 0 16px;
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 400;
  line-height: 1.18;
  color: #fff;
  letter-spacing: -0.01em;
}
.menu-detail__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--c-accent);
  text-decoration: none;
  letter-spacing: 0.01em;
  transition: color var(--transition), gap var(--transition);
  word-break: break-all;
}
.menu-detail__link:hover {
  color: #a0b4ff;
  gap: 10px;
}
.menu-detail__link-icon {
  font-size: 1rem;
  transition: transform var(--transition);
}
.menu-detail__link:hover .menu-detail__link-icon {
  transform: translate(2px, -2px);
}
.menu-detail__summary {
  margin: 0;
  font-size: 0.97rem;
  line-height: 1.7;
  color: var(--c-text-muted);
  font-weight: 300;
}

/* ── State messages ── */
.menu-detail__state {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 32px 0;
  font-size: 0.95rem;
  color: var(--c-text-muted);
}
.menu-detail__state--error {
  color: var(--c-error);
}
.state-icon {
  font-size: 1.3rem;
  opacity: 0.8;
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid var(--c-border);
  border-top-color: var(--c-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Sections ── */
.menu-detail__section {
  margin-bottom: 48px;
}
.section-heading {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0 0 24px;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 400;
  font-style: italic;
  color: var(--c-text-muted);
  letter-spacing: 0.01em;
}
.section-heading__line {
  display: block;
  width: 28px;
  height: 1px;
  background: linear-gradient(to right, var(--c-accent), transparent);
  flex-shrink: 0;
}

/* ── Prose content ── */
.prose-content {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-card);
  padding: 28px 32px;
  font-size: 0.96rem;
  line-height: 1.78;
  color: var(--c-text-muted);
  font-weight: 300;
}
.prose-content :deep(p) {
  margin: 0 0 1em;
}
.prose-content :deep(p:last-child) {
  margin-bottom: 0;
}
.prose-content :deep(a) {
  color: var(--c-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.prose-content :deep(strong) {
  color: var(--c-text);
  font-weight: 600;
}
.prose-content :deep(ul),
.prose-content :deep(ol) {
  padding-left: 1.4em;
  margin: 0.6em 0;
}
.prose-content :deep(li) {
  margin-bottom: 0.4em;
}

/* ── Submenu grid ── */
.submenu-grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}

/* Submenu card */
.submenu-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 20px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-card);
  text-decoration: none;
  color: inherit;
  transition:
    background var(--transition),
    border-color var(--transition),
    transform var(--transition),
    box-shadow var(--transition);
  position: relative;
  overflow: hidden;
}
.submenu-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--c-accent-glow), transparent 60%);
  opacity: 0;
  transition: opacity var(--transition);
}
.submenu-card:hover {
  background: var(--c-surface-2);
  border-color: var(--c-border-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
}
.submenu-card:hover::before {
  opacity: 1;
}

.submenu-card__icon-wrap {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--c-surface-2);
  border: 1px solid var(--c-border);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  z-index: 1;
}
.submenu-card__icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.submenu-card__body {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}
.submenu-card__title {
  margin: 0 0 4px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--c-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.submenu-card__desc {
  margin: 0;
  font-size: 0.8rem;
  color: var(--c-text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.submenu-card__arrow {
  flex-shrink: 0;
  font-size: 1rem;
  color: var(--c-text-faint);
  transition: color var(--transition), transform var(--transition);
  position: relative;
  z-index: 1;
}
.submenu-card:hover .submenu-card__arrow {
  color: var(--c-accent);
  transform: translateX(4px);
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .menu-detail__container {
    padding: 36px 18px 64px;
  }
  .menu-detail__header {
    flex-direction: column;
    gap: 20px;
    margin-bottom: 40px;
    padding-bottom: 36px;
  }
  .menu-detail__icon {
    width: 68px;
    height: 68px;
  }
  .submenu-grid {
    grid-template-columns: 1fr;
  }
  .prose-content {
    padding: 20px 18px;
  }
}
</style>