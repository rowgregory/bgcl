'use client'

import { PageContentEditor } from '../_components/PageContentEditor'
import { createPage } from '@/lib/actions/page/createPage'
import { updatePageBySlug } from '@/lib/actions/page/updatePageBySlug'
import { useState } from 'react'
import { InlineMessageState } from '@/components/_shared/InlineMessage'
import extractErrorMessage from '@/lib/utils/extractErrorMessage'

export const PageEditorLatestNewsClient = ({ data }) => {
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<InlineMessageState | null>(null)

  const handleSave = async (content: any): Promise<void> => {
    setIsSaving(true)
    setMessage(null)

    const isUpdate = Boolean(data?.id)

    try {
      const res = isUpdate ? await updatePageBySlug('latest-news', content) : await createPage('latest-news', content)

      if (res && res.success === false) {
        setMessage({
          type: 'error',
          message: isUpdate ? 'Could not save changes' : 'Could not create page',
          description: extractErrorMessage(res)
        })
        return
      }

      setMessage({
        type: 'success',
        message: isUpdate ? 'Changes saved successfully' : 'Page created successfully',
        description: isUpdate
          ? 'Visitors will see the updated content immediately'
          : 'Your latest news page text is now accessible to all visitors'
      })
    } catch (error: unknown) {
      setMessage({
        type: 'error',
        message: isUpdate ? 'Could not save changes' : 'Could not create page',
        description: extractErrorMessage(error)
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PageContentEditor
      fields={data?.content}
      onSave={handleSave}
      isLoading={isSaving}
      message={message}
      onDismissMessage={() => setMessage(null)}
    />
  )
}
