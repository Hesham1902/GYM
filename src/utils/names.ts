import type { Exercise, Lang } from '@/types'

/** Display name without the trailing "(English term)" in Arabic; the term is shown separately. */
export function exName(ex: Pick<Exercise, 'name' | 'termEn'> | undefined, lang: Lang): string {
  if (!ex) return ''
  const n = ex.name[lang] || ex.name.en
  return lang === 'ar' ? n.replace(/\s*\([^)]*\)\s*$/, '') : n
}
export function exTerm(ex: Pick<Exercise, 'name' | 'termEn'> | undefined, lang: Lang): string | null {
  if (!ex) return null
  return lang === 'ar' ? ex.termEn : null
}
