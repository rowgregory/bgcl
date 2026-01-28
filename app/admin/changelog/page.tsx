'use client'

import { motion } from 'framer-motion'
import { GitCommit, Bug, Zap, AlertCircle } from 'lucide-react'

type ChangeType = 'feature' | 'improvement' | 'fix' | 'performance' | 'ui' | 'breaking' | 'bug'
type ImpactLevel = 'low' | 'medium' | 'high'

interface Change {
  type: ChangeType
  title: string
  description: string
  impact: ImpactLevel
}

interface ChangelogEntry {
  version: string
  date: string
  changes: Change[]
}

const changelogData: ChangelogEntry[] = [
  {
    version: '1.6.1',
    date: '2026-01-28',
    changes: [
      {
        type: 'feature',
        title: 'Campaign Visibility Control',
        description:
          'Added isListed field to Campaign model with custom toggle switch in admin panel. Administrators can now show or hide specific campaigns from the frontend page while still having them avaiable to donate towards in the donation form.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Required Campaign Selection',
        description:
          'Made campaign selection required in donation form with the first available campaign automatically pre-selected when the component loads, ensuring all donations are properly attributed to campaigns.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Campaign Listing Filter',
        description:
          'Added optional filtering to campaign queries to show only listed campaigns on public donation pages while maintaining full visibility in donation form and in admin views for management purposes.',
        impact: 'medium'
      }
    ]
  },
  {
    version: '1.6.0',
    date: '2026-01-27',
    changes: [
      {
        type: 'feature',
        title: 'About Page Content Management',
        description:
          'Unlocked the About page in Star Map admin panel for content editing. Administrators can now dynamically update mission statements, outcomes, statistics, and COVID response information without code changes.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Unified Preset Donation System',
        description:
          'Completely redesigned donation flow with preset amounts for one-time, monthly, and yearly donations. Previously only one-time donations had custom amounts; now all donation types feature suggested preset tiers plus custom amount options for maximum flexibility.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Streamlined Amount Selection',
        description:
          'Unified the amount selection logic across all donation types. Users can now choose from preset plans or select "Custom Amount" to enter their own value, with consistent UX across one-time and recurring donations.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Dedicated Recurring Donation Pages',
        description:
          'Added separate admin pages for viewing monthly and yearly recurring donations. Administrators can now filter and manage recurring donations by frequency with dedicated list views.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Failed Payment Tracking',
        description:
          'Added comprehensive failed payment tracking with admin drawer view. Administrators can now review failed donations, contact donors, and view payment details in Stripe.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Enhanced Toast Notifications',
        description:
          'Redesigned toast notification system with better light/dark mode support, mobile responsiveness, and contextual descriptions.',
        impact: 'low'
      },
      {
        type: 'improvement',
        title: 'Donation History List View',
        description:
          'Replaced card-based donation view with streamlined list layout showing more data at a glance. Desktop users see table-like rows while mobile maintains stacked layout.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Donation Detail Drawer',
        description:
          'Added comprehensive donation detail drawer displaying full donor information, billing address, payment details, fees covered, and recurring billing schedules with direct Stripe dashboard links.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Fee Coverage Visibility',
        description:
          'Failed payment drawer and donation list now clearly display when donors opted to cover processing fees and the amount covered.',
        impact: 'medium'
      }
    ]
  },
  {
    version: '1.5.0',
    date: '2026-01-27',
    changes: [
      {
        type: 'feature',
        title: 'Stripe Payment Methods Management',
        description:
          'Added complete payment method management system allowing users to save, view, and manage multiple payment cards. Users can set a default card, delete saved cards, and view cardholder names and expiration dates. Includes full CRUD operations with proper security checks.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Saved Card Checkout Flow',
        description:
          'Implemented saved card selection during checkout for authenticated users. Donors can now choose from their saved cards or enter a new card. Server-side payment confirmation for saved cards eliminates need for frontend CardElement interaction.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Payment Methods Database Schema',
        description:
          'Created PaymentMethod model with Stripe integration. Stores cardholder name, card brand, last 4 digits, expiration, and default status. Includes proper user ownership validation and cascade deletion.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Donation Overview Admin Page',
        description:
          'Built comprehensive admin dashboard showing donations by campaign with bar chart visualization, pie/distribution charts, and detailed breakdown tables. Displays total raised, donor count, average donation, and campaign-specific metrics.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Supporter Donations History Page',
        description:
          'Added /supporter/donations page displaying all user donations in card grid layout. Shows donation amount, date, recipient campaign, frequency (if recurring), and status. Each card links to full order confirmation details.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Saved Payment Methods UI',
        description:
          'Created beautiful payment methods management page at /supporter/payment-methods. Displays saved cards with gradient backgrounds, shine effects for default card, and smooth radio button selection for setting defaults. Includes delete confirmation modal.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Server Action: getDonationStats',
        description:
          'Built server-side donation statistics aggregation. Calculates monthly/yearly recurring revenue, churn rate, average donation, and generates 6-month trend data and retention metrics. Includes caching with unstable_cache.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Campaign-Based Donation Tracking',
        description:
          'Enhanced donation system to track which campaign each donation supports. Campaign names now display on donation cards, order confirmations, and admin analytics. Includes campaign aggregation and performance metrics.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Donation Form Refactoring',
        description:
          'Extracted handleSubmit logic into custom hook useDonationPayment. Separated one-time and recurring donation flows. Optimized Pusher listener setup with dedicated functions to reduce code duplication.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Payment Method Validation',
        description:
          'Enhanced security with user ownership verification for all payment method operations. Validates payment method exists and belongs to authenticated user before allowing updates or deletions.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'CardElement Dark Mode Support',
        description:
          'Updated Stripe CardElement styling with proper dark mode colors. Light text on dark backgrounds, adjusted placeholder colors, and maintained contrast ratios for accessibility.',
        impact: 'low'
      },
      {
        type: 'improvement',
        title: 'Loading State Management',
        description:
          'Refactored donation form loading states. Loading now clears when payment succeeds, fails, or times out via Pusher listener instead of finally block. Provides better UX feedback during payment processing.',
        impact: 'low'
      },
      {
        type: 'fix',
        title: 'Payment Method ID Handling',
        description:
          'Fixed issue where database ID was being passed to Stripe instead of stripePaymentId. Now correctly retrieves Stripe payment method ID from database before confirming payment intents.',
        impact: 'high'
      },
      {
        type: 'fix',
        title: 'Cardholder Name Input',
        description:
          'Fixed cardholder name field styling to match CardElement appearance. Added proper dark mode support with consistent borders, padding, and focus states.',
        impact: 'low'
      },
      {
        type: 'performance',
        title: 'Donation Stats Caching',
        description:
          'Implemented unstable_cache for getDonationStats with 60-second revalidation and tagged cache invalidation. Reduces database queries for repeated stat requests.',
        impact: 'medium'
      },
      {
        type: 'performance',
        title: 'Payment Methods Caching',
        description:
          'Added unstable_cache to getSavedPaymentMethods with user ID-based cache keys. Automatic revalidation on card creation, deletion, or default changes.',
        impact: 'low'
      },
      {
        type: 'ui',
        title: 'Mobile Responsive Payment Methods',
        description:
          'Designed payment methods page to be fully responsive down to 330px. Grid layout adapts from 1 column on mobile to 3 columns on desktop with proper spacing.',
        impact: 'medium'
      },
      {
        type: 'ui',
        title: 'Donation Cards Visual Design',
        description:
          'Created beautiful donation card designs with gradient headers, animated shine effects for defaults, and smooth hover states. Includes status badges and campaign information display.',
        impact: 'medium'
      }
    ]
  },
  {
    version: '1.4.0',
    date: '2026-01-23',
    changes: [
      {
        type: 'feature',
        title: 'Program Staff Role & Access Control',
        description:
          'Introduced new PROGRAM role for program staff with dedicated access control. Program staff have their own isolated dashboard at /program/airlock and cannot access admin or supporter areas. Implemented complete middleware protection to enforce role-based routing.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Program Staff User Management',
        description:
          'Added "Position Staff" command to admin interface for creating program staff users. Program staff can be assigned through the Command Pod with proper role selection dropdown that includes SUPPORTER, PROGRAM, and ADMIN options.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Role-Based Authentication Routing',
        description:
          'Enhanced authentication middleware to redirect users to appropriate dashboards based on role: ADMIN/SUPERUSER to /admin/star-map/home, PROGRAM to /program/airlock, and SUPPORTER to /supporter/overview. Prevents cross-role navigation with automatic redirects.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'User Role Selection Interface',
        description:
          'Replaced toggle switch with comprehensive dropdown select for user role assignment. Admins can now choose from all role types with clear descriptions and visual permission indicators showing access levels for each role.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Comprehensive Job Application Display',
        description:
          "Expanded job application confirmation page to display all submitted data including driver's license information, professional references, resume details, and certifications. Added sections for license verification, traffic violations, reference contacts, and agreement confirmations.",
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Enhanced SEO Metadata',
        description:
          'Implemented comprehensive SEO optimization including JSON-LD structured data, Open Graph tags, geo-targeting for Lynn, MA, and 20+ local keywords. Added Google Analytics integration and site verification for improved search visibility.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Dynamic Sitemap Generation',
        description:
          'Created automated sitemap generation that pulls dynamic content from database including programs, events, and campaigns. Sitemap automatically updates with proper change frequencies and priorities for optimal search engine crawling.',
        impact: 'low'
      },
      {
        type: 'improvement',
        title: 'Progressive Web App Support',
        description:
          'Added site.webmanifest file for PWA functionality including app icons, theme colors, and display modes. Enables installation on mobile devices and provides native app-like experience for users.',
        impact: 'low'
      }
    ]
  },
  {
    version: '1.3.2',
    date: '2026-01-23',
    changes: [
      {
        type: 'feature',
        title: 'Dynamic Program Hero Gradients',
        description:
          'Implemented randomly selected gradient backgrounds for program pages. Each page load selects from 4 vibrant color combinations (sky, purple, green, orange) providing visual variety while maintaining brand consistency.',
        impact: 'low'
      },
      {
        type: 'improvement',
        title: 'Compact Hero Section Redesign',
        description:
          'Redesigned program hero sections with reduced height, added thin navigation header, and removed hero images in favor of colorful gradients with subtle pattern overlays for improved performance and modern aesthetic.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Program Image Gallery Enhancement',
        description:
          'Added imageTwo field support in program detail pages, displayed in right column sidebar between schedule information and enrollment CTA for enhanced visual content.',
        impact: 'low'
      },
      {
        type: 'feature',
        title: 'External Program Documents',
        description:
          'Added external link support for program pages, allowing links to Google Drive PDFs and other external resources with dedicated UI section including FileText icon and external link indicator.',
        impact: 'low'
      },
      {
        type: 'improvement',
        title: 'Contact Form Subject Pre-population',
        description:
          'Enhanced contact form to pre-populate subject field from URL parameters (e.g., ?subject=tour) while maintaining user ability to change selection after initial load.',
        impact: 'low'
      },
      {
        type: 'feature',
        title: 'New Facility Showcase Component',
        description:
          'Created modern, responsive facility showcase component with dark/light mode support, interactive image carousel, feature cards, and stats section. Optimized for screens down to 320px width using neutral and sky color palettes.',
        impact: 'medium'
      }
    ]
  },
  {
    version: '1.3.1',
    date: '2026-01-22',
    changes: [
      {
        type: 'feature',
        title: 'Closing Dates Management',
        description:
          'Added new Closing model and admin interface for managing facility closure dates. Supports flexible date formats including single dates (January 1, 2025) and date ranges (December 23 - 26, 2025) stored as formatted strings.',
        impact: 'medium'
      }
    ]
  },
  {
    version: '1.3.0',
    date: '2026-01-22',
    changes: [
      {
        type: 'feature',
        title: 'Theme Management System',
        description:
          'Added server actions to create themes and attach them to programs. Themes can now be associated with multiple programs and include weekly scheduling information.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Theme Display Component',
        description:
          'Created a new frontend display area for themes on program pages. Themes are shown in a colorful card grid with rotating color schemes (purple, orange, green) and display week numbers, titles, and dates.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Campaign Cards Redesign',
        description:
          'Redesigned campaign cards with a wider 2-column layout on desktop. Updated visual hierarchy with improved progress display and better use of horizontal space with centered stats.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Campaign Detail Page Layout',
        description:
          'Reorganized campaign detail page layout to balance content distribution. Moved progress information and stats to the left column alongside description and details, while keeping image and CTA buttons in a sticky right sidebar for better visual balance.',
        impact: 'low'
      },
      {
        type: 'bug',
        title: 'Campaign Data Cleanup',
        description:
          'Fixed campaign pre-selection issue by cleaning up trailing whitespace in campaign names directly in the database.',
        impact: 'low'
      },
      {
        type: 'improvement',
        title: 'Data Sanitization Utility',
        description:
          'Created trimAndTransformData utility function to automatically trim whitespace from all string fields and handle type conversions (dates, numbers) before saving to database. Implemented across all campaign creation/update functions to ensure data consistency, particularly for campaign names that need to match query parameters in the donation form.',
        impact: 'high'
      }
    ]
  },
  {
    version: '1.2.1',
    date: '2026-01-21',
    changes: [
      {
        type: 'fix' as ChangeType,
        title: 'Magic Link Email Client Prefetch Issue',
        description:
          'Identified that .org email platforms (Outlook, corporate email security scanners) pre-fetch links for security scanning, consuming magic link tokens before users can click them. Documented for future auth flow improvements.',
        impact: 'medium' as ImpactLevel
      },
      {
        type: 'feature' as ChangeType,
        title: 'Dedicated Auth Error Page',
        description:
          'Created a separate authentication error page with space-themed messaging to handle auth errors cleanly, preventing false positive error logging on the login page.',
        impact: 'medium' as ImpactLevel
      },
      {
        type: 'feature' as ChangeType,
        title: 'Capital Campaign Page',
        description:
          'Built modern Capital Campaign page featuring hero section, video modal with play button overlay, renderings gallery with lightbox, animated progress bar, and full dark/light mode support.',
        impact: 'high' as ImpactLevel
      },
      {
        type: 'feature' as ChangeType,
        title: 'Capital Campaign Floating Tab',
        description:
          'Added a floating side tab component for homepage visibility, featuring vertical text, hover preview with campaign progress, and dismiss functionality.',
        impact: 'medium' as ImpactLevel
      },
      {
        type: 'improvement' as ChangeType,
        title: 'Middleware Auth Redirect',
        description:
          'Updated middleware to include /auth/login in matcher, redirecting authenticated users away from the login page to prevent token verification race conditions.',
        impact: 'medium' as ImpactLevel
      },
      {
        type: 'fix' as ChangeType,
        title: 'Server Action Caching Fix',
        description:
          'Removed unstable_cache wrappers from create, update, and delete server actions (team members, admin users) that were incorrectly caching mutation operations and preventing real-time updates.',
        impact: 'high' as ImpactLevel
      }
    ]
  },
  {
    version: '1.2.0',
    date: '2026-01-19',
    changes: [
      {
        type: 'feature' as ChangeType,
        title: 'Server Actions for CRUD Operations',
        description:
          'Added server actions to create, update, and delete News, Newsletters, Contact Submissions (Volunteer & Contact Form), Club Resources, and Job Applications, streamlining backend operations and improving admin workflow.',
        impact: 'high' as ImpactLevel
      },
      {
        type: 'feature' as ChangeType,
        title: 'Expanded Donation Form',
        description:
          'Added new fields to the donation form including additional donor information, campaign selection, and optional notes, enabling more detailed contributions tracking.',
        impact: 'medium' as ImpactLevel
      },
      {
        type: 'improvement' as ChangeType,
        title: 'Updated Home Programs Cards',
        description:
          'Refreshed the Home Programs cards to use the brand colors, improving visual consistency and brand recognition across the site.',
        impact: 'low' as ImpactLevel
      },
      {
        type: 'feature' as ChangeType,
        title: 'Generic Drag List Component',
        description:
          'Created a reusable drag-and-drop list component for admin interfaces, allowing easy reordering of items across multiple lists with intuitive drag interactions.',
        impact: 'medium' as ImpactLevel
      },
      {
        type: 'feature' as ChangeType,
        title: 'ThemeProvider for Dark/Light Mode',
        description:
          'Implemented a ThemeProvider that automatically detects users’ system dark or light mode preferences and applies the corresponding theme across the application.',
        impact: 'medium' as ImpactLevel
      }
    ]
  },
  {
    version: '1.1.1',
    date: '2026-01-16',
    changes: [
      {
        type: 'feature',
        title: 'Enhanced Donation Form',
        description:
          'Expanded donation form with comprehensive donor information collection. Added address fields (street, city, state, ZIP, country), campaign selection dropdown with multiple fundraising options, and optional message/notes field for donor comments.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Admin Navigation Updates',
        description:
          'Added Changelog to Management section of admin navigation. Updated sidebar styling for better dark/light mode contrast and readability.',
        impact: 'low'
      }
    ]
  },
  {
    version: '1.1.0',
    date: '2026-01-16',
    changes: [
      {
        type: 'feature',
        title: 'Stories Page Combined',
        description:
          'Consolidated News and Honorees sections into a single Stories page. Users can now browse news, award winners, and community recognition in one unified experience.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Floating Donate Button',
        description:
          'Added animated floating donation button with modal menu. Features pulsing hover effects, preset donation amounts, and impact statistics.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Volunteer Drawer Component',
        description:
          'Replaced dedicated volunteer page with slide-out drawer. Includes benefits, steps, requirements, and direct CTA for applications.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Capital Campaign Drawer',
        description:
          'Moved capital campaign information into a drawer component accessible from various pages. Includes goals, timeline, and impact statistics.',
        impact: 'low'
      },
      {
        type: 'feature',
        title: 'Modernized Honorees Page',
        description:
          'Complete redesign of honorees section with featured award winners, Hall of Fame inductees, business awards, and community recognition lists. Includes animations and dark/light mode support.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Team Page with Nested Tabs',
        description:
          'New team page featuring Board of Directors and Staff sections with nested tabs. Includes team member cards with contact information and professional photos.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'News Detail Page Layout',
        description:
          'Redesigned news detail page with 2-column layout. Includes sidebar with related articles and newsletter signup, improved typography and spacing.',
        impact: 'medium'
      },
      {
        type: 'bug',
        title: 'Donation Notification Cycling',
        description:
          'Fixed infinite loop in donation notification carousel. Implemented proper timer cleanup and recursive cycle function for smooth 5-second display / 15-second hide pattern.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Program Detail Pages',
        description:
          'Added individual detail pages for each program with hero images, descriptions, schedules, and enrollment information. Full dark/light mode support.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Dark Mode Support System-Wide',
        description:
          'Implemented comprehensive dark/light mode toggle across all pages and components. Updated color system to use neutral palette with sky blue accents.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Component Animations',
        description:
          'Added Framer Motion animations to all major sections including staggered item animations, scroll-triggered reveals, and smooth transitions.',
        impact: 'low'
      },
      {
        type: 'feature',
        title: 'Program Cards Component',
        description:
          'Created reusable program cards with hover effects, icons, descriptions, and CTA buttons. Used across programs page with responsive grid layout.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Events Page Creation',
        description:
          'Built comprehensive events page with featured events, upcoming events grid, calendar integration hints, and registration CTAs.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Navigation Structure',
        description:
          'Reorganized navigation to match new page structure. Added dropdown menus for Programs and News sections.',
        impact: 'medium'
      },
      {
        type: 'breaking',
        title: 'Design System Overhaul',
        description:
          'Complete redesign using modern component architecture. Moved from Webflow to Next.js with React/TypeScript. Implemented professional color system and typography.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Mobile-First Responsive Design',
        description:
          'All pages built with mobile-first approach using Tailwind CSS. Tested and optimized for mobile, tablet, and desktop viewports.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Admin Dashboard Foundation',
        description:
          'Started building admin dashboard with authentication, content management, and analytics foundations.',
        impact: 'medium'
      }
    ]
  }
]

const getChangeIcon = (type: ChangeType) => {
  switch (type) {
    case 'feature':
      return <Zap className="w-5 h-5" />
    case 'improvement':
      return <GitCommit className="w-5 h-5" />
    case 'bug':
      return <Bug className="w-5 h-5" />
    case 'breaking':
      return <AlertCircle className="w-5 h-5" />
    default:
      return <GitCommit className="w-5 h-5" />
  }
}

const getChangeColor = (type: ChangeType) => {
  switch (type) {
    case 'feature':
      return 'dark:bg-green-500/10 bg-green-100 dark:text-green-400 text-green-700 dark:border-green-500/20 border-green-300/50'
    case 'improvement':
      return 'dark:bg-blue-500/10 bg-blue-100 dark:text-blue-400 text-blue-700 dark:border-blue-500/20 border-blue-300/50'
    case 'bug':
      return 'dark:bg-red-500/10 bg-red-100 dark:text-red-400 text-red-700 dark:border-red-500/20 border-red-300/50'
    case 'breaking':
      return 'dark:bg-orange-500/10 bg-orange-100 dark:text-orange-400 text-orange-700 dark:border-orange-500/20 border-orange-300/50'
    default:
      return 'dark:bg-neutral-500/10 bg-neutral-100 dark:text-neutral-400 text-neutral-700'
  }
}

const getImpactColor = (impact: ImpactLevel) => {
  switch (impact) {
    case 'low':
      return 'dark:bg-neutral-600 bg-neutral-500 text-white text-xs'
    case 'medium':
      return 'dark:bg-sky-600 bg-sky-600 text-white text-xs'
    case 'high':
      return 'dark:bg-red-600 bg-red-600 text-white text-xs'
    default:
      return 'dark:bg-neutral-600 bg-neutral-500 text-white text-xs'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function ChangelogPage() {
  return (
    <div className="dark:bg-neutral-950 bg-white min-h-screen py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="space-y-4 mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
            Admin Panel
          </p>
          <h1 className="text-5xl md:text-6xl font-black dark:text-white text-neutral-900 leading-tight">Changelog</h1>
          <p className="text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">
            Track all updates, improvements, and bug fixes to the Boys & Girls Club of Lynn website.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-12">
          {changelogData.map((entry, entryIndex) => (
            <motion.div
              key={entry.version}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: entryIndex * 0.1 }}
              className="space-y-6"
            >
              {/* Version Header */}
              <div className="flex items-baseline gap-4 border-b dark:border-neutral-800 border-neutral-200 pb-4">
                <h2 className="text-3xl font-black dark:text-white text-neutral-900">v{entry.version}</h2>
                <time className="text-sm dark:text-neutral-400 text-neutral-600 font-medium">
                  {new Date(entry.date + 'T00:00:00')?.toLocaleDateString()}
                </time>
              </div>

              {/* Changes Grid */}
              <div className="space-y-4">
                {entry.changes.map((change, changeIndex) => (
                  <motion.div
                    key={changeIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: changeIndex * 0.05 }}
                    className="dark:bg-neutral-900/50 bg-neutral-50 rounded-xl p-5 border dark:border-neutral-800 border-neutral-200 hover:border-sky-500/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Type Icon */}
                      <div
                        className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border ${getChangeColor(
                          change.type
                        )}`}
                      >
                        {getChangeIcon(change.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold dark:text-white text-neutral-900">{change.title}</h3>
                          {/* Type Badge */}
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${getChangeColor(
                              change.type
                            )}`}
                          >
                            {change.type}
                          </span>
                          {/* Impact Badge */}
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full font-semibold capitalize ${getImpactColor(
                              change.impact
                            )}`}
                          >
                            {change.impact} impact
                          </span>
                        </div>
                        <p className="dark:text-neutral-300 text-neutral-700 text-sm leading-relaxed">
                          {change.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 pt-12 border-t dark:border-neutral-800 border-neutral-200 text-center space-y-4"
        >
          <p className="dark:text-neutral-400 text-neutral-600">Need to report a bug or suggest a feature?</p>
          <a
            href="mailto:development@bgcl.org"
            className="inline-block px-6 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
          >
            Contact Development Team
          </a>
        </motion.div>
      </div>
    </div>
  )
}
