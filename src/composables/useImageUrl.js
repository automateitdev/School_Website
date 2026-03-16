/*
 *   useImageUrl('photo.jpg', `${instituteId}/images/about_institute`)
 *   → https://web.academyims.com/storage/1/images/about_institute/photo.jpg
 */
export const STORAGE_BASE = 'https://web.academyims.com/storage/'

export const useImageUrl = (filename, folder = '') => {
    if (!filename) return ''
    const prefix = folder ? `${folder}/` : ''
    return `${STORAGE_BASE}${prefix}${filename}`
}
export const useAboutImageUrl = (about) => {
    if (!about?.image || !about?.institute_id) return ''
    return `${STORAGE_BASE}${about.institute_id}/images/about_institute/${about.image}`
}
