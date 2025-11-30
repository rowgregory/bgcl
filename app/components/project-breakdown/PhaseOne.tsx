import { additionalFeatures } from "@/app/lib/constants/project-breakdown";
import { IPhaseOne } from "@/types/project-breakdown";
import {
  DollarSign,
  Lightbulb,
  Lock,
  Rocket,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { FC } from "react";

const PhaseOne: FC<IPhaseOne> = ({
  setSelectedFeatures,
  setPhase1Discount,
  phaseOneTotal,
  phaseOneTotalWithDiscount,
}) => {
  if (!additionalFeatures) return null;

  return (
    <section className="mb-12">
      <div className="bg-linear-to-br from-neutral-900 to-neutral-950 border border-indigo-500/30 rounded-xl p-8">
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
          <p className="text-neutral-300 text-lg max-w-3xl mx-auto mb-2">
            Based on our experience with youth organizations, we recommend
            starting with these essential features to maximize early engagement
            and value
          </p>
          <p className="text-neutral-400 text-sm max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3 h-3" />
              This is a curated package — additional features cannot be added or
              removed
            </span>
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
                ${phaseOneTotal.toLocaleString()}
              </div>
              <div className="text-3xl font-bold text-indigo-400">
                ${Math.round(phaseOneTotalWithDiscount).toLocaleString()}
              </div>
              <div className="text-xs text-indigo-300">
                with 15% discount on all recommended features
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Recommended Add-Ons */}
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Recommended Features
              </h4>
              <div className="space-y-2">
                {[0, 3, 7, 9, 10, 13].map((index) => {
                  const feature = additionalFeatures[index];
                  if (!feature) return null;

                  return (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-sm text-indigo-200"
                    >
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">{feature.system}</div>
                        <div className="text-xs text-neutral-500">
                          {feature.title}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-neutral-500 line-through">
                          ${feature.cost.toLocaleString()}
                        </div>
                        <div className="text-xs text-indigo-300 font-semibold">
                          ${(feature.cost * 0.85).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-indigo-500/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-white font-semibold mb-1">
                  Why This Package?
                </h5>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  We recommend a suite of systems designed to streamline
                  operations and support families. Mission Control manages
                  administration and content, The Orbital links social media
                  marketing to the main hero section, The Observatory serves as
                  the Analytics & Reporting Dashboard for all events, The Nebula
                  is the Media Storage & Management System, The Credit Orb
                  manages payments and billing, and The Orbital Hall oversees
                  all event coordination.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                setSelectedFeatures([
                  additionalFeatures[0].id,
                  additionalFeatures[3].id,
                  additionalFeatures[7].id,
                  additionalFeatures[9].id,
                  additionalFeatures[10].id,
                  additionalFeatures[13].id,
                ]);
                setPhase1Discount(true);
              }}
              className="flex-1 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
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
              <h4 className="text-white font-semibold">Launch Faster</h4>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Get your app in kids&apos; hands in 6-8 weeks with core features.
              Add advanced functionality in Phase 2 based on real user feedback.
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
              Spread costs across phases and align with grant cycles. Only
              invest in features that your users actually need and request.
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
              Learn what kids and parents actually use. Let real engagement data
              guide Phase 2 features instead of guessing upfront.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhaseOne;
