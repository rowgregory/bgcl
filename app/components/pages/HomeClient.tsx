'use client'

import { IProgram } from '@/types/entities/program'
import { AboutSection } from '../home/AboutSection'
import { Hero } from '../home/Hero'
import { ProgramCarousel } from '../home/ProgramCarousel'
import { motion } from 'framer-motion'

interface HomeClientProps {
  initialPageData?: any
  programs: IProgram[]
}

const HomeClient = ({ initialPageData, programs }: HomeClientProps) => {
  const pageContent = initialPageData?.content

  if (!pageContent) {
    return <div>Loading...</div>
  }

  return (
    <div className="text-white">
      <Hero initialPageData={pageContent} />

      {/* Content that scrolls over */}
      <div className="relative z-10">
        {/* About Section */}
        <AboutSection
          title="Our"
          subtitle="Mission"
          description="To inspire and enable all young people, especially those that need us the most, to realize their full potential as productive, responsible and caring citizens."
          detailedDescription="We stand behind our mission statement by instilling programs that focus on five core areas including Education & Career Development, Character & Leadership Development, Health & Life Skills, the Arts, Sports, Fitness and Recreation activities. The Boys & Girls Club of Lynn strives in enhancing our Youth Development Strategy (YDS) by fully implementing all our values to create an environment that guides boys and girls to achieve and reach their full potential."
          stats={[
            { label: 'Members Served', value: '1,500' },
            { label: 'Daily Visitors', value: '250+' },
            { label: 'Summer Camp', value: '125/week' }
          ]}
          image="/images/img-1.jpg"
          buttonText="Learn More"
          buttonHref="/about"
        />

        <ProgramCarousel title="Our programs" heading="Building" subheading="Skills for Tomorrow" items={programs} />

        {/* Testimonials */}
        {pageContent?.testimonials && (
          <div className="bg-neutral-950 py-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <p className="text-neutral-600 uppercase text-xs font-semibold tracking-widest mb-4">Testimonials</p>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-16">
                What people <span className="font-light text-neutral-500">says about us</span>
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Image */}
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="relative">
                    <img src="/images/logo-1.webp" alt="Testimonial" className="w-64 h-80 object-contain rounded-lg" />
                    {/* Quote Mark */}
                    <div className="absolute top-10 -right-6 w-12 h-18 bg-sky-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-7xl font-bold absolute -translate-x-1/2 left-1/2 top-1/4">
                        "
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Content */}
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-lg md:text-xl text-neutral-300 leading-relaxed italic">
                    {pageContent.testimonials.testimonial1}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-px w-8 bg-sky-500"></div>
                      <p className="text-lg font-bold text-white">{pageContent.testimonials.testimonial1Author}</p>
                    </div>
                  </div>

                  {/* Dot Indicators */}
                  {/* <div className="flex gap-3">
                    <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                    <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
                    <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
                  </div> */}
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        {/* {pageContent?.faq && (
          <div className=" py-24 px-6 border-t border-cyan-600/30">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-black uppercase mb-12">{pageContent.faq.heading}</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <details key={i} className="border border-cyan-600/30 group cursor-pointer">
                    <summary className="px-6 py-4 font-black uppercase flex justify-between items-center group-open:border-b group-open:border-cyan-600/30">
                      <span>{pageContent.faq[`question${i}`]}</span>
                      <span className="group-open:rotate-180 transition">▼</span>
                    </summary>
                    <p className="px-6 py-4 text-gray-400 bg-gray-950/50">{pageContent.faq[`answer${i}`]}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        )} */}

        {/* Newsletter */}
        {/* {pageContent?.newsletter && (
          <div className="bg-cyan-600 text-black py-24 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-4xl font-black uppercase mb-4">{pageContent.newsletter.heading}</h2>
              <p className="text-lg mb-8">{pageContent.newsletter.subheading}</p>
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder={pageContent.newsletter.placeholderText}
                  className="flex-1 px-4 py-3  text-white placeholder-gray-500 border border-black"
                />
                <button className=" text-cyan-400 px-8 py-3 font-bold uppercase hover:bg-gray-900 transition">
                  {pageContent.newsletter.buttonText}
                </button>
              </div>
            </div>
          </div>
        )} */}

        {/* CTA */}
        {/* <div className=" py-24 px-6 border-t border-cyan-600/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-black uppercase mb-6">{pageContent?.cta?.heading}</h2>
            <p className="text-xl text-gray-300 mb-8">{pageContent?.cta?.bodyText}</p>

            <a
              href={pageContent?.cta?.buttonLink}
              className="inline-block bg-cyan-500 text-black px-12 py-4 font-black uppercase text-lg hover:bg-cyan-400 transition"
            >
              {pageContent?.cta?.buttonText} →
            </a>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default HomeClient
