'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: 'Our Commitment to Privacy',
      content:
        'Boys & Girls Club of Lynn recognizes that visitors to our site may be concerned about the information they provide to us and how we use that information. We use our best efforts to respect and protect the privacy of our online visitors, Club families, donors and event attendees. We will not share your personal information with any third parties.'
    },
    {
      title: 'Data Collection',
      content:
        'We collect personal information from you only when you voluntarily provide us with such information. For example, if you decide to donate, we will need certain personal information to complete the transaction. Boys & Girls Club of Lynn lists donors in categorical amounts in its annual report and may use sponsor names in our advertising, brochures and publications. We strictly honor any request for anonymity.'
    },
    {
      title: 'Internet Protocol Address',
      content:
        'We collect an IP address from all visitors to our Site. An IP address is a number automatically assigned to your computer when you use the Internet. We use IP addresses to help diagnose problems with our server, administer our Site, analyze trends, and gather broad demographic information. IP addresses are not linked to personally identifiable information.'
    },
    {
      title: 'Cookies',
      content:
        'We do not capture or store any information via "cookies" that would be placed during a website visit to make a purchase or donation or for any reason.'
    },
    {
      title: 'External Links',
      content:
        'Our Privacy Policy applies only to your use of the www.bgcl.org website. This site may contain links to other sites. We are not responsible for the privacy practices of these other sites. We encourage you to read the privacy policies of each site you visit.'
    },
    {
      title: 'Security',
      content:
        'All information provided to Boys & Girls Club of Lynn is transmitted using SSL (Secure Socket Layer) encryption. We also protect account information by placing it on a secure portion of our site accessible only by qualified employees. We do not store sensitive information such as credit card or social security numbers. Please note that no data transmission over the Internet can be guaranteed 100% secure.'
    },
    {
      title: "Children's Privacy",
      content:
        'We are concerned about the safety of children when they use the Internet and do not knowingly request or collect personally identifiable information online from any person under the age of thirteen.'
    },
    {
      title: 'Personal Data Collection',
      content:
        'We collect personal and activity data, which may be linked. We use technologies like cookies, web beacons, or unique device identifiers to identify your computer or device. Our systems also log information like your browser, operating system and IP address. With your permission, we may also access other personal information on your device to provide services to you.'
    },
    {
      title: 'Location Data',
      content:
        'We may collect and share anonymous location data. To customize our service for you, we may collect, use, and share precise location data, including the real-time geographic location of your computer or device. This data is collected anonymously and is not personally identifiable. We may obtain your consent on your first use of the service.'
    },
    {
      title: 'Your Rights',
      content:
        'You can request to see or delete your personal data. You can sign into your account to view or delete any personally identifiable information we have stored, such as your name, address, email or phone number. You can also contact us by email to request to see or delete this information.'
    },
    {
      title: 'Sharing Your Information',
      content:
        'We may share personally identifiable information with trusted partners in order to provide you with relevant advertising, offers or services. California residents are legally entitled to request information about how we may have shared your information. No mobile information will be shared with third parties for marketing and/or promotional purposes.'
    },
    {
      title: 'Vendors and Service Providers',
      content:
        'In order to serve you, we may share your personal and anonymous information with other companies, including vendors and contractors. Their use of information is limited to these purposes and is subject to agreements requiring them to keep the information confidential. Analytics companies may access anonymous data to help us understand how our services are used.'
    },
    {
      title: 'Ad Tracking',
      content:
        'Ad companies may use and collect anonymous data about your interests to customize content and advertising. Interest and location data may be linked to your device, but is not linked to your identity. You can opt out of personalized advertising.'
    },
    {
      title: 'Special Circumstances',
      content:
        'We may make information available to third parties in limited circumstances: (1) with your express consent, (2) when required by law, (3) when necessary to protect our rights or property, or (4) to any successor or purchaser in a merger, acquisition, or sale of assets.'
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <p className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Legal</p>
            <h1 className="text-5xl font-bold text-white">Privacy Policy</h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Last Updated: January 2025</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-16 bg-zinc-900 border border-zinc-800 rounded-lg p-8 space-y-4"
        >
          <p className="text-zinc-300 leading-relaxed">
            This website is owned and operated by the Boys & Girls Club of Lynn. We recognize that visitors to our site
            may be concerned about the information they provide to us and how we use that information.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            By visiting, making a purchase, registering for a membership, or by making a gift to us, you accept the
            practices described in this policy.{' '}
            <span className="text-blue-400 font-semibold">
              This Privacy Policy may be changed or updated at any time.
            </span>
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-3"
            >
              <h2 className="text-2xl font-bold text-white">{section.title}</h2>
              <p className="text-zinc-400 leading-relaxed">{section.content}</p>
            </motion.section>
          ))}
        </div>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 bg-zinc-900 border border-zinc-800 rounded-lg p-8 space-y-4"
        >
          <h2 className="text-2xl font-bold text-white">Questions or Comments?</h2>
          <p className="text-zinc-400 leading-relaxed">
            Should you have any questions and/or comments on this policy, please send a message to{' '}
            <a href="mailto:info@bgcl.org" className="text-blue-400 hover:text-blue-300 font-semibold">
              info@bgcl.org
            </a>{' '}
            or visit our{' '}
            <Link href="/contact" className="text-blue-400 hover:text-blue-300 font-semibold">
              Contact Us
            </Link>{' '}
            page.
          </p>
        </motion.section>

        {/* Related Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="mt-12 pt-8 border-t border-zinc-800"
        >
          <div className="grid grid-cols-2 gap-4">
            <Link href="/terms" className="text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-2">
              <span>Terms & Conditions</span>
              <span>→</span>
            </Link>
            <Link
              href="/contact"
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-2"
            >
              <span>Contact Us</span>
              <span>→</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-zinc-900 border-t border-zinc-800 py-12 mt-16"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Committed to Your Privacy</h2>
          <p className="text-zinc-400">
            Your trust is important to us. We take data privacy seriously and are transparent about how we use your
            information.
          </p>
        </div>
      </motion.section>
    </div>
  )
}
