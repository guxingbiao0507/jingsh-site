/**
 * Theme static asset paths — work in dev (public/) and prod (public/ + R2 via /api/media).
 * Prefer /assets/... (bundled with Pages deploy); /api/media/ available when keyed in R2.
 */
const THEME_PREFIX = '/assets/themes/jingsh'

export function useJingshAsset() {
  function themeImage(name: string) {
    const file = name.replace(/^\/+/, '').replace(/^images\//, '')
    return `${THEME_PREFIX}/images/${file}`
  }

  function themeMediaUrl(name: string) {
    const file = name.replace(/^\/+/, '').replace(/^images\//, '')
    return `/api/media/assets/themes/jingsh/images/${file}`
  }

  return { themeImage, themeMediaUrl, THEME_PREFIX }
}
