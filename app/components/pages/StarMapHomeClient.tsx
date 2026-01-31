'use client'

import { PageContentEditor } from '@/app/components/common/PageContentEditor'
import { createPage } from '@/app/lib/actions/createPage'
import { updatePageBySlug } from '@/app/lib/actions/updatePageBySlug'
import { initialContent } from '@/app/lib/mock-data/home-page'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { store } from '@/app/lib/store/store'
import { useState } from 'react'

export const StarMapHomeClient = ({ data }) => {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (content: any): Promise<void> => {
    setIsSaving(true)
    if (data?.id) {
      await updatePageBySlug('home', content)
      store.dispatch(
        showToast({
          message: 'Changes saved successfully',
          description: 'Visitors will see the updated content immediately',
          type: 'success'
        })
      )
    } else {
      await createPage('home', content)
      store.dispatch(
        showToast({
          message: 'Page created successfully',
          description: 'Your home page is now accessible to all visitors',
          type: 'success'
        })
      )
    }

    setIsSaving(false)
  }

  return <PageContentEditor fields={initialContent} onSave={handleSave} isLoading={isSaving} />
}
