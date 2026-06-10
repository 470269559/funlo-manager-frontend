import { zh } from './zh'

type LocaleKey = keyof typeof zh

export function t(key: LocaleKey) {
  return zh[key]
}
