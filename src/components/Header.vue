<template>
  <header ref="headerRef">

    <div class="top-bar">
      <div class="left">
        <span class="datetime-icon">🕐</span>
        {{ currentDateTime }}
      </div>
      <div class="right">
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

        <div class="social-links">
          <a href="#" target="_blank" class="social-btn facebook" title="Facebook">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="#" target="_blank" class="social-btn youtube" title="YouTube">
            <i class="fab fa-youtube"></i>
          </a>
          <a href="#" target="_blank" class="social-btn linkedin" title="LinkedIn">
            <i class="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </div>

    <div class="main-header">
      <router-link to="/" class="logo-area" @click="closeMobileMenu">
        <div v-if="websiteStore.isLoading" class="skeleton-logo"></div>
        <img v-else-if="logoSrc" :src="logoSrc" alt="School Logo" />
        <div v-if="websiteStore.isLoading" class="skeleton-title"></div>
        <h1 v-else>{{ schoolName }}</h1>
      </router-link>

      <div class="hamburger" @click="toggleMobileMenu">
        <span :class="{ open: mobileMenuOpen }"></span>
        <span :class="{ open: mobileMenuOpen }"></span>
        <span :class="{ open: mobileMenuOpen }"></span>
      </div>

      <nav class="menu" :class="{ 'mobile-open': mobileMenuOpen }">
        <router-link to="/" :class="{ active: isActive('/') }" @click="closeMobileMenu">Home</router-link>

        <div
          v-for="menu in allMenus"
          :key="menu.name"
          class="dropdown"
          @mouseenter="isDesktop && openDropdown(menu.name)"
          @mouseleave="isDesktop && closeDropdown(menu.name)"
        >
          <span
            class="dropbtn"
            :class="{ active: isMenuRouteActive(menu.name) || openMenus[menu.name] }"
            @click="!isDesktop && toggleMobileDropdown(menu.name)"
          >
            {{ menu.name }}
            <span class="arrow" :class="{ rotated: openMenus[menu.name] }">▼</span>
          </span>

          <div class="dropdown-bridge" v-if="isDesktop"></div>

          <ul v-show="openMenus[menu.name]" class="dropdown-content">
            <li v-for="item in menu.items" :key="item.link || item.name">
              <a
                v-if="item.external"
                :href="item.link"
                target="_blank"
                @click="!isDesktop && closeMobileMenu()"
              >{{ item.name }}</a>
              <router-link
                v-else
                :to="item.link"
                :class="{ active: isActive(item.link) }"
                @click="!isDesktop && closeMobileMenu()"
              >{{ item.name }}</router-link>
            </li>
          </ul>
        </div>

        <router-link to="/downloads" :class="{ active: isActive('/downloads') }" @click="closeMobileMenu">Downloads</router-link>
        <router-link to="/contact" :class="{ active: isActive('/contact') }" @click="closeMobileMenu">Contact</router-link>
      </nav>
    </div>

  </header>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useHeaderLogoUrl } from '@/composables/useImageUrl'

const route = useRoute()
const websiteStore = useWebsiteStore()

const getBasic = computed(() => websiteStore.getBasic)
const logoSrc = computed(() => getBasic.value?.logo ? useHeaderLogoUrl(getBasic.value.logo) : '')
const schoolName = computed(() => getBasic.value?.name || 'abc school')

const allMenus = computed(() => websiteStore.getNavMenus)

const openMenus = reactive({})
watch(allMenus, (menus) => {
  menus.forEach(m => { if (!(m.name in openMenus)) openMenus[m.name] = false })
}, { immediate: true })
const mobileMenuOpen = ref(false)
const loginOpen = ref(false)
const headerRef = ref(null)

const toggleMobileMenu = () => (mobileMenuOpen.value = !mobileMenuOpen.value)
const toggleMobileDropdown = name => {
  Object.keys(openMenus).forEach(menu => {
    openMenus[menu] = menu === name ? !openMenus[menu] : false
  })
}

const openDropdown = name => (openMenus[name] = true)
const closeDropdown = name => (openMenus[name] = false)
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  Object.keys(openMenus).forEach(menu => (openMenus[menu] = false))
}

const isActive = link => route.path === link
const isMenuRouteActive = menuName => {
  const menu = allMenus.value.find(m => m.name === menuName)
  return menu?.items.some(item => !item.external && item.link === route.path)
}

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
const updateWidth = () => (windowWidth.value = window.innerWidth)
onMounted(() => window.addEventListener('resize', updateWidth))
onUnmounted(() => window.removeEventListener('resize', updateWidth))

const isDesktop = computed(() => windowWidth.value > 768)

watch(() => route.path, () => {
  closeMobileMenu()
  loginOpen.value = false
})
watch(isDesktop, val => { if (val) closeMobileMenu() })

const currentDateTime = ref('')
let timer = null
const updateDateTime = () => {
  const now = new Date()
  currentDateTime.value = now.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
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
  background: linear-gradient(135deg, #002d3a 0%, #004d62 100%);
  color: rgba(255,255,255,0.9);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 24px;
  font-size: 13px;
  letter-spacing: 0.2px;
}

.top-bar .left {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  opacity: 0.9;
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

.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  flex-wrap: nowrap;
  flex-shrink: 0;
}

.logo-area img {
  width: 100px;
  margin-bottom: -50px;
  flex-shrink: 0;
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

.logo-area h1 {
  font-size: clamp(18px, 2.5vw, 28px);
  margin: 0;
  font-weight: 700;
  color: #003f4f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 1200px) {
  .logo-area h1 { white-space: normal; }
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
  gap: 2px;
  align-items: center;
}

.menu > a,
.dropbtn {
  padding: 6px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  color: #333;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s, color 0.3s;
  cursor: pointer;
  white-space: nowrap;
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