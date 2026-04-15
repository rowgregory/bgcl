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
    version: '1.17.4',
    date: '2026-04-13',
    changes: [
      {
        type: 'fix',
        title: 'Admin Notification Email Recipients Updated',
        description:
          'Donation and ticket purchase admin notifications now route to Erica directly. All other admin notifications (volunteer forms, contact forms, job applications) continue to go to the info address.',
        impact: 'low'
      }
    ]
  },
  {
    version: '1.17.3',
    date: '2026-04-10',
    changes: [
      {
        type: 'feature',
        title: 'Notes Column Added to Donor PDF Report',
        description: 'The donor report PDF now includes a Notes column.',
        impact: 'low'
      }
    ]
  },
  {
    version: '1.17.1',
    date: '2026-04-09',
    changes: [
      {
        type: 'fix',
        title: 'Donation Admin Notification Email',
        description:
          'Admin was receiving a ticket purchase notification email when a one-time donation was processed. The webhook handler was hardcoding TICKET_PURCHASE as the notification type instead of using the dynamic orderType variable. One-time and recurring donations now correctly send their own labelled notification emails.',
        impact: 'high'
      }
    ]
  },
  {
    version: '1.17.0',
    date: '2026-04-06',
    changes: [
      {
        type: 'feature',
        title: 'Hero Studio',
        description:
          'Built a full Hero Studio admin page for managing the homepage hero section. Admins can update title, subtitle, CTA buttons, background video or image, overlay opacity, announcement strip, countdown timer, thermometer widget, and growth tree widget — all without a deployment.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Announcement Strip',
        description:
          'Added a dismissible announcement strip that sits above the entire site. Supports animated radial gradient with two admin-configurable colors, custom text, an optional link (internal or external), and session-based dismissal so it stays gone until the next visit.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Hero Countdown Widget',
        description:
          'Added a glassmorphism countdown timer widget that renders inside the hero. Admin configures the target date and label. Counts down in real time with DD/HH/MM/SS units and hides automatically when the date has passed.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Hero Thermometer Widget',
        description:
          'Added a campaign thermometer widget for the hero section. Displays a vertical fill tube with configurable goal, current amount, label, and color. Admin-configurable and self-hiding when disabled.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Hero Growth Tree Widget',
        description:
          'Added an animated SVG growth tree widget for the hero. Leaves grow in proportion to progress toward a goal. Configurable current value, goal, label, and color. Wrapped in a glassmorphism card for legibility over video backgrounds.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Hero Background — Video or Image',
        description:
          'Hero background is now fully admin-controlled. Supports video (MP4, WebM, MOV/QuickTime) or image upload via Firebase Storage with drag-and-drop, real-time progress bar, and current media preview. Overlay opacity is configurable via a range slider.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Hero CTA Buttons — Dual with Link Type',
        description:
          'Hero now supports two independently configurable CTA buttons. Each has its own text, link, and internal/external link type selector. Button 2 is optional and toggled on/off by the admin.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Hero Model & Singleton Upsert',
        description:
          'Created the Hero Prisma model with 25+ configurable fields and a singleton upsert pattern — there is always exactly one Hero row. Added getHero and getEventIds server actions. Event IDs surface as quick-insert buttons in the announcement strip link field.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Hero Height Adjusts to Active Widgets',
        description:
          'Hero section height scales dynamically based on how many widgets are active — base 800px plus 120px per active widget — so content is never clipped regardless of configuration.',
        impact: 'low'
      },
      {
        type: 'ui',
        title: 'Admin Hero Studio Layout',
        description:
          'Hero Studio uses a full-width two-column desktop layout (content + announcement left, background + countdown + widgets right) with a sticky bottom save bar. No max-width constraints — matches the admin dashboard layout pattern.',
        impact: 'low'
      }
    ]
  },
  {
    version: '1.16.0',
    date: '2026-04-06',
    changes: [
      {
        type: 'feature',
        title: 'Page Content Management System',
        description:
          'Completed full page content editing section in the admin dashboard. All frontend page text is now managed through the CMS',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Editable Page Text — All Public Pages',
        description:
          'Every heading, subheading, eyebrow label, body paragraph, button text, and metadata across all public-facing pages is now driven by CMS page data arrays. Pages covered: Home, About, Programs, Events, Campaigns, News, Partners, Get Involved, Contact, Team, Capital Campaign and Award Winners.',
        impact: 'high'
      }
    ]
  },
  {
    version: '1.15.1',
    date: '2026-03-31',
    changes: [
      {
        type: 'improvement',
        title: 'Added Seasonal Summer Position Type',
        description: 'Added YOUTH_DEVELOPMENT_WORKER to the PositionType enum for job applications.',
        impact: 'low'
      },
      {
        type: 'ui',
        title: 'Job Applications Table Redesign',
        description:
          'Rebuilt the Signal Relay transmissions view from a card grid to a compact table format. All submission details moved into a slide-in drawer on row click. Includes tabs for filtering by status and type, inline status actions, and a search bar.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Position Labels Centralized',
        description:
          'Replaced hardcoded position label strings throughout the admin UI with a shared POSITION_LABELS record keyed by PositionType enum. Ensures consistent display names across the application drawer and transmissions table.',
        impact: 'low'
      }
    ]
  },
  {
    version: '1.15.0',
    date: '2026-03-30',
    changes: [
      {
        type: 'feature',
        title: 'Casino Night Public Event Page',
        description:
          'Built a fully casino-themed public event details page for BGCL Cash Madness Casino Night featuring Vanta.js wave background, gold typography, per-ticket-type gradient cards, prize ladder, schedule, sponsor tiers, and dress code section.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Ticket Sales Window',
        description:
          'Added ticketSalesStartDate and ticketSalesEndDate to the Event model. Tickets are always addable to cart but payment is gated until sales open. Checkout form shows a live countdown and unlocks automatically at midnight on May 13th.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Casino Ticket Cards with Per-Type Gradients',
        description:
          'Redesigned ticket cards with rich saturated gradients per ticket type — red for Raffle, purple for Tournament, gold for Sponsorship, blue for General. Each card features noise overlay, shine sweep animation, suit watermark, and BGCL logo watermark.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Casino Cart Widget',
        description:
          'Added a fixed top-right cart widget with gold border, shine animation, per-item gradient suit thumbnails, quantity controls, and checkout button. Shows quick-add ticket buttons when cart is empty.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Casino Ticket Marquee',
        description:
          'Built a scrolling marquee of quick-add ticket pills that pause on hover and touch. Each pill shows the ticket name, price, and cart quantity badge. Fades on left and right edges.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Casino Sign In Prompt with Multi-Step Flow',
        description:
          'Added a contextual sign-in section that progresses through: unauthenticated → sign in with Google or magic link → enter first and last name → enter mailing address → ready to play summary with cart and checkout buttons.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Casino Intro Animation',
        description:
          'Added a full-screen intro animation that plays on page load — four suit cards fly in from the corners, then burst outward revealing the gold shimmering title with a loading bar before fading into the page.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Raffle Ticket Number Assignment in Webhook',
        description:
          'Webhook now assigns sequential raffle ticket numbers using pg_advisory_xact_lock to prevent duplicates under concurrent purchases. Each raffle OrderItem gets a unique raffleTicketNumber and raffleTicketCode in RAFF-XXXX format.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Sponsorship Tier Deadline Gating',
        description:
          'Sponsorship tickets become unavailable after the registrationDeadline on the Event model. Cards and sponsor tier section display the deadline date and show a closed state with grayscale filter after expiry.',
        impact: 'medium'
      },
      {
        type: 'ui',
        title: 'Add to Cart Toast with Quantity Controls',
        description:
          'Redesigned the add-to-cart toast notification with casino theming — gold border, gradient progress bar, per-ticket-type suit thumbnail, and inline quantity increment and decrement controls that reset the auto-dismiss timer on change.',
        impact: 'medium'
      }
    ]
  },
  {
    version: '1.14.0',
    date: '2026-03-24',
    changes: [
      {
        type: 'feature',
        title: 'Job Application Position & Background Step',
        description:
          'Added a new first step to the job application form with four new fields: position types (Seasonal Summer, Camp Counselor, Life Guard), youth organization employment history, education, and extracurricular activities & skills. These fields are also persisted to the JobApplication model.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Job Application Admin Drawer',
        description:
          'Added a slide-in drawer on the admin job applications page displaying full applicant details. Admins can now review all submitted data and update application status directly from the drawer.',
        impact: 'high'
      },
      {
        type: 'ui',
        title: 'Job Applications Table View',
        description:
          'Replaced the card grid layout on the admin job applications page with a compact table view showing applicant name, positions, employment type, submission date, and status.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Job Application Form Step Reordering',
        description:
          'Position & Background is now the first step of the job application form so applicants declare their intended role before filling out personal details.',
        impact: 'low'
      },
      {
        type: 'ui',
        title: 'Job Application Detail Page Updated',
        description:
          'Updated the /get-involved/[jobApplicationId] page to display the four new Position & Background fields — position types, youth organization employment, education, and extracurricular skills — above the existing personal information section.',
        impact: 'low'
      }
    ]
  },
  {
    version: '1.13.0',
    date: '2026-03-18',
    changes: [
      {
        type: 'bug',
        title: 'Date Object Crashing Events Admin List',
        description:
          'Fixed React error "Objects are not valid as a React child" on the events admin list — AdminListItem was rendering item.date directly as a fallback description. Wrapped in toLocaleDateString() to convert Date object to string.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Removed revalidateTag from Server Actions',
        description:
          'Removed all revalidateTag calls from server actions across the codebase — components use router.refresh() for revalidation, keeping cache invalidation consistent and avoiding tag mismatch issues.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Partners Section — Tier-Based Reordering',
        description:
          'Added createMultiRolePartnerPage component to the Partners admin section — each tier (Foundation, Corporate & Business, Government & Public, Community & Program) now has its own independently reorderable list, replacing the single flat partner list.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'The Library Subnav Horizontal Scroll',
        description:
          'Fixed The Library subnav links getting cut off on desktop — added explicit width calc(100vw - 400px) accounting for sidebar, ref-based wheel event handler for Magic Trackpad horizontal scroll support.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Decimal Serialization in getDonationStats',
        description:
          'Fixed feesCovered Decimal not serializable in getDonationStats — serialized at the source orders map so all derived calculations including stats, trendData, campaigns, and failedOrders automatically use serialized values.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'getEvents Serialization',
        description: 'Added ticket price Decimal serialization to getEvents server action.',
        impact: 'low'
      }
    ]
  },
  {
    version: '1.12.0',
    date: '2026-03-17',
    changes: [
      {
        type: 'feature',
        title: 'Ticket Purchase Checkout',
        description:
          'Built full checkout flow for ticket purchases — contact, billing, address fields, Stripe CardElement, saved card selection, cover fees toggle, save card toggle, and Pusher listener for order confirmation.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Saved Cards at Checkout',
        description:
          'Logged-in users with saved payment methods see their cards at checkout with a Use a Different Card option. Saved card purchases are confirmed server-side, new cards confirmed client-side.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Order Confirmation Page',
        description:
          'Built OrderConfirmationPage and OrderConfirmationClient showing receipt with ticket line items, subtotal, processing fees, total, confirmation email note, and Back to Home / Donate Again actions.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Ticket Purchase Webhook Handler',
        description:
          'Added TICKET_PURCHASE handling in payment_intent.succeeded webhook — creates Order, creates OrderItems, increments quantitySold, updates ticket availability, and adds user to event attendees with duplicate guard.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Add to Cart Toast',
        description:
          'Built AddToCartToast component powered by Redux — shows ticket name, event title, price, quantity, animated progress bar auto-dismiss, View Cart with live count badge, and Checkout shortcut.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Supporter Dashboard Ticket Orders',
        description:
          'Built ticket orders section in supporter dashboard grouping purchases by event server-side using deep copy reduce to prevent mutation of ticketOrders array.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Upcoming Events Section',
        description:
          'Added upcoming events section to supporter dashboard showing grouped ticket purchases per event with ticket types and quantities, filtered to future events only.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'getSupporterDashboard Server Action',
        description:
          'Built getSupporterDashboard returning donation orders, ticket orders, upcoming events, stats array, recent donations, monthly/yearly amounts, total spend, and join year.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Event Performance Dashboard Cards',
        description:
          'Added event performance card grid to events dashboard showing revenue, tickets sold vs capacity, attendee count, orders, animated capacity bar, and percentage of total revenue per event.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Ticket Type Breakdown Pie Chart',
        description:
          'Added donut pie chart to events dashboard showing ticket type breakdown by quantity sold and revenue, with inline breakdown list replacing labels to prevent clipping on resize.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Ticket Sales Scatter Chart',
        description:
          'Added scatter chart to events dashboard plotting tickets sold vs revenue per event, with bubble size scaled by revenue and custom tooltip showing event name, tickets, attendees, and revenue.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Checkout Page Redesign',
        description:
          'Redesigned checkout from split-screen to single-column header with two-column content matching the BGCL donate page aesthetic — order summary on left, payment form on right.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Checkout Form Reorganized',
        description:
          'Merged Contact and Billing into one fieldset, moved cover fees toggle inside Payment fieldset above submit, removed country field hardcoded to US, updated state input to STATES select dropdown.',
        impact: 'low'
      },
      {
        type: 'improvement',
        title: 'Unique Attendee Count',
        description:
          'Fixed attendeeCount incrementing on every ticket purchase — now checks if user is already an attendee before incrementing, and totalAttendees stat uses unique email count.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Decimal Serialization Across BGCL Actions',
        description:
          'Fixed Decimal objects not serializable for client components across getCapsuleOverview, getCapsuleTransactions, getSupporterDashboard, getOrder, getDonations, and getMyDonations.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'createPaymentIntentForCheckout Refactored',
        description:
          'Extracted getOrCreateStripeCustomer and validateSavedCard into standalone utilities, reducing createPaymentIntentForCheckout to metadata assembly and intent creation only.',
        impact: 'low'
      },
      {
        type: 'improvement',
        title: 'Cover Fees Calculation Fixed',
        description:
          'Switched from simple 2.9% + $0.30 formula to reverse formula (amount + 0.30) / (1 - 0.022) - amount ensuring the org nets the full donation amount after Stripe takes their cut.',
        impact: 'medium'
      },
      {
        type: 'fix',
        title: 'Event Date/Time Timezone Fix',
        description:
          'Fixed date input using toISOString() which treated local time as UTC, shifting dates by timezone offset. Replaced with local time component extraction in formatDateForInput and formatTimeForInput.',
        impact: 'high'
      },
      {
        type: 'fix',
        title: 'Ticket Order Grouping Mutation Bug',
        description:
          'Fixed upcomingEvents reduce mutating original ticketOrders array via shallow copy — switched to deep copy using map with object spread so ticket order quantities display correctly.',
        impact: 'high'
      },
      {
        type: 'fix',
        title: 'Duplicate Attendee Grouping',
        description:
          'Fixed attendee list showing the same user multiple times — grouped by email in both the attendee tab reduce and the upcoming events useMemo.',
        impact: 'medium'
      },
      {
        type: 'fix',
        title: 'feesCovered Decimal Truncation',
        description:
          'Fixed feesCovered saving as integer (e.g. 2 instead of 2.56) — changed Order model feesCovered from Int to Decimal and updated webhook to use parseFloat instead of parseInt.',
        impact: 'medium'
      },
      {
        type: 'ui',
        title: 'Ticket Availability Card Redesign',
        description:
          'Updated unavailable ticket styling — removed opacity-60, added subtle background treatment, moved status badge inline with title, and added tickets sold count display.',
        impact: 'low'
      },
      {
        type: 'ui',
        title: 'Event Status Badge in Drag List',
        description:
          'Replaced plain text event status with color-coded badge — UPCOMING sky, ONGOING green, COMPLETED neutral, CANCELLED red, POSTPONED amber, ARCHIVED purple.',
        impact: 'low'
      },
      {
        type: 'ui',
        title: 'Session Indicator at Checkout',
        description:
          'Added signed-in user display at checkout header showing avatar icon and email, with Not you? sign out button with loading spinner.',
        impact: 'low'
      }
    ]
  },
  {
    version: '1.11.0',
    date: '2026-03-11',
    changes: [
      {
        type: 'feature',
        title: 'Partners Page',
        description:
          'New public-facing partners page with featured spotlight section, uniform partner grid, and a become-a-partner CTA.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Partner Admin Form',
        description: 'Full CRUD form for managing partners including name, logo, URL, and active/featured toggles.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Responsive Header Navigation',
        description:
          'Nav links now disappear one at a time as the viewport shrinks using a priority system and intermediate breakpoints (lg-2, lg-3, xl-2), replacing the all-or-nothing 2xl threshold.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Custom Breakpoints',
        description:
          'Added lg-2 (1100px), lg-3 (1160px), and xl-2 (1380px) to the @theme block in globals.css to support granular responsive header nav behavior.',
        impact: 'low'
      },
      {
        type: 'improvement',
        title: 'Image Upload Limits',
        description:
          'Increased max file size to 10MB and explicitly specified allowed types (JPEG, PNG, WebP, GIF, SVG) in the ImageUpload component accept attribute.',
        impact: 'low'
      }
    ]
  },
  {
    version: '1.10.3',
    date: '2026-03-10',
    changes: [
      {
        type: 'feature',
        title: 'Program PDF Link & Description',
        description:
          'Added pdfLink and pdfDescription fields to the Program model. Admins can now attach an additional PDF URL and a short description to any program. The PDF section renders on the program detail page between the about section and the weekly themes grid, conditionally shown only when both fields are populated.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Program Server Actions Updated',
        description:
          'Updated createProgram and updateProgram server actions to handle the new pdfLink and pdfDescription fields. Both fields are optional strings passed through from the admin form inputs.',
        impact: 'low'
      },
      {
        type: 'ui',
        title: 'Admin Program Form — PDF Inputs',
        description:
          'Added a new PDF section to the admin program drawer with a URL input for the PDF link and an input for the PDF description. Both fields wire into the existing handleInput and formSlice pattern.',
        impact: 'low'
      },
      {
        type: 'ui',
        title: 'Admin Program List — View Button',
        description:
          'Added a view button to each program row in the admin programs list that opens the live program detail page in a new tab.',
        impact: 'low'
      },
      {
        type: 'feature',
        title: 'Event Archiving',
        description:
          'Added the ability to archive events from the admin dashboard. Archived events are hidden from the public-facing events list but remain in the database for record keeping. Includes an archive toggle button on each event row and a filter in the admin events list to view archived events.',
        impact: 'medium'
      }
    ]
  },
  {
    version: '1.10.2',
    date: '2026-03-06',
    changes: [
      {
        type: 'bug',
        title: 'Fixed Ghost One-Time Donation Orders on Subscription Renewal',
        description:
          'Replaced multi-guard webhook logic with a single metadata check — if a PaymentIntent has no orderType in its metadata it is skipped entirely, since all manual PaymentIntents always include orderType and Stripe-generated subscription PaymentIntents never do.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Stripe Duplicate Customer Prevention',
        description:
          'Updated createStripeCustomer, createSetupIntentForSubscription, and getSetupIntentClientSecret to check Stripe by email before creating a new customer, preventing duplicate customer records across all payment flows.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Supporter Ticket Orders Page',
        description:
          'Added /supporter/tickets page showing all ticket purchases grouped by event with event name, date, ticket line items, quantities, and order totals. Includes getTicketOrders server action.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Subscription-Linked Card Deletion Warning',
        description:
          'Added isCardLinkedToSubscription server action that checks if a specific payment method is attached to an active recurring donation. Attempting to delete a linked card now opens a warning modal directing the user to cancel their subscription first.',
        impact: 'medium'
      },
      {
        type: 'bug',
        title: 'Fixed Duplicate Payment Method Saves on One-Time Checkout',
        description:
          'Added a ref guard to the Pusher order-created listener to prevent savePaymentMethod from firing more than once per order. Also replaced channel.unbind with channel.unbind_all and pusher.unsubscribe to ensure full cleanup.',
        impact: 'medium'
      },
      {
        type: 'ui',
        title: 'Supporter Overview Redesign',
        description:
          'Replaced tall CTA cards with compact inline banners, added empty states with CTAs for Donation History and Events sections, added ticket orders section with event name and date above ticket line items, and updated stats grid to 2-col mobile layout.',
        impact: 'medium'
      }
    ]
  },
  {
    version: '1.10.1',
    date: '2026-03-03',
    changes: [
      {
        type: 'bug',
        title: 'Ghost One-Time Donation Orders on Subscription Payments',
        description:
          "Fixed a critical issue where Stripe's payment_intent.succeeded webhook was creating ghost ONE_TIME_DONATION orders for every recurring subscription charge. Root cause was twofold: subscription metadata was missing orderType and donationType fields (causing the metadata guard to not fire), and Stripe's 2025-08-27.basil API no longer populates the invoice field on PaymentIntent webhook payloads synchronously. The fix adds orderType: 'RECURRING_DONATION' and donationType: frequency to both createSubscriptionAfterSetup and createSubscriptionWithSavedCard metadata, and adds a fallback guard that queries stripe.invoices.list({ payment_intent }) to detect and skip subscription-related payment intents.",
        impact: 'high'
      },
      {
        type: 'bug',
        title: 'Recurring Donation Orders Not Being Created on Renewal',
        description:
          'The handleInvoicePaymentSucceeded webhook handler was silently returning early on every renewal because it was reading subscriptionId from invoiceWithSub.subscription — a field that no longer exists in the basil API. Subscription ID is now correctly read from invoiceWithSub.parent.subscription_details.subscription.',
        impact: 'high'
      },
      {
        type: 'bug',
        title: 'Unique Constraint Violation on Recurring Donation Renewals',
        description:
          'The Order model had a @unique constraint on stripeSubscriptionId, which prevented more than one order record per subscription. This caused all renewal charges after the first to fail with a Prisma unique constraint error. The constraint has been removed — multiple order records per subscription are now correctly created to represent each individual payment in the donation history.',
        impact: 'high'
      },
      {
        type: 'bug',
        title: 'Subscription Status Update and Cancellation Handlers Failing',
        description:
          'handleSubscriptionUpdated and handleSubscriptionDeleted were using prisma.order.update({ where: { stripeSubscriptionId } }) which became invalid after removing the @unique constraint. Both handlers now use findFirst to locate the latest order by subscription ID before updating. handleSubscriptionDeleted was also updated to use updateMany with a PENDING status filter — confirmed CONFIRMED payments are preserved and not retroactively marked as CANCELLED.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Fuel Tank Consolidated into Single Transactions Page',
        description:
          'Replaced the three separate Fuel Tank pages (One-Time, Monthly, Yearly) with a single unified transactions page. Now features filter buttons for All / One-Time / Monthly / Yearly and campaign-based filtering, with all data sourced directly from the Order table.',
        impact: 'medium'
      }
    ]
  },
  {
    version: '1.10.0',
    date: '2026-02-27',
    changes: [
      {
        type: 'feature',
        title: 'useOverlayAccessibility hook',
        description:
          'Extracted modal/drawer focus management into a reusable hook. Handles body scroll lock, focus trapping, and focus restoration on close.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Picture component ADA updates',
        description:
          'Added decorative prop that automatically sets alt="" and aria-hidden="true" for purely visual images. Exposed sizes, role, and className as optional props with sensible defaults.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Header ADA compliance',
        description:
          'Added skip navigation link, header landmark, aria-expanded and aria-controls on burger menu, aria-current="page" on active nav links, focus rings on all interactive elements, and new tab warnings on external links.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Hero section ADA compliance',
        description:
          'Added pause/play control for autoplay video per WCAG 2.2.2, aria-hidden on decorative elements, motion-safe animation guards, darkened overlay for contrast compliance, and focus rings on CTA buttons.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'HomePrograms ADA compliance',
        description:
          'Converted program grid from div to ul/li landmark list, added aria-labelledby on section, aria-current on active links, aria-hidden on decorative overlays and animated SVGs, and focus rings on all card links.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'MissionSection ADA compliance',
        description:
          'Added section landmark with aria-labelledby, focus rings on CTA buttons, aria-hidden on Heart icon, and optional chaining on all mission data fields to prevent empty element announcements.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'FacilitySection ADA compliance',
        description:
          'Replaced fragment with section landmark, added carousel role and aria-roledescription, dynamic prev/next button labels announcing target slide number, role="tablist" on dots with aria-selected states, and replaced MotionLink wrapping button with a single Link element.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'CapitalCampaignTab ADA compliance',
        description:
          'Added aria-label covering full campaign context for screen readers, onFocus/onBlur handlers for keyboard users, role="progressbar" with aria-valuenow on both progress bars, aria-expanded and aria-controls on mobile disclosure widget, and aria-hidden on all decorative elements.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'DonationNotification ADA compliance',
        description:
          'Added role="status", aria-live="polite", and aria-atomic="true" on both desktop and mobile notifications, aria-hidden on decorative icons and progress bars, arrow characters wrapped in aria-hidden spans, and new tab warnings on external links.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'RegistrationModal ADA compliance',
        description:
          'Added role="dialog", aria-modal="true", aria-labelledby, and aria-describedby. Implemented full focus trap with Tab/Shift+Tab cycling and Escape to close. Focus moves to close button on open and returns to trigger element on close.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Footer ADA compliance',
        description:
          'Added footer landmark, useId for stable IDs, visible email label, fieldset and legend for radio group, role="alert" on error banner, role="status" on success banner, aria-invalid and aria-describedby on email input, disabled state on submit during loading, and aria-hidden on decorative SVGs.',
        impact: 'medium'
      },
      {
        type: 'fix',
        title: 'Duplicate logo screen reader announcement',
        description:
          'Light and dark mode logo pairs across header, footer, and modal now use the decorative prop on the dark variant to prevent screen readers from announcing the organization name twice.',
        impact: 'medium'
      },
      {
        type: 'fix',
        title: 'Framer Motion scroll offset warning',
        description:
          'Removed scale-based motion.div elements from DonationNotification that were triggering Framer Motion positioning warnings. Progress bars and icon pulse replaced with CSS or static elements.',
        impact: 'low'
      },
      {
        type: 'performance',
        title: 'Program card image priority loading',
        description:
          'Changed priority={true} on all program cards to priority={index < 3} so only above-the-fold images are eagerly loaded. Remaining images lazy load as the user scrolls.',
        impact: 'medium'
      },
      {
        type: 'ui',
        title: 'Framer Motion added to Hero section',
        description:
          'Added parallax scroll on video and content layers, staggered fade-up entrance for heading, body text, and buttons, spring animations on CTA button hover and tap, and fade-in on pause/play control.',
        impact: 'low'
      }
    ]
  },
  {
    version: '1.9.2',
    date: '2026-02-25',
    changes: [
      {
        type: 'improvement',
        title: 'Replaced Harness Donation Links',
        description:
          'Removed all external Harness links and replaced them with in-app donate links using campaign query params to route to the correct campaign.',
        impact: 'high'
      },
      {
        type: 'ui',
        title: 'Newsletter Year Grouping',
        description:
          'Newsletters are now grouped by year with a header, horizontal rule, and issue count badge. Years are sorted newest first.',
        impact: 'medium'
      }
    ]
  },
  {
    version: '1.9.1',
    date: '2026-02-05',
    changes: [
      {
        type: 'feature',
        title: 'PDF Donation Report Generation',
        description:
          'Added ability to generate and download comprehensive donation reports as PDF files with summary statistics, campaign breakdowns, and detailed transaction tables.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Server Action for Report Generation',
        description:
          'Created generateDonationsReport server action to handle donation data processing and PDF generation on the server side.',
        impact: 'medium'
      },
      {
        type: 'fix',
        title: 'PDF AutoTable Integration',
        description:
          'Fixed jsPDF autoTable implementation by using the correct function syntax autoTable(doc, options) instead of doc.autoTable(options).',
        impact: 'medium'
      }
    ]
  },
  {
    version: '1.9.0',
    date: '2026-02-05',
    changes: [
      {
        type: 'feature',
        title: 'Auto-Account Creation for Recurring Donors',
        description:
          'Guest users creating recurring donations now automatically receive user accounts with their email and name. Accounts are created server-side during subscription setup, enabling full donation management and payment method tracking.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Automatic Payment Method Saving',
        description:
          'Payment methods used for recurring donations are automatically saved to user accounts, allowing donors to manage their cards and view payment history without manual setup.',
        impact: 'high'
      },
      {
        type: 'fix',
        title: 'Corrected Stripe Subscription Webhook Flow',
        description:
          'Fixed critical issue where orders were created on subscription.created instead of invoice.payment_succeeded, causing duplicate charges and missing payment intent IDs. Orders now create only when actual payment occurs.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Enhanced Subscription Status Tracking',
        description:
          'Implemented comprehensive subscription status webhook handlers (updated, deleted) to keep database in sync with Stripe. Automatically updates order status when subscriptions are cancelled, past due, or unpaid.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Unified Order Retrieval by Email',
        description:
          'Users can now view all their orders (both authenticated and guest) by matching either userId or customerEmail, providing complete donation history after account creation.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Idempotency Key Protection',
        description:
          'Added idempotency keys to all Stripe subscription creation calls to prevent duplicate subscriptions from network retries or double-clicks.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Production-Ready Webhook Logging',
        description:
          'Replaced all console.log statements with structured database logging using createLog, providing comprehensive audit trails for all webhook events, errors, and subscription lifecycle changes.',
        impact: 'low'
      },
      {
        type: 'fix',
        title: 'Next Billing Date Calculation',
        description:
          'Fixed invalid Date errors by using invoice.period_end instead of subscription.current_period_end, which was missing from Stripe API responses.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Payment Method Deletion Protection',
        description:
          'Enhanced payment method deletion with validation preventing users from removing default cards when active recurring subscriptions exist, with clear error messaging.',
        impact: 'low'
      }
    ]
  },
  {
    version: '1.8.6',
    date: '2026-02-04',
    changes: [
      {
        type: 'ui',
        title: 'Failed Payment Status Styling',
        description:
          'Added visual indicators for failed one-time donation payments with red warning badges, error states, and clear status messaging to help administrators quickly identify and resolve payment issues.',
        impact: 'high'
      },
      {
        type: 'ui',
        title: 'LinkedIn Social Media Integration',
        description:
          'Replaced YouTube social media icon with LinkedIn in the footer to better reflect professional networking presence. Maintained consistent hover effects and dark mode support across all social icons.',
        impact: 'low'
      }
    ]
  },
  {
    version: '1.8.5',
    date: '2026-02-03',
    changes: [
      {
        type: 'ui',
        title: 'Social Media Integration',
        description:
          'Added Facebook, Instagram, and YouTube social media icons to the footer with hover effects and dark mode support',
        impact: 'low'
      }
    ]
  },
  {
    version: '1.8.4',
    date: '2026-01-31',
    changes: [
      {
        type: 'feature',
        title: 'Mission Control Dashboard',
        description:
          'Launched comprehensive Mission Control center providing unified access to all platform analytics and management tools. Features integrated cards for Google Analytics, Google Search Console, Stripe, Hotjar, and Meta Pixel (coming soon) with direct links, credentials display, and real-time status indicators.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Tracking Infrastructure Setup',
        description:
          'Implemented Hotjar (Contentsquare) tracking for session recordings and heatmaps, organized SEO metadata and JSON-LD structured data into dedicated directory structure for better maintainability.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Extended Breakpoint System',
        description:
          'Expanded Tailwind breakpoint configuration to support ultra-wide displays up to 3200px with conventional breakpoint naming (3xl, 4xl, 5xl). Optimized dashboard grid layouts to utilize available screen space on larger monitors.',
        impact: 'low'
      },
      {
        type: 'fix',
        title: 'Welcome Animation Flash',
        description:
          'Fixed welcome animation flash on page load by initializing visibility state from localStorage immediately, preventing brief black screen display for returning users.',
        impact: 'low'
      },
      {
        type: 'ui',
        title: 'Dark Mode Consistency',
        description:
          'Ensured complete dark/light mode support across all new Mission Control components including page content editor, section collapsibles, field inputs, and preview panel with proper contrast ratios and hover states.',
        impact: 'medium'
      }
    ]
  },
  {
    version: '1.8.3',
    date: '2026-01-30',
    changes: [
      {
        type: 'improvement',
        title: 'Page Content Data Structure Refactor',
        description:
          'Refactored page content management system with cleaner data structure and improved organization. Restructured content fields into consistent format with proper typing, better section grouping, and server-side processing for optimal performance. Migrated existing content to new structure across all pages.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Site-Wide Content Reorganization',
        description:
          'Restructured multiple page sections across homepage and about page based on client feedback. Reorganized content flow for improved storytelling and user engagement, including reordering of Mission, Programs, History, and other key sections.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Google Translate Reliability Enhancement',
        description:
          'Significantly improved language translation reliability with automatic retry mechanism, multiple event triggers, and fallback page reload. Translation now works consistently with visual loading indicators and prevents duplicate translation attempts.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Donation Toast Notification Redesign',
        description:
          'Redesigned live donation notifications to focus on community building rather than dollar amounts. Changed from monetary display to supporter recognition with heart icons and social proof messaging ("just became a supporter").',
        impact: 'low'
      },
      {
        type: 'improvement',
        title: 'Top Bar Contact Information',
        description:
          'Enhanced top navigation bar with responsive display of organization contact details including phone number, physical address, and tax ID. Information progressively displays based on screen size for optimal mobile experience.',
        impact: 'low'
      },
      {
        type: 'fix',
        title: 'Toast Notification Mobile Layout',
        description:
          'Fixed toast notifications to properly sit at the top edge on mobile devices, touching both sides of the screen for better visibility and user experience.',
        impact: 'low'
      },
      {
        type: 'fix',
        title: 'Program Not Found Error Handling',
        description:
          'Added proper error handling for invalid program IDs to prevent application crashes. Implemented consistent return types and graceful 404 page display with dark/light mode support.',
        impact: 'medium'
      }
    ]
  },
  {
    version: '1.8.2',
    date: '2026-01-30',
    changes: [
      {
        type: 'feature',
        title: 'Live Stripe Integration',
        description:
          'Successfully deployed live Stripe payment processing with production API keys, webhook configuration, and real payment handling. System now accepts live donations and manages active subscriptions with proper webhook event handling.',
        impact: 'high'
      },
      {
        type: 'fix',
        title: 'Webhook Endpoint Configuration',
        description:
          'Resolved 307 redirect issue on webhook endpoint by configuring proper domain (www.bgcl.org) for Stripe webhook delivery. Webhooks now successfully receive and process all subscription and payment events.',
        impact: 'high'
      },
      {
        type: 'fix',
        title: 'Stripe Customer ID Handling',
        description:
          'Fixed empty string customer ID issue in SetupIntent creation by ensuring customer is always created before processing payments. Added proper customer creation flow for both authenticated and guest users.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Test Data Cleanup',
        description:
          'Cleared all test mode Stripe customer IDs and payment data from production database to prepare for live payment processing.',
        impact: 'low'
      }
    ]
  },
  {
    version: '1.8.1',
    date: '2026-01-30',
    changes: [
      {
        type: 'fix',
        title: 'Session Null Reference on Logout',
        description:
          'Fixed crash occurring when logging out due to components attempting to access null session data. Added proper null checks and early return guards in AdminSidebar component.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Magic Link Authentication Flow',
        description:
          'Improved magic link authentication by setting proper callback URL to ensure users are redirected to /auth/login after clicking the magic link, where middleware then routes them to their role-appropriate dashboard.',
        impact: 'medium'
      }
    ]
  },
  {
    version: '1.8.0',
    date: '2026-01-29',
    changes: [
      {
        type: 'feature',
        title: 'Subscription Cancellation System',
        description:
          'Added comprehensive subscription cancellation functionality with cancellation drawer, reason selection, feedback collection, and real-time status updates. Includes visual indicators for cancelled subscriptions throughout the admin dashboard.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Subscription Details Page',
        description:
          'Created dedicated subscription management page displaying payment history, billing information, subscription status, and cancellation controls with full mobile responsiveness.',
        impact: 'high'
      },
      {
        type: 'ui',
        title: 'Subscription Status Indicators',
        description:
          'Added visual badges and styling for subscription types and statuses (active, cancelled, failed) across donation lists and detail views with RefreshCw and XCircle icons.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Cancel Drawer UX',
        description:
          'Implemented multi-step cancellation flow with 8 predefined cancellation reasons, optional feedback textarea, loading states, and success confirmation.',
        impact: 'medium'
      }
    ]
  },
  {
    version: '1.7.1',
    date: '2026-01-28',
    changes: [
      {
        type: 'feature',
        title: 'Program Visibility Control',
        description:
          'Added isListed field to Program model with toggle in admin panel. Public facing program pages now only display programs marked as listed, while admin views show all programs for management. Optimized caching to ensure immediate visibility updates.',
        impact: 'high'
      }
    ]
  },
  {
    version: '1.7.0',
    date: '2026-01-28',
    changes: [
      {
        type: 'feature',
        title: 'Registration Modal Toggle Control',
        description:
          'Added toggle modal button in action dropdown menu allowing administrators to instantly show or hide the homepage registration modal without code changes. The modal state is stored in the page content and persists across sessions.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Modal State Management Server Actions',
        description:
          'Created server actions to toggle and retrieve modal visibility state from the home page content. Includes caching for performance with automatic cache invalidation on state changes.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Admin Email Notifications System',
        description:
          'Implemented three new admin notification email templates for volunteer applications, contact form submissions, and job applications. All notifications are sent to info@bgcl.org with applicant details and direct login links to view full submissions.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Async Action Support in Dropdown Menu',
        description:
          'Enhanced action dropdown menu to support both Redux actions and async server actions, enabling real-time server operations directly from the admin action menu dropdown interface.',
        impact: 'medium'
      },
      {
        type: 'ui',
        title: 'Professional Email Templates',
        description:
          'Designed three consistent, mobile responsive email templates matching BGCL branding for volunteer forms, contact submissions, and job applications with clear call-to-action buttons.',
        impact: 'medium'
      }
    ]
  },
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
          'Introduced new PROGRAM role for program staff with dedicated access control. Program staff have their own isolated dashboard at /program/job-applications and cannot access admin or supporter areas. Implemented complete middleware protection to enforce role-based routing.',
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
          'Enhanced authentication middleware to redirect users to appropriate dashboards based on role: ADMIN/SUPERUSER to /admin/star-map/home, PROGRAM to /program/job-applications, and SUPPORTER to /supporter/overview. Prevents cross-role navigation with automatic redirects.',
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
