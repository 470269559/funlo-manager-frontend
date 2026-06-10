import { request } from '../request'
import type { DictionaryItem, DictionaryType } from '../../types/system'

export type SaveDictionaryTypePayload = {
  dictName: string
  dictCode: string
  description: string | null
  isEnabled: boolean
}

export type SaveDictionaryItemPayload = {
  itemLabel: string
  itemValue: string
  sortOrder: number
  isEnabled: boolean
}

export function getDictionaryTypes() {
  return request<DictionaryType[]>({ url: '/system/dictionaries/types' })
}

export function createDictionaryType(payload: SaveDictionaryTypePayload) {
  return request({
    url: '/system/dictionaries/types',
    method: 'POST',
    data: payload,
  })
}

export function deleteDictionaryType(id: number) {
  return request({
    url: `/system/dictionaries/types/${id}`,
    method: 'DELETE',
  })
}

export function getDictionaryItems(typeId: number) {
  return request<DictionaryItem[]>({
    url: `/system/dictionaries/types/${typeId}/items`,
  })
}

export function createDictionaryItem(
  typeId: number,
  payload: SaveDictionaryItemPayload,
) {
  return request({
    url: `/system/dictionaries/types/${typeId}/items`,
    method: 'POST',
    data: payload,
  })
}

export function deleteDictionaryItem(id: number) {
  return request({ url: `/system/dictionaries/items/${id}`, method: 'DELETE' })
}
