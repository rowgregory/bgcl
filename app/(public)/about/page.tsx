'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <p className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Who We Are</p>
            <h1 className="text-5xl font-bold text-white">About Our Mission</h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Boys & Girls Club of Lynn inspires and enables young people to realize their full potential as productive,
              responsible, and caring citizens.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-96 rounded-lg overflow-hidden border border-zinc-700">
            <Image
              src="/images/img-2.jpg"
              alt="Our Mission"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <p className="text-sky-400 font-semibold text-sm uppercase tracking-wider mb-2">About Us</p>
              <h2 className="text-4xl font-bold text-white mb-6">Our Mission & Vision</h2>
            </div>

            <p className="text-zinc-300 text-lg leading-relaxed">
              To inspire and enable all young people, especially those that need us the most, to realize their full
              potential as productive, responsible and caring citizens.
            </p>

            <p className="text-zinc-400 leading-relaxed">
              Currently, we serve 1,500 members ages 5 to 18 at our main club located on 25 N Common St, Lynn MA. We
              have more than 250 children walk through our doors daily for various after school programs. Our summer
              camp program serves over 125 children weekly at Creighton Pond Day Camp in Middleton.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-sky-400">1,500+</p>
                <p className="text-zinc-400 text-sm mt-2">Members</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-sky-400">250+</p>
                <p className="text-zinc-400 text-sm mt-2">Daily Visitors</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-sky-400">125+</p>
                <p className="text-zinc-400 text-sm mt-2">Summer Camp</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* History Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-zinc-900 py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6 order-2 lg:order-1">
              <div>
                <p className="text-sky-400 font-semibold text-sm uppercase tracking-wider mb-2">Our History</p>
                <h2 className="text-4xl font-bold text-white mb-6">Our Journey</h2>
              </div>

              <p className="text-zinc-300 text-lg leading-relaxed">
                The Boys & Girls Club of Lynn has a rich history of serving the youth in our community. Founded with a
                vision to provide a safe, supportive environment where young people can learn, grow, and thrive, our
                organization has been instrumental in shaping the lives of thousands of children and teens.
              </p>

              <p className="text-zinc-400 leading-relaxed">
                Over the years, we've maintained our commitment to providing youth with the resources, guidance, and
                support they need to succeed. Our dedicated staff and volunteers work tirelessly to create programs that
                inspire confidence, foster creativity, and develop the leaders of tomorrow.
              </p>

              <div className="space-y-3 pt-4">
                <div className="flex items-start space-x-3">
                  <ChevronRight className="w-5 h-5 text-sky-400 mt-1 shrink-0" />
                  <span className="text-zinc-300">Education & Career Development</span>
                </div>
                <div className="flex items-start space-x-3">
                  <ChevronRight className="w-5 h-5 text-sky-400 mt-1 shrink-0" />
                  <span className="text-zinc-300">Character & Leadership Development</span>
                </div>
                <div className="flex items-start space-x-3">
                  <ChevronRight className="w-5 h-5 text-sky-400 mt-1 shrink-0" />
                  <span className="text-zinc-300">Health & Life Skills</span>
                </div>
                <div className="flex items-start space-x-3">
                  <ChevronRight className="w-5 h-5 text-sky-400 mt-1 shrink-0" />
                  <span className="text-zinc-300">Sports, Arts & Recreation</span>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-full rounded-lg overflow-hidden order-1 lg:order-2">
              <div className="relative h-full rounded-lg overflow-hidden border border-zinc-700">
                <Image
                  src="/images/img-3.jpg"
                  alt="Our Mission"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Why Choose Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32"
      >
        <div className="text-center space-y-4 mb-16">
          <p className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Why Choose Us</p>
          <h2 className="text-4xl font-bold text-white">What Makes Us Different</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-sky-400 transition-colors"
          >
            <div className="h-48 bg-linear-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
              <div className="text-5xl">🎓</div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-bold text-white">Competitive Graduates</h3>
              <p className="text-zinc-400">
                Club members report higher grades and are more motivated to succeed in today's workforce.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-sky-400 transition-colors"
          >
            <div className="h-48 bg-linear-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
              <div className="text-5xl">🚀</div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-bold text-white">21st Century Leaders</h3>
              <p className="text-zinc-400">
                Our youth volunteer at higher rates and become the innovators and problem-solvers of tomorrow.
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-sky-400 transition-colors"
          >
            <div className="h-48 bg-linear-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
              <div className="text-5xl">💪</div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-bold text-white">Healthier Generation</h3>
              <p className="text-zinc-400">
                Club teens are less likely to use drugs and more engaged in regular physical activity.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32"
      >
        <div className="text-center space-y-4 mb-16">
          <p className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Testimonials</p>
          <h2 className="text-4xl font-bold text-white">What People Say About Us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
              <p className="text-zinc-300 leading-relaxed">
                "The Boys & Girls Club has been instrumental in helping my child develop confidence and skills. The
                staff is wonderful and truly cares about each member."
              </p>
              <div>
                <p className="text-white font-bold">Sarah Johnson</p>
                <p className="text-sky-400 text-sm">Parent & Donor</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* COVID Response */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-zinc-900 py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div>
                <p className="text-sky-400 font-semibold text-sm uppercase tracking-wider mb-2">Impact</p>
                <h2 className="text-4xl font-bold text-white mb-6">Our Response to COVID-19</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <span className="text-sky-400 text-4xl font-bold shrink-0">200K+</span>
                  <p className="text-zinc-400">youth received internet access and technology support</p>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-sky-400 text-4xl font-bold shrink-0">24M+</span>
                  <p className="text-zinc-400">emergency meals and snacks provided</p>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-sky-400 text-4xl font-bold shrink-0">$10M+</span>
                  <p className="text-zinc-400">in economic assistance to families</p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-96 rounded-lg overflow-hidden">
              <div className="relative rounded-lg overflow-hidden order-1 lg:order-2 w-96 h-96 border border-zinc-700">
                <Image
                  src="/images/img-4.jpg"
                  alt="Our Mission"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="bg-linear-to-r from-sky-600 to-sky-700 py-32 mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-4xl font-bold text-white">Ready to Make a Difference?</h2>
          <p className="text-sky-100 text-lg max-w-2xl mx-auto">
            Support our mission to empower youth in our community.
          </p>
          <Link
            href="/donate"
            className="px-10 py-3 bg-white hover:bg-zinc-100 text-sky-600 font-bold rounded-lg transition-colors inline-block"
          >
            Donate Now
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
