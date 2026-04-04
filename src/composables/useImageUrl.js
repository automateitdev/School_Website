import { useWebsiteStore } from '@/stores/websiteStore'

export const STORAGE_HOST = 'https://web.academyims.com'
export const STORAGE_BASE = `${STORAGE_HOST}/storage/`

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

// ─────────────────────────────────────────────
// Header / Footer / Logo
// pattern: storage/{institute_id}/images/webheader/{file}
// ─────────────────────────────────────────────
export const useHeaderLogoUrl = (headerImage) => {
    if (!headerImage) return ''
    return `${STORAGE_BASE}${getInstId()}/images/webheader/${headerImage}`
}

// ─────────────────────────────────────────────
// Sliders
// pattern: storage/{institute_id}/images/slider/{file}
// ─────────────────────────────────────────────
export const useSliderImageUrl = (slider, sliderInstituteId = null) => {
    if (!slider) return ''

    const sliderImg = typeof slider === 'object'
        ? slider.slider_img || ''
        : slider

    if (!sliderImg) return ''

    const instId = sliderInstituteId || (typeof slider === 'object' && slider.institute_id) || getInstId()
    return `${STORAGE_BASE}${instId}/images/slider/${sliderImg}`
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
// pattern: storage/{institute_id}/images/notice/{type}/{file}
// ─────────────────────────────────────────────
export const useNoticeFileUrl = (file, noticeInstituteId = null, noticeType = '') => {
    if (!file) return ''

    const resolveFile = (value) => {
        if (Array.isArray(value)) return value.find(Boolean) || ''
        if (typeof value === 'object' && value !== null) return value.url || value.path || ''
        return String(value || '').trim()
    }

    const filepath = resolveFile(file)
    if (!filepath) return ''

    if (/^\/\//.test(filepath)) return `https:${filepath}`
    if (/^www\./i.test(filepath)) return `https://${filepath}`
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(filepath)) return filepath

    if (filepath.startsWith('/storage/') || filepath.startsWith('/videos/')) {
        return `${STORAGE_HOST}${filepath}`
    }
    if (filepath.startsWith('storage/')) {
        return `${STORAGE_HOST}/${filepath}`
    }

    const instId = noticeInstituteId || getInstId()
    const typeSegment = String(noticeType || '').trim().toLowerCase()
    const typePath = typeSegment ? `${typeSegment}/` : ''
    return `${STORAGE_BASE}${instId}/images/notice/${typePath}${filepath}`
}

export const useFooterImageUrl = (footerImage) => {
    if (!footerImage) return ''
    const image = typeof footerImage === 'object'
        ? footerImage.url || footerImage.path || ''
        : String(footerImage || '').trim()

    if (!image) return ''
    if (/^\/\//.test(image)) return `https:${image}`
    if (/^www\./i.test(image)) return `https://${image}`
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(image)) return image
    if (image.startsWith('/storage/')) return `${STORAGE_HOST}${image}`
    if (image.startsWith('storage/')) return `${STORAGE_HOST}/${image}`

    return `${STORAGE_BASE}${getInstId()}/images/webfooter/${image}`
}

export const useNewsFileUrl = (file, instituteId = null) => {
    if (!file) return ''
    const instId = instituteId || getInstId()
    return `${STORAGE_BASE}${instId}/images/news/${file}`
}

// ─────────────────────────────────────────────
// Videos
// pattern: storage/{institute_id}/videos/{file}
// ─────────────────────────────────────────────
export const useVideoUrl = (videoPath, videoInstituteId = null) => {
    if (!videoPath) return ''

    let path = typeof videoPath === 'object'
        ? videoPath.url || videoPath.video || videoPath.path || ''
        : String(videoPath || '')

    path = path.trim()
    if (!path) return ''

    const addHttps = (value) => {
        if (value.startsWith('//')) return `https:${value}`
        if (/^www\./i.test(value)) return `https://${value}`
        return value
    }

    const toYouTubeEmbed = (value) => {
        const idMatch = value.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([A-Za-z0-9_-]{11})/i)
        if (idMatch) return `https://www.youtube.com/embed/${idMatch[1]}`
        return value
    }

    const toVimeoEmbed = (value) => {
        const idMatch = value.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
        if (idMatch) return `https://player.vimeo.com/video/${idMatch[1]}`
        return value
    }

    if (/^(?:www\.|youtu\.be|youtube\.com|vimeo\.com)/i.test(path)) {
        const absolute = addHttps(path)
        if (/youtube\.com|youtu\.be/i.test(absolute)) return toYouTubeEmbed(absolute)
        if (/vimeo\.com/i.test(absolute)) return toVimeoEmbed(absolute)
        return absolute
    }

    const absolutePattern = /^(?:[a-zA-Z][a-zA-Z0-9+.-]*:)?\/\//
    if (absolutePattern.test(path)) {
        const absolute = addHttps(path)
        if (/youtube\.com|youtu\.be/i.test(absolute)) return toYouTubeEmbed(absolute)
        if (/vimeo\.com/i.test(absolute)) return toVimeoEmbed(absolute)
        return absolute
    }

    const schemeMatch = path.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/)
    if (schemeMatch) {
        const scheme = schemeMatch[1].toLowerCase()
        const allowedSchemes = ['http', 'https', 'data', 'blob', 'mailto', 'ftp', 'ftps', 'about']
        if (allowedSchemes.includes(scheme)) return path
        return ''
    }

    if (path.startsWith('/storage/') || path.startsWith('/videos/')) {
        return `${STORAGE_HOST}${path}`
    }
    if (path.startsWith('storage/')) {
        return `${STORAGE_HOST}/${path}`
    }

    const instId = videoInstituteId || getInstId()
    const normalizedPath = path.replace(/^\/+/, '')
    if (normalizedPath.startsWith('videos/')) {
        return `${STORAGE_BASE}${instId}/${normalizedPath}`
    }
    return `${STORAGE_BASE}${instId}/videos/${normalizedPath}`
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
