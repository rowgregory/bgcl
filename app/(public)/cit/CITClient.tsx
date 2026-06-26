'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CITApplicationFormProps, CITFormData, CreateCITApplicationInput } from '@/types/entities/cit-application.types'
import { FORM_STEPS, INITIAL_DATA } from '@/app/lib/constants/cit-application.constants'
import { CITFormDesktopProgress } from '@/app/components/cit-application/CITFormDesktopProgress'
import { CITFormMobileProgress } from '@/app/components/cit-application/CITFormMobileProgress'
import { CITStep1 } from '@/app/components/cit-application/CITStep1'
import { CITStep2 } from '@/app/components/cit-application/CITStep2'
import { CITStep3 } from '@/app/components/cit-application/CITStep3'
import { CITStep4 } from '@/app/components/cit-application/CITStep4'
import { CITFormNavigation } from '@/app/components/cit-application/CITFormNavigation'
import { validateCITStep } from '@/app/lib/utils/cit-application.utils'
import { CITFormSuccess } from '@/app/components/cit-application/CITFormSuccess'
import { CITFormHeader } from '@/app/components/cit-application/CITFormHeader'
import { createCITApplication } from '@/app/lib/actions/cit-application'

export function CITClient({ t }: CITApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<CITFormData>(INITIAL_DATA)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const progress = Math.round((currentStep / FORM_STEPS.length) * 100)

  const update = useCallback(<K extends keyof CITFormData>(key: K, value: CITFormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key as string]) return prev
      const next = { ...prev }
      delete next[key as string]
      return next
    })
  }, [])

  const toggleWeek = useCallback((week: string) => {
    setData((prev) => ({
      ...prev,
      weeksAvailable: prev.weeksAvailable.includes(week)
        ? prev.weeksAvailable.filter((w) => w !== week)
        : [...prev.weeksAvailable, week]
    }))
  }, [])

  const validateStep = useCallback(
    (step: number): boolean => {
      const next = validateCITStep(step, data)
      setErrors(next)
      return Object.keys(next).length === 0
    },
    [data]
  )

  const handleNext = useCallback(() => {
    if (!validateStep(currentStep)) return
    setCurrentStep((s) => Math.min(s + 1, FORM_STEPS.length))
  }, [currentStep, validateStep])

  const handleBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1))
  }, [])

  // Sidebar nav: allow jumping back freely, forward only through validation
  const goToStep = useCallback(
    (target: number) => {
      if (target < currentStep) {
        setCurrentStep(target)
        return
      }
      if (target > currentStep) {
        if (validateStep(currentStep)) setCurrentStep((s) => Math.min(s + 1, target))
      }
    },
    [currentStep, validateStep]
  )

  const handleSubmit = useCallback(async () => {
    // Validate all steps before submit
    for (let s = 1; s <= FORM_STEPS.length - 1; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s)
        return
      }
    }
    setSubmitting(true)
    try {
      const payload: CreateCITApplicationInput = {
        name: data.name,
        dateOfBirth: new Date(data.dateOfBirth),
        age: Number(data.age),
        city: data.city,
        school: data.school,
        grade: data.grade,
        cellPhone: data.cellPhone,
        personalEmail: data.personalEmail || null,
        parentGuardianEmail: data.parentGuardianEmail,
        emergencyContact1: data.emergencyContact1,
        emergencyContact2: data.emergencyContact2,
        weeksAvailable: data.weeksAvailable,
        strengths: data.strengths,
        hopesToLearn: data.hopesToLearn,
        hobbiesExtracurriculars: data.hobbiesExtracurriculars
      }
      const res = await createCITApplication(payload)
      if (!res.success) {
        setErrors({ submit: (res as { success: false; error: string }).error })
        return
      }

      void payload
      setSubmitted(true)
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }, [data, validateStep])

  // ── Success state ───────────────────────────────────────────────────────────
  if (submitted) return <CITFormSuccess data={data} />

  return (
    <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-334 mx-auto space-y-12 sm:space-y-16">
        {/* Header */}
        <CITFormHeader t={t} />

        {/* Form Container */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12 items-start">
          {/* Sidebar Progress - Desktop Only */}
          <CITFormDesktopProgress currentStep={currentStep} goToStep={goToStep} />

          {/* Main Form Content */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            {/* Mobile Progress - Mobile/Tablet Only */}
            <CITFormMobileProgress currentStep={currentStep} progress={progress} />
            {/* Desktop step heading */}
            <div className="hidden lg:block">
              <h2 className="text-2xl font-bold dark:text-white text-neutral-900">
                {FORM_STEPS[currentStep - 1].name}
              </h2>
            </div>

            {/* Steps */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-4 sm:space-y-6"
              >
                {currentStep === 1 && <CITStep1 data={data} errors={errors} update={update} />}

                {currentStep === 2 && <CITStep2 data={data} errors={errors} update={update} />}

                {currentStep === 3 && <CITStep3 data={data} errors={errors} toggleWeek={toggleWeek} />}

                {currentStep === 4 && <CITStep4 data={data} errors={errors} update={update} />}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <CITFormNavigation
              currentStep={currentStep}
              handleBack={handleBack}
              handleNext={handleNext}
              handleSubmit={handleSubmit}
              submitting={submitting}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
