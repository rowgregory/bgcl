'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save } from 'lucide-react'
import { setCloseHeroStudio } from '@/app/lib/store/slices/appSlice'
import { useAppDispatch, useApplicationSelector } from '@/app/lib/store/store'
import { IHero } from '@/types/entities/hero'
import { initialHeroConfig } from '@/app/lib/initial-states/hero'
import HeroPreview from './HeroPreview'
import SavedHeroes from './SavedHeroes'
import HeightEditor from './editor/HeightEditor'
import LayoutEditor from './editor/LayoutEditor'
import BackgroundEditor from './editor/BackgroundEditor'
import ContentEditor from './editor/ContentEditor'
import CtaEditor from './editor/CtaEditor'
import FloatingButtonEditor from './editor/FloatingButtonEditor'
import ThermometerEditor from './editor/ThermometerEditor'
import CountdownEditor from './editor/CountdownEditor'
import GrowthTreeEditor from './editor/GrowthTreeEditor'
import EmptyHero from './EmptyHero'
import TopBannerEditor from './editor/TopBannerEditor'
import FullScreenPreviewMode from './FullScreenPreviewMode'

const HeroStudio = () => {
  const [heroes, setHeroes] = useState<IHero[] | null>([])
  const [activeHero, setActiveHero] = useState<IHero | null>(null)
  const [previewMode, setPreviewMode] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const onClose = () => dispatch(setCloseHeroStudio())
  const { heroStudio } = useApplicationSelector()

  const createNewHero = () => {
    const newHero = {
      ...initialHeroConfig,
      id: `hero-${Date.now()}`,
      name: `Hero ${(heroes?.length ?? 0) + 1}`
    }
    setHeroes([...(heroes ?? []), newHero])
    setActiveHero(newHero)
  }

  const updateActiveHero = (updates: Partial<IHero>) => {
    if (!activeHero) return
    const updated = { ...activeHero, ...updates }
    setActiveHero(updated)
    setHeroes((heroes ?? []).map((h) => (h.id === updated.id ? updated : h)))
  }

  const deleteHero = (id: string) => {
    setHeroes((heroes ?? []).filter((h) => h.id !== id))
    if (activeHero?.id === id) {
      const remaining = (heroes ?? []).filter((h) => h.id !== id)
      setActiveHero(remaining.length > 0 ? remaining[0] : null)
    }
  }

  return (
    <AnimatePresence>
      {heroStudio && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 bg-[#0f0f14] flex"
          >
            {/* Left Sidebar - Saved Heroes */}
            <SavedHeroes
              activeHero={activeHero}
              createNewHero={createNewHero}
              deleteHero={deleteHero}
              heroes={heroes}
              onClose={onClose}
              previewMode={previewMode}
              setActiveHero={setActiveHero}
              setPreviewMode={setPreviewMode}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {previewMode && activeHero ? (
                /* Full Screen Preview Mode */
                <FullScreenPreviewMode activeHero={activeHero} setPreviewMode={setPreviewMode} />
              ) : activeHero ? (
                <>
                  {/* Top Bar */}
                  <div className="bg-[#16161f] border-b border-neutral-800 px-6 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-sm">{activeHero.name}</h3>
                        <p className="text-neutral-500 text-xs mt-0.5">Configure your hero section</p>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
                        <Save className="w-4 h-4" />
                        Save Hero
                      </button>
                    </div>
                  </div>

                  {/* Editor + Live Preview Split */}
                  <div className="flex-1 flex overflow-hidden">
                    {/* Left: Configuration */}
                    <div className="w-96 border-r border-neutral-800 overflow-y-auto bg-[#1a1a24]">
                      {/* Basic Info */}
                      <div className="border-b border-neutral-800 bg-neutral-900/50 p-4">
                        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">
                          Basic Information
                        </h3>
                        <input
                          type="text"
                          value={activeHero.name}
                          onChange={(e) => updateActiveHero({ name: e.target.value })}
                          placeholder="Hero Name"
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      {/* Height */}
                      <HeightEditor activeHero={activeHero} updateActiveHero={updateActiveHero} />

                      {/* Layout */}
                      <LayoutEditor activeHero={activeHero} updateActiveHero={updateActiveHero} />

                      {/* Background */}
                      <BackgroundEditor activeHero={activeHero} updateActiveHero={updateActiveHero} />

                      {/* Content */}
                      <ContentEditor activeHero={activeHero} updateActiveHero={updateActiveHero} />

                      {/* CTA */}
                      <CtaEditor activeHero={activeHero} updateActiveHero={updateActiveHero} />

                      {/* Floating Button */}
                      <FloatingButtonEditor activeHero={activeHero} updateActiveHero={updateActiveHero} />

                      {/* Thermometer */}
                      <ThermometerEditor activeHero={activeHero} updateActiveHero={updateActiveHero} />

                      {/* Countdown */}
                      <CountdownEditor activeHero={activeHero} updateActiveHero={updateActiveHero} />

                      {/* Growth Tree */}
                      <GrowthTreeEditor activeHero={activeHero} updateActiveHero={updateActiveHero} />

                      {/* Top Banner */}
                      <TopBannerEditor activeHero={activeHero} updateActiveHero={updateActiveHero} />
                    </div>

                    {/* Right: Live Preview */}
                    <div className="flex-1 bg-[#16161f] flex items-center justify-center p-8">
                      <div className="w-full max-w-6xl">
                        <div className="mb-4 text-center">
                          <p className="text-neutral-400 text-sm">Live Preview</p>
                          <p className="text-neutral-600 text-xs mt-1">
                            Desktop view - Click Preview to test other devices
                          </p>
                        </div>
                        <div className="border border-neutral-700 rounded-lg overflow-hidden shadow-2xl">
                          <HeroPreview
                            hero={activeHero}
                            disableAnimations={true}
                            disableResponsiveScaling={true}
                            viewportSize="desktop"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <EmptyHero createNewHero={createNewHero} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default HeroStudio
