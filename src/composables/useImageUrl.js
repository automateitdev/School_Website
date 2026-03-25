import { useWebsiteStore } from '@/stores/websiteStore'

export const STORAGE_BASE = 'https://web.academyims.com/storage/'

/**
 * Resolves the institute_id from the Pinia store.
 * Checks multiple fields to handle API variations (id, institute_id).
 */
const getInstId = () => {
    try {
        const store = useWebsiteStore()
        // basics[0].institute_id is the authoritative field from the real API
        if (store.getBasic?.institute_id) return store.getBasic.institute_id
        if (store.data?.aboutinstitutes?.institute_id) return store.data.aboutinstitutes.institute_id
        if (store.data?.sliders?.[0]?.institute_id) return store.data.sliders[0].institute_id
        if (store.data?.galleries?.[0]?.institute_id) return store.data.galleries[0].institute_id
        return '1'
    } catch {
        return '1'
    }
}

// ─────────────────────────────────────────────
// Header / Footer / Logo
// pattern: storage/{institute_id}/images/webheader/{file}
// ─────────────────────────────────────────────
export const useHeaderLogoUrl = (headerImage) => {
    if (!headerImage) return ''
    return `${STORAGE_BASE}${getInstId()}/images/webheader/${headerImage}`
}

export const useFooterImageUrl = (footerImage) => {
    if (!footerImage) return ''
    return `${STORAGE_BASE}${getInstId()}/images/webfooter/${footerImage}`
}

// ─────────────────────────────────────────────
// Sliders
// pattern: storage/{institute_id}/images/slider/{file}
// ─────────────────────────────────────────────
export const useSliderImageUrl = (sliderImg) => {
    if (!sliderImg) return ''
    return `${STORAGE_BASE}${getInstId()}/images/slider/${sliderImg}`
}

// ─────────────────────────────────────────────
// About Institute
// pattern: storage/{institute_id}/images/about_institute/{file}
// ─────────────────────────────────────────────
export const useAboutImageUrl = (aboutOrImage) => {
    if (!aboutOrImage) return ''
    const image = typeof aboutOrImage === 'object' ? aboutOrImage.image : aboutOrImage
    const instId = typeof aboutOrImage === 'object' && aboutOrImage.institute_id
        ? aboutOrImage.institute_id
        : getInstId()
    if (!image) return ''
    return `${STORAGE_BASE}${instId}/images/about_institute/${image}`
}

// ─────────────────────────────────────────────
// Notice files / images
// pattern: storage/{institute_id}/images/notice/{file}
// ─────────────────────────────────────────────
export const useNoticeFileUrl = (file, noticeInstituteId = null) => {
    if (!file) return ''
    const instId = noticeInstituteId || getInstId()
    return `${STORAGE_BASE}${instId}/images/notice/${file}`
}

// ─────────────────────────────────────────────
// Gallery
// pattern: storage/{institute_id}/images/gallery/{albumFolder}/{img}
// ─────────────────────────────────────────────
export const useGalleryImageUrl = (albumFolder, img, galleryInstituteId = null) => {
    if (!img) return ''
    const instId = galleryInstituteId || getInstId()
    return `${STORAGE_BASE}${instId}/images/gallery/${albumFolder}/${img}`
}

// ─────────────────────────────────────────────
// Teacher photos
// pattern: storage/{institute_id}/images/teachers/photo/{file}
// ─────────────────────────────────────────────
export const useTeacherPhotoUrl = (photoName) => {
    if (!photoName) return ''
    return `${STORAGE_BASE}${getInstId()}/images/teachers/photo/${photoName}`
}

// ─────────────────────────────────────────────
// Student photos
// pattern: storage/dp/{institute_id}/{studentId}/{image}
// ─────────────────────────────────────────────
export const useStudentProfileUrl = (studentId, image) => {
    if (!image) return ''
    return `${STORAGE_BASE}dp/${getInstId()}/${studentId}/${image}`
}

// ─────────────────────────────────────────────
// Speeches profile images
// pattern: storage/{institute_id}/images/speeches/{pro_img}
// ─────────────────────────────────────────────
export const useSpeechProfileUrl = (proImg, speechInstituteId = null) => {
    if (!proImg) return ''
    const instId = speechInstituteId || getInstId()
    return `${STORAGE_BASE}${instId}/images/speeches/${proImg}`
}

// ─────────────────────────────────────────────
// Documents (content/menu sub-documents)
// pattern: storage/{institute_id}/document/{file}
// ─────────────────────────────────────────────
export const useDocumentUrl = (document) => {
    if (!document) return ''
    return `${STORAGE_BASE}${getInstId()}/document/${document}`
}

// ─────────────────────────────────────────────
// Menu icons (presets — no institute_id)
// pattern: storage/presets/menuicons/{icon}
// ─────────────────────────────────────────────
export const useMenuIconUrl = (menuIcon) => {
    if (!menuIcon) return ''
    return `${STORAGE_BASE}presets/menuicons/${menuIcon}`
}

// ─────────────────────────────────────────────
// Website background (presets — no institute_id)
// pattern: storage/presets/website_backgrounds/{file}
// ─────────────────────────────────────────────
export const useWebsiteBackgroundUrl = (backgroundImg) => {
    if (!backgroundImg) return ''
    return `${STORAGE_BASE}presets/website_backgrounds/${backgroundImg}`
}

// ─────────────────────────────────────────────
// Default avatar (presets — no institute_id)
// pattern: storage/presets/default.png
// ─────────────────────────────────────────────
export const useDefaultAvatarUrl = () => {
    return `${STORAGE_BASE}presets/default.png`
}

// ─────────────────────────────────────────────
// Generic fallback helper
// ─────────────────────────────────────────────
export const useImageUrl = (filename, folder = '') => {
    if (!filename) return ''
    const prefix = folder ? `${folder}/` : ''
    return `${STORAGE_BASE}${prefix}${filename}`
}
