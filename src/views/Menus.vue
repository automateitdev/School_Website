<template>
  <section class="menus-page">
    <div class="menus-page__container">
      <header class="menus-page__header">
        <h1>Dynamic Menus</h1>
        <p>Browse dynamic menu categories and submenus loaded from the API.</p>
      </header>

      <div v-if="loading" class="menus-status">Loading menus…</div>
      <div v-else-if="error" class="menus-status menus-status--error">{{ error }}</div>
      <div v-else-if="menus.length === 0" class="menus-status">No menu data available.</div>

      <div class="menu-grid" v-else>
        <article v-for="menu in menus" :key="menu.slug || menu.id" class="menu-card">
          <router-link :to="`/menus/${menu.slug || menu.id}`" class="menu-card__header">
            <img
              v-if="menuIcon(menu)"
              :src="menuIcon(menu)"
              :alt="menu.title"
              class="menu-card__icon"
            />
            <div>
              <h2>{{ menu.title }}</h2>
              <p v-if="menu.description || menu.summary">{{ menu.description || menu.summary }}</p>
            </div>
          </router-link>

          <ul v-if="menu.submenus?.length" class="submenu-list">
            <li
              v-for="sub in menu.submenus"
              :key="sub.slug || sub.id"
              class="submenu-item"
            >
              <router-link :to="`/menus/${menu.slug || menu.id}/${sub.slug || sub.id}`" class="submenu-link">
                <img
                  v-if="submenuIcon(sub)"
                  :src="submenuIcon(sub)"
                  :alt="sub.title"
                  class="submenu-link__icon"
                />
                <span>{{ sub.title }}</span>
              </router-link>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useWebsiteStore } from '@/stores/websiteStore'
import { useMenuIconUrl } from '@/composables/useImageUrl'

const websiteStore = useWebsiteStore()
const loading = ref(false)
const error = ref('')

const menus = computed(() => websiteStore.getMenuSubmenus || [])

const menuIcon = (menu) => useMenuIconUrl(menu?.menuassign?.menu_icon || menu?.menu_icon)
const submenuIcon = (submenu) => useMenuIconUrl(
  submenu?.submenuassign?.submenu_icon ||
  submenu?.mm?.submenuassign?.submenu_icon ||
  submenu?.menuassign?.menu_icon ||
  submenu?.icon
)

const loadMenus = async () => {
  if (websiteStore.getMenuSubmenus?.length) return
  loading.value = true
  error.value = ''
  try {
    await websiteStore.fetchMenuSubmenus()
  } catch (e) {
    error.value = e?.message || 'Unable to load menu data.'
  } finally {
    loading.value = false
  }
}

onMounted(loadMenus)
</script>

<style scoped>
.menus-page__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.menus-page__header {
  text-align: center;
  margin-bottom: 32px;
}

.menus-page__header h1 {
  margin-bottom: 10px;
  font-size: 2.4rem;
}

.menus-page__header p {
  margin: 0;
  color: #4b5563;
}

.menus-status {
  text-align: center;
  color: #374151;
  padding: 24px 0;
}

.menus-status--error {
  color: #b91c1c;
}

.menu-grid {
  display: grid;
  gap: 24px;
}

.menu-card {
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.menu-card__header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  text-decoration: none;
  color: inherit;
}

.menu-card__icon {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.menu-card__header h2 {
  margin: 0 0 8px;
  font-size: 1.35rem;
}

.menu-card__header p {
  margin: 0;
  color: #6b7280;
}

.submenu-list {
  list-style: none;
  margin: 0;
  padding: 0 24px 20px;
}

.submenu-item {
  margin-top: 12px;
}

.submenu-link {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #111827;
  text-decoration: none;
  padding: 10px;
  border-radius: 12px;
  transition: background 0.2s ease;
}

.submenu-link:hover {
  background: #f8fafc;
}

.submenu-link__icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

@media (min-width: 900px) {
  .menu-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
