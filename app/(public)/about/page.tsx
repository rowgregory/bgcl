'use client'

import Picture from '@/app/components/common/Picture'
import { motion } from 'framer-motion'

export default function AboutPage() {
  const outcomes = [
    {
      title: 'Globally Competitive Graduates',
      description:
        "When young people perform well academically, they graduate from high school on time, are motivated to learn and have a plan to succeed in today's modern workforce. Among youth ages 12 to 17 living in households experiencing low income, Club members report higher grades than youth nationally."
    },
    {
      title: '21st Century Leaders',
      description:
        'Club youth are the leaders, innovators and problem-solvers of tomorrow - developing skills to be change agents in their communities and beyond. Club members in 8th, 10th and 12th grades volunteer at significantly higher rates than their peers nationally.'
    },
    {
      title: 'A Healthier Generation',
      description:
        'When young people live healthy lifestyles, they are able to make decisions that result in their social, emotional and physical well-being. Club teens are less likely to use drugs or alcohol and more likely to engage in regular physical activity than their peers nationally.'
    }
  ]

  const covidStats = [
    { stat: '200K+', label: 'Youth received internet access and technology' },
    { stat: '24M+', label: 'Emergency meals and snacks served' },
    { stat: '460K', label: 'Families received wellness checks and support' },
    { stat: '$10M+', label: 'Economic assistance provided to families' }
  ]

  return (
    <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Header */}
        <motion.div
          className="space-y-4 sm:space-y-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-3 sm:space-y-4">
            <p className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
              Our Purpose
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
              Our Mission
            </h1>
            <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">
              To inspire and enable all young people, especially those that need us the most, to realize their full
              potential as productive, responsible and caring citizens.
            </p>
          </div>
        </motion.div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6 text-neutral-700 dark:text-neutral-300"
          >
            <p className="text-base sm:text-lg leading-relaxed">
              We stand behind our mission statement by instilling programs that focus on five core areas including
              Education & Career Development, Character & Leadership Development, Health & Life Skills, the Arts,
              Sports, Fitness and Recreation activities.
            </p>

            <p className="text-base sm:text-lg leading-relaxed">
              The Boys & Girls Club of Lynn strives in enhancing our Youth Development Strategy (YDS) by fully
              implementing all our values to create an environment that guides boys and girls to achieve and reach their
              full potential.
            </p>

            <p className="text-base sm:text-lg leading-relaxed">
              During the school year we serve 1,500 members ages 5 to 18 at our main club located on 25 N Common St,
              Lynn MA. We have more than 250 children walk through our doors daily for various after school programs.
              Our summer camp program serves over 125 children weekly at Creighton Pond Day Camp in Middleton.
            </p>
          </motion.div>

          {/* Mission Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden dark:border dark:border-neutral-800 border border-neutral-200"
          >
            <Picture src="/images/img-1.jpg" alt="Our Mission" priority={true} className="object-cover w-full h-full" />
          </motion.div>
        </div>

        {/* Why Choose Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8 sm:space-y-12"
        >
          <div className="text-center space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black dark:text-white text-neutral-900 leading-tight">
              Why Choose the Boys & Girls Club of Lynn?
            </h2>
            <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl mx-auto">
              Check out what separates us from other clubs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden dark:border dark:border-neutral-800 border border-neutral-200"
            >
              <Picture
                src="/images/img-3.jpg"
                alt="Why Choose BGCL"
                priority={false}
                className="object-cover w-full h-full"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 sm:space-y-8"
            >
              {outcomes.map((outcome, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="space-y-2 sm:space-y-3"
                >
                  <h3 className="text-lg sm:text-xl font-bold dark:text-white text-neutral-900">{outcome.title}</h3>
                  <p className="text-sm sm:text-base dark:text-neutral-400 text-neutral-600 leading-relaxed">
                    {outcome.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Accreditations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="dark:bg-neutral-800 bg-white p-6 sm:p-8 rounded-lg sm:rounded-xl dark:border dark:border-neutral-700 border border-neutral-200"
          >
            <h3 className="text-lg sm:text-xl font-bold dark:text-white text-neutral-900 mb-4 sm:mb-6">
              Boys & Girls Clubs of America is Highly Respected
            </h3>
            <p className="dark:text-neutral-300 text-neutral-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              BGCA maintains the highest Guidestar Platinum Seal of Transparency and is ranked #11 on the Chronicle of
              Philanthropy's list of "America's Favorite Charities." Consumer Reports has recognized BGCA as one of the
              "Best Charities for Your Donations."
            </p>
            <div className="flex flex-wrap gap-6 sm:gap-8 items-center">
              <div className="relative w-24 h-12 sm:w-32 sm:h-16">
                <Picture
                  src="https://cdn.prod.website-files.com/65e0d291ed80aa415dbb7adf/65f7b5d4bb93f0112db17054_candid-platinum-transparency.png"
                  alt="Candid Platinum Seal"
                  priority={false}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="relative w-24 h-12 sm:w-32 sm:h-16">
                <Picture
                  src="https://cdn.prod.website-files.com/65e0d291ed80aa415dbb7adf/65f7b5d402aea38a08323c87_charity-navigator.png"
                  alt="Charity Navigator"
                  priority={false}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
            <p className="text-xs sm:text-sm dark:text-neutral-400 text-neutral-600 mt-4 sm:mt-6">
              *2020 National Outcomes Report, National Youth Outcomes Initiative, Boys & Girls Clubs of America
            </p>
          </motion.div>
        </motion.div>

        {/* COVID Response Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8 sm:space-y-12"
        >
          <div className="text-center space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black dark:text-white text-neutral-900 leading-tight">
              Our Response to COVID-19
            </h2>
            <p className="text-lg sm:text-xl dark:text-neutral-300 text-neutral-700">
              Mission Unstoppable: Clubs Transform Operations to Support the Safety & Success of Youth
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4 sm:space-y-6"
            >
              <p className="text-base sm:text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
                When the COVID-19 pandemic eliminated the structure of the traditional in-person school day and access
                to safe places, meals, and more for millions of youth, clubs stepped up:
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {covidStats.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="dark:bg-neutral-800 bg-neutral-100 p-3 sm:p-4 rounded-lg"
                  >
                    <div className="text-xl sm:text-2xl md:text-3xl font-black dark:text-white text-neutral-900 mb-1 sm:mb-2">
                      {item.stat}
                    </div>
                    <p className="text-xs sm:text-sm dark:text-neutral-400 text-neutral-600 leading-snug">
                      {item.label}
                    </p>
                  </motion.div>
                ))}
              </div>

              <p className="text-base sm:text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
                Youth pitched in, too - assembling community care packages, writing letters to frontline workers and
                sharing in community efforts to recover and look beyond the pandemic to hopeful days ahead.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden dark:border dark:border-neutral-800 border border-neutral-200"
            >
              <Picture
                src="/images/img-4.jpg"
                alt="COVID Response"
                priority={false}
                className="object-cover w-full h-full"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
