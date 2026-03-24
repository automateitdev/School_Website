import { useWebsiteStore } from '@/stores/websiteStore'

export const STORAGE_BASE = 'https://web.academyims.com/storage/'
export const LIVE_STORAGE_BASE = 'https://live.academyims.com/storage/'

const getInstId = () => {
    try {
        const store = useWebsiteStore()
        if (store.getBasic?.institute_id) return store.getBasic.institute_id
        if (store.data?.aboutinstitutes?.institute_id) return store.data.aboutinstitutes.institute_id
        if (store.data?.sliders?.[0]?.institute_id) return store.data.sliders[0].institute_id
        if (store.data?.galleries?.[0]?.institute_id) return store.data.galleries[0].institute_id
        return '1'
    } catch {
        return '1'
    }
}

export const useTeacherPhotoUrl = (photoName) => {
    if (!photoName) return ''
    return `${STORAGE_BASE}${getInstId()}/images/teachers/photo/${photoName}`
}

export const useStudentProfileUrl = (studentId, image, useLive = false) => {
    if (!image) return ''
    const base = useLive ? LIVE_STORAGE_BASE : STORAGE_BASE
    return `${base}dp/${getInstId()}/${studentId}/${image}`
}

export const useNoticeFileUrl = (file) => {
    if (!file) return ''
    return `${STORAGE_BASE}${getInstId()}/images/notice/${file}`
}

export const useDocumentUrl = (document) => {
    if (!document) return ''
    return `${STORAGE_BASE}${getInstId()}/document/${document}`
}

export const useGalleryImageUrl = (albumFolder, img) => {
    if (!img) return ''
    return `${STORAGE_BASE}${getInstId()}/images/gallery/${albumFolder}/${img}`
}

export const useSpeechProfileUrl = (proImg) => {
    if (!proImg) return ''
    return `${STORAGE_BASE}${getInstId()}/images/speeches/${proImg}`
}

export const useSliderImageUrl = (sliderImg) => {
    if (!sliderImg) return ''
    return `${STORAGE_BASE}${getInstId()}/images/slider/${sliderImg}`
}

export const useAboutImageUrl = (aboutOrImage) => {
    if (!aboutOrImage) return ''
    // Handle both new signature (image string) and old signature (about object)
    const image = typeof aboutOrImage === 'object' ? aboutOrImage.image : aboutOrImage
    const instId = typeof aboutOrImage === 'object' && aboutOrImage.institute_id ? aboutOrImage.institute_id : getInstId()
    if (!image) return ''
    return `${STORAGE_BASE}${instId}/images/about_institute/${image}`
}

export const useHeaderLogoUrl = (headerImage) => {
    if (!headerImage) return ''
    return `${STORAGE_BASE}${getInstId()}/images/webheader/${headerImage}`
}

export const useFooterImageUrl = (footerImage) => {
    if (!footerImage) return ''
    return `${STORAGE_BASE}${getInstId()}/images/webfooter/${footerImage}`
}

export const useDefaultAvatarUrl = () => {
    return `${STORAGE_BASE}presets/default.png`
}

export const useMenuIconUrl = (menuIcon) => {
    if (!menuIcon) return ''
    return `${STORAGE_BASE}presets/menuicons/${menuIcon}`
}

export const useWebsiteBackgroundUrl = (backgroundImg) => {
    if (!backgroundImg) return ''
    return `${STORAGE_BASE}presets/website_backgrounds/${backgroundImg}`
}

export const useImageUrl = (filename, folder = '') => {
    if (!filename) return ''
    const prefix = folder ? `${folder}/` : ''
    return `${STORAGE_BASE}${prefix}${filename}`
}
