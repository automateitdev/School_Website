<template>
  <header ref="headerRef">
    <div class="top-bar">
      <div class="top-bar-right">
        <a v-if="email" :href="'mailto:' + email" class="top-bar-email">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 6h16v12H4z"></path>
            <path d="m4 7 8 6 8-6"></path>
          </svg>
          <span>{{ email }}</span>
        </a>

        <div class="social-icons" aria-label="Social links">
          <a href="#" class="social-link" title="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="#" class="social-link" title="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="#" class="social-link" title="Twitter">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          </a>
          <a href="#" class="social-link" title="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
        </div>

        <div class="top-bar-divider"></div>

        <div
          class="login-dropdown"
          @mouseenter="isDesktop && openLoginMenu()"
          @mouseleave="isDesktop && closeLoginMenu()"
          @focusin="openLoginMenu"
          @focusout="handleLoginFocusOut"
        >
          <button
            type="button"
            class="login-btn"
            :aria-expanded="loginOpen ? 'true' : 'false'"
            @click.stop="toggleLoginMenu"
          >
            <span class="btn-icon btn-icon--login" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21a8 8 0 0 0-16 0"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            <span>Login</span>
            <span class="arrow-small">&#9662;</span>
          </button>

          <ul class="login-menu" v-show="loginOpen">
            <li>
              <a href="https://live.academyims.com/Student_Portal" target="_blank" @click="loginOpen = false">
                Student Portal
              </a>
            </li>
            <li>
              <a href="https://live.academyims.com/" target="_blank" @click="loginOpen = false">
                Academic Portal
              </a>
            </li>
          </ul>
        </div>

        <a href="https://pay.academyims.com/" target="_blank" class="payment-btn">
          <span class="btn-icon btn-icon--payment" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2.5" y="5" width="19" height="14" rx="2"></rect>
              <path d="M2.5 9.5h19"></path>
            </svg>
          </span>
          <span>Payment Portal</span>
        </a>
      </div>
    </div>

    <div class="main-header">
      <div class="main-header-left">
        <router-link to="/" class="main-logo-area" @click="closeMobileMenu">
          <img v-if="logoSrc" :src="logoSrc" alt="School Logo" class="main-logo-img" />
        </router-link>
      </div>

      <div class="hamburger" @click="toggleMobileMenu">
        <span :class="{ open: mobileMenuOpen }"></span>
        <span :class="{ open: mobileMenuOpen }"></span>
        <span :class="{ open: mobileMenuOpen }"></span>
      </div>

      <nav class="menu" :class="{ 'mobile-open': mobileMenuOpen }">
        <div
          v-for="(item, idx) in orderedMenuWithSubItems"
          :key="item.menu.menu_id"
          class="dropdown"
          @mouseenter="isDesktop && (openMenus[item.menu.menu_id] = true)"
          @mouseleave="isDesktop && (openMenus[item.menu.menu_id] = false)"
        >
          <div
            class="dropbtn"
            :class="{ active: openMenus[item.menu.menu_id] || isMenuActive(item) }"
            @click="handleMenuRowClick(item)"
          >
            <span
              v-if="hasSubItems(item)"
              class="menu-link menu-link--text"
            >
              {{ getMenuLabel(item.menu) }}
            </span>

            <router-link
              v-else
              :to="menuDirectLink(item)"
              class="menu-link"
              @click="!isDesktop && closeMobileMenu()"
            >
              {{ getMenuLabel(item.menu) }}
            </router-link>

            <button
              v-if="hasSubItems(item)"
              type="button"
              class="menu-toggle"
              :aria-expanded="openMenus[item.menu.menu_id] ? 'true' : 'false'"
              @click.stop="toggleMobileDropdown(item.menu.menu_id)"
            >
              <span class="arrow" :class="{ rotated: openMenus[item.menu.menu_id] }">&#9660;</span>
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
                  || '-' }}
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
import { useHeaderLogoUrl } from '@/composables/useImageUrl'

const route = useRoute()
const websiteStore = useWebsiteStore()

const getBasic = computed(() => websiteStore.getBasic)
const getHeader = computed(() => websiteStore.getHeader)
const getUser = computed(() => websiteStore.getUser)
const getFooterData = computed(() => websiteStore.getFooterData || {})

const email = computed(() =>
  getFooterData.value?.footer_email || getBasic.value?.email || getUser.value?.email || ''
)

const logoSrc = computed(() => {
  const img = getHeader.value?.header_image || getBasic.value?.logo
  return img ? useHeaderLogoUrl(img) : ''
})

const menuWithSubItems = computed(() => websiteStore.getMenuWithSubItems || [])

const orderedMenuWithSubItems = computed(() => {
  const items = [...menuWithSubItems.value]
  const isHomeMenu = (item) => {
    const label = String(getMenuLabel(item?.menu) || '').trim().toLowerCase()
    return label === 'home' || label === '???' || label === '??? ???'
  }
  items.sort((a, b) => {
    const aIsHome = isHomeMenu(a)
    const bIsHome = isHomeMenu(b)
    if (aIsHome === bIsHome) return 0
    return aIsHome ? -1 : 1
  })
  return items
})

const getMenuLabel = (menu) =>
  menu?.menuassign?.menu_title_bangla ||
  menu?.menuassign?.menu_title ||
  ''

const hasSubItems = (item) => item.subItems && item.subItems.length > 0

const menuDirectLink = (item) => {
  const menu = item.menu
  if (menu.menu_content) return `/menus/single/${menu.id}`
  const title = (menu.menuassign?.menu_title || '').toLowerCase()
  if (title === 'home' || title === '???' || title === '??? ???') return '/'
  return '/'
}

const openMenus = reactive({})

watch(orderedMenuWithSubItems, (items) => {
  items.forEach(item => {
    const key = item.menu.menu_id
    if (!(key in openMenus)) openMenus[key] = false
  })
}, { immediate: true })

const toggleMobileDropdown = (id) => {
  Object.keys(openMenus).forEach(k => {
    openMenus[k] = String(k) === String(id) ? !openMenus[k] : false
  })
}

const handleMenuRowClick = (item) => {
  if (!hasSubItems(item)) return
  toggleMobileDropdown(item.menu.menu_id)
}

const mobileMenuOpen = ref(false)
const loginOpen = ref(false)
const headerRef = ref(null)

const toggleMobileMenu = () => (mobileMenuOpen.value = !mobileMenuOpen.value)
const openLoginMenu = () => { loginOpen.value = true }
const closeLoginMenu = () => { loginOpen.value = false }
const toggleLoginMenu = () => { loginOpen.value = !loginOpen.value }
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

const handleDocumentClick = (e) => {
  if (headerRef.value && !headerRef.value.contains(e.target)) {
    Object.keys(openMenus).forEach(k => { openMenus[k] = false })
    closeLoginMenu()
  }
}

const handleLoginFocusOut = (e) => {
  if (!e.currentTarget?.contains(e.relatedTarget)) {
    closeLoginMenu()
  }
}

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
const updateWidth = () => { windowWidth.value = window.innerWidth }

onMounted(() => {
  window.addEventListener('resize', updateWidth)
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
  document.removeEventListener('click', handleDocumentClick)
})

const isDesktop = computed(() => windowWidth.value > 768)

watch(() => route.path, () => {
  closeMobileMenu()
  loginOpen.value = false
})

watch(isDesktop, val => {
  if (val) closeMobileMenu()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

header {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 3000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
  background: white;
}

.top-bar {
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.16), transparent 32%),
    linear-gradient(135deg, #063d4d 0%, #0a728a 55%, #11a1bd 100%);
  color: rgba(255, 255, 255, 0.96);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  gap: 18px;
  font-size: 14px;
  letter-spacing: 0.2px;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.top-bar-right {
  justify-content: space-between;
  width: 100%;
  column-gap: 8px;
}

.top-bar-email {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: inherit;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
}

.top-bar-email:hover {
  text-decoration: underline;
}

.top-bar-email span {
  overflow-wrap: anywhere;
}

.main-header-left {
  display: inline-flex;
  align-items: center;
  flex-shrink: 1;
  width: fit-content;
  max-width: 300px;
}

.main-logo-area {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  line-height: 0;
  width: 100%;
}

.main-logo-img {
  display: block;
  max-width: 100%;
  max-height: 80px;
  height: auto;
  object-fit: contain;
  object-position: left center;
}

.login-btn svg,
.payment-btn svg,
.top-bar-email svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.social-icons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.social-link {
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.2s;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.social-link svg {
  width: 14px;
  height: 14px;
}

.top-bar-divider {
  width: 1px;
  align-self: stretch;
  background: rgba(255, 255, 255, 0.18);
  margin: 0 2px;
}

.login-dropdown {
  position: relative;
  padding-bottom: 12px;
  margin-bottom: -12px;
  margin-right: -2px;
}

.login-btn,
.payment-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(65, 167, 191, 0.92), rgba(36, 138, 164, 0.98));
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s;
  white-space: nowrap;
  color: #fff;
  text-decoration: none;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
}

.login-btn {
  border-width: 1px;
}

.login-btn:hover,
.login-btn:focus-visible,
.payment-btn:hover {
  background: linear-gradient(180deg, rgba(79, 183, 206, 0.95), rgba(46, 151, 177, 1));
}

.login-btn:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: 2px;
}

.arrow-small {
  font-size: 8px;
  line-height: 1;
  opacity: 0.95;
  transform: translateY(1px);
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

.btn-icon svg {
  width: 13px;
  height: 13px;
}

.btn-icon--login {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: rgba(51, 67, 72, 0.9);
  color: #f8f6e7;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.btn-icon--login svg {
  width: 10px;
  height: 10px;
}

.btn-icon--payment {
  width: 14px;
  height: 11px;
  border-radius: 2px;
  background: linear-gradient(180deg, #f4c546, #df9c14);
  color: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(86, 59, 0, 0.28);
}

.btn-icon--payment svg {
  width: 12px;
  height: 9px;
}

.login-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 2px);
  background: white;
  list-style: none;
  border-radius: 14px;
  overflow: hidden;
  min-width: 190px;
  z-index: 4000;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.login-menu li a {
  display: block;
  padding: 12px 16px;
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

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 0 20px 0 0;
  background: white;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.22);
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 3px;
  cursor: pointer;
  z-index: 1500;
  flex-shrink: 0;
}

.hamburger span {
  width: 20px;
  height: 2px;
  background: #333;
  display: block;
  transition: 0.3s;
}

.hamburger span.open:nth-child(1) { transform: rotate(45deg) translate(4px, 4px); }
.hamburger span.open:nth-child(2) { opacity: 0; }
.hamburger span.open:nth-child(3) { transform: rotate(-45deg) translate(2.5px, -3.5px); }

.menu {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  gap: 2px;
  min-width: 0;
}

.menu > a,
.dropbtn,
.menu-toggle {
  padding: 4px 5px;
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
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
}

.menu-link,
.menu-link--text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
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
  display: inline-flex;
  align-items: center;
}

.arrow {
  margin-left: 0;
  font-size: 9px;
  line-height: 1;
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
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
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
  .hamburger {
    display: inline-flex;
    align-self: flex-start;
    margin: 4px 12px 8px;
    border: 1px solid #d7e3e8;
    border-radius: 6px;
    padding: 6px 8px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .top-bar {
    flex-direction: column;
    align-items: stretch;
    padding: 8px 12px;
    gap: 6px;
    font-size: 11px;
  }

  .top-bar-right {
    width: 100%;
    justify-content: center;
  }

  .top-bar-right {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    column-gap: 8px;
    row-gap: 5px;
  }

  .top-bar-email {
    grid-column: 1;
    justify-content: flex-start;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .social-icons {
    justify-content: flex-end;
    gap: 6px;
    grid-column: 2;
  }

  .social-link {
    width: 26px;
    height: 26px;
  }

  .top-bar-divider {
    display: none;
  }

  .login-dropdown,
  .payment-btn {
    width: 100%;
    margin: 0;
    padding-bottom: 0;
    grid-column: auto;
  }

  .login-dropdown {
    justify-self: end;
  }

  .payment-btn {
    justify-self: start;
  }

  .login-btn,
  .payment-btn {
    width: 100%;
    justify-content: center;
    min-height: 34px;
    padding: 7px 9px;
    border-radius: 12px;
    white-space: nowrap;
    text-align: center;
    font-size: 12px;
  }

  .login-menu {
    right: 0;
    left: 0;
    top: calc(100% + 4px);
    transform: none;
    min-width: 0;
  }

  .login-menu li a {
    font-size: 14px;
    padding: 12px 16px;
    text-align: center;
  }

  .main-header {
    flex-direction: column;
    align-items: stretch;
    padding: 0;
  }

  .main-header-left {
    justify-content: center;
    width: 100%;
    max-width: 100%;
    padding: 0;
    border-bottom: 3px solid #f1f1f1;
  }

  .main-logo-img {
    width: 100%;
    height: auto;
    max-height: 90px;
    object-fit: contain;
    object-position: center;
    display: block;
  }

  .menu {
    display: none;
    flex-direction: column;
    align-items: stretch;
    position: static;
    background: white;
    width: 100%;
    border-top: 1px solid #ddd;
    gap: 0;
    flex: none;
    padding: 6px 12px 12px;
  }

  .menu.mobile-open {
    display: flex;
    animation: slideDown 0.3s ease;
  }

  .dropdown {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 5px;
  }

  .menu > a,
  .dropbtn {
    border-radius: 9px;
    padding: 10px 12px;
    font-size: 14px;
    width: 100%;
    justify-content: space-between;
  }

  .dropbtn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    cursor: pointer;
    border: 1px solid #e4edf2;
    background: #ffffff;
  }

  .dropbtn.active {
    background: linear-gradient(135deg, #eef9fc, #f7fdff);
    color: #0a4f61;
    border-color: #bfe2ee;
  }

  .menu-link,
  .menu-link--text {
    flex: 1;
    min-width: 0;
  }

  .menu-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: rgba(10, 114, 138, 0.08);
    border: none;
    cursor: pointer;
    flex-shrink: 0;
    padding: 0;
  }

  .dropbtn.active .menu-toggle {
    background: rgba(10, 114, 138, 0.12);
  }

  .dropbtn.active .arrow {
    color: #0a728a;
  }

  .dropdown-bridge {
    display: none;
  }

  .dropdown-content {
    position: relative;
    top: 0;
    left: 0;
    border: 1px solid #d7e8ef;
    border-radius: 9px;
    box-shadow: none;
    background: #f5fbfd;
    padding: 4px 0;
    margin: 4px 6px 0 12px;
    overflow: hidden;
    animation: fadeIn 0.2s ease;
  }

  .dropdown-content li a {
    padding: 9px 14px 9px 15px;
    border-bottom: 1px solid #eee;
    font-size: 13px;
    white-space: normal;
  }

  .dropdown-content li:last-child a {
    border-bottom: none;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
}

@media (max-width: 420px) {
  .top-bar {
    padding: 8px 10px;
  }

  .social-icons {
    justify-content: center;
  }

  .main-logo-img {
    max-height: 48px;
  }
}
</style>
