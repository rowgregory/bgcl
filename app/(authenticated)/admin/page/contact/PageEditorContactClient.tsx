'use client'

import { PageContentEditor } from '../_components/PageContentEditor'
import { createPage } from '@/lib/actions/page/createPage'
import { updatePageBySlug } from '@/lib/actions/page/updatePageBySlug'
import { showToast } from '@/lib/store/slices/toastSlice'
import { store } from '@/lib/store/store'
import { useState } from 'react'

export const PageEditorContactClient = ({ data }) => {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (content: any): Promise<void> => {
    setIsSaving(true)

    if (data?.id) {
      await updatePageBySlug('contact', content)
      store.dispatch(
        showToast({
          message: 'Changes saved successfully',
          description: 'Visitors will see the updated content immediately',
          type: 'success'
        })
      )
    } else {
      await createPage('contact', content)
      store.dispatch(
        showToast({
          message: 'Page created successfully',
          description: 'Your contact us page text is now accessible to all visitors',
          type: 'success'
        })
      )
    }

    setIsSaving(false)
  }

  return <PageContentEditor fields={data?.content} onSave={handleSave} isLoading={isSaving} />
}
