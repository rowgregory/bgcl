import { Calculator, CheckCircle, Code, Rocket, Settings } from "lucide-react";
import React from "react";

const MinNMatchExplaination = () => {
  return (
    <div className="bg-neutral-900 border-2 border-indigo-500 rounded-2xl p-6 ring-indigo-400">
      <div className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
        BUILD YOUR APP
      </div>
      <h3 className="text-xl font-bold text-white mb-3">
        Interactive App Feature Selector
      </h3>
      <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-3">
        Custom Build Pricing
      </div>
      <div className="text-base text-neutral-300 mb-6">
        Click on different app features below to see real-time pricing for your
        custom Boys and Girls Club space app
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span className="text-sm text-neutral-300">
            Select the exact features SQYSH will build for your app
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span className="text-sm text-neutral-300">
            Watch pricing update instantly as you add/remove features
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span className="text-sm text-neutral-300">
            Each feature is custom-built by SQYSH for your organization
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span className="text-sm text-neutral-300">
            You&apos;ll control all content through your admin dashboard
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-indigo-500/20">
          <div className="text-xs text-indigo-300 font-semibold mb-2">
            Example features you can select:
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-indigo-400 flex-shrink-0" />
              <span className="text-xs text-neutral-300">
                The Code Lab (Space Lab: Experiments & Challenges)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-indigo-400 flex-shrink-0" />
              <span className="text-xs text-neutral-300">
                he Family Launch Station (Complete Parent & Family Portal)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-indigo-400 flex-shrink-0" />
              <span className="text-xs text-neutral-300">
                The Comm Station (Multi-Channel Communication System)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-indigo-400 flex-shrink-0" />
              <span className="text-xs text-neutral-300">
                Mission Control (Admin Club & Content Management Dashboard)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-indigo-400 flex-shrink-0" />
              <span className="text-xs text-neutral-300">
                The Mission Gate (Digital Check-In/Out System)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-600/20 border border-indigo-400 p-3 rounded-lg mb-4">
        <p className="text-xs text-indigo-200">
          <strong className="text-indigo-300">How it works:</strong> Click
          features to add them to your package. Once your custom app is
          delivered, you&apos;ll manage everything through an easy-to-use admin
          panel.
        </p>
      </div>

      <div className="text-sm text-neutral-400">
        <strong className="text-neutral-300">Development Timeline:</strong>{" "}
        Updates based on selected features (typically 4-12 weeks)
      </div>
    </div>
  );
};

export default MinNMatchExplaination;
