import { defineStore } from 'pinia'
import axios from '@/plugins/axios.js'

const extractApiPayload = (response) => {
    if (!response) return null
    let payload = response.data !== undefined ? response.data : response
    if (payload && payload.data !== undefined) payload = payload.data
    return payload
}

const normalizeArrayResult = (payload, fallback = []) => {
    if (Array.isArray(payload)) return payload
    if (!payload) return fallback
    if (Array.isArray(payload.students)) return payload.students
    if (Array.isArray(payload.teachers)) return payload.teachers
    if (Array.isArray(payload.items)) return payload.items
    if (Array.isArray(payload.list)) return payload.list
    return fallback
}

const slugify = (value) => String(value || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

const resolveMenuLabel = (menu) => {
    return menu?.menuassign?.menu_title_bangla ||
        menu?.menuassign?.menu_title ||
        menu?.menu_title_bangla ||
        menu?.menu_title ||
        menu?.menu_name_bangla ||
        menu?.menu_name ||
        menu?.name_bn ||
        menu?.title_bn ||
        menu?.name ||
        menu?.title ||
        ''
}

const resolveSubmenuLabel = (sub) => {
    return sub?.mm?.submenuassign?.submenu_title_bangla ||
        sub?.mm?.submenuassign?.submenu_title ||
        sub?.submenuassign?.submenu_title_bangla ||
        sub?.submenuassign?.submenu_title ||
        sub?.submenu_title_bangla ||
        sub?.submenu_title ||
        sub?.submenu_name_bangla ||
        sub?.submenu_name ||
        sub?.name_bn ||
        sub?.title_bn ||
        sub?.name ||
        sub?.title ||
        ''
}

const normalizeSubmenu = (sub, parentSlug) => {
    const title = resolveSubmenuLabel(sub) || `Submenu ${sub?.id || ''}`
    const slug = sub.slug || slugify(title) || String(sub?.id || '')
    const link = sub.link || sub.url || `/menus/${parentSlug}/${slug}`
    return {
        ...sub,
        title,
        slug,
        link
    }
}

const normalizeMenu = (menu) => {
    const title = resolveMenuLabel(menu) || `Menu ${menu?.menu_id || menu?.id || ''}`
    const slug = menu.slug || slugify(title) || String(menu?.menu_id || menu?.id || '')
    const link = menu.link || menu.url || `/menus/${slug}`
    return {
        ...menu,
        title,
        slug,
        link,
        submenus: Array.isArray(menu.submenus)
            ? menu.submenus.map(sub => normalizeSubmenu(sub, slug))
            : []
    }
}

export const useWebsiteStore = defineStore('website', {
    state: () => ({
        data: null,
        isLoading: false,
        error: null,
        menuSubmenus: [],
        videoGalleries: [],
        videoGalleryDetail: null,
        footer: null,
        teacherList: [],
        studentList: [],
        classInfo: null
    }),

    getters: {
        getBasic: (state) => state.data?.basics?.[0] ?? null,

        getHeader: (state) => state.data?.header ?? null,

        getWeb: (state) => state.data?.web_presets ?? null,

        getSliders: (state) => state.data?.sliders ?? [],

        getNotices: (state) => state.data?.notices ?? [],

        getAbout: (state) => state.data?.aboutinstitutes ?? null,

        getUser: (state) => state.data?.users ?? null,

        getInstituteEiin: (state) => state.data?.users?.EIIN_number || state.data?.users?.eiin_number || '',
        getInstituteType: (state) => state.data?.users?.institute_type || state.data?.users?.type || '',
        getInstituteBoard: (state) => state.data?.users?.edu_board || state.data?.users?.education_board || '',
        getInstituteAddress: (state) => state.data?.users?.address || state.data?.basics?.[0]?.address || '',
        getEstablishedYear: (state) => state.data?.aboutinstitutes?.established || '',

        getSpeech: (state) => state.data?.speeches ?? [],

        getPhotoGalleries: (state) =>
            (state.data?.galleries ?? []).filter(g => g.content_type === 'image'),

        getVideoGalleries: (state) => {
            const explicit = state.videoGalleries ?? []
            if (explicit.length > 0) return explicit
            return (state.data?.galleries ?? []).filter(g => g.content_type === 'video')
        },

        getVideoGalleryBySlugOrId: (state) => (identifier) => {
            if (!identifier) return null
            const lookup = String(identifier).toLowerCase()
            const numericId = Number(identifier)
            const isNumber = !Number.isNaN(numericId)
            const galleries = (state.videoGalleries && state.videoGalleries.length > 0)
                ? state.videoGalleries
                : (state.data?.galleries ?? [])
            return galleries.find(item => {
                return (
                    (isNumber && item.id === numericId) ||
                    item.slug?.toLowerCase() === lookup ||
                    item.title?.toLowerCase() === lookup ||
                    item.link?.toLowerCase() === lookup ||
                    item.url?.toLowerCase() === lookup
                )
            }) ?? null
        },

        getVideoGalleryDetail: (state) => state.videoGalleryDetail,

        getFooterData: (state) => state.footer ?? state.data?.footer ?? null,

        getFooter: (state) =>
            state.data?.footer ?? state.data?.web_presets?.essential_links ?? [],

        getMenuLists: (state) => state.data?.menulists ?? [],

        getMenuSubmenus: (state) => state.menuSubmenus ?? [],

        getMenuWithSubItems: (state) => {
            const lists = state.data?.menulists ?? []
            const maps = state.data?.menumaps ?? {}
            const keys = Object.keys(maps)
            const items = []
            lists.forEach(menu => {
                if (menu.state == 1) {
                    const subItems = []
                    keys.forEach(key => {
                        ;(maps[key] || []).forEach(mm => {
                            if (menu.menu_id == mm.menuassign_id) {
                                subItems.push({ mm })
                            }
                        })
                    })
                    items.push({ menu, subItems })
                }
            })
            return items
        },

        getMenuBySlugOrId: (state) => (identifier) => {
            if (!identifier) return null
            const lookup = String(identifier).toLowerCase()
            const numericId = Number(identifier)
            const isNumber = !Number.isNaN(numericId)
            return (state.menuSubmenus || []).find(menu => {
                return (
                    (isNumber && menu.id === numericId) ||
                    menu.slug?.toLowerCase() === lookup ||
                    menu.title?.toLowerCase() === lookup ||
                    menu.url?.toLowerCase() === lookup ||
                    menu.link?.toLowerCase() === lookup
                )
            }) ?? null
        },

        getSubmenuBySlugOrId: (state) => (menuIdentifier, submenuIdentifier) => {
            if (!menuIdentifier || !submenuIdentifier) return null
            const menuLookup = String(menuIdentifier).toLowerCase()
            const menuNumericId = Number(menuIdentifier)
            const menuIsNumber = !Number.isNaN(menuNumericId)
            const menu = (state.menuSubmenus || []).find(menu => {
                return (
                    (menuIsNumber && menu.id === menuNumericId) ||
                    menu.slug?.toLowerCase() === menuLookup ||
                    menu.title?.toLowerCase() === menuLookup ||
                    menu.url?.toLowerCase() === menuLookup ||
                    menu.link?.toLowerCase() === menuLookup
                )
            })
            if (!menu || !Array.isArray(menu.submenus)) return null
            const subLookup = String(submenuIdentifier).toLowerCase()
            const subNumericId = Number(submenuIdentifier)
            const subIsNumber = !Number.isNaN(subNumericId)
            return menu.submenus.find(sub => {
                return (
                    (subIsNumber && sub.id === subNumericId) ||
                    sub.slug?.toLowerCase() === subLookup ||
                    sub.title?.toLowerCase() === subLookup ||
                    sub.url?.toLowerCase() === subLookup ||
                    sub.link?.toLowerCase() === subLookup
                )
            }) ?? null
        },

        getDownloads: (state) => state.data?.downloads ?? [],

        getMenuMaps: (state) => state.data?.menumaps ?? {},

        getNavMenus: (state) => {
            const lists = state.data?.menulists ?? []
            const maps = state.data?.menumaps ?? {}

            if (lists.length === 0) {
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
                    items: (maps[m.menu_id] ?? []).map(sub => {
                        const link = sub.link
                            ? sub.link
                            : sub.slug
                                ? `/content/${sub.slug}`
                                : `/content/${sub.id}`
                        return {
                            id: sub.id,
                            name: sub.name,
                            link,
                            external: sub.external || false
                        }
                    })
                }))
        }
    },

    persist: true,

    actions: {
        async fetchAllData() {
            this.isLoading = true
            this.error = null
            try {
                const res = await axios.get('indexdata')
                const payload = extractApiPayload(res) || {}
            const cleanData = {
                users: payload.users || payload.user || null,
                basics: payload.basics || [],
                header: payload.header || null,
                sliders: payload.sliders || [],
                notices: payload.notices || [],
                aboutinstitutes: payload.aboutinstitutes || null,
                galleries: payload.galleries || [],
                menulists: payload.menulists || [],
                menumaps: payload.menumaps || {},
                downloads: payload.downloads || [],
                footer: payload.footer || null
            }
                
            if (payload.web_presets) {
                cleanData.web_presets = {
                    background_img: payload.web_presets.background_img || '',
                    essential_links: payload.web_presets.essential_links || []
                }
            }

            if (!cleanData.footer) {
                const hasFooterRoot = payload.footer_image || payload.footer_text || payload.footer_links || payload.footer_address || payload.footer_phone || payload.footer_email
                if (hasFooterRoot) {
                    cleanData.footer = {
                        footer_image: payload.footer_image || '',
                        footer_text: payload.footer_text || '',
                        footer_links: payload.footer_links || [],
                        footer_address: payload.footer_address || '',
                        footer_phone: payload.footer_phone || '',
                        footer_email: payload.footer_email || ''
                    }
                }
            }

            cleanData.speeches = Array.isArray(payload.speeches)
                ? payload.speeches
                : []

            this.data = cleanData
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

        async fetchMenuSubmenus() {
            this.error = null

            const buildFallbackMenus = () => {
                const lists = this.data?.menulists ?? []
                const maps = this.data?.menumaps ?? {}

                return lists
                    .filter(m => m.state === 1)
                    .map(m => normalizeMenu({
                        id: m.menu_id,
                        slug: m.slug,
                        title: m.name,
                        link: m.link,
                        menuassign: {
                            menu_icon: m.menu_icon || '',
                            menu_title: m.menu_title || '',
                            menu_title_bangla: m.menu_title_bangla || ''
                        },
                        menu_title: m.menu_title || '',
                        menu_title_bangla: m.menu_title_bangla || '',
                        menu_name: m.menu_name || '',
                        menu_name_bangla: m.menu_name_bangla || '',
                        name: m.name || '',
                        submenus: (maps[m.menu_id] ?? []).map(sub => ({
                            id: sub.id,
                            slug: sub.slug,
                            title: sub.name,
                            link: sub.link,
                            submenuassign: {
                                submenu_icon: sub.submenu_icon || '',
                                submenu_title: sub.submenu_title || '',
                                submenu_title_bangla: sub.submenu_title_bangla || ''
                            },
                            submenu_title: sub.submenu_title || '',
                            submenu_title_bangla: sub.submenu_title_bangla || '',
                            submenu_name: sub.submenu_name || '',
                            submenu_name_bangla: sub.submenu_name_bangla || '',
                            name: sub.name || '',
                            title_bn: sub.title_bn || '',
                            description: sub.description || sub.content || '',
                            external: sub.external || false
                        }))
                    }))
            }

            const endpoints = [
                'menu-submenus',
                'menumsubmenus',
                'menus',
                'menus-submenus',
                'menu-submenu',
                'menu/submenus'
            ]
            let response = null
            for (const endpoint of endpoints) {
                try {
                    response = await axios.get(endpoint)
                    if (response?.data) break
                } catch (innerError) {
                    response = null
                }
            }

            const fallbackMenus = buildFallbackMenus()
            if (!response || !response.data) {
                if (fallbackMenus.length) {
                    this.menuSubmenus = fallbackMenus
                    return this.menuSubmenus
                }
                this.menuSubmenus = []
                this.error = 'Menu API did not return valid data'
                return this.menuSubmenus
            }

            const rawPayload = Array.isArray(response.data)
                ? response.data
                : response.data.data ?? response.data.menuSubmenus ?? response.data.menu_submenus ?? []
            const payload = Array.isArray(rawPayload) ? rawPayload : []

            this.menuSubmenus = payload.map(menu => normalizeMenu(menu))
            if (!this.menuSubmenus.length && fallbackMenus.length) {
                this.menuSubmenus = fallbackMenus
            }
            return this.menuSubmenus
        },

        async fetchFooterData() {
            this.error = null
            if (this.footer || this.data?.footer) {
                return this.footer || this.data.footer
            }

            const endpoints = ['footer', 'footer-data', 'footerinfo', 'indexdata']
            let response = null

            for (const endpoint of endpoints) {
                try {
                    response = await axios.get(endpoint)
                    if (response?.data) break
                } catch (innerError) {
                    response = null
                }
            }

            if (!response || !response.data) {
                return null
            }

            let payload = response.data
            if (payload.data) payload = payload.data
            if (payload.footer) payload = payload.footer

            const normalized = {
                footer_image: payload.footer_image || '',
                footer_text: payload.footer_text || '',
                footer_links: Array.isArray(payload.footer_links) ? payload.footer_links : [],
                footer_address: payload.footer_address || '',
                footer_phone: payload.footer_phone || '',
                footer_email: payload.footer_email || ''
            }

            this.footer = normalized
            if (!this.data) this.data = {}
            this.data.footer = normalized
            return normalized
        },

        async fetchTeacherList() {
            this.error = null
            this.isLoading = true

            try {
                const res = await axios.get('teacherlist')
                const payload = extractApiPayload(res)
                this.teacherList = normalizeArrayResult(payload)
                return this.teacherList
            } catch (error) {
                this.error = error?.message || 'Failed to load teacher list'
                this.teacherList = []
                return []
            } finally {
                this.isLoading = false
            }
        },

        async fetchClassInfo() {
            this.error = null
            this.isLoading = true

            try {
                const res = await axios.get('classinfo')
                const payload = extractApiPayload(res)
                this.classInfo = payload
                return payload
            } catch (error) {
                this.error = error?.message || 'Failed to load class info'
                this.classInfo = null
                return null
            } finally {
                this.isLoading = false
            }
        },

        async fetchStudentList(academic_year_id, class_id) {
            this.error = null
            this.isLoading = true

            try {
                const params = {}
                if (academic_year_id !== undefined && academic_year_id !== null && academic_year_id !== '') {
                    params.academic_year_id = academic_year_id
                }
                if (class_id !== undefined && class_id !== null && class_id !== '') {
                    params.class_id = class_id
                }

                const res = await axios.get('studentlist', { params })
                const payload = extractApiPayload(res)
                this.studentList = normalizeArrayResult(payload)
                return this.studentList
            } catch (error) {
                this.error = error?.message || 'Failed to load student list'
                this.studentList = []
                return []
            } finally {
                this.isLoading = false
            }
        },

        async fetchVideoGalleries() {
            this.error = null
            const endpoints = ['video-galleries', 'videogalleries', 'galleries?type=video']
            let response = null

            for (const endpoint of endpoints) {
                try {
                    response = await axios.get(endpoint)
                    if (response?.data) break
                } catch (innerError) {
                    response = null
                }
            }

            const fallbackVideos = (this.data?.galleries ?? []).filter(g => g.content_type === 'video')
            if (!response || !response.data) {
                this.videoGalleries = fallbackVideos
                return this.videoGalleries
            }

            const payload = Array.isArray(response.data)
                ? response.data
                : response.data.data ?? response.data.videoGalleries ?? response.data.videogalleries ?? response.data.galleries ?? []

            this.videoGalleries = Array.isArray(payload) ? payload : []
            if (!this.videoGalleries.length) {
                this.videoGalleries = fallbackVideos
            }
            return this.videoGalleries
        },

        async fetchVideoGalleryDetail(identifier) {
            this.error = null
            this.videoGalleryDetail = null

            const normalizedId = String(identifier ?? '').trim()
            const isUrlLike = /^(https?:)?\/\//i.test(normalizedId)
            const hasPathChars = normalizedId.includes('/')
            const isSafeIdentifier = /^[a-zA-Z0-9-_]+$/.test(normalizedId)
            const isSingleNonNumericChar = normalizedId.length === 1 && Number.isNaN(Number(normalizedId))

            const fallback = this.getVideoGalleryBySlugOrId(normalizedId)
            if (!normalizedId || isUrlLike || hasPathChars || isSingleNonNumericChar || (!isSafeIdentifier && fallback)) {
                this.videoGalleryDetail = fallback
                return fallback
            }

            const endpoints = [`video-galleries/${normalizedId}`, `videogalleries/${normalizedId}`]
            let response = null

            for (const endpoint of endpoints) {
                try {
                    response = await axios.get(endpoint)
                    if (response?.data) break
                } catch (innerError) {
                    response = null
                }
            }

            if (!response || !response.data) {
                this.videoGalleryDetail = fallback
                return fallback
            }

            const payload = Array.isArray(response.data)
                ? response.data[0]
                : response.data.data ?? response.data

            this.videoGalleryDetail = payload
            return payload
        },

        async fetchSpeeches() {
            this.error = null
            this.isLoading = true

            try {
                if (Array.isArray(this.data?.speeches) && this.data.speeches.length > 0) {
                    return this.data.speeches
                }

                const endpoints = ['speeches', 'speech', 'indexdata']
                let response = null

                for (const endpoint of endpoints) {
                    try {
                        response = await axios.get(endpoint)
                        if (response?.data) break
                    } catch (innerError) {
                        response = null
                    }
                }

                if (!response || !response.data) {
                    this.data = this.data || {}
                    this.data.speeches = []
                    return []
                }

                let payload = response.data
                if (payload.data) payload = payload.data

                const speeches = Array.isArray(payload.speeches)
                    ? payload.speeches
                    : Array.isArray(payload)
                        ? payload
                        : Array.isArray(payload.data)
                            ? payload.data
                            : Array.isArray(payload.items)
                                ? payload.items
                                : []

                this.data = this.data || {}
                this.data.speeches = speeches
                return speeches
            } catch (error) {
                this.error = error?.message || 'Failed to load speeches'
                this.data = this.data || {}
                this.data.speeches = []
                return []
            } finally {
                this.isLoading = false
            }
        },

        getNoticeById(id) {
            const numId = Number(id)
            return (this.data?.notices ?? []).find(n => n.id === numId) ?? null
        },

        // Returns { subItems: [{ mm }] } format used by SubMenuContent page
        getContentById(id) {
            const numId = Number(id)
            const maps = this.data?.menumaps ?? {}
            for (const menuId in maps) {
                const found = maps[menuId].find(item => item.id === numId)
                if (found) {
                    return { subItems: [{ mm: found }] }
                }
            }
            return null
        },

        // Returns a menulist item by its id — used by SingleMenuContent page
        getSingleNavContentId(id) {
            const numId = Number(id)
            return (this.data?.menulists ?? []).find(m => Number(m.id || m.menu_id) === numId) ?? null
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
