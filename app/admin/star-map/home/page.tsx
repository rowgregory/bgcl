'use client'

import { PageContentEditor } from '@/app/components/common/PageContentEditor'
import { createPage } from '@/app/lib/actions/createPage'
import { updatePageBySlug } from '@/app/lib/actions/updatePageBySlug'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { store } from '@/app/lib/store/store'

const HomePage = ({ data }) => {
  const handleSave = async (content: any): Promise<void> => {
    if (data?.id) {
      await updatePageBySlug('home', content)
      store.dispatch(showToast({ message: `Successfully updated home page`, type: 'success' }))
    } else {
      await createPage('home', content)
      store.dispatch(showToast({ message: `Successfully created home page`, type: 'success' }))
    }
  }

  return <PageContentEditor initialContent={data.content} onSave={handleSave} />
}

export default HomePage
