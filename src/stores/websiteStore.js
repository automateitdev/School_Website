import { defineStore } from 'pinia'
import axios from '@/plugins/axios.js'

export const useWebsiteStore = defineStore('website', {
    state: () => ({
        data: null,
        isLoading: false,
        error: null
    }),

    getters: {
        getBasic: (state) => state.data?.basics?.[0] ?? null,

        getHeader: (state) => state.data?.header ?? null,

        getWeb: (state) => state.data?.web_presets ?? null,

        getSliders: (state) => state.data?.sliders ?? [],

        getNotices: (state) => state.data?.notices ?? [],

        getAbout: (state) => state.data?.aboutinstitutes ?? null,

        getSpeech: (state) => state.data?.speeches ?? [],

        getPhotoGalleries: (state) =>
            (state.data?.galleries ?? []).filter(g => g.content_type === 'image'),

        getVideoGalleries: (state) =>
            (state.data?.galleries ?? []).filter(g => g.content_type === 'video'),

        getFooter: (state) =>
            state.data?.footer ?? state.data?.web_presets?.essential_links ?? [],

        getMenuLists: (state) => state.data?.menulists ?? [],

        getDownloads: (state) => state.data?.downloads ?? [],

        getMenuMaps: (state) => state.data?.menumaps ?? {},

        getNavMenus: (state) => {
            const lists = state.data?.menulists ?? []
            const maps = state.data?.menumaps ?? {}

            if (lists.length === 0) {
                // Return static fallback if API has no menus yet
                return [
                    {
                        name: 'Management',
                        items: [
                            { name: 'Chief Patron Message', link: '/content/chief-patron-message' },
                            { name: 'Chairman Message', link: '/content/chairman-message' },
                            { name: 'Principal Message', link: '/content/principal-message' },
                            { name: 'Managing Committee', link: '/content/managing-committee' },
                            { name: 'Sub Committee', link: '/content/sub-committee' },
                            { name: 'Mission & Vision', link: '/content/mission-vision' }
                        ]
                    },
                    {
                        name: 'Academic',
                        items: [
                            { name: 'Syllabus', link: '/content/syllabus' },
                            { name: 'Dress Code', link: '/content/dress-code' }
                        ]
                    },
                    {
                        name: 'Admission',
                        items: [
                            { name: 'Tuition Fee', link: '/content/tuition-fee' },
                            { name: 'How to Apply', link: '/content/how-to-apply' },
                            { name: 'Apply Online', link: '/content/apply-online' }
                        ]
                    },
                    {
                        name: 'Careers',
                        items: [
                            { name: 'Job Vacancies', link: '/content/job-vacancies' },
                            { name: 'Submit Resume', link: '/content/submit-resume' }
                        ]
                    },
                    {
                        name: 'Payment Procedure',
                        items: [
                            { name: 'Fees Payment', link: 'https://live.academyims.com/Student_Portal', external: true },
                            { name: 'Fees Payment v2', link: 'https://pay.academyims.com/auth/login', external: true }
                        ]
                    }
                ]
            }

            return lists
                .filter(m => m.state === 1)
                .map(m => ({
                    name: m.name,
                    menu_id: m.menu_id,
                    items: (maps[m.menu_id] ?? []).map(sub => ({
                        id: sub.id,
                        name: sub.name,
                        link: `/content/${sub.id}`
                    }))
                }))
        }
    },

    persist: true,

    actions: {
        async fetchAllData() {
            this.isLoading = true
            this.error = null
            try {
                const res = await axios.get('/website-data')
                this.data = res.data
            } catch (e) {
                console.warn('[websiteStore] Primary API failed. Fetching fallback indexdata.json.', e.message)
                try {
                    const fallbackRes = await fetch('/indexdata.json')
                    if (!fallbackRes.ok) throw new Error('Failed to fetch dummy data')
                    const fallbackData = await fallbackRes.json()
                    this.data = fallbackData
                    this.error = null
                } catch (fallbackError) {
                    console.error('[websiteStore] Fast fallback failed too:', fallbackError)
                    this.error = fallbackError.message
                }
            } finally {
                this.isLoading = false
            }
        },

        getNoticeById(id) {
            const numId = Number(id)
            return (this.data?.notices ?? []).find(n => n.id === numId) ?? null
        },

        getContentById(id) {
            const numId = Number(id)
            const maps = this.data?.menumaps ?? {}
            for (const menuId in maps) {
                const found = maps[menuId].find(item => item.id === numId)
                if (found) {
                    const menu = (this.data?.menulists ?? []).find(m => m.menu_id === Number(menuId))
                    return { ...found, menuName: menu?.name ?? '' }
                }
            }
            return null
        },

        getContentBySlug(slug) {
            const maps = this.data?.menumaps ?? {}
            for (const menuId in maps) {
                const found = maps[menuId].find(item => {
                    if (item.slug === slug) return true
                    if (item.link && item.link.includes(`/content/${slug}`)) return true
                    const generatedSlug = item.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                    return generatedSlug === slug
                })
                if (found) {
                    const menu = (this.data?.menulists ?? []).find(m => m.menu_id === Number(menuId))
                    return { ...found, menuName: menu?.name ?? '' }
                }
            }
            return null
        },

        getGalleryById(id) {
            const numId = Number(id)
            return (this.data?.galleries ?? []).find(g => g.id === numId) ?? null
        }
    }
})
