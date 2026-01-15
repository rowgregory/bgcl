'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { additionalFeatures, coreFeatures } from '@/app/lib/constants/project-breakdown'
import MinNMatchExplaination from '@/app/components/project-breakdown/MinNMatchExplaination'
import CoreFeaturesGrid from '@/app/components/project-breakdown/CoreFeaturesGrid'
import RequiredThirdPartyServicesGrid from '@/app/components/project-breakdown/RequiredThirdPartyServicesGrid'
import InteractiveBuilder from '@/app/components/project-breakdown/InteractiveBuilder'
import PhaseOne from '@/app/components/project-breakdown/PhaseOne'
import FixedBottomPricingBar from '@/app/components/project-breakdown/FixedBottomPricingBar'

const ProjectBreakdown = () => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [phase1Discount, setPhase1Discount] = useState<boolean>(false)

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId]
    )
  }

  const resetSelection = () => {
    setSelectedFeatures([])
    setPhase1Discount(false)
  }

  const totalCoreFeaturesPrice = coreFeatures.reduce((acc, item) => acc + item.cost, 0)

  // Phase 1 feature indices
  const phase1Indices = [0, 3, 9, 12, 15]
  const phase1FeatureIds = phase1Indices.map((index) => additionalFeatures[index]?.id).filter(Boolean)

  // Calculate total without discount (for display purposes)
  const calculateTotalWithoutDiscount = () => {
    const selectedAdditionalCost = additionalFeatures
      .filter((feature) => selectedFeatures.includes(feature.id))
      .reduce((total, feature) => total + feature.cost, 0)

    return totalCoreFeaturesPrice + selectedAdditionalCost
  }

  // Calculate total with discount applied (only if phase1Discount is true)
  const calculateTotalWithDiscount = () => {
    const additionalWithDiscount = additionalFeatures
      .filter((feature) => selectedFeatures.includes(feature.id))
      .reduce((total, feature) => {
        // Only apply 15% discount if phase1Discount is enabled AND it's a Phase 1 feature
        const isPhase1Feature = phase1FeatureIds.includes(feature.id)
        const discountRate = phase1Discount && isPhase1Feature ? 0.85 : 1.0
        return total + feature.cost * discountRate
      }, 0)

    return totalCoreFeaturesPrice + additionalWithDiscount
  }

  // Calculate discount amount for display
  const calculateDiscountAmount = () => {
    if (!phase1Discount) return 0
    return calculateTotalWithoutDiscount() - calculateTotalWithDiscount()
  }

  // Calculate selected additional features total (with discount if applicable)
  const calculateAdditionalFeaturesSelectedTotal = () => {
    return additionalFeatures
      .filter((feature) => selectedFeatures.includes(feature.id))
      .reduce((total, feature) => {
        // Only apply 15% discount if phase1Discount is enabled AND it's a Phase 1 feature
        const isPhase1Feature = phase1FeatureIds.includes(feature.id)
        const discountRate = phase1Discount && isPhase1Feature ? 0.85 : 1.0
        return total + feature.cost * discountRate
      }, 0)
  }

  // Phase 1 specific calculation (keeping your original)
  const calculatePhaseOneTotal = (includeDiscount: boolean = false) => {
    const phase1AdditionalCost = phase1Indices.reduce((sum, index) => sum + (additionalFeatures[index]?.cost ?? 0), 0)

    const totalBeforeDiscount = totalCoreFeaturesPrice + phase1AdditionalCost

    if (!includeDiscount) {
      return totalBeforeDiscount
    }

    // With Phase 1 discount: Core features no discount, Phase 1 features 15% off
    return totalCoreFeaturesPrice + phase1AdditionalCost * 0.85
  }

  // Calculate monthly hosting cost
  const calculateMonthlyHostingCost = () => {
    const selectedTotal = additionalFeatures
      .filter((feature) => selectedFeatures.includes(feature.id))
      .reduce((total, feature) => total + feature.cost, 0)

    return Math.round((selectedTotal + totalCoreFeaturesPrice) * 0.07)
  }

  const getRecommendation = () => {
    const count = selectedFeatures.length

    if (count === 0)
      return {
        text: 'Select features to build your custom Boys & Girls Club system!',
        color: 'text-neutral-400'
      }
    if (count <= 2)
      return {
        text: 'Great start! Add a few more features to maximize impact for your members.',
        color: 'text-violet-400'
      }
    if (count <= 4)
      return {
        text: 'Perfect balance for a solid club management system!',
        color: 'text-green-400'
      }
    if (count === 5)
      return {
        text: 'Excellent choice! Your club is getting powerful tools.',
        color: 'text-purple-400'
      }
    if (count <= 7)
      return {
        text: "You're building a comprehensive youth development platform!",
        color: 'text-yellow-400'
      }
    if (count <= 10)
      return {
        text: 'Nearly complete — empowering staff, parents, and kids alike!',
        color: 'text-orange-400'
      }
    if (count <= 14)
      return {
        text: 'All-in premium system — the ultimate club management solution!',
        color: 'text-red-400'
      }
    if (count === 15)
      return {
        text: 'Complete feature set selected — full Boys & Girls Club ecosystem!',
        color: 'text-pink-400'
      }
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="p-4 lg:p-8">
        {/* Back Button */}
        <div className="max-w-375 mx-auto mb-8">
          <Link href="/" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="max-w-375 mx-auto mb-12">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Boys & Girls Club of Lynn{' '}
              <span className="bg-linear-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
                Platform
              </span>
            </h1>
            <p className="text-lg lg:text-2xl text-neutral-300 max-w-3xl mx-auto">
              Development breakdown for our youth club digital platform
            </p>
          </div>
        </div>

        <div className="max-w-375 mx-auto">
          {/* Main Content Grid */}
          <div className="flex flex-col gap-8">
            <section className="mb-12">
              <div className="gap-6">
                {/* Mix & Match Explanation */}
                <MinNMatchExplaination />
              </div>
            </section>

            {/* Core Features Grid */}
            <CoreFeaturesGrid totalCoreFeaturesPrice={totalCoreFeaturesPrice} />

            {/* Required Third-Party Services Grid */}
            <RequiredThirdPartyServicesGrid />

            {/* Interactive Builder */}
            <InteractiveBuilder
              selectedFeatures={selectedFeatures}
              toggleFeature={toggleFeature}
              calculateAdditionalFeaturesSelectedTotal={calculateAdditionalFeaturesSelectedTotal()}
              calculateTotalWithoutDiscount={calculateTotalWithoutDiscount}
              phase1Discount={phase1Discount}
              calculateDiscountAmount={calculateDiscountAmount}
              calculateTotalWithDiscount={calculateTotalWithDiscount}
              getRecommendation={getRecommendation}
              resetSelection={resetSelection}
              totalCoreFeaturesPrice={totalCoreFeaturesPrice}
            />

            {/* Phase 1 Recommendations */}
            <PhaseOne
              setSelectedFeatures={setSelectedFeatures}
              setPhase1Discount={setPhase1Discount}
              phaseOneTotal={calculatePhaseOneTotal(false)}
              phaseOneTotalWithDiscount={calculatePhaseOneTotal(true)}
            />

            {/* Spacer to prevent content from being hidden behind fixed bar */}
            <div className="h-20 sm:h-24"></div>
          </div>
        </div>

        {/* Fixed Bottom Pricing Bar */}
        <FixedBottomPricingBar
          totalWithDiscount={calculateTotalWithDiscount()}
          totalWithoutDiscount={calculateTotalWithoutDiscount()}
          selectedFeaturesCount={selectedFeatures.length}
          monthlyHostingCost={calculateMonthlyHostingCost()}
          phase1Discount={phase1Discount}
        />
      </div>
    </div>
  )
}

export default ProjectBreakdown
