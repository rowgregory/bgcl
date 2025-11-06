"use client";

import React, { useState } from "react";
import {
  Users,
  CheckCircle,
  Shield,
  Calculator,
  ArrowLeft,
  Gamepad2,
  MessageSquare,
  ShoppingCart,
  RotateCcw,
  Rocket,
  Star,
  DollarSign,
  Mail,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import MinNMatchExplaination from "../components/project-breakdown/MinNMatchExplaination";
import CoreFeature from "../components/project-breakdown/CoreFeature";
import {
  additionalFeatures,
  coreFeatures,
} from "../lib/constants/project-breakdown";
import AdditionalFeature from "../components/project-breakdown/AdditionalFeature";
import FixedBottomPricingBar from "../components/project-breakdown/FixedBottomPricingBar";

const ProjectBreakdown = () => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [phase1Discount, setPhase1Discount] = useState<boolean>(false);

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  const resetSelection = () => setSelectedFeatures([]);

  const calculateSelectedTotal = () => {
    return additionalFeatures
      .filter((feature) => selectedFeatures.includes(feature.id))
      .reduce((total, feature) => total + feature.cost, 0);
  };

  const getRecommendation = () => {
    const count = selectedFeatures.length;

    if (count === 0)
      return {
        text: "Select some features to see your custom quote!",
        color: "text-neutral-400",
      };
    if (count <= 2)
      return {
        text: "Great start! Consider adding 1-2 more for better value.",
        color: "text-violet-400",
      };
    if (count <= 4)
      return {
        text: "Perfect balance of features and budget!",
        color: "text-green-400",
      };
    if (count === 5)
      return {
        text: "Excellent choice! Almost the full experience.",
        color: "text-purple-400",
      };
    if (count <= 7)
      return {
        text: "You’re building a powerhouse networking app!",
        color: "text-yellow-400",
      };
    if (count <= 10)
      return {
        text: "Nearly everything included — networking unleashed!",
        color: "text-orange-400",
      };
    if (count <= 14)
      return {
        text: "All-in premium package, the ultimate networking experience!",
        color: "text-red-400",
      };
    if (count === 15)
      return {
        text: "Complete feature set selected — nothing left to add!",
        color: "text-pink-400",
      };
  };

  const calculateTotal = (items: { cost: string }[]) => {
    const costs = items.map((item) => {
      const range = item.cost.replace("$", "").split("-");
      return {
        min: parseInt(range[0].replace(",", "")),
      };
    });
    return costs.reduce((sum, cost) => sum + cost.min, 0);
  };

  const totalPrice = calculateTotal(coreFeatures);

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="p-4 lg:p-8">
        {/* Back Button */}
        <div className="max-w-[1500px] mx-auto mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="max-w-[1500px] mx-auto mb-12">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Boys & Girls Club of Lynn{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
                Platform
              </span>
            </h1>
            <p className="text-lg lg:text-2xl text-neutral-300 max-w-3xl mx-auto">
              Development breakdown for our youth club digital platform
            </p>
          </div>
        </div>

        <div className="max-w-[1500px] mx-auto">
          {/* Main Content Grid */}
          <div className="flex flex-col gap-8">
            <section className="mb-12">
              <div className="gap-6">
                {/* Mix & Match Explanation */}
                <MinNMatchExplaination />
              </div>
            </section>

            {/* Core Features Grid */}
            <section className="mb-12">
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-neutral-800 rounded-lg">
                    <Calculator className="w-6 h-6 text-neutral-300" />
                  </div>
                  <h2 className="text-2xl font-semibold text-neutral-100">
                    Required Core Features
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {coreFeatures.map((feature, index) => (
                    <CoreFeature key={index} index={index} feature={feature} />
                  ))}
                </div>

                <div className="mt-6 bg-neutral-900 border border-neutral-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-neutral-100">
                        Core Features Total
                      </h3>
                      <p className="text-neutral-400 text-sm">
                        {coreFeatures.length} deliverables
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-neutral-400 line-through mb-1">
                        ${totalPrice.toFixed(2).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <div className="text-2xl font-bold text-indigo-400">
                          ${(totalPrice * 0.85).toFixed(2).toLocaleString()}
                        </div>
                        <span className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                          15% OFF
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive Builder */}
            <section className="mb-12">
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-2 border-violet-500/30 rounded-xl p-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 rounded-full px-4 py-2 mb-4">
                    <Gamepad2 className="w-4 h-4 text-violet-400" />
                    <span className="text-violet-300 text-sm font-medium">
                      Interactive Builder
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Your Platform, Ready for Launch
                  </h2>
                  <p className="text-neutral-300 text-lg">
                    Click features to add them to your custom package!
                  </p>
                </div>

                {/* Feature Selection Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {additionalFeatures.map((feature, index) => {
                    const isSelected = selectedFeatures.includes(feature.id);
                    return (
                      <AdditionalFeature
                        key={index}
                        feature={feature}
                        isSelected={isSelected}
                        toggleFeature={toggleFeature}
                      />
                    );
                  })}
                </div>

                {/* Results Panel */}
                <div className="bg-neutral-900/80 border border-indigo-500/30 rounded-xl p-6">
                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    {/* Selection Summary */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-indigo-400" />
                        Your Custom Package
                      </h3>

                      {selectedFeatures.length > 0 ? (
                        <div className="space-y-2 mb-4">
                          {additionalFeatures
                            .filter((feature) =>
                              selectedFeatures.includes(feature.id)
                            )
                            .map((feature) => (
                              <div
                                key={feature.id}
                                className="flex justify-between items-center text-sm"
                              >
                                <span className="text-neutral-300">
                                  {feature.title}
                                </span>
                                <span className="text-indigo-300 font-semibold">
                                  ${feature.cost.toLocaleString()}
                                </span>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-neutral-400 text-sm mb-4 italic">
                          No features selected yet. Click features above to add
                          them!
                        </div>
                      )}

                      <div className="border-t border-neutral-700 pt-3">
                        {/* Feature Count */}
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-white">
                            Selected Features:
                          </span>
                          <span className="text-indigo-300">
                            {selectedFeatures.length} of{" "}
                            {additionalFeatures.length}
                          </span>
                        </div>

                        {/* Core Features Cost */}
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-neutral-300">
                            Required Core Features
                          </span>
                          <span className="text-neutral-300">
                            ${totalPrice.toLocaleString()}
                          </span>
                        </div>

                        {/* Additional Features Cost */}
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-neutral-300">
                            Additional Features
                          </span>
                          <span className="text-neutral-300">
                            ${calculateSelectedTotal().toLocaleString()}
                          </span>
                        </div>

                        {/* Subtotal */}
                        <div className="flex justify-between items-center mb-2 pt-2 border-t border-neutral-800">
                          <span className="font-semibold text-white">
                            Subtotal
                          </span>
                          <span className="font-semibold text-white">
                            $
                            {(
                              calculateSelectedTotal() + totalPrice
                            ).toLocaleString()}
                          </span>
                        </div>

                        {/* Discount */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-emerald-400">
                            Local Business Discount (15%)
                          </span>
                          <span className="text-emerald-400">
                            -$
                            {(
                              (calculateSelectedTotal() + totalPrice) *
                              0.15
                            ).toLocaleString()}
                          </span>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center pt-3 border-t-2 border-indigo-500/30">
                          <span className="font-bold text-white text-lg">
                            Total Cost:
                          </span>
                          <span className="font-bold text-indigo-400 text-2xl">
                            $
                            {(
                              (calculateSelectedTotal() + totalPrice) *
                              0.85
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendation & Actions */}
                    <div className="text-center">
                      <div className="bg-violet-900/30 border border-violet-500/20 rounded-lg p-4 mb-4">
                        <div className="text-sm font-semibold mb-2 text-indigo-300">
                          💡 Smart Recommendation
                        </div>
                        <div
                          className={`text-sm ${getRecommendation()?.color}`}
                        >
                          {getRecommendation()?.text}
                        </div>
                      </div>

                      {selectedFeatures.length > 0 && (
                        <div className="bg-neutral-800 rounded-lg p-4 mb-4">
                          <div className="text-sm text-neutral-300 mb-2">
                            Cost:
                          </div>
                          <div className="text-2xl font-bold text-white">
                            $
                            {(
                              Math.round(
                                calculateSelectedTotal() + totalPrice
                              ) * 0.85
                            ).toLocaleString()}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={resetSelection}
                          className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Phase 1 Recommendations */}
            <section className="mb-12">
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-indigo-500/30 rounded-xl p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full px-4 py-2 mb-4">
                    <Lightbulb className="w-4 h-4 text-indigo-400" />
                    <span className="text-indigo-300 text-sm font-medium">
                      Expert Recommendation
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    🚀 Suggested Phase 1 Launch Package
                  </h2>
                  <p className="text-neutral-300 text-lg max-w-3xl mx-auto">
                    Based on our experience with youth organizations, we
                    recommend starting with these essential features to maximize
                    early engagement and value
                  </p>
                </div>

                {/* Phase 1 Package Card */}
                <div className="border-2 border-indigo-400 rounded-xl p-6 mb-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">
                          Phase 1: Foundation Launch
                        </h3>
                        <span className="bg-indigo-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                          RECOMMENDED
                        </span>
                      </div>
                      <p className="text-indigo-200 text-sm">
                        Perfect starting point for immediate impact
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-neutral-400 line-through mb-1">
                        $
                        {(
                          (totalPrice +
                            additionalFeatures[0].cost +
                            additionalFeatures[1].cost +
                            additionalFeatures[5].cost +
                            additionalFeatures[8].cost +
                            additionalFeatures[10].cost) *
                          0.85
                        ).toLocaleString()}
                      </div>
                      <div className="text-3xl font-bold text-indigo-400">
                        $
                        {(
                          (totalPrice +
                            additionalFeatures[0].cost +
                            additionalFeatures[1].cost +
                            additionalFeatures[5].cost +
                            additionalFeatures[8].cost +
                            additionalFeatures[10].cost) *
                          0.85 *
                          0.85
                        ).toLocaleString()}
                      </div>
                      <div className="text-xs text-indigo-300">
                        with 15% discount
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Included Core Features */}
                    <div>
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-indigo-400" />
                        Core Features (Included)
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-neutral-300">
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                          <span>Authentication & User Management</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-300">
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                          <span>Admin Dashboard & CMS</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-300">
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                          <span>Mobile-First Design</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-300">
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                          <span>Push Notifications</span>
                        </div>
                      </div>
                    </div>

                    {/* Recommended Add-Ons */}
                    <div>
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                        Recommended Features
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm text-indigo-200">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium">
                              {additionalFeatures[0].system}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {additionalFeatures[0].title}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-neutral-500 line-through">
                              ${additionalFeatures[0].cost}
                            </div>
                            <div className="text-xs text-indigo-300 font-semibold">
                              $
                              {(
                                additionalFeatures[0].cost * 0.85
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-indigo-200">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium">
                              {additionalFeatures[1].system}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {additionalFeatures[1].title}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-neutral-500 line-through">
                              ${additionalFeatures[1].cost}
                            </div>
                            <div className="text-xs text-indigo-300 font-semibold">
                              $
                              {(
                                additionalFeatures[1].cost * 0.85
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-indigo-200">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium">
                              {additionalFeatures[5].system}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {additionalFeatures[5].title}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-neutral-500 line-through">
                              ${additionalFeatures[5].cost}
                            </div>
                            <div className="text-xs text-indigo-300 font-semibold">
                              $
                              {(
                                additionalFeatures[5].cost * 0.85
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-indigo-200">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium">
                              {additionalFeatures[8].system}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {additionalFeatures[8].title}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-neutral-500 line-through">
                              ${additionalFeatures[8].cost}
                            </div>
                            <div className="text-xs text-indigo-300 font-semibold">
                              $
                              {(
                                additionalFeatures[8].cost * 0.85
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-indigo-200">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium">
                              {additionalFeatures[10].system}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {additionalFeatures[10].title}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-neutral-500 line-through">
                              ${additionalFeatures[10].cost}
                            </div>
                            <div className="text-xs text-indigo-300 font-semibold">
                              $
                              {(
                                additionalFeatures[10].cost * 0.85
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-900/50 border border-indigo-500/20 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-white font-semibold mb-1">
                          Why This Package?
                        </h5>
                        <p className="text-sm text-neutral-300 leading-relaxed">
                          We recommend a suite of systems to streamline
                          operations and support families. Mission Control
                          handles admin and content management, The Family
                          Launch Station connects parents to programs, The Comm
                          Station manages communications, The Starforge powers
                          fundraising, and The Credit Orb handles payments and
                          billing.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => {
                        setSelectedFeatures([
                          additionalFeatures[0].id,
                          additionalFeatures[1].id,
                          additionalFeatures[5].id,
                          additionalFeatures[8].id,
                          additionalFeatures[10].id,
                        ]);
                        setPhase1Discount(true);
                      }}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                    >
                      <Rocket className="w-5 h-5" />
                      Select Phase 1 Package
                    </button>
                  </div>
                </div>

                {/* Why Phase Approach */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-indigo-400" />
                      </div>
                      <h4 className="text-white font-semibold">
                        Launch Faster
                      </h4>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      Get your app in kids&apos; hands in 6-8 weeks with core
                      features. Add advanced functionality in Phase 2 based on
                      real user feedback.
                    </p>
                  </div>

                  <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-violet-600/20 border border-violet-500/30 rounded-lg">
                        <DollarSign className="w-5 h-5 text-violet-400" />
                      </div>
                      <h4 className="text-white font-semibold">Budget Smart</h4>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      Spread costs across phases and align with grant cycles.
                      Only invest in features that your users actually need and
                      request.
                    </p>
                  </div>

                  <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-emerald-600/20 border border-emerald-500/30 rounded-lg">
                        <Users className="w-5 h-5 text-emerald-400" />
                      </div>
                      <h4 className="text-white font-semibold">Build Better</h4>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      Learn what kids and parents actually use. Let real
                      engagement data guide Phase 2 features instead of guessing
                      upfront.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Options Section */}
            <section className="mb-12">
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-indigo-500/30 rounded-xl p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full px-4 py-2 mb-4">
                    <DollarSign className="w-4 h-4 text-indigo-400" />
                    <span className="text-indigo-300 text-sm font-medium">
                      Flexible Payment Plans
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Choose Your Payment Option
                  </h2>
                  <p className="text-neutral-400 text-lg">
                    Select the payment plan that works best for your
                    organization
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Pay in Full - Featured */}
                  <div className="relative bg-gradient-to-br from-indigo-900/40 to-violet-900/40 border-2 border-indigo-400 rounded-xl p-6 transform hover:scale-105 transition-all shadow-lg shadow-indigo-500/20">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                        BEST VALUE
                      </span>
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-indigo-400 font-bold text-sm mb-2">
                        Pay in Full
                      </div>
                      <div className="text-4xl font-bold text-white mb-1">
                        $
                        {(
                          (calculateSelectedTotal() + totalPrice) *
                          0.85
                        ).toLocaleString()}
                      </div>
                      <div className="text-sm text-neutral-400">
                        One-time payment
                      </div>
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        <span>15% discount applied</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        <span>No interest or fees</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        <span>Priority development queue</span>
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 rounded-lg transition-all">
                      Select Plan
                    </button>
                  </div>

                  {/* 2 Payments */}
                  <div className="bg-neutral-900/50 border border-neutral-700 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
                    <div className="text-center mb-4">
                      <div className="text-indigo-400 font-bold text-sm mb-2">
                        2 Payments
                      </div>
                      <div className="text-4xl font-bold text-white mb-1">
                        $
                        {(
                          ((calculateSelectedTotal() + totalPrice) * 0.85) /
                          2
                        ).toLocaleString()}
                      </div>
                      <div className="text-sm text-neutral-400">
                        per payment
                      </div>
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span>50% upfront, 50% at launch</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span>No additional fees</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span>Same 15% discount</span>
                      </div>
                    </div>
                    <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 rounded-lg transition-all">
                      Select Plan
                    </button>
                  </div>

                  {/* 3 Payments */}
                  <div className="bg-neutral-900/50 border border-neutral-700 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
                    <div className="text-center mb-4">
                      <div className="text-indigo-400 font-bold text-sm mb-2">
                        3 Payments
                      </div>
                      <div className="text-4xl font-bold text-white mb-1">
                        $
                        {(
                          ((calculateSelectedTotal() + totalPrice) * 0.85) /
                          3
                        ).toLocaleString()}
                      </div>
                      <div className="text-sm text-neutral-400">
                        per payment
                      </div>
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span>Monthly installments</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span>Start, midpoint, launch</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span>Flexible schedule</span>
                      </div>
                    </div>
                    <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 rounded-lg transition-all">
                      Select Plan
                    </button>
                  </div>

                  {/* 4 Payments */}
                  <div className="bg-neutral-900/50 border border-neutral-700 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
                    <div className="text-center mb-4">
                      <div className="text-indigo-400 font-bold text-sm mb-2">
                        4 Payments
                      </div>
                      <div className="text-4xl font-bold text-white mb-1">
                        $
                        {(
                          ((calculateSelectedTotal() + totalPrice) * 0.85) /
                          4
                        ).toLocaleString()}
                      </div>
                      <div className="text-sm text-neutral-400">
                        per payment
                      </div>
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span>Quarterly payments</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span>Spread over development</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span>Budget-friendly option</span>
                      </div>
                    </div>
                    <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 rounded-lg transition-all">
                      Select Plan
                    </button>
                  </div>

                  {/* 6 Payments */}
                  <div className="bg-neutral-900/50 border border-neutral-700 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
                    <div className="text-center mb-4">
                      <div className="text-indigo-400 font-bold text-sm mb-2">
                        6 Payments
                      </div>
                      <div className="text-4xl font-bold text-white mb-1">
                        $
                        {(
                          ((calculateSelectedTotal() + totalPrice) * 0.85) /
                          6
                        ).toLocaleString()}
                      </div>
                      <div className="text-sm text-neutral-400">
                        per payment
                      </div>
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span>Lowest monthly payment</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span>Extended payment timeline</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span>Maximum flexibility</span>
                      </div>
                    </div>
                    <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 rounded-lg transition-all">
                      Select Plan
                    </button>
                  </div>

                  {/* 12 Months */}
                  <div className="bg-neutral-900/50 border border-neutral-700 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
                    <div className="text-center mb-4">
                      <div className="text-indigo-400 font-bold text-sm mb-2">
                        12 Months
                      </div>
                      <div className="text-4xl font-bold text-white mb-1">
                        $
                        {(
                          ((calculateSelectedTotal() + totalPrice) * 0.85) /
                          12
                        ).toLocaleString()}
                      </div>
                      <div className="text-sm text-neutral-400">per month</div>
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span>Smallest monthly payment</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span>Full year to complete</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span>Maximum cash flow relief</span>
                      </div>
                    </div>
                    <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 rounded-lg transition-all">
                      Select Plan
                    </button>
                  </div>
                </div>
                {/* Full Width CTA */}
                <div className="mt-8 bg-gradient-to-r from-indigo-600/10 via-violet-600/10 to-indigo-600/10 border-2 border-indigo-500/40 rounded-xl p-8 text-center">
                  <div className="max-w-3xl mx-auto">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                      Need a Custom Payment Plan?
                    </h3>
                    <p className="text-neutral-300 text-lg mb-6">
                      We understand every organization has unique financial
                      needs. Let&apos;s create a payment schedule that works for
                      your budget, grant cycles, or fiscal year.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Schedule a Call
                      </button>
                      <button className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-4 px-8 rounded-lg transition-all flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Email Us
                      </button>
                    </div>
                    <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-neutral-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-indigo-400" />
                        <span>Grant-friendly options</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-indigo-400" />
                        <span>Nonprofit discounts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-indigo-400" />
                        <span>Flexible terms</span>
                      </div>
                    </div>
                  </div>

                  {/* Custom Payment */}
                  <div className="bg-neutral-900/50 border border-neutral-700 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
                    <div className="text-center mb-4">
                      <div className="text-indigo-400 font-bold text-sm mb-2">
                        Custom Plan
                      </div>
                      <div className="text-4xl font-bold text-white mb-1">
                        Let&apos;s Talk
                      </div>
                      <div className="text-sm text-neutral-400">
                        Tailored to you
                      </div>
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span>Your payment schedule</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span>Grant-friendly options</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span>Special arrangements</span>
                      </div>
                    </div>
                    <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 rounded-lg transition-all">
                      Contact Us
                    </button>
                  </div>
                </div>

                {/* Payment Terms Note */}
                <div className="mt-8 bg-violet-900/20 border border-violet-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-1">
                        Payment Terms & Security
                      </h4>
                      <p className="text-sm text-neutral-300 leading-relaxed">
                        All payment plans maintain the 15% local business
                        discount. Development begins upon first payment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Spacer to prevent content from being hidden behind fixed bar */}
            <div className="h-20 sm:h-24"></div>
          </div>
        </div>

        {/* Fixed Bottom Pricing Bar */}
        <FixedBottomPricingBar
          calculateSelectedTotal={calculateSelectedTotal}
          totalPrice={totalPrice}
          selectedFeatures={selectedFeatures}
          phase1Discount={phase1Discount}
        />
      </div>
    </div>
  );
};

export default ProjectBreakdown;
