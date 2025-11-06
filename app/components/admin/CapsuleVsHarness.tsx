"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Check,
  X,
  DollarSign,
  Zap,
  Shield,
  Settings,
  Lock,
  Unlock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { containerVariants, itemVariants } from "@/app/lib/motion";

const costComparison = {
  harness: {
    annual: 7500,
    monthly: 650,
    setup: 0,
    threeYear: 22500,
    fiveYear: 37500,
  },
  capsule: {
    annual: 3000,
    monthly: 250,
    setup: 7500, // Mid-range estimate for event platform
    threeYear: 9000,
    fiveYear: 15000,
  },
};

const features = [
  {
    category: "Event Management",
    items: [
      { name: "Unlimited Events", harness: true, capsule: true },
      { name: "Custom Event Pages", harness: true, capsule: true },
      { name: "Registration Management", harness: true, capsule: true },
      { name: "Capacity Controls", harness: true, capsule: true },
      { name: "Waitlist Management", harness: true, capsule: true },
      { name: "Multi-Tier Ticketing", harness: true, capsule: true },
    ],
  },
  {
    category: "Payment & Commerce",
    items: [
      { name: "Secure Payment Processing", harness: true, capsule: true },
      { name: "Multiple Payment Methods", harness: true, capsule: true },
      { name: "Refund Management", harness: true, capsule: true },
      {
        name: "Transaction Fees",
        harness: "2.9% + $0.30",
        capsule: "2.9% + $0.30",
      },
      { name: "Direct Bank Deposits", harness: true, capsule: true },
    ],
  },
  {
    category: "Attendee Experience",
    items: [
      { name: "Digital Tickets", harness: true, capsule: true },
      { name: "QR Code Check-in", harness: true, capsule: true },
      { name: "Email Confirmations", harness: true, capsule: true },
      { name: "Mobile Responsive", harness: true, capsule: true },
      { name: "Real-time Updates", harness: true, capsule: true },
    ],
  },
  {
    category: "Analytics & Reporting",
    items: [
      { name: "Event Analytics Dashboard", harness: true, capsule: true },
      { name: "Revenue Tracking", harness: true, capsule: true },
      { name: "Attendance Reports", harness: true, capsule: true },
      { name: "Custom Report Builder", harness: false, capsule: true },
      { name: "Real-time Metrics", harness: true, capsule: true },
      { name: "Export to Excel/CSV", harness: true, capsule: true },
    ],
  },
  {
    category: "Customization & Control",
    items: [
      { name: "Custom Branding", harness: true, capsule: true },
      { name: "White Label Solution", harness: false, capsule: true },
      { name: "Custom Domain", harness: true, capsule: true },
      { name: "Full Code Access", harness: false, capsule: true },
      { name: "API Access", harness: "Limited", capsule: "Full" },
      { name: "Custom Feature Requests", harness: false, capsule: true },
    ],
  },
  {
    category: "Support & Service",
    items: [
      { name: "Email Support", harness: true, capsule: true },
      { name: "Phone Support", harness: true, capsule: true },
      { name: "Training & Onboarding", harness: true, capsule: true },
      { name: "Direct Developer Access", harness: false, capsule: true },
      { name: "Custom Development", harness: false, capsule: true },
    ],
  },
];

const advantages = [
  {
    icon: DollarSign,
    title: "Significant Cost Savings",
    description:
      "Save over $15,000 in the first three years compared to Harness",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Settings,
    title: "Complete Customization",
    description:
      "Built specifically for BGCL with full control over features and updates",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Data Ownership",
    description:
      "Your data stays with you, no third-party platform dependencies",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Faster Updates",
    description:
      "Direct development means features and fixes implemented immediately",
    color: "from-amber-500 to-orange-500",
  },
];

const CapsuleVsHarness = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            The Capsule vs Harness
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            A comprehensive comparison of event management platforms built for
            the Boys & Girls Club of Lynn
          </p>
        </motion.div>

        {/* Cost Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Cost Analysis</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Harness Pricing */}
            <div className="bg-zinc-900/90 backdrop-blur-sm rounded-xl p-8 border border-zinc-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Harness Events</h3>
                <Unlock className="w-6 h-6 text-zinc-500" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                  <span className="text-zinc-400">Setup Fee</span>
                  <span className="text-xl font-bold">
                    ${costComparison.harness.setup.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                  <span className="text-zinc-400">Monthly Cost</span>
                  <span className="text-xl font-bold">
                    ${costComparison.harness.monthly.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                  <span className="text-zinc-400">Annual Cost</span>
                  <span className="text-xl font-bold">
                    ${costComparison.harness.annual.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 bg-zinc-800/50 rounded-lg px-4">
                  <span className="font-medium">3-Year Total</span>
                  <span className="text-2xl font-bold text-red-400">
                    ${costComparison.harness.threeYear.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 bg-zinc-800/50 rounded-lg px-4">
                  <span className="font-medium">5-Year Total</span>
                  <span className="text-2xl font-bold text-red-400">
                    ${costComparison.harness.fiveYear.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* The Capsule Pricing */}
            <div className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 backdrop-blur-sm rounded-xl p-8 border border-blue-800/50 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">The Capsule</h3>
                <Lock className="w-6 h-6 text-blue-400" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-blue-900/50">
                  <span className="text-zinc-400">Setup Fee</span>
                  <span className="text-xl font-bold">
                    ${costComparison.capsule.setup.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-blue-900/50">
                  <span className="text-zinc-400">Monthly Cost</span>
                  <span className="text-xl font-bold">
                    ${costComparison.capsule.monthly.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-blue-900/50">
                  <span className="text-zinc-400">Annual Cost</span>
                  <span className="text-xl font-bold">
                    ${costComparison.capsule.annual.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 bg-green-500/10 border border-green-500/20 rounded-lg px-4">
                  <span className="font-medium">3-Year Total</span>
                  <span className="text-2xl font-bold text-green-400">
                    $
                    {(
                      costComparison.capsule.setup +
                      costComparison.capsule.threeYear
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 bg-green-500/10 border border-green-500/20 rounded-lg px-4">
                  <span className="font-medium">5-Year Total</span>
                  <span className="text-2xl font-bold text-green-400">
                    $
                    {(
                      costComparison.capsule.setup +
                      costComparison.capsule.fiveYear
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Highlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-8"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Total Cost Savings</h3>
              <p className="text-zinc-400">
                Compare total investment over time
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-zinc-400 mb-2">Year 1 Investment</p>
                <p className="text-3xl font-bold text-green-400">
                  $
                  {(
                    costComparison.harness.annual -
                    (costComparison.capsule.setup +
                      costComparison.capsule.annual)
                  ).toLocaleString()}
                </p>
                <p className="text-sm text-zinc-500 mt-1">Immediate ROI</p>
              </div>
              <div className="text-center">
                <p className="text-zinc-400 mb-2">3-Year Savings</p>
                <p className="text-3xl font-bold text-green-400">
                  $
                  {(
                    costComparison.harness.threeYear -
                    (costComparison.capsule.setup +
                      costComparison.capsule.threeYear)
                  ).toLocaleString()}
                </p>
                <p className="text-sm text-zinc-500 mt-1">Mid-term value</p>
              </div>
              <div className="text-center">
                <p className="text-zinc-400 mb-2">5-Year Savings</p>
                <p className="text-3xl font-bold text-green-400">
                  $
                  {(
                    costComparison.harness.fiveYear -
                    (costComparison.capsule.setup +
                      costComparison.capsule.fiveYear)
                  ).toLocaleString()}
                </p>
                <p className="text-sm text-zinc-500 mt-1">Long-term value</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-zinc-300">
                    <strong>What&apos;s Included:</strong> The $250/month covers
                    dedicated development support, ongoing feature updates,
                    priority bug fixes, hosting, security updates, and direct
                    developer access. Unlike Harness&apos;s fixed platform, you
                    get a living system that evolves with your needs.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Key Advantages */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">
            Why Choose The Capsule
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {advantages.map((advantage, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-zinc-900/90 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${advantage.color} p-3 mb-4`}
                >
                  <advantage.icon className="w-full h-full" />
                </div>
                <h3 className="text-xl font-bold mb-2">{advantage.title}</h3>
                <p className="text-zinc-400">{advantage.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">
            Feature Comparison
          </h2>

          <div className="bg-zinc-900/90 backdrop-blur-sm rounded-xl border border-zinc-800 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-zinc-800/50 border-b border-zinc-800">
              <div className="font-bold">Feature</div>
              <div className="font-bold text-center">Harness Events</div>
              <div className="font-bold text-center">The Capsule</div>
            </div>

            {/* Feature Categories */}
            {features.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="px-6 py-4 bg-zinc-800/30">
                  <h3 className="font-bold text-lg">{category.category}</h3>
                </div>
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="grid grid-cols-3 gap-4 p-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                  >
                    <div className="text-zinc-300">{item.name}</div>
                    <div className="flex justify-center">
                      {typeof item.harness === "boolean" ? (
                        item.harness ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <X className="w-5 h-5 text-red-400" />
                        )
                      ) : (
                        <span className="text-sm text-zinc-400">
                          {item.harness}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-center">
                      {typeof item.capsule === "boolean" ? (
                        item.capsule ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <X className="w-5 h-5 text-red-400" />
                        )
                      ) : (
                        <span className="text-sm text-zinc-400">
                          {item.capsule}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-blue-500/30 rounded-xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Make the Switch?</h2>
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            Empower BGCL to streamline event management with a platform designed
            specifically to meet your organization&apos;s needs
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg font-bold text-lg flex items-center space-x-2 mx-auto hover:shadow-xl transition-all"
          >
            <span>Get Started with The Capsule</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default CapsuleVsHarness;
