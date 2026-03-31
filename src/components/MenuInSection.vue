<template>
  <section class="menu-section" id="menu-section">
    <!-- Background decoration -->
    <div class="ms-bg-deco ms-bg-deco--1" aria-hidden="true"></div>
    <div class="ms-bg-deco ms-bg-deco--2" aria-hidden="true"></div>

    <div class="ms-inner">

      <!-- Section heading -->
      <div class="ms-heading">
        <span class="ms-heading__pill">Services</span>
        <h2 class="ms-heading__title">Resource Center</h2>
        <p class="ms-heading__sub">Find essential information and services from different departments with ease.</p>
        <div class="ms-heading__bar"></div>
      </div>

      <!-- Skeleton -->
      <div v-if="isLoading" class="ms-grid">
        <div v-for="n in 6" :key="n" class="ms-skeleton"></div>
      </div>

      <!-- Cards -->
      <div v-else-if="visibleMenus.length" class="ms-grid">
        <article
          v-for="item in visibleMenus"
          :key="item.menu.menu_id"
          class="ms-card"
        >
          <!-- Top accent bar (color cycles) -->
          <div class="ms-card__accent"></div>

          <!-- Icon + Title -->
          <div class="ms-card__head">
            <div class="ms-card__icon-ring">
              <img
                v-if="item.menu.menuassign?.menu_icon"
                :src="menuIconUrl(item.menu.menuassign.menu_icon)"
                :alt="menuLabel(item.menu)"
                class="ms-card__icon-img"
                loading="lazy"
              />
              <span v-else class="ms-card__icon-fallback">📂</span>
            </div>
            <h3 class="ms-card__title">{{ menuLabel(item.menu) }}</h3>
          </div>

          <!-- Divider -->
          <div class="ms-card__divider"></div>

          <!-- Submenu links -->
          <ul class="ms-card__list">
            <li
              v-for="sub in item.subItems"
              :key="sub.mm.id"
              class="ms-card__list-item"
            >
              <router-link :to="`/menus/${sub.mm.id}`" class="ms-card__link">
                <svg class="ms-card__link-icon" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                </svg>
                <span>{{ sub.mm.submenuassign?.submenu_title_bangla || sub.mm.submenuassign?.submenu_title || '—' }}</span>
              </router-link>
            </li>

            <!-- Extra: Student List under Academic Info -->
            <li v-if="item.menu.menuassign?.menu_title === 'Academic Info'" class="ms-card__list-item ms-card__list-item--special">
              <router-link to="/studentlist" class="ms-card__link ms-card__link--special">
                <svg class="ms-card__link-icon" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                </svg>
                <span>Student List</span>
              </router-link>
            </li>

            <li v-if="item.menu.menuassign?.menu_title === 'Management Info'" class="ms-card__list-item ms-card__list-item--special">
              <router-link to="/teacherlist" class="ms-card__link ms-card__link--special">
                <svg class="ms-card__link-icon" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                </svg>
                <span>Our Teachers</span>
              </router-link>
            </li>
          </ul>

          <div class="ms-card__footer">
            <span class="ms-card__count">{{ subCount(item) }} items</span>
          </div>
        </article>
      </div>

      <!-- Empty -->
      <div v-else class="ms-empty">No menu information found.</div>

    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useMenuIconUrl } from '@/composables/useImageUrl'

const store = useWebsiteStore()
const isLoading = computed(() => store.isLoading)

const visibleMenus = computed(() =>
  (store.getMenuWithSubItems || []).filter(item =>
    item.menu.menu_id !== 31 && item.subItems.length > 0
  )
)

const menuLabel = (menu) =>
  menu?.menuassign?.menu_title_bangla || menu?.menuassign?.menu_title || '—'

const menuIconUrl = (icon) => useMenuIconUrl(icon)

const subCount = (item) => {
  let count = item.subItems.length
  const title = item.menu.menuassign?.menu_title
  if (title === 'Academic Info') count++
  if (title === 'Management Info') count++
  return count
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

/* ── Section shell ── */
.menu-section {
  position: relative;
  background: linear-gradient(160deg, #011f2a 0%, #013344 50%, #01293a 100%);
  padding: 90px 20px 100px;
  overflow: hidden;
  font-family: 'Hind Siliguri', 'Inter', sans-serif;
}

/* ── Background decoration circles ── */
.ms-bg-deco {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.06;
}
.ms-bg-deco--1 {
  width: 680px; height: 680px;
  top: -200px; left: -200px;
  background: radial-gradient(circle, #00d4ff 0%, transparent 70%);
}
.ms-bg-deco--2 {
  width: 500px; height: 500px;
  bottom: -160px; right: -140px;
  background: radial-gradient(circle, #0af5a0 0%, transparent 70%);
}

/* ── Inner ── */
.ms-inner {
  position: relative;
  z-index: 1;
  max-width: 1300px;
  margin: 0 auto;
}

/* ── Heading ── */
.ms-heading {
  text-align: center;
  margin-bottom: 60px;
}
.ms-heading__pill {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #00d4ff;
  background: rgba(0, 212, 255, 0.12);
  border: 1px solid rgba(0, 212, 255, 0.25);
  padding: 5px 16px;
  border-radius: 20px;
  margin-bottom: 16px;
}
.ms-heading__title {
  font-size: clamp(1.9rem, 4vw, 2.8rem);
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 12px;
  letter-spacing: -0.01em;
}
.ms-heading__sub {
  font-size: 0.97rem;
  color: rgba(255, 255, 255, 0.45);
  margin: 0 auto 22px;
  max-width: 480px;
  line-height: 1.6;
}
.ms-heading__bar {
  width: 52px; height: 3px;
  background: linear-gradient(90deg, #00d4ff, #0af5a0);
  border-radius: 3px;
  margin: 0 auto;
}

/* ── Skeleton ── */
.ms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 22px;
}
.ms-skeleton {
  height: 300px;
  background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.06) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 20px;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Card ── */
.ms-card {
  position: relative;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(8px);
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
  display: flex;
  flex-direction: column;
}
.ms-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.35);
  border-color: rgba(0, 212, 255, 0.35);
}

/* Accent bar — alternating colours */
.ms-card__accent {
  height: 3px;
  background: linear-gradient(90deg, #00d4ff, #0af5a0);
  width: 100%;
}
.ms-card:nth-child(2n) .ms-card__accent  { background: linear-gradient(90deg, #a78bfa, #f472b6); }
.ms-card:nth-child(3n) .ms-card__accent  { background: linear-gradient(90deg, #fb923c, #fbbf24); }

/* Card head */
.ms-card__head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 22px 14px;
}
.ms-card__icon-ring {
  width: 52px; height: 52px;
  flex-shrink: 0;
  border-radius: 14px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.14);
  display: flex; align-items: center; justify-content: center;
  transition: background 0.22s;
}
.ms-card:hover .ms-card__icon-ring { background: rgba(0,212,255,0.12); }
.ms-card__icon-img {
  width: 30px; height: 30px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.85;
}
.ms-card__icon-fallback { font-size: 1.5rem; }
.ms-card__title {
  font-size: 0.98rem;
  font-weight: 700;
  color: #e8f4f8;
  margin: 0;
  line-height: 1.3;
}

/* Divider */
.ms-card__divider {
  height: 1px;
  background: rgba(255,255,255,0.07);
  margin: 0 22px;
}

/* List */
.ms-card__list {
  list-style: none;
  padding: 10px 0 4px;
  margin: 0;
  flex: 1;
}

.ms-card__link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 22px;
  font-size: 0.88rem;
  font-weight: 500;
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  transition: color 0.18s, background 0.18s, padding-left 0.18s;
}
.ms-card__link:hover {
  color: #00d4ff;
  background: rgba(0, 212, 255, 0.06);
  padding-left: 28px;
}
.ms-card__link-icon {
  flex-shrink: 0;
  opacity: 0.5;
  transition: opacity 0.18s, transform 0.18s;
  color: #00d4ff;
}
.ms-card__link:hover .ms-card__link-icon {
  opacity: 1;
  transform: translateX(2px);
}

/* Special items (hardcoded teacher/student) */
.ms-card__link--special { color: rgba(10,245,160,0.75); }
.ms-card__link--special:hover { color: #0af5a0; background: rgba(10,245,160,0.06); }
.ms-card__link--special .ms-card__link-icon { color: #0af5a0; }

/* Footer */
.ms-card__footer {
  padding: 10px 22px 16px;
  border-top: 1px solid rgba(255,255,255,0.05);
  margin-top: 4px;
}
.ms-card__count {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.25);
  text-transform: uppercase;
}

/* Empty */
.ms-empty {
  text-align: center;
  color: rgba(255,255,255,0.3);
  font-size: 1rem;
  padding: 40px 0;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .menu-section { padding: 60px 14px 70px; }
  .ms-grid { grid-template-columns: 1fr; }
}
@media (min-width: 769px) and (max-width: 1100px) {
  .ms-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
