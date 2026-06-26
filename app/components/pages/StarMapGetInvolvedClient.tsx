'use client'

import { PageContentEditor } from '@/app/components/common/PageContentEditor'
import { createPage } from '@/app/lib/actions/page/createPage'
import { updatePageBySlug } from '@/app/lib/actions/page/updatePageBySlug'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { store } from '@/app/lib/store/store'
import { useState } from 'react'

export const StarMapGetInvolvedClient = ({ data }) => {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (content: any): Promise<void> => {
    setIsSaving(true)

    if (data?.id) {
      await updatePageBySlug('get-involved', content)
      store.dispatch(
        showToast({
          message: 'Changes saved successfully',
          description: 'Visitors will see the updated content immediately',
          type: 'success'
        })
      )
    } else {
      await createPage('get-involved', content)
      store.dispatch(
        showToast({
          message: 'Page created successfully',
          description: 'Your get involved page text is now accessible to all visitors',
          type: 'success'
        })
      )
    }

    setIsSaving(false)
  }

  return <PageContentEditor fields={data?.content} onSave={handleSave} isLoading={isSaving} />
}
