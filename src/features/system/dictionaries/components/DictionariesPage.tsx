import { useEffect, useState } from 'react'
import { t } from '../../../../locales'
import type { DictionaryItem, DictionaryType } from '../../../../types/system'
import ConfirmDialog from '../../shared/components/ConfirmDialog'
import PageCard from '../../shared/components/PageCard'
import DictionaryItemPanel from './DictionaryItemPanel'
import DictionaryTypePanel from './DictionaryTypePanel'
import {
  createDictionaryItem,
  createDictionaryType,
  deleteDictionaryItem,
  deleteDictionaryType,
  getDictionaryItems,
  getDictionaryTypes,
} from '../../../../services/system/dictionaryService'

const emptyTypeForm = {
  dictName: '',
  dictCode: '',
  description: '',
  isEnabled: true,
}

const emptyItemForm = {
  itemLabel: '',
  itemValue: '',
  sortOrder: '0',
  isEnabled: true,
}

type DeletingTarget = {
  id: number
  kind: 'item' | 'type'
}

function DictionariesPage() {
  const [types, setTypes] = useState<DictionaryType[]>([])
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null)
  const [items, setItems] = useState<DictionaryItem[]>([])
  const [typeForm, setTypeForm] = useState(emptyTypeForm)
  const [itemForm, setItemForm] = useState(emptyItemForm)
  const [deletingTarget, setDeletingTarget] = useState<DeletingTarget | null>(
    null,
  )
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSavingItem, setIsSavingItem] = useState(false)
  const [isSavingType, setIsSavingType] = useState(false)

  const selectedType = types.find((type) => type.id === selectedTypeId)

  const loadTypes = async () => {
    const nextTypes = await getDictionaryTypes()
    setTypes(nextTypes)
    if (!selectedTypeId && nextTypes[0]) {
      setSelectedTypeId(nextTypes[0].id)
    }
  }

  const loadItems = async (typeId: number) => {
    setItems(await getDictionaryItems(typeId))
  }

  useEffect(() => {
    void loadTypes()
  }, [])

  useEffect(() => {
    if (selectedTypeId) {
      void loadItems(selectedTypeId)
    }
  }, [selectedTypeId])

  async function saveType() {
    if (isSavingType) return
    setIsSavingType(true)
    try {
      await createDictionaryType({
        dictName: typeForm.dictName,
        dictCode: typeForm.dictCode,
        description: typeForm.description || null,
        isEnabled: typeForm.isEnabled,
      })
      setTypeForm(emptyTypeForm)
      await loadTypes()
    } finally {
      setIsSavingType(false)
    }
  }

  async function saveItem() {
    if (!selectedTypeId || isSavingItem) return
    setIsSavingItem(true)
    try {
      await createDictionaryItem(selectedTypeId, {
        itemLabel: itemForm.itemLabel,
        itemValue: itemForm.itemValue,
        sortOrder: Number(itemForm.sortOrder),
        isEnabled: itemForm.isEnabled,
      })
      setItemForm(emptyItemForm)
      await loadItems(selectedTypeId)
    } finally {
      setIsSavingItem(false)
    }
  }

  async function confirmRemove() {
    if (!deletingTarget || isDeleting) return

    setIsDeleting(true)
    try {
      if (deletingTarget.kind === 'type') {
        await deleteDictionaryType(deletingTarget.id)
        setSelectedTypeId(null)
        await loadTypes()
      }

      if (deletingTarget.kind === 'item' && selectedTypeId) {
        await deleteDictionaryItem(deletingTarget.id)
        await loadItems(selectedTypeId)
      }

      setDeletingTarget(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <PageCard
      title={t('system.dictionaries.title')}
      description={t('system.dictionaries.description')}
    >
      <div className="grid grid-cols-1 gap-4 p-3 sm:p-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <DictionaryTypePanel
          form={typeForm}
          isCreating={isSavingType}
          selectedTypeId={selectedTypeId}
          types={types}
          onChange={setTypeForm}
          onCreate={saveType}
          onRemove={(id) => setDeletingTarget({ id, kind: 'type' })}
          onSelect={setSelectedTypeId}
        />
        <DictionaryItemPanel
          form={itemForm}
          isCreating={isSavingItem}
          items={items}
          selectedType={selectedType}
          selectedTypeId={selectedTypeId}
          onChange={setItemForm}
          onCreate={saveItem}
          onRemove={(id) => setDeletingTarget({ id, kind: 'item' })}
        />
      </div>
      <ConfirmDialog
        description={t('common.deleteConfirmDescription')}
        isOpen={deletingTarget !== null}
        isProcessing={isDeleting}
        title={t('common.deleteConfirmTitle')}
        onCancel={() => setDeletingTarget(null)}
        onConfirm={confirmRemove}
      />
    </PageCard>
  )
}

export default DictionariesPage
