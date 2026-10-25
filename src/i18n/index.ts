import { useCallback, useEffect } from 'react'
import { en } from './en'
import { ar } from './ar'
import type { Dict, TKey } from './types'
import type { L10n, Lang } from '@/types'
import { useSettings } from '@/stores/settingsStore'

const dicts: Record<Lang, Dict> = { en, ar: ar as Dict }

function lookup(dict: Dict, key: string): string {
  let cur: unknown = dict
  for (const part of key.split('.')) {
    if (cur && typeof cur === 'object' && part in (cur as Record<string, unknown>)) cur = (cur as Record<string, unknown>)[part]
    else return key
  }
  return typeof cur === 'string' ? cur : key
}

export function translate(lang: Lang, key: TKey | string, params?: Record<string, string | number>): string {
  let s = lookup(dicts[lang], key)
  if (s === key && lang !== 'en') s = lookup(dicts.en, key)
  if (params) for (const [k, v] of Object.entries(params)) s = s.replaceAll(`{${k}}`, String(v))
  return s
}

export function applyDir(lang: Lang) {
  const html = document.documentElement
  html.lang = lang
  html.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

export function useLang(): Lang {
  return useSettings((s) => s.language)
}

/** Arabic exercise names end with "(English term)"; the brackets mirror and wrap badly in RTL, and the term is shown on its own line where it helps. */
export function exerciseName(v: L10n | undefined | null, lang: Lang): string {
  if (!v) return ''
  const s = v[lang] || v.en
  return lang === 'ar' ? s.replace(/\s*\([^()]*\)\s*$/, '') : s
}

export function useT() {
  const lang = useLang()
  const t = useCallback((key: TKey, params?: Record<string, string | number>) => translate(lang, key, params), [lang])
  const l = useCallback((v: L10n | undefined | null) => (v ? v[lang] || v.en : ''), [lang])
  const n = useCallback((v: L10n | undefined | null) => exerciseName(v, lang), [lang])
  return { t, l, n, lang, isRtl: lang === 'ar' }
}

export function useApplyLocale() {
  const lang = useLang()
  useEffect(() => applyDir(lang), [lang])
}
