import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Downloads from '../views/Downloads.vue'
import Contact from '../views/Contact.vue'
import NoticesPage from '../views/notices/index.vue'
import NoticeDetails from '../views/notices/[id].vue'
import AboutDetails from '../views/AboutDetails.vue'
import ContentPage from '../views/ContentPage.vue'
import NewsList from '../views/news/index.vue'
import NewsDetail from '../views/news/[id].vue'
import VideoGallery from '../views/VideoGallery.vue'
import PhotoGallery from '../views/PhotoGallery.vue'
import { ref } from 'vue'

const isLoading = ref(false)

const makeBanner = (title = '', subtitle = '') => ({ title, subtitle })

const routes = [
  {
    path: '/',
    component: Home,
    meta: { banner: null }
  },
  {
    path: '/downloads',
    component: Downloads,
    meta: { banner: makeBanner('Downloads') }
  },
  {
    path: '/contact',
    component: Contact,
    meta: { banner: makeBanner('Contact Us', 'We would love to hear from you') }
  },
  {
    path: '/menus',
    component: () => import('../views/Menus.vue'),
    meta: { banner: makeBanner('Menus') }
  },
  {
    path: '/menus/:menuSlug/:submenuSlug',
    name: 'MenuSubmenuDetail',
    component: () => import('../views/MenuDetail.vue'),
    props: true,
    meta: { banner: makeBanner('Menu Details') }
  },
  {
    path: '/menus/:menuSlug',
    name: 'MenuDetail',
    component: () => import('../views/MenuDetail.vue'),
    props: true,
    meta: { banner: makeBanner('Menu Details') }
  },
  {
    path: '/notices',
    component: NoticesPage,
    meta: { banner: makeBanner('All Notices') }
  },
  {
    path: '/notices/:id',
    name: 'NoticeDetails',
    component: NoticeDetails,
    props: true,
    alias: '/notice/:id',
    meta: { banner: makeBanner('Notice Details') }
  },
  {
    path: '/news',
    component: NewsList,
    meta: { banner: makeBanner('News') }
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: NewsDetail,
    props: true,
    meta: { banner: makeBanner('News') }
  },
  {
    path: '/videos',
    component: VideoGallery,
    meta: { banner: makeBanner('Video Gallery') }
  },

  {
    path: '/photogallery',
    component: PhotoGallery,
    meta: { banner: makeBanner('Photo Gallery') }
  },
  {
    path: '/photogallery/:id',
    name: 'PhotoAlbum',
    component: () => import('../views/photogallery/[id].vue'),
    props: true,
    meta: { banner: makeBanner('Photo Album') }
  },
  {
    path: '/about-details',
    component: AboutDetails,
    meta: { banner: makeBanner('About Us') }
  },
  {
    path: '/content/:slug',
    component: ContentPage,
    props: true,
    meta: { banner: makeBanner('Page') }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      const waitForLoad = () => {
        if (!isLoading.value) {
          resolve(savedPosition || { top: 0 })
        } else {
          setTimeout(waitForLoad, 50)
        }
      }
      waitForLoad()
    })
  }
})

router.beforeEach((to, from, next) => {
  isLoading.value = true
  next()
})

router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 400)
})

export default router
