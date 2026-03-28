<template>
  <section class="menu-detail-page">
    <div class="menu-detail__container">
      <div class="menu-detail__header">
        <img
          v-if="currentIcon"
          :src="currentIcon"
          :alt="currentTitle"
          class="menu-detail__icon"
        />
        <div>
          <h1>{{ currentTitle }}</h1>
          <p v-if="currentLink" class="menu-detail__link">
            <strong>Link:</strong>
            <a :href="currentLink" target="_blank" rel="noopener">{{ currentLink }}</a>
          </p>
          <p class="menu-detail__summary">{{ currentDescription }}</p>
        </div>
      </div>

      <div v-if="loading" class="menu-detail__status">Loading menu details…</div>
      <div v-else-if="error" class="menu-detail__status menu-detail__status--error">{{ error }}</div>
      <div v-else>
        <div v-if="menu" class="menu-detail__content">
          <div class="menu-detail__section">
            <h2>About this menu</h2>
            <div v-html="currentDocument"></div>
          </div>

          <div class="menu-detail__section" v-if="relatedSubmenus.length">
            <h2>Related submenus</h2>
            <ul class="submenu-list">
              <li v-for="sub in relatedSubmenus" :key="sub.slug || sub.id" class="submenu-item">
                <router-link :to="`/menus/${menu.slug || menu.id}/${sub.slug || sub.id}`" class="submenu-card">
                  <img
                    v-if="submenuIcon(sub)"
                    :src="submenuIcon(sub)"
                    :alt="sub.title"
                    class="submenu-card__icon"
                  />
                  <div>
                    <h3>{{ sub.title }}</h3>
                    <p v-if="sub.description || sub.summary">{{ sub.description || sub.summary }}</p>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
        </div>

        <div v-else class="menu-detail__status">Menu item not found.</div>
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
.menu-detail__container {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 20px;
}

.menu-detail__header {
  display: flex;
  gap: 24px;
  align-items: center;
  margin-bottom: 32px;
}

.menu-detail__icon {
  width: 96px;
  height: 96px;
  object-fit: contain;
  border-radius: 18px;
  background: #f8fafc;
  padding: 14px;
}

.menu-detail__header h1 {
  margin: 0;
  font-size: 2rem;
}

.menu-detail__link,
.menu-detail__summary {
  margin: 12px 0 0;
  color: #4b5563;
}

.menu-detail__link a {
  color: #0f766e;
  text-decoration: underline;
}

.menu-detail__status {
  padding: 24px 0;
  color: #374151;
}

.menu-detail__status--error {
  color: #b91c1c;
}

.menu-detail__section {
  margin-bottom: 32px;
}

.menu-detail__section h2 {
  margin-bottom: 14px;
  font-size: 1.25rem;
}

.submenu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.submenu-item {
  margin-bottom: 14px;
}

.submenu-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s ease;
}

.submenu-card:hover {
  background: #f8fafc;
}

.submenu-card__icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.submenu-card h3 {
  margin: 0 0 6px;
  font-size: 1.05rem;
}

.submenu-card p {
  margin: 0;
  color: #6b7280;
}
</style>
