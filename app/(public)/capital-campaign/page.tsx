'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  X,
  Target,
  Users,
  Building2,
  Heart,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react'
import Link from 'next/link'
import Picture from '@/app/components/common/Picture'
import BrochureDisplayer from '@/app/components/BrochureDisplayer'

const renderings = [
  {
    src: '/images/render_1.jpg',
    alt: 'Exterior View 1'
  },
  {
    src: '/images/render_2.jpg',
    alt: 'Exterior View 2'
  },
  {
    src: '/images/render_3.jpg',
    alt: 'Pool Area'
  },
  {
    src: '/images/render_4.jpg',
    alt: 'Swimming Pool'
  },
  {
    src: '/images/render_5.jpg',
    alt: 'Dance Room'
  },
  {
    src: '/images/render_6.jpg',
    alt: 'Classroom'
  },
  {
    src: '/images/render_7.jpg',
    alt: 'Gaming Area'
  },
  {
    src: '/images/render_8.jpg',
    alt: 'Cooking Club'
  },
  {
    src: '/images/render_9.jpg',
    alt: 'Teen Center'
  },
  {
    src: '/images/render_10.jpg',
    alt: 'Cafeteria'
  },
  {
    src: '/images/render_11.jpg',
    alt: 'Classrooms'
  },
  {
    src: '/images/render_12.jpg',
    alt: 'Entry Check-in'
  },
  {
    src: '/images/render_13.jpg',
    alt: 'Gymnasium'
  },
  {
    src: '/images/render_14.jpg',
    alt: 'Interior Hallway'
  }
]

const expansionFeatures = [
  {
    icon: Building2,
    title: 'Two New Classrooms',
    description: 'Age-appropriate learning spaces for our Licensed OST Programming'
  },
  { icon: Users, title: 'Youth Gymnasium', description: 'Dedicated gym space designed for our younger members' },
  { icon: Target, title: 'Commercial Kitchen', description: 'Full-service kitchen to support nutrition programs' },
  { icon: Heart, title: 'Cafeteria for 80', description: 'Modern dining space for our growing membership' }
]

const teenFeatures = [
  'Dedicated Teen Wing',
  'Planet Fitness Room',
  'Dance & Theater Center',
  'Game Room',
  'Upgraded Pool & Splash Pad'
]

const impactPoints = [
  'Increase our capacity to serve more members',
  'Enhance our programs with state-of-the-art facilities',
  'Provide a safe and supportive environment for our members to develop critical skills and healthy habits'
]

export default function CapitalCampaign() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<string | null>(null)

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % renderings.length)
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + renderings.length) % renderings.length)

  const goalAmount = 30000000
  const raisedAmount = 17071500
  const progressPercent = (raisedAmount / goalAmount) * 100

  return (
    <div className="min-h-screen dark:bg-neutral-950 bg-white">
      {/* Hero Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-334 mx-auto">
          <motion.div
            className="space-y-6 mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              <p className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
                CAPITAL CAMPAIGN
              </p>
              <h1 className="text-5xl md:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
                Future Ready
              </h1>
              <p className="text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">
                Educating and mentoring our members for a promising tomorrow. Join us in building a brighter future for
                the youth of Lynn.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="https://bgcl.harnessgiving.org/donate/?method=one-time,monthly,roundup&selected-method=one-time&amount=50&campaign_id=15622"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl transition-colors"
              >
                Donate Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => {
                  setCurrentVideo('capital-campaign')
                  setVideoModalOpen(true)
                }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:text-white text-neutral-900 font-semibold rounded-xl transition-colors"
              >
                <Play className="w-5 h-5" />
                Watch Video
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Mission Section */}
      <section className="py-24 px-6 dark:bg-neutral-900 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          {/* Image with Play Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <button
              onClick={() => {
                setCurrentVideo('Capital-Campaign.mp4')
                setVideoModalOpen(true)
              }}
              className="relative w-full aspect-21/9 rounded-2xl overflow-hidden group cursor-pointer"
            >
              <Picture
                src="/images/capital-campaign-1.jpg"
                alt="Boys & Girls Club members"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                priority={true}
              />
              <div className="absolute inset-0 bg-neutral-950/30 group-hover:bg-neutral-950/40 transition-colors" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Pulse ring */}
                  <div
                    className="absolute inset-0 rounded-full bg-white/30 animate-ping"
                    style={{ animationDuration: '2s' }}
                  />

                  {/* Button */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-2xl">
                    <Play className="w-8 h-8 md:w-10 md:h-10 text-neutral-900 fill-neutral-900 ml-1" />
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div className="text-left">
                  <p className="text-white font-semibold text-lg">Watch Our Story</p>
                  <p className="text-white/70 text-sm">Capital Campaign: Phase 2</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                  2:07
                </div>
              </div>
            </button>
          </motion.div>

          {/* Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl md:text-5xl font-black dark:text-white text-neutral-900 mb-6">
                Building a Brighter Future
              </h2>
              <div className="space-y-4 text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
                <p>
                  To continue our mission and expand our impact, we are embarking on a significant capital campaign for
                  the expansion of our club. This expansion is designed to enhance our existing programs and facilities,
                  providing more for our current members and increasing our capacity to serve even more youth in our
                  community.
                </p>
                <p>
                  We currently have a waitlist and would like to open our doors to new members. This expansion will
                  double the square footage of our building, enabling us to open our doors to close to 700 members.
                </p>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {expansionFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-2xl dark:bg-neutral-800 bg-white border dark:border-neutral-700 border-neutral-200"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-sky-500" />
                  </div>
                  <h3 className="font-bold dark:text-white text-neutral-900 mb-1">{feature.title}</h3>
                  <p className="text-sm dark:text-neutral-400 text-neutral-600">{feature.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Teen Center Features */}
      <section className="py-24 px-6 dark:bg-neutral-950 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black dark:text-white text-neutral-900 mb-4">
              Teen Center Expansion
            </h2>
            <p className="text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl mx-auto">
              A dedicated space designed specifically for our teenage members
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {teenFeatures.map((feature) => (
              <div
                key={feature}
                className="inline-flex items-center gap-3 px-6 py-4 rounded-xl dark:bg-neutral-900 bg-neutral-50 border dark:border-neutral-800 border-neutral-200"
              >
                <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0" />
                <span className="font-medium dark:text-white text-neutral-900">{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-24 px-6 dark:bg-neutral-900 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black dark:text-white text-neutral-900 mb-4">Learn More</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Capital Campaign Video */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => {
                setCurrentVideo('Capital-Campaign.mp4')
                setVideoModalOpen(true)
              }}
              className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer"
            >
              <Picture
                src="https://cdn.prod.website-files.com/65e0d291ed80aa415dbb7adf/671107668d64b5995e19d873_capital-thumb.jpg"
                alt="Capital Campaign Video"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                priority={true}
              />
              <div className="absolute inset-0 bg-neutral-950/40 group-hover:bg-neutral-950/30 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
                <h3 className="text-white font-bold text-lg">Capital Campaign: Phase 2</h3>
                <p className="text-white/70 text-sm">2:07</p>
              </div>
            </motion.button>

            {/* Virtual Tour Video */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              onClick={() => {
                setCurrentVideo('landing.mov')
                setVideoModalOpen(true)
              }}
              className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer"
            >
              <Picture
                src="https://cdn.prod.website-files.com/65e0d291ed80aa415dbb7adf/670f4e02fe0a3f0cb5869fd3_Interior%201%20Games%20%26%20Stair-min.jpg"
                alt="Virtual Tour Video"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                priority={false}
              />
              <div className="absolute inset-0 bg-neutral-950/40 group-hover:bg-neutral-950/30 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
                <h3 className="text-white font-bold text-lg">Virtual Tour</h3>
                <p className="text-white/70 text-sm">0:58</p>
              </div>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Renderings Gallery */}
      <section className="py-24 px-6 dark:bg-neutral-950 bg-white">
        <div className="max-w-334 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black dark:text-white text-neutral-900 mb-4">Renderings</h2>
            <p className="text-lg dark:text-neutral-400 text-neutral-600">
              Preview our vision for the expanded facility
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {renderings.map((image, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className="group relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer"
              >
                <Picture
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  priority={false}
                />
                <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/30 transition-colors flex items-center justify-center">
                  <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Progress Section */}
      <section className="py-24 px-6 dark:bg-neutral-900 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-black dark:text-white text-neutral-900 mb-12">
              What It Will Take
            </h2>

            {/* Goal */}
            <div className="mb-8">
              <div className="text-sm font-medium dark:text-neutral-400 text-neutral-600 mb-2">Campaign Goal</div>
              <div className="text-5xl md:text-6xl font-black dark:text-white text-neutral-900">
                ${goalAmount.toLocaleString()}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-8">
              <div className="h-4 rounded-full dark:bg-neutral-800 bg-neutral-200 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progressPercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full rounded-full bg-linear-to-r from-sky-500 to-sky-600"
                />
              </div>
            </div>

            {/* Raised Amount */}
            <div className="mb-12">
              <div className="text-3xl md:text-4xl font-bold text-sky-500 mb-2">${raisedAmount.toLocaleString()}</div>
              <div className="dark:text-neutral-400 text-neutral-600">
                Raised so far. {Math.round(progressPercent)}% of our ${(goalAmount / 1000000).toFixed(0)} million goal.
              </div>
            </div>

            {/* Quote */}
            <blockquote className="text-xl md:text-2xl dark:text-neutral-300 text-neutral-700 italic mb-12 max-w-3xl mx-auto">
              "Together, we can ensure that our community's youth go on to reach their full potential. At the Boys &
              Girls Club of Lynn we believe that{' '}
              <span className="text-sky-500 font-semibold not-italic">Great Futures Start Here</span>."
            </blockquote>

            <Link
              href="https://bgcl.harnessgiving.org/donate/?method=one-time,monthly,roundup&selected-method=one-time&amount=50&campaign_id=15622"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-sky-600 hover:bg-sky-500 text-white text-lg font-semibold rounded-xl transition-colors"
            >
              Donate Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Help Us Build Section */}
      <section className="py-24 px-6 dark:bg-neutral-950 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl md:text-5xl font-black dark:text-white text-neutral-900 mb-6">
                Help Us Build the Future
              </h2>
              <p className="text-lg dark:text-neutral-300 text-neutral-700 mb-8 leading-relaxed">
                We invite you to join us in this inspiring journey. Your financial contribution will play a crucial role
                in making this vision a reality, ensuring that we continue to nurture and support the members of our
                community for years to come.
              </p>

              <div className="mb-8">
                <p className="font-semibold dark:text-white text-neutral-900 mb-4">
                  Your generous contribution will help us:
                </p>
                <ul className="space-y-3">
                  {impactPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                      <span className="dark:text-neutral-300 text-neutral-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="dark:text-neutral-400 text-neutral-600 mb-8">
                By committing to this project, you are making a lasting difference in the lives of young people in Lynn.
                Together, we can ensure that every child has the opportunity to realize their full potential and become
                productive, responsible, and caring citizens.
              </p>

              <Link
                href="https://bgcl.harnessgiving.org/donate/?method=one-time,monthly,roundup&selected-method=one-time&amount=50&campaign_id=15622"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl transition-colors"
              >
                Make a Donation
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-4/5 rounded-2xl overflow-hidden">
                <Picture
                  src="https://cdn.prod.website-files.com/65e0d291ed80aa415dbb7adf/68ae7e9ecd340a307dd26e68_6718a9849fdf2c30b9e02648b96b117d_Capital%20Campaign%20grid%20img.jpg"
                  alt="Boys & Girls Club members"
                  className="w-full h-full object-cover"
                  priority={false}
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-sky-500/20 rounded-2xl -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-sky-600/20 rounded-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      <BrochureDisplayer
        images={[
          '/images/capital_campaign_brochure-1.jpg',
          '/images/capital_campaign_brochure-2.jpg',
          '/images/capital_campaign_brochure-3.jpg',
          '/images/capital_campaign_brochure-4.jpg',
          '/images/capital_campaign_brochure-5.jpg',
          '/images/capital_campaign_brochure-6.jpg',
          '/images/capital_campaign_brochure-7.jpg',
          '/images/capital_campaign_brochure-8.jpg',
          '/images/capital_campaign_brochure-9.jpg',
          '/images/capital_campaign_brochure-10.jpg',
          '/images/capital_campaign_brochure-11.jpg',
          '/images/capital_campaign_brochure-12.jpg',
          '/images/capital_campaign_brochure-13.jpg',
          '/images/capital_campaign_brochure-14.jpg',
          '/images/capital_campaign_brochure-15.jpg'
        ]}
      />

      {/* Contact Section */}
      <section className="py-24 px-6 dark:bg-neutral-900 bg-neutral-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-black dark:text-white text-neutral-900 mb-8">Get In Touch</h2>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
              <a
                href="tel:781-593-1772"
                className="inline-flex items-center gap-3 px-6 py-4 rounded-xl dark:bg-neutral-800 bg-white border dark:border-neutral-700 border-neutral-200 dark:text-white text-neutral-900 hover:border-sky-500/50 transition-colors"
              >
                <Phone className="w-5 h-5 text-sky-500" />
                <span className="font-medium">781-593-1772</span>
              </a>
              <a
                href="mailto:info@bgcl.org"
                className="inline-flex items-center gap-3 px-6 py-4 rounded-xl dark:bg-neutral-800 bg-white border dark:border-neutral-700 border-neutral-200 dark:text-white text-neutral-900 hover:border-sky-500/50 transition-colors"
              >
                <Mail className="w-5 h-5 text-sky-500" />
                <span className="font-medium">info@bgcl.org</span>
              </a>
              <a
                href="https://maps.google.com/?q=25+North+Common+Street+Lynn+MA+01902"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-4 rounded-xl dark:bg-neutral-800 bg-white border dark:border-neutral-700 border-neutral-200 dark:text-white text-neutral-900 hover:border-sky-500/50 transition-colors"
              >
                <MapPin className="w-5 h-5 text-sky-500" />
                <span className="font-medium">25 North Common Street, Lynn, MA</span>
              </a>
            </div>

            <p className="dark:text-neutral-500 text-neutral-600 text-sm">
              The Boys & Girls Club of Lynn is a 501(c)3 Charitable Nonprofit Organization
              <br />
              Tax ID Number: 04-2103924
            </p>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-neutral-950/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              className="absolute left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-5xl max-h-[80vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Picture
                src={renderings[currentImageIndex].src}
                alt={renderings[currentImageIndex].alt}
                className="w-full h-full object-contain rounded-lg"
                priority={false}
              />
              <p className="text-center text-white/70 mt-4">
                {renderings[currentImageIndex].alt} ({currentImageIndex + 1} of {renderings.length})
              </p>
            </motion.div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-neutral-950/95 flex items-center justify-center p-4"
            onClick={() => setVideoModalOpen(false)}
          >
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Player */}
              <video src={`/videos/${currentVideo}`} controls autoPlay className="w-full h-full rounded-xl">
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
