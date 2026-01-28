'use client'

import { PageContentEditor } from '@/app/components/common/PageContentEditor'
import { createPage } from '@/app/lib/actions/createPage'
import { updatePageBySlug } from '@/app/lib/actions/updatePageBySlug'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { store } from '@/app/lib/store/store'

export const StarMapAboutClient = ({ data }) => {
  const handleSave = async (content: any): Promise<void> => {
    if (data?.id) {
      await updatePageBySlug('about', content)
      store.dispatch(
        showToast({
          message: 'Changes saved successfully',
          description: 'Visitors will see the updated content immediately',
          type: 'success'
        })
      )
    } else {
      await createPage('about', content)
      store.dispatch(
        showToast({
          message: 'Page created successfully',
          description: 'Your about page is now accessible to all visitors',
          type: 'success'
        })
      )
    }
  }

  return <PageContentEditor initialContent={data?.content} onSave={handleSave} />
}
