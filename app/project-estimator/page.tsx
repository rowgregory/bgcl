"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Globe,
  Shield,
  Users,
  Calendar,
  CreditCard,
  Heart,
  Activity,
  Settings,
  Code,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// FRONTEND PAGES
// Home
// History
// Board of Directors
// Staff
// Programs
// Rennovation (takeing over for Experience Our Club)
// Events (platform)
// Honorees/Youth of the Year
// Newsletter archive/club resources
// Contact
// Login (platform)

export default function BGCLProjectBreakdown() {
  const [expandedSection, setExpandedSection] = useState(null);

  const projectSummary = {
    total: 35000,
    timeline: "16-20 weeks",
    monthlySupport: 600,
  };

  const sections = [
    {
      id: "public",
      title: "Public Marketing Website",
      icon: Globe,
      cost: 8000,
      description: "Complete rebuild of bgcl.org public-facing pages",
      features: [
        "Modern, mobile-first homepage with hero sections",
        "Programs page with filterable listings (age, type, schedule)",
        "Events calendar with registration capabilities",
        "Staff directory with photos, bios, and roles",
        "About Us page with mission, history, impact stats",
        "Contact page with form and location info",
        "News/announcements system",
        "Photo galleries for programs and events",
        "Donation landing page (links to portal)",
        "Weglot integration for 10 languages",
      ],
    },
    {
      id: "auth",
      title: "Authentication System",
      icon: Shield,
      cost: 2500,
      description: "Secure multi-role login system",
      features: [
        "Google OAuth integration",
        "Magic link email authentication (Resend)",
        "Role-based access (Parent, Youth, Staff, Admin)",
        "Password reset functionality",
        "Session management and security",
        "Account creation and verification",
      ],
    },
    {
      id: "parent",
      title: "Parent Portal Dashboard",
      icon: Users,
      cost: 4500,
      description: "Complete parent management interface",
      features: [
        "Personalized dashboard with upcoming activities",
        "Family profile management",
        "Multiple youth profiles per account",
        "Emergency contact management",
        "Medical information and allergy tracking",
        "Communication preferences",
        "Payment history and upcoming charges",
        "Document uploads (permission slips, forms)",
        "Notification center for announcements",
      ],
    },
    {
      id: "enrollment",
      title: "Program Enrollment System",
      icon: Calendar,
      cost: 4000,
      description: "Complete program management and registration",
      features: [
        "Browse all programs with filters (age, type, schedule)",
        "Real-time availability and capacity tracking",
        "Multi-child enrollment in single flow",
        "Waitlist management with auto-notifications",
        "Program prerequisites and requirements",
        "Age/grade eligibility validation",
        "Enrollment confirmation emails",
        "Cancellation and refund processing",
        "Recurring program management (weekly activities)",
      ],
    },
    {
      id: "payments",
      title: "Payment Processing",
      icon: CreditCard,
      cost: 3500,
      description: "Stripe integration for all transactions",
      features: [
        "Stripe nonprofit rate setup (2.2% + 30¢)",
        "Membership fee processing",
        "Program payment collection",
        "Saved payment methods",
        "Payment history and receipts",
        "Automated billing for recurring programs",
        "Refund processing",
        "Payment plan options",
        "Failed payment handling and retry logic",
      ],
    },
    {
      id: "donations",
      title: "Online Giving System",
      icon: Heart,
      cost: 2800,
      description: "Complete donation platform",
      features: [
        "Public donation page (no login required)",
        "One-time donation processing",
        "Recurring monthly/annual donations",
        "Campaign-specific giving options",
        "Custom donation amounts",
        "Suggested amount buttons",
        "Dedication options (in honor/memory of)",
        "Automatic tax receipts via email",
        "Donor dashboard to manage recurring gifts",
        "Admin reporting for fundraising metrics",
      ],
    },
    {
      id: "admin",
      title: "Admin Control Panel",
      icon: Settings,
      cost: 5000,
      description: "Complete backend management system",
      features: [
        "Member management (view, edit, deactivate)",
        "Program creation and management",
        "Event scheduling and management",
        "Staff directory management",
        "Content management for public pages",
        "Enrollment oversight and approval",
        "Payment and donation tracking",
        "Financial reporting dashboard",
        "Bulk email/announcement system",
        "User role and permission management",
        "Activity logs and audit trails",
        "Data export tools (CSV, PDF)",
      ],
    },
    {
      id: "features",
      title: "Additional Features",
      icon: Activity,
      cost: 1700,
      description: "Supporting systems and tools",
      features: [
        "Modern FAQ system (searchable, categorized)",
        "Email notification system (Resend)",
        "Activity/schedule viewing for families",
        "Event RSVP and capacity management",
        "Automated reminder emails",
        "Data validation and error handling",
        "Comprehensive error logging",
        "Performance optimization",
        "SEO optimization for public pages",
      ],
    },
  ];

  const toggleSection = (id: any) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="min-h-screen relative p-4 sm:p-8">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/videos/estimator-2.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for readability */}
      <div className="fixed top-0 left-0 w-full h-full bg-black/60 -z-10"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-mono">
            BGCL DIGITAL PLATFORM
          </h1>
          <p className="text-xl text-blue-300 mb-6">
            Complete Website & Portal System Breakdown
          </p>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-cyan-500/20 border border-cyan-500/50 rounded-xl p-4">
              <div className="text-cyan-400 text-sm font-mono mb-1">
                TOTAL COST
              </div>
              <div className="text-3xl font-bold text-white">
                ${projectSummary.total.toLocaleString()}
              </div>
            </div>
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
              <div className="text-blue-400 text-sm font-mono mb-1">
                TIMELINE
              </div>
              <div className="text-3xl font-bold text-white">
                {projectSummary.timeline}
              </div>
            </div>
            <div className="bg-purple-500/20 border border-purple-500/50 rounded-xl p-4">
              <div className="text-purple-400 text-sm font-mono mb-1">
                MONTHLY
              </div>
              <div className="text-3xl font-bold text-white">
                ${projectSummary.monthlySupport}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Sections */}
        <div className="space-y-4 mb-8">
          {sections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;

            return (
              <div
                key={section.id}
                className="bg-slate-900/60 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="bg-cyan-500/20 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {section.title}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyan-400">
                        ${section.cost.toLocaleString()}
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-cyan-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-slate-700/50">
                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {section.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Monthly Support Details */}
        <div className="bg-gradient-to-br from-slate-900/80 to-blue-900/80 backdrop-blur-sm border-2 border-cyan-500/50 rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white mb-6 font-mono">
            MONTHLY SUPPORT - $600/MONTH
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-cyan-500/20 p-2 rounded-lg">
                <Code className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-white font-semibold mb-1">
                  Hosting & Infrastructure
                </div>
                <div className="text-sm text-slate-300">
                  Vercel, database, storage, CDN
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-cyan-500/20 p-2 rounded-lg">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-white font-semibold mb-1">
                  Security & Updates
                </div>
                <div className="text-sm text-slate-300">
                  Monitoring, patches, backups
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-cyan-500/20 p-2 rounded-lg">
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-white font-semibold mb-1">
                  Maintenance & Fixes
                </div>
                <div className="text-sm text-slate-300">
                  Bug fixes, performance tuning
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-cyan-500/20 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-white font-semibold mb-1">
                  5 Hours Support
                </div>
                <div className="text-sm text-slate-300">
                  Additional: $150/hour
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-200">
              <strong>12-month minimum commitment.</strong> Includes email
              service (Resend), error tracking, uptime monitoring, and priority
              support during business hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
