'use client'

import React, { JSX, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  Search,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  FileText,
  ChevronDown,
  ChevronRight,
  Edit2,
  Check,
  ExternalLink,
  LucideIcon
} from 'lucide-react'

// Base types for field values
type FieldValue = string | number | boolean
type NestedObject = Record<string, FieldValue>
type ArrayItem = FieldValue | NestedObject
type SectionValue = FieldValue | NestedObject | ArrayItem[]

// Generic section type that can hold any structure
type Section = Record<string, SectionValue>

// Page type - each page can have completely different sections
type PageContent = Record<string, Section>

// Content structure - each page is independently defined
interface ContentStructure {
  home: PageContent
  about: PageContent
  programs: PageContent
  contact: PageContent
  events: PageContent
  donate: PageContent
}

type PageId = keyof ContentStructure

interface PageInfo {
  id: PageId
  label: string
  icon: LucideIcon
}

const StarMap: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<PageId>('home')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showPreview, setShowPreview] = useState<boolean>(true)
  const [expandedSections, setExpandedSections] = useState<string[]>(['hero', 'about', 'programs'])
  const [editingField, setEditingField] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState<boolean>(false)

  // Content structure - each page has its own unique structure
  const [content, setContent] = useState<ContentStructure>({
    home: {
      metadata: {
        title: 'Boys & Girls Club of Lynn - Home',
        description: 'Empowering youth through quality programs and services',
        keywords: 'boys girls club, youth programs, Lynn MA'
      },
      hero: {
        heading: 'Welcome to Boys & Girls Club of Lynn',
        subheading: 'Empowering youth to reach their full potential',
        ctaText: 'Join Today',
        ctaLink: '/join',
        backgroundImage: '/images/hero-bg.jpg'
      },
      about: {
        heading: 'Our Mission',
        bodyText:
          'Since 1985, the Boys & Girls Club of Lynn has been dedicated to enabling all young people, especially those who need us most, to reach their full potential as productive, caring, and responsible citizens.',
        stats: {
          yearsServing: '35+',
          membersServed: '1,200+',
          programsOffered: '15+'
        }
      },
      programs: {
        heading: 'Our Programs',
        subheading: 'Discover opportunities for growth and learning',
        list: [
          {
            name: 'Kids Club',
            description: 'Daily after-school program for elementary students',
            age: '6-12'
          },
          {
            name: 'Teen Center',
            description: 'Evening program for high school students',
            age: '14-18'
          },
          {
            name: 'Camp Creighton',
            description: 'Summer day camp with outdoor activities',
            age: '6-15'
          }
        ]
      },
      cta: {
        heading: 'Ready to Make a Difference?',
        bodyText: "Join our community and help shape the future of Lynn's youth",
        buttonText: 'Get Involved',
        buttonLink: '/donate'
      }
    },
    about: {
      metadata: {
        title: 'About Us - Boys & Girls Club of Lynn',
        description: 'Learn about our history, mission, and impact in the Lynn community',
        keywords: 'about, mission, history, community'
      },
      hero: {
        heading: 'About Our Club',
        subheading: "Building great futures for Lynn's youth since 1985"
      },
      history: {
        heading: 'Our History',
        bodyText:
          'The Boys & Girls Club of Lynn was founded in 1985 with a simple mission: to provide a safe, positive environment where young people can learn, grow, and thrive.',
        timeline: [
          '1985 - Club founded',
          '1990 - First expansion',
          '2000 - Reached 500 members',
          '2010 - New facility opened',
          '2020 - Virtual programs launched'
        ]
      },
      mission: {
        heading: 'Our Mission',
        bodyText:
          'To enable all young people, especially those who need us most, to reach their full potential as productive, caring, and responsible citizens.'
      },
      values: {
        heading: 'Our Core Values',
        list: ['Integrity', 'Respect', 'Excellence', 'Innovation', 'Community']
      },
      team: {
        heading: 'Leadership Team',
        description: 'Meet the dedicated professionals who make our mission possible',
        memberCount: '12 staff members'
      }
    },
    programs: {
      metadata: {
        title: 'Programs - Boys & Girls Club of Lynn',
        description: 'Explore our youth programs including Kids Club, Teen Center, and Camp Creighton',
        keywords: 'programs, kids club, teen center, summer camp'
      },
      hero: {
        heading: 'Our Programs',
        subheading: 'Experience our club, explore opportunities'
      },
      intro: {
        bodyText:
          'We offer a variety of programs designed to support the holistic development of young people. From academic enrichment to sports and arts, we provide opportunities for every child to discover their passion and develop essential life skills.'
      },
      categories: {
        heading: 'Program Categories',
        list: [
          {
            category: 'Education & Career',
            programs: 'Homework help, tutoring, STEM, college prep',
            icon: 'book'
          },
          {
            category: 'Health & Wellness',
            programs: 'Sports, fitness, nutrition education',
            icon: 'heart'
          },
          {
            category: 'Character & Leadership',
            programs: 'Youth leadership, community service',
            icon: 'star'
          },
          {
            category: 'The Arts',
            programs: 'Music, dance, visual arts, drama',
            icon: 'palette'
          }
        ]
      },
      schedule: {
        heading: 'Weekly Schedule',
        hours: 'Monday - Friday: 2:30 PM - 8:00 PM',
        weekend: 'Saturday: 9:00 AM - 5:00 PM'
      }
    },
    contact: {
      metadata: {
        title: 'Contact Us - Boys & Girls Club of Lynn',
        description: 'Get in touch with the Boys & Girls Club of Lynn',
        keywords: 'contact, location, hours, phone'
      },
      hero: {
        heading: 'Get in Touch',
        subheading: "We'd love to hear from you"
      },
      info: {
        address: '580 Lynnfield Street, Lynn, MA 01904',
        phone: '(781) 592-5437',
        email: 'info@bgclynn.org',
        hours: 'Monday - Friday: 2:30 PM - 8:00 PM'
      },
      directions: {
        heading: 'Directions',
        byBus: 'Take Route 441 or 442 to Lynnfield Street',
        parking: 'Free parking available on-site',
        accessibility: 'Wheelchair accessible entrance on main level'
      },
      map: {
        embedUrl: 'https://maps.google.com/...',
        showMap: true
      }
    },
    events: {
      metadata: {
        title: 'Events - Boys & Girls Club of Lynn',
        description: 'Upcoming events and activities at the Boys & Girls Club',
        keywords: 'events, activities, fundraisers, calendar'
      },
      hero: {
        heading: 'Upcoming Events',
        subheading: 'Join us for exciting activities and fundraisers',
        highlightText: 'Check back often for new events!'
      },
      featured: {
        eventName: 'Summer Gala 2024',
        date: 'July 15, 2024',
        time: '6:00 PM - 11:00 PM',
        location: 'Lynn Auditorium',
        description: 'Annual fundraising gala with dinner, dancing, and silent auction',
        ticketPrice: '$50',
        ticketsAvailable: true
      },
      calendar: {
        heading: 'Event Calendar',
        viewType: 'month',
        showPastEvents: false
      },
      newsletter: {
        heading: 'Stay Updated',
        bodyText: 'Subscribe to our newsletter to get event notifications',
        ctaText: 'Subscribe Now'
      }
    },
    donate: {
      metadata: {
        title: 'Donate - Boys & Girls Club of Lynn',
        description: 'Support the Boys & Girls Club of Lynn through donations',
        keywords: 'donate, support, fundraising, give'
      },
      hero: {
        heading: 'Support Our Mission',
        subheading: "Your donation makes a lasting impact on Lynn's youth",
        impactStatement: 'Every dollar helps us serve more children'
      },
      impact: {
        heading: 'Your Impact',
        amounts: [
          {
            amount: '$25',
            impact: 'Provides supplies for one child for a month'
          },
          {
            amount: '$100',
            impact: 'Sponsors one child in our summer camp'
          },
          {
            amount: '$500',
            impact: 'Funds a scholarship for a full year'
          },
          {
            amount: '$1,000',
            impact: 'Supports program development and expansion'
          }
        ]
      },
      methods: {
        heading: 'Ways to Give',
        list: [
          'One-time donation',
          'Monthly recurring gift',
          'Corporate sponsorship',
          'Legacy giving',
          'In-kind donations'
        ]
      },
      taxInfo: {
        heading: 'Tax Information',
        taxId: 'EIN: 04-1234567',
        deductible: 'All donations are tax-deductible',
        receiptInfo: 'You will receive a receipt via email'
      },
      testimonial: {
        quote: 'This club changed my life and gave me opportunities I never thought possible.',
        author: 'Former Member',
        year: 'Class of 2020'
      }
    }
  })

  const pages: PageInfo[] = [
    { id: 'home', label: 'Home Page', icon: Globe },
    { id: 'about', label: 'About Us', icon: FileText },
    { id: 'programs', label: 'Programs', icon: FileText },
    { id: 'contact', label: 'Contact', icon: FileText },
    { id: 'events', label: 'Events', icon: FileText },
    { id: 'donate', label: 'Donate', icon: FileText }
  ]

  const toggleSection = (sectionId: string): void => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    )
  }

  const handleEdit = (section: string, field: string, value: string): void => {
    setContent((prev) => {
      const currentPage = prev[selectedPage]
      const currentSection = currentPage[section as keyof typeof currentPage]

      if (typeof currentSection === 'object' && currentSection !== null) {
        return {
          ...prev,
          [selectedPage]: {
            ...currentPage,
            [section]: {
              ...currentSection,
              [field]: value
            }
          }
        }
      }

      return prev
    })
    setHasChanges(true)
  }

  const handleSave = (): void => {
    // Here you would save to your database
    setHasChanges(false)
    alert('Content saved successfully!')
  }

  const handleReset = (): void => {
    if (window.confirm('Are you sure you want to discard all changes?')) {
      // Reset to original content from database
      setHasChanges(false)
    }
  }

  const renderField = (
    section: string,
    fieldName: string,
    value: string,
    type: 'text' | 'textarea' = 'text'
  ): JSX.Element => {
    const fieldId = `${section}-${fieldName}`
    const isEditing = editingField === fieldId

    return (
      <div key={fieldId} className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-neutral-400">
            {fieldName.charAt(0).toUpperCase() + fieldName.replace(/([A-Z])/g, ' $1').slice(1)}
          </label>
          <button
            onClick={() => setEditingField(isEditing ? null : fieldId)}
            className="p-1 hover:bg-neutral-800 rounded transition-colors"
          >
            {isEditing ? <Check className="w-4 h-4 text-green-400" /> : <Edit2 className="w-4 h-4 text-neutral-500" />}
          </button>
        </div>

        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => handleEdit(section, fieldName, e.target.value)}
            disabled={!isEditing}
            rows={4}
            className={`w-full px-3 py-2 bg-neutral-800 border rounded-lg text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isEditing ? 'border-indigo-500' : 'border-neutral-700'
            } ${!isEditing && 'cursor-not-allowed opacity-75'}`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => handleEdit(section, fieldName, e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 bg-neutral-800 border rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isEditing ? 'border-indigo-500' : 'border-neutral-700'
            } ${!isEditing && 'cursor-not-allowed opacity-75'}`}
          />
        )}

        {isEditing && <p className="text-xs text-neutral-500 mt-1">Click the checkmark to confirm changes</p>}
      </div>
    )
  }

  const renderSection = (sectionId: string, sectionData: Section): JSX.Element => {
    const isExpanded = expandedSections.includes(sectionId)

    return (
      <div key={sectionId} className="bg-neutral-900 rounded-lg border border-neutral-800 mb-4">
        <button
          onClick={() => toggleSection(sectionId)}
          className="w-full flex items-center justify-between p-4 hover:bg-neutral-800/50 transition-colors rounded-lg"
        >
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-neutral-400" />
            )}
            <h3 className="text-base font-semibold text-white capitalize">
              {sectionId.replace(/([A-Z])/g, ' $1')} Section
            </h3>
          </div>
          <span className="text-xs text-neutral-500">{Object.keys(sectionData).length} fields</span>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 space-y-2">
                {Object.entries(sectionData).map(([field, value]) => {
                  if (typeof value === 'string') {
                    return renderField(sectionId, field, value, value.length > 100 ? 'textarea' : 'text')
                  } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    return (
                      <div key={field} className="ml-4 pl-4 border-l-2 border-neutral-800">
                        <h4 className="text-sm font-medium text-neutral-400 mb-3 capitalize">{field}</h4>
                        {Object.entries(value as Record<string, unknown>).map(([subField, subValue]) => (
                          <div key={subField}>
                            {typeof subValue === 'string' &&
                              renderField(sectionId, `${field}.${subField}`, subValue, 'text')}
                          </div>
                        ))}
                      </div>
                    )
                  } else if (Array.isArray(value)) {
                    return (
                      <div key={field} className="ml-4 pl-4 border-l-2 border-neutral-800">
                        <h4 className="text-sm font-medium text-neutral-400 mb-3 capitalize">{field}</h4>
                        {value.map((item, index) => (
                          <div key={index} className="mb-4 p-3 bg-neutral-800/50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-neutral-500">Item {index + 1}</span>
                            </div>
                            {typeof item === 'string'
                              ? renderField(sectionId, `${field}[${index}]`, item, 'text')
                              : Object.entries(item as Record<string, unknown>).map(([itemField, itemValue]) => (
                                  <div key={itemField}>
                                    {typeof itemValue === 'string' &&
                                      renderField(sectionId, `${field}[${index}].${itemField}`, itemValue, 'text')}
                                  </div>
                                ))}
                          </div>
                        ))}
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentPageContent: any = content[selectedPage]

  return (
    <div className="min-h-screen bg-neutral-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with StarMap Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-to-br from-indigo-600 to-purple-600 rounded-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Star Map</h1>
                <p className="text-sm text-neutral-400">Frontend Content Management</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors border border-neutral-700"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="hidden sm:inline">Preview</span>
              </button>
              {hasChanges && (
                <>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors border border-neutral-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Page Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 mb-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {pages.map((page) => {
              const Icon = page.icon
              return (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page.id)}
                  className={`flex items-center gap-3 p-4 rounded-lg font-medium transition-all duration-200 ${
                    selectedPage === page.id
                      ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{page.label}</span>
                  <span className="sm:hidden text-xs">{page.id}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search content fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Content Editor</h2>
                <span className="text-xs text-neutral-500">{Object.keys(currentPageContent).length} sections</span>
              </div>
            </div>

            {/* Render all sections */}
            {Object.entries(currentPageContent).map(([sectionId, sectionData]) =>
              renderSection(sectionId, sectionData as Section)
            )}
          </motion.div>

          {/* Preview Panel */}
          <AnimatePresence mode="wait">
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.3 }}
                className="lg:sticky lg:top-6 h-fit"
              >
                <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">Live Preview</h2>
                    <a
                      href={`/${selectedPage === 'home' ? '' : selectedPage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      View Live <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Preview Content */}
                  <div className="bg-white rounded-lg p-6 max-h-[800px] overflow-y-auto">
                    {/* Metadata Preview */}
                    {'metadata' in currentPageContent && currentPageContent.metadata && (
                      <div className="mb-6 pb-6 border-b border-neutral-200">
                        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                          SEO Metadata
                        </h3>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-neutral-900">{currentPageContent.metadata.title}</p>
                          <p className="text-xs text-neutral-600">{currentPageContent.metadata.description}</p>
                        </div>
                      </div>
                    )}

                    {/* Hero Preview */}
                    {'hero' in currentPageContent && currentPageContent.hero && (
                      <div className="mb-8">
                        <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white text-center">
                          <h1 className="text-3xl font-bold mb-3">{currentPageContent.hero.heading}</h1>
                          {currentPageContent.hero.subheading && (
                            <p className="text-lg opacity-90 mb-4">{currentPageContent.hero.subheading}</p>
                          )}
                          {'ctaText' in currentPageContent.hero && currentPageContent.hero.ctaText && (
                            <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-neutral-100 transition-colors">
                              {currentPageContent.hero.ctaText}
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Other Sections Preview */}
                    {Object.entries(currentPageContent).map(([sectionId, sectionData]) => {
                      if (sectionId === 'metadata' || sectionId === 'hero') return null

                      const section = sectionData as Section

                      return (
                        <div key={sectionId} className="mb-8">
                          {'heading' in section && typeof section.heading === 'string' && (
                            <h2 className="text-2xl font-bold text-neutral-900 mb-3">{section.heading}</h2>
                          )}
                          {'subheading' in section && typeof section.subheading === 'string' && (
                            <p className="text-lg text-neutral-600 mb-4">{section.subheading}</p>
                          )}
                          {'bodyText' in section && typeof section.bodyText === 'string' && (
                            <p className="text-neutral-700 mb-4 leading-relaxed">{section.bodyText}</p>
                          )}
                          {'description' in section && typeof section.description === 'string' && (
                            <p className="text-neutral-600 mb-4">{section.description}</p>
                          )}
                          {'quote' in section && typeof section.quote === 'string' && (
                            <blockquote className="border-l-4 border-indigo-600 pl-4 italic text-neutral-700 mb-2">
                              &quot;{section.quote}&quot;
                            </blockquote>
                          )}
                          {'author' in section && typeof section.author === 'string' && (
                            <p className="text-sm text-neutral-600">
                              — {section.author}
                              {' year' in section && typeof section.year === 'string' && `, ${section.year}`}
                            </p>
                          )}
                          {'list' in section && Array.isArray(section.list) && (
                            <div className="space-y-3">
                              {section.list.map((item, index) => (
                                <div key={index} className="p-4 bg-neutral-50 rounded-lg">
                                  {typeof item === 'string' ? (
                                    <p className="text-neutral-900 font-medium">{item}</p>
                                  ) : typeof item === 'object' && item !== null ? (
                                    <>
                                      {'name' in item && typeof item.name === 'string' && (
                                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">{item.name}</h3>
                                      )}
                                      {'category' in item && typeof item.category === 'string' && (
                                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">{item.category}</h3>
                                      )}
                                      {'eventName' in item && typeof item.eventName === 'string' && (
                                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                                          {item.eventName}
                                        </h3>
                                      )}
                                      {'amount' in item && typeof item.amount === 'string' && (
                                        <div className="text-xl font-bold text-indigo-600 mb-2">{item.amount}</div>
                                      )}
                                      {'description' in item && typeof item.description === 'string' && (
                                        <p className="text-sm text-neutral-600">{item.description}</p>
                                      )}
                                      {'programs' in item && typeof item.programs === 'string' && (
                                        <p className="text-sm text-neutral-600">{item.programs}</p>
                                      )}
                                      {'impact' in item && typeof item.impact === 'string' && (
                                        <p className="text-sm text-neutral-600">{item.impact}</p>
                                      )}
                                      {'age' in item && typeof item.age === 'string' && (
                                        <p className="text-xs text-neutral-500 mt-1">Ages {item.age}</p>
                                      )}
                                      {'date' in item && typeof item.date === 'string' && (
                                        <p className="text-xs text-neutral-500 mt-1">{item.date}</p>
                                      )}
                                      {'time' in item && typeof item.time === 'string' && (
                                        <p className="text-xs text-neutral-500">{item.time}</p>
                                      )}
                                      {'location' in item && typeof item.location === 'string' && (
                                        <p className="text-xs text-neutral-500">{item.location}</p>
                                      )}
                                    </>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          )}
                          {'timeline' in section && Array.isArray(section.timeline) && (
                            <ul className="space-y-2">
                              {section.timeline.map((item, index) => (
                                <li key={index} className="text-neutral-700">
                                  {typeof item === 'string' ? item : String(item)}
                                </li>
                              ))}
                            </ul>
                          )}
                          {'amounts' in section && Array.isArray(section.amounts) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              {section.amounts.map(
                                (item, index) =>
                                  typeof item === 'object' &&
                                  item !== null && (
                                    <div key={index} className="p-4 border-2 border-indigo-200 rounded-lg">
                                      {'amount' in item && typeof item.amount === 'string' && (
                                        <div className="text-2xl font-bold text-indigo-600 mb-2">{item.amount}</div>
                                      )}
                                      {'impact' in item && typeof item.impact === 'string' && (
                                        <p className="text-sm text-neutral-700">{item.impact}</p>
                                      )}
                                    </div>
                                  )
                              )}
                            </div>
                          )}
                          {/* Render simple key-value pairs */}
                          {Object.entries(section).map(([key, value]) => {
                            // Skip already rendered fields
                            if (
                              [
                                'heading',
                                'subheading',
                                'bodyText',
                                'description',
                                'list',
                                'timeline',
                                'amounts',
                                'quote',
                                'author',
                                'year'
                              ].includes(key)
                            ) {
                              return null
                            }

                            // Render simple string/number values
                            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                              return (
                                <div key={key} className="mb-2">
                                  <span className="text-sm font-medium text-neutral-600 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1')}:
                                  </span>
                                  <span className="text-sm text-neutral-900 ml-2">{String(value)}</span>
                                </div>
                              )
                            }

                            // Render nested objects
                            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                              return (
                                <div key={key} className="mb-4 p-4 bg-neutral-50 rounded-lg">
                                  <h4 className="text-sm font-semibold text-neutral-800 mb-2 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1')}
                                  </h4>
                                  {Object.entries(value as NestedObject).map(([nestedKey, nestedValue]) => (
                                    <div key={nestedKey} className="mb-1">
                                      <span className="text-xs font-medium text-neutral-600 capitalize">
                                        {nestedKey.replace(/([A-Z])/g, ' $1')}:
                                      </span>
                                      <span className="text-xs text-neutral-900 ml-2">{String(nestedValue)}</span>
                                    </div>
                                  ))}
                                </div>
                              )
                            }

                            return null
                          })}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-sm text-neutral-500"
        >
          Click the edit icon next to any field to modify content. Changes are reflected in the live preview.
        </motion.div>
      </div>
    </div>
  )
}

export default StarMap
