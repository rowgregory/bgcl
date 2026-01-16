'use client'

import { containerVariants, itemVariants } from '@/app/lib/constants/motion'
import { motion } from 'framer-motion'
import { Mail, Download, ExternalLink, BookOpen } from 'lucide-react'

interface Newsletter {
  month: string
  year: string
  downloadUrl: string
}

interface Resource {
  title: string
  downloadUrl?: string
}

const newsletters: Newsletter[] = [
  {
    month: 'March',
    year: '2023',
    downloadUrl: 'https://drive.google.com/file/d/1OBSillFE3g0frvH5foV7WNi8CCSrFfzd/view'
  },
  {
    month: 'April',
    year: '2023',
    downloadUrl: 'https://drive.google.com/file/d/1F-8sAOXNWcB388-bN3CuQNuKU2EZ42B-/view'
  },
  {
    month: 'MaMayrch',
    year: '2023',
    downloadUrl: 'https://drive.google.com/file/d/1DmQk-yoEgE_9xfCL1FJg69gUmYFjgHZ2/view'
  },
  {
    month: 'June',
    year: '2023',
    downloadUrl: 'https://drive.google.com/file/d/1QX5N4lELyiYOdu_1PZ6ZdnRGsoPkeZ8d/view'
  },
  {
    month: 'September',
    year: '2023',
    downloadUrl: 'https://drive.google.com/file/d/1d1NGuD64WF7xj4LrpbIAVgqgCZXofbVP/view'
  },
  {
    month: 'November',
    year: '2023',
    downloadUrl: 'https://drive.google.com/file/d/16lPcg17lHqcLWyxJ3sIOqdQisD2ZXcB3/view'
  },
  {
    month: 'December',
    year: '2023',
    downloadUrl: 'https://drive.google.com/file/d/1lcm5aUXGY7QlYLAP9jXcuyp3rBFjVwxj/view'
  },
  {
    month: 'January',
    year: '2024',
    downloadUrl: 'https://drive.google.com/file/d/1WjAGKSegYa-Iz8n3tImQMjaHclp9eHR2/view'
  },
  {
    month: 'February',
    year: '2024',
    downloadUrl: 'https://drive.google.com/file/d/1qv8dpfhoOKDxoJbBdrSbe30Ob38nV3YF/view?usp=drive_link'
  },
  {
    month: 'March',
    year: '2024',
    downloadUrl: 'https://drive.google.com/file/d/1cpA7OFvKllZSvEv2X5clzPB5k0yQnflb/view?usp=drive_link'
  },
  {
    month: 'April',
    year: '2024',
    downloadUrl: 'https://drive.google.com/file/d/1wftBgyCiqi28Sdbadd8iSDtEjWyxACmO/view'
  },
  {
    month: 'May',
    year: '2024',
    downloadUrl: 'https://drive.google.com/file/d/1qkUVH8lEE3cYqa-yeKvV7xUw3IdCah37/view'
  },
  {
    month: 'June',
    year: '2024',
    downloadUrl: 'https://drive.google.com/file/d/1XfN9bn0ydyNKMYoqMerbY8SQ9FXW7308/view?usp=sharing'
  },
  {
    month: 'July',
    year: '2024',
    downloadUrl: 'https://drive.google.com/file/d/1t7wFPx1M5iXDTu_zRvPLthH7_q3E-Rny/view'
  },
  {
    month: 'August',
    year: '2024',
    downloadUrl: 'https://drive.google.com/file/d/11lsXRxQ4CVjp_tVRHrtdi1xnGCMMZISS/view'
  },
  {
    month: 'September',
    year: '2024',
    downloadUrl: 'https://drive.google.com/file/d/1ubu-dYl9TQmvuhIqd01gtoDigMhwP32v/view'
  },
  {
    month: 'November',
    year: '2024',
    downloadUrl: 'https://drive.google.com/file/d/1PwexS-mPy7dnCYHqo8kDXrM4yCDTJLe0/view'
  },
  {
    month: 'December',
    year: '2024',
    downloadUrl: 'https://drive.google.com/file/d/12DemCTAzDTW7EWNALJbCpYe7QXuzwmfA/view'
  },
  {
    month: 'January',
    year: '2025',
    downloadUrl: 'https://drive.google.com/file/d/1fzUOcCxUFiExvgtHk7F4uTU3X_BOZRBV/view?usp=sharing'
  },
  {
    month: 'February',
    year: '2025',
    downloadUrl: 'https://drive.google.com/file/d/1kbiV_vzLOrVYIvuiM6rjBYmBXdB9eeKS/view?usp=sharing'
  },
  {
    month: 'March',
    year: '2025',
    downloadUrl: 'https://drive.google.com/file/d/1jW3fZIR9ygSVdbzeCnvmqdIW8tDeih30/view?usp=sharing'
  },
  {
    month: 'April',
    year: '2025',
    downloadUrl: 'https://drive.google.com/file/d/1yvUSWE0g4Uubn8Rc-nS288cCPvVE98-M/view?usp=sharing'
  },
  {
    month: 'May',
    year: '2025',
    downloadUrl: 'https://drive.google.com/file/d/1MoDkcL0Ls2umFI0-lggjwdrSxmeO0IkS/view?usp=sharing'
  },
  {
    month: 'June',
    year: '2025',
    downloadUrl: 'https://drive.google.com/file/d/1K8vt1Sapg8eeLwaoiapg8tCNQdPwXtLW/view?usp=sharing'
  },
  {
    month: 'July',
    year: '2025',
    downloadUrl: 'https://drive.google.com/file/d/1dnUKRiUMSSifDz8ieQ16G35kehUowVv-/view?usp=sharing'
  },
  {
    month: 'August',
    year: '2025',
    downloadUrl: 'https://drive.google.com/file/d/1uk8gnBtsaDcEINsrJCyE3ReuBHo4p9bz/view?usp=sharing'
  },
  {
    month: 'October',
    year: '2025',
    downloadUrl: 'https://drive.google.com/file/d/1-o0C7ZiCG7qdN8I-FEQFn4GesxJi7VvX/view?usp=drive_link'
  },
  {
    month: 'November',
    year: '2025',
    downloadUrl: 'https://drive.google.com/file/d/1_TmYBDLB-zxl4RpVsTnMM4PVNxCFG8ot/view'
  }
]

const resources: Resource[] = [
  {
    title: 'Club Safety',
    downloadUrl: 'https://drive.google.com/file/d/1Dm8Umq3s2T8X7psJrMJc6sVM9MdVeupR/view'
  },
  {
    title: 'Parent Handbook',
    downloadUrl: 'https://drive.google.com/file/d/1oiUCt5rCL5_Ox3J3rAyHEkuNec1wGZKC/view'
  },
  {
    title: 'Program Schedule',
    downloadUrl: 'https://drive.google.com/file/d/1bxunDFErWIOElCaNzKg9Cbn7uPx8Xmtk/view'
  }
]

export default function HubPage() {
  return (
    <div className="dark:bg-neutral-950 bg-white">
      {/* Hero Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="space-y-6 mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              <p className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
                Resources & Updates
              </p>
              <h1 className="text-5xl md:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
                The Hub
              </h1>
              <p className="text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">
                Your one-stop destination for club resources, newsletters, and important information.
              </p>
            </div>
          </motion.div>

          {/* Newsletter Subscription */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="dark:bg-linear-to-br dark:from-sky-500/10 dark:to-sky-600/10 bg-linear-to-br from-sky-100 to-sky-50 dark:border-sky-500/20 border-sky-300/30 rounded-2xl p-8 border mb-16"
          >
            <div className="flex items-center gap-4 mb-4">
              <Mail className="w-8 h-8 dark:text-sky-400 text-sky-600 shrink-0" />
              <h3 className="text-2xl font-bold dark:text-white text-neutral-900">Stay Updated</h3>
            </div>
            <p className="dark:text-neutral-300 text-neutral-700 mb-6 max-w-2xl">
              Subscribe to our newsletter and never miss important updates, program announcements, and community news.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Newsletters Section */}
      <section className="py-20 px-6 md:px-12 dark:bg-neutral-900/50 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-black dark:text-white text-neutral-900 mb-4">Newsletters</h2>
            <p className="text-lg dark:text-neutral-400 text-neutral-600">
              Download our latest newsletters to stay informed about programs, events, and updates.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {newsletters
              .map((newsletter, n) => (
                <motion.div
                  key={n}
                  variants={itemVariants}
                  className="dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 border rounded-xl p-6 hover:border-sky-500/50 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Mail className="w-6 h-6 dark:text-sky-400 text-sky-600 shrink-0" />
                    <span className="text-xs font-semibold dark:bg-neutral-800 bg-neutral-100 dark:text-neutral-400 text-neutral-600 px-3 py-1 rounded-full">
                      {newsletter.month}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold dark:text-white text-neutral-900 mb-2 group-hover:dark:text-sky-400 group-hover:text-sky-600 transition-colors">
                    {newsletter.year}
                  </h3>
                  <a
                    href={newsletter.downloadUrl}
                    target="_blank"
                    className="inline-flex items-center gap-2 dark:text-sky-400 text-sky-600 hover:dark:text-sky-300 hover:text-sky-700 font-semibold text-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                </motion.div>
              ))
              .reverse()}
          </motion.div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-black dark:text-white text-neutral-900 mb-4">Club Resources</h2>
            <p className="text-lg dark:text-neutral-400 text-neutral-600">
              Access important documents, guides, and tools to make the most of your membership.
            </p>
          </motion.div>

          {/* Resources Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {resources.map((resource, r) => (
              <motion.div
                key={r}
                variants={itemVariants}
                className="dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 border rounded-xl p-6 hover:border-sky-500/50 transition-colors group"
              >
                <h3 className="text-lg font-bold dark:text-white text-neutral-900 mb-2 group-hover:dark:text-sky-400 group-hover:text-sky-600 transition-colors">
                  {resource.title}
                </h3>
                {resource.downloadUrl && (
                  <a
                    href={resource.downloadUrl}
                    target="_blank"
                    className="inline-flex items-center gap-2 dark:text-sky-400 text-sky-600 hover:dark:text-sky-300 hover:text-sky-700 font-semibold text-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="dark:bg-neutral-900/50 bg-neutral-50 py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-black dark:text-white text-neutral-900">Can't Find What You Need?</h2>
            <p className="text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl mx-auto">
              Our team is here to help. Contact us with any questions or to request additional resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:781-593-1772"
                className="px-6 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
              >
                Call Us
              </a>
              <a
                href="mailto:info@bgcl.org"
                className="px-6 py-3 dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:text-white text-neutral-900 font-semibold rounded-lg transition-colors"
              >
                Send Email
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
