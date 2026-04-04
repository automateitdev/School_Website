<template>
  <header ref="headerRef">

    <div class="top-bar top-bar--brand">
      <div class="left left--brand">
        <router-link to="/" class="top-logo-area" @click="closeMobileMenu">
          <img v-if="logoSrc" :src="logoSrc" alt="School Logo" />
          <div class="title-wrap">
            <h1>{{ schoolName }}</h1>
          </div>
        </router-link>
      </div>
      <div class="right right--top">
        <div class="login-dropdown" @mouseenter="isDesktop && (loginOpen = true)" @mouseleave="isDesktop && (loginOpen = false)">
          <span class="login-btn" @click="!isDesktop && (loginOpen = !loginOpen)">
            <span class="login-icon">👤</span>
            Login
            <span class="arrow-small">▾</span>
          </span>
          <ul class="login-menu" v-show="loginOpen">
            <li>
              <a href="https://live.academyims.com/Student_Portal" target="_blank" @click="loginOpen = false">
                🎓 Student Portal
              </a>
            </li>
            <li>
              <a href="https://live.academyims.com/" target="_blank" @click="loginOpen = false">
                🏫 Academic Portal
              </a>
            </li>
          </ul>
        </div>
        <div class="datetime-box">
          <span class="datetime-icon">🕐</span>
          <span>{{ currentDateTime }}</span>
        </div>
      </div>
    </div>

    <div class="main-header">

      <div class="hamburger" @click="toggleMobileMenu">
        <span :class="{ open: mobileMenuOpen }"></span>
        <span :class="{ open: mobileMenuOpen }"></span>
        <span :class="{ open: mobileMenuOpen }"></span>
      </div>

      <nav class="menu" :class="{ 'mobile-open': mobileMenuOpen }">

        <div
          v-for="(item, idx) in menuWithSubItems"
          :key="item.menu.menu_id"
          class="dropdown"
          @mouseenter="isDesktop && openDropdown(item.menu.menu_id)"
          @mouseleave="isDesktop && closeDropdown(item.menu.menu_id)"
        >
          <div
            class="dropbtn"
            :class="{ active: openMenus[item.menu.menu_id] || isMenuActive(item) }"
          >
            <span
              v-if="hasSubItems(item)"
              class="menu-link menu-link--text"
            >
              <img
                v-if="item.menu.menuassign?.menu_icon"
                :src="menuIconUrl(item.menu.menuassign.menu_icon)"
                alt=""
                class="menu-icon"
              />
              {{ getMenuLabel(item.menu) }}
            </span>

            <router-link
              v-else
              :to="menuDirectLink(item)"
              class="menu-link"
              @click="!isDesktop && closeMobileMenu()"
            >
              <img
                v-if="item.menu.menuassign?.menu_icon"
                :src="menuIconUrl(item.menu.menuassign.menu_icon)"
                alt=""
                class="menu-icon"
              />
              {{ getMenuLabel(item.menu) }}
            </router-link>
            <button
              v-if="hasSubItems(item)"
              type="button"
              class="menu-toggle"
              @click.stop="toggleMobileDropdown(item.menu.menu_id)"
            >
              <span class="arrow" :class="{ rotated: openMenus[item.menu.menu_id] }">▼</span>
            </button>
          </div>

          <div class="dropdown-bridge" v-if="isDesktop && hasSubItems(item)"></div>

          <ul
            v-if="hasSubItems(item)"
            v-show="openMenus[item.menu.menu_id]"
            class="dropdown-content"
          >
            <li v-for="sub in item.subItems" :key="sub.mm.id">
              <router-link
                :to="`/menus/${sub.mm.id}`"
                :class="{ active: isActive(`/menus/${sub.mm.id}`) }"
                @click="!isDesktop && closeMobileMenu()"
              >
                {{ sub.mm.submenuassign?.submenu_title_bangla
                  || sub.mm.submenuassign?.submenu_title
                  || '—' }}
              </router-link>
            </li>

            <li v-if="item.menu.menuassign?.menu_title === 'Academic Info'">
              <router-link
                to="/studentlist"
                :class="{ active: isActive('/studentlist') }"
                @click="!isDesktop && closeMobileMenu()"
              >
                Student List
              </router-link>
            </li>

            <li v-if="item.menu.menuassign?.menu_title === 'Management Info'">
              <router-link
                to="/teacherlist"
                :class="{ active: isActive('/teacherlist') }"
                @click="!isDesktop && closeMobileMenu()"
              >
                Our Teachers
              </router-link>
            </li>
          </ul>
        </div>

      </nav>
    </div>

  </header>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useHeaderLogoUrl, useMenuIconUrl } from '@/composables/useImageUrl'

const route = useRoute()
const websiteStore = useWebsiteStore()

const getBasic = computed(() => websiteStore.getBasic)
const getHeader = computed(() => websiteStore.getHeader)
const getUser = computed(() => websiteStore.getUser)

const logoSrc = computed(() => {
  const img = getHeader.value?.header_image || getBasic.value?.logo
  return img ? useHeaderLogoUrl(img) : ''
})
const schoolName = computed(() => getUser.value?.institute_name || getBasic.value?.name || 'Our School')

const menuWithSubItems = computed(() => websiteStore.getMenuWithSubItems || [])

const getMenuLabel = (menu) =>
  menu?.menuassign?.menu_title_bangla ||
  menu?.menuassign?.menu_title ||
  ''

const hasSubItems = (item) => item.subItems && item.subItems.length > 0

const menuDirectLink = (item) => {
  const menu = item.menu
  if (menu.menu_content) return `/menus/single/${menu.id}`
  const title = (menu.menuassign?.menu_title || '').toLowerCase()
  if (title === 'home' || title === 'হোম' || title === 'হোম পেজ') return '/'
  return '/'
}

const menuIconUrl = (icon) => icon ? useMenuIconUrl(icon) : ''

const openMenus = reactive({})

watch(menuWithSubItems, (items) => {
  items.forEach(item => {
    const key = item.menu.menu_id
    if (!(key in openMenus)) openMenus[key] = false
  })
}, { immediate: true })

const openDropdown  = (id) => { openMenus[id] = true }
const closeDropdown = (id) => { openMenus[id] = false }

const toggleMobileDropdown = (id) => {
  Object.keys(openMenus).forEach(k => {
    openMenus[k] = String(k) === String(id) ? !openMenus[k] : false
  })
}

const mobileMenuOpen = ref(false)
const loginOpen = ref(false)
const headerRef = ref(null)

const toggleMobileMenu = () => (mobileMenuOpen.value = !mobileMenuOpen.value)
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  Object.keys(openMenus).forEach(k => (openMenus[k] = false))
}

const isActive = (link) => route.path === link

const isMenuActive = (item) => {
  if (!hasSubItems(item)) return isActive(menuDirectLink(item))
  return item.subItems.some(sub => isActive(`/menus/${sub.mm.id}`))
    || isActive(`/menus/single/${item.menu.id}`)
    || isActive('/studentlist') && item.menu.menuassign?.menu_title === 'Academic Info'
    || isActive('/teacherlist') && item.menu.menuassign?.menu_title === 'Management Info'
}

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
const updateWidth = () => (windowWidth.value = window.innerWidth)
onMounted(() => window.addEventListener('resize', updateWidth))
onUnmounted(() => window.removeEventListener('resize', updateWidth))
const isDesktop = computed(() => windowWidth.value > 768)

watch(() => route.path, () => { closeMobileMenu(); loginOpen.value = false })
watch(isDesktop, val => { if (val) closeMobileMenu() })

const currentDateTime = ref('')
let timer = null
const updateDateTime = () => {
  const now = new Date()
  currentDateTime.value = now.toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}

onMounted(() => {
  updateDateTime()
  timer = setInterval(updateDateTime, 1000)
  const setHeaderPad = () => {
    if (headerRef.value) document.body.style.paddingTop = headerRef.value.offsetHeight + 'px'
  }
  setHeaderPad()
  const ro = new ResizeObserver(setHeaderPad)
  if (headerRef.value) ro.observe(headerRef.value)
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 3000;
  box-shadow: 0 2px 20px rgba(0,0,0,0.15);
}

.top-bar {
  background: linear-gradient(160deg, #063d4d 0%, #0a728a 50%, #0d8aa6 100%);
  color: rgba(255,255,255,0.95);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 30px;
  gap: 16px;
  font-size: 15px;
  letter-spacing: 0.2px;
}

.top-bar .left,
.top-bar .right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.left--brand {
  gap: 18px;
}

.top-logo-area {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: inherit;
}

.top-logo-area img {
  width: 60px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.18);
}

.title-wrap h1 {
  font-size: clamp(18px, 2.4vw, 28px);
  margin: 0;
  font-weight: 700;
  line-height: 1.15;
  color: #ffffff;
}

.datetime-box {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  opacity: 0.92;
}

.datetime-icon {
  font-size: 16px;
}

.datetime-icon {
  font-size: 14px;
}

.top-bar .right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.login-dropdown {
  position: relative;
  padding-bottom: 10px;
  margin-bottom: -10px;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  padding: 5px 12px;
  border-radius: 20px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  transition: all 0.2s;
  white-space: nowrap;
}

.login-btn:hover {
  background: rgba(255,255,255,0.22);
}

.arrow-small {
  font-size: 12px;
}

.login-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  list-style: none;
  border-radius: 10px;
  overflow: hidden;
  min-width: 180px;
  z-index: 4000;
  box-shadow: 0 8px 30px rgba(0,0,0,0.18);
  border: 1px solid rgba(0,0,0,0.06);
}

.login-menu li a {
  display: block;
  padding: 11px 16px;
  color: #1a2e35;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  border-bottom: 1px solid #f0f0f0;
  white-space: nowrap;
}

.login-menu li:last-child a {
  border-bottom: none;
}

.login-menu li a:hover {
  background: #f0f9fb;
  color: #007a94;
  padding-left: 20px;
}

.social-links {
  display: flex;
  align-items: center;
  gap: 6px;
}

.social-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  text-decoration: none;
  font-size: 12px;
  transition: transform 0.2s, opacity 0.2s;
  opacity: 0.85;
}

.social-btn:hover {
  transform: scale(1.18);
  opacity: 1;
}

.social-btn.facebook { background: #1877f2; }
.social-btn.youtube  { background: #ff0000; }
.social-btn.linkedin { background: #0a66c2; }

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px;
  background: white;
  border-bottom: 1px solid #ddd;
}

.skeleton-logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f0f0f0;
  animation: pulse 1.5s infinite;
}

.skeleton-title {
  width: 200px;
  height: 24px;
  background: #f0f0f0;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  z-index: 1500;
  flex-shrink: 0;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background: #333;
  display: block;
  transition: 0.3s;
}

.hamburger span.open:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.hamburger span.open:nth-child(2) { opacity: 0; }
.hamburger span.open:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

.menu {
  display: flex;
  gap: 1px;
  align-items: center;
  flex-wrap: nowrap;
}

.menu > a,
.dropbtn,
.menu-toggle {
  padding: 5px 7px;
  border-radius: 5px;
  font-weight: 600;
  font-size: 13px;
  color: #333;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s, color 0.3s;
  cursor: pointer;
  white-space: nowrap;
}

.menu-toggle {
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  cursor: pointer;
}

.menu-link,
.menu-link--text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.menu-icon,
.submenu-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  margin-right: 8px;
}

.menu > a:hover,
.dropbtn:hover,
.menu > a.active,
.dropbtn.active {
  background: #0a728a;
  color: white;
}

.dropdown {
  position: relative;
}

.arrow {
  margin-left: 4px;
  font-size: 12px;
  display: inline-block;
  transition: transform 0.3s;
}

.arrow.rotated {
  transform: rotate(180deg);
}

.dropdown-bridge {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 8px;
  background: transparent;
  z-index: 999;
}

.dropdown-content {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: white;
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ddd;
  min-width: 160px;
  z-index: 1000;
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  border-radius: 6px;
  overflow: hidden;
}

.dropdown-content li a {
  display: block;
  padding: 8px 12px;
  color: #333;
  text-decoration: none;
  transition: background 0.3s, color 0.3s;
  font-size: 15px;
  white-space: nowrap;
  border-bottom: 1px solid #f0f0f0;
}

.dropdown-content li:last-child a {
  border-bottom: none;
}

.dropdown-content li a:hover,
.dropdown-content li a.active {
  background: #0a728a;
  color: white;
}

@media (max-width: 768px) {
  .hamburger { display: flex; }

  .top-bar {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 16px;
    gap: 8px;
    font-size: 12px;
    text-align: center;
  }

  .top-bar .left {
    justify-content: center;
    font-size: 11px;
    width: 100%;
    text-align: center;
  }

  .top-bar .right {
    justify-content: center;
    width: 100%;
    gap: 12px;
  }

  .login-dropdown {
    position: relative;
  }

  .login-menu {
    position: absolute;
    right: auto;
    left: 50%;
    transform: translateX(-50%);
    top: 100%;
    min-width: 180px;
    border-radius: 10px;
    z-index: 5000;
  }

  .login-menu li a {
    font-size: 14px;
    padding: 12px 18px;
  }

  .main-header { padding: 5px 14px; }

  .logo-area img { width: 65px; margin-bottom: -32px; }
  .logo-area h1  { font-size: clamp(13px, 3.8vw, 20px); }

  .menu {
    display: none;
    flex-direction: column;
    align-items: stretch;
    position: absolute;
    right: 0;
    top: 100%;
    background: white;
    width: min(280px, 92vw);
    border: 1px solid #ddd;
    border-top: none;
    z-index: 1000;
    gap: 0;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    max-height: calc(100vh - 140px);
    overflow-y: auto;
  }

  .menu.mobile-open {
    display: flex;
    animation: slideDown 0.3s ease;
  }

  .menu > a,
  .dropbtn {
    border-radius: 0;
    padding: 13px 16px;
    font-size: 15px;
    border-bottom: 1px solid #eee;
    width: 100%;
    justify-content: space-between;
  }

  .dropdown-bridge { display: none; }

  .dropdown-content {
    position: relative;
    top: 0;
    left: 0;
    border: none;
    border-radius: 0;
    box-shadow: none;
    background: #f9f9f9;
  }

  .dropdown-content li a {
    padding: 10px 28px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
}

@media (max-width: 420px) {
  .top-bar .left { font-size: 10px; }
  .logo-area img { width: 50px; margin-bottom: -25px; }
  .logo-area h1  { font-size: 13px; }
}
</style>