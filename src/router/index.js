import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Downloads from '../views/Downloads.vue'
import Contact from '../views/Contact.vue'
import NoticesPage from '../views/NoticesPage.vue'
import NoticeDetails from '../views/NoticeDetails.vue'
import AboutDetails from '../views/AboutDetails.vue'
import ContentPage from '../views/ContentPage.vue'
import NewsPage from '../views/NewsPage.vue'
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
    path: '/notices/:type',
    component: NoticesPage,
    props: true,
    meta: { banner: makeBanner('Notices') }
  },
  {
    path: '/notice/:id',
    component: NoticeDetails,
    props: true,
    meta: { banner: makeBanner('Notice Details') }
  },
  {
    path: '/news',
    component: NewsPage,
    meta: { banner: makeBanner('News & Events') }
  },
  {
    path: '/videos',
    component: VideoGallery,
    meta: { banner: makeBanner('Video Gallery') }
  },
  {
    path: '/videos/:id',
    name: 'VideoDetail',
    component: () => import('../views/VideoDetail.vue'),
    props: true,
    meta: { banner: makeBanner('Video Details') }
  },

  {
    path: '/photogallery',
    component: PhotoGallery,
    meta: { banner: makeBanner('Photo Gallery') }
  },
  {
    path: '/photogallery/:id',
    name: 'FolderView',
    component: () => import('../views/FolderView.vue'),
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

  if (to.path.startsWith('/notices/')) {
    const validTypes = ['general', 'academics', 'admission']
    if (!validTypes.includes(to.params.type)) {
      return next('/notices/general')
    }
  }

  next()
})

router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 400)
})

export default router
