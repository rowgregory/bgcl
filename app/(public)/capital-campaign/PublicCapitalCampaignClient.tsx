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
  FileText
} from 'lucide-react'
import Link from 'next/link'
import Picture from '@/app/components/common/Picture'

export default function PublicCapitalCampaignClient({ pageData }) {
  const t = pageData?.sections?.campaign
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<string | null>(null)

  const goalAmount = Number(t?.goal_amount)
  const raisedAmount = Number(t?.raised_amount)
  const progressPercent = (raisedAmount / goalAmount) * 100

  const expansionFeatures = [
    {
      icon: Building2,
      title: t?.expansion_feature_1_title,
      description: t?.expansion_feature_1_description
    },
    {
      icon: Users,
      title: t?.expansion_feature_2_title,
      description: t?.expansion_feature_2_description
    },
    {
      icon: Target,
      title: t?.expansion_feature_3_title,
      description: t?.expansion_feature_3_description
    },
    {
      icon: Heart,
      title: t?.expansion_feature_4_title,
      description: t?.expansion_feature_4_description
    }
  ]

  const teenFeatures = [t?.teen_feature_1, t?.teen_feature_2, t?.teen_feature_3, t?.teen_feature_4, t?.teen_feature_5]

  const impactPoints = [t?.impact_point_1, t?.impact_point_2, t?.impact_point_3]

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
                {t?.eyebrow}
              </p>
              <h1 className="text-5xl md:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
                {t?.heading}
              </h1>
              <p className="text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">{t?.subheading}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/donate?campaignName=Capital Campaign"
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
                  <p className="text-white font-semibold text-lg">{t?.video_title}</p>
                  <p className="text-white/70 text-sm">{t?.video_subtitle}</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                  {t?.video_duration}
                </div>
              </div>
            </button>
          </motion.div>

          {/* Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl md:text-5xl font-black dark:text-white text-neutral-900 mb-6">
                {t?.about_heading}
              </h2>
              <div className="space-y-4 text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
                <p>{t?.about_paragraph1}</p>
                <p>{t?.about_paragraph2}</p>
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
            <h2 className="text-4xl md:text-5xl font-black dark:text-white text-neutral-900 mb-4">{t?.teen_heading}</h2>
            <p className="text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl mx-auto">{t?.teen_subheading}</p>
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
            <h2 className="text-4xl md:text-5xl font-black dark:text-white text-neutral-900 mb-4">
              {t?.renderings_heading}
            </h2>
            <p className="text-lg dark:text-neutral-400 text-neutral-600">{t?.renderings_subheading}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="rendering-1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors"
            >
              <FileText className="w-5 h-5 shrink-0" aria-hidden="true" />
              {t?.renderings_pdf_label_1 ?? 'Architecture Drawings'}
            </a>

            <a
              href="rendering-2.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 font-bold rounded-xl transition-colors"
            >
              <FileText className="w-5 h-5 shrink-0" aria-hidden="true" />
              {t?.renderings_pdf_label_2 ?? 'Renderings'}
            </a>
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
              {t?.financials_heading}
            </h2>

            {/* Goal */}
            <div className="mb-8">
              <div className="text-sm font-medium dark:text-neutral-400 text-neutral-600 mb-2">{t?.goal_label}</div>
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
              href="/donate?campaignName=Capital Campaign"
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
                {t?.cta_heading}
              </h2>
              <p className="text-lg dark:text-neutral-300 text-neutral-700 mb-8 leading-relaxed">{t?.cta_subheading}</p>

              <div className="mb-8">
                <p className="font-semibold dark:text-white text-neutral-900 mb-4">{t?.cta_impact_label}</p>
                <ul className="space-y-3">
                  {impactPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                      <span className="dark:text-neutral-300 text-neutral-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="dark:text-neutral-400 text-neutral-600 mb-8">{t?.cta_closing}</p>

              <Link
                href="/donate?campaignName=Capital Campaign"
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
