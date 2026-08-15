'use client'

import { PageContentEditor } from '../_components/PageContentEditor'
import { createPage } from '@/lib/actions/page/createPage'
import { updatePageBySlug } from '@/lib/actions/page/updatePageBySlug'
import { useState } from 'react'
import extractErrorMessage from '@/lib/utils/extractErrorMessage'
import { InlineMessageState } from '@/components/_shared/InlineMessage'

export const PageEditorAwardWinnersClient = ({ data }) => {
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<InlineMessageState | null>(null)

  const handleSave = async (content: any): Promise<void> => {
    setIsSaving(true)
    setMessage(null)

    const isUpdate = Boolean(data?.id)

    try {
      const res = isUpdate ? await updatePageBySlug('award-winner', content) : await createPage('award-winner', content)

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
          : 'Your award winner page text is now accessible to all visitors'
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
