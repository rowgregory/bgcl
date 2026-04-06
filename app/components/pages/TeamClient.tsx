'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ITeamMember } from '@/types/entities/team-member'
import { Mail, Phone } from 'lucide-react'
import Picture from '../common/Picture'
import SqyshCard from '../SqyshCard'

type TTabButton = {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  id: string
  controls: string
}

const TabButton = ({ active, onClick, children, id, controls }: TTabButton) => (
  <button
    role="tab"
    id={id}
    aria-selected={active}
    aria-controls={controls}
    onClick={onClick}
    className={`px-0 py-2 mr-8 font-semibold text-sm transition-all border-b-2 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
      active
        ? 'dark:text-white text-neutral-900 dark:border-sky-600 border-sky-600'
        : 'dark:text-neutral-400 text-neutral-600 dark:border-transparent border-transparent dark:hover:text-neutral-300 hover:text-neutral-700'
    }`}
  >
    {children}
  </button>
)

const TeamMemberCard = ({ member }: { member: ITeamMember }) => {
  const isStaffWithContact =
    member.role === 'program_staff' || member.role === 'admin_staff' || member.email || member.phone

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      aria-label={`${member.name}${member.title ? `, ${member.title}` : ''}`}
      className="dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 rounded-lg overflow-hidden border hover:border-sky-500/50 transition-colors group flex flex-col h-full"
    >
      {member.image && (
        <div className="relative shrink-0 h-92 overflow-hidden dark:bg-neutral-800 bg-neutral-100" aria-hidden="true">
          <Picture
            src={member.image}
            alt=""
            decorative
            className="object-cover object-top group-hover:scale-105 transition-transform duration-300 w-full h-full"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      )}

      <div className={`p-4 grow flex flex-col ${isStaffWithContact ? 'justify-between' : ''}`}>
        <div>
          <h3
            className={`text-lg font-bold dark:text-white text-neutral-900 ${member?.isSqysh ? 'sqysh-gradient' : ''}`}
          >
            {member.name}
          </h3>
          {member.title && <p className="dark:text-sky-400 text-sky-600 font-semibold text-sm mt-1">{member.title}</p>}
          {member.company && <p className="dark:text-neutral-100 text-neutral-600 text-sm">{member.company}</p>}
        </div>

        {/* Contact Information for Staff */}
        {isStaffWithContact && (
          <div className="pt-3 border-t dark:border-neutral-700 border-neutral-200 space-y-2 mt-3">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                aria-label={`Email ${member.name} at ${member.email}`}
                className="flex items-center gap-2 text-xs dark:text-neutral-400 text-neutral-600 hover:dark:text-sky-400 hover:text-sky-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{member.email}</span>
              </a>
            )}
            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                aria-label={`Call ${member.name} at ${member.phone}`}
                className="flex items-center gap-2 text-xs dark:text-neutral-400 text-neutral-600 hover:dark:text-sky-400 hover:text-sky-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{member.phone}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  )
}

export const TeamClient = ({ team, pageData }) => {
  const t = pageData?.sections?.team

  const [activeTab, setActiveTab] = useState<'board' | 'staff'>('board')
  const [boardSubTab, setBoardSubTab] = useState<'officers' | 'directors' | 'corporators'>('officers')
  const [staffSubTab, setStaffSubTab] = useState<'admin' | 'program' | 'maintenance' | 'tech'>('admin')

  return (
    <main id="main-content" className="dark:bg-neutral-950 bg-white">
      <section aria-labelledby="team-heading" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
        <div className="max-w-334 mx-auto">
          <motion.div
            className="space-y-4 sm:space-y-6 mb-12 sm:mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-3 sm:space-y-4">
              <p className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
                {t?.eyebrow}
              </p>
              <h1
                id="team-heading"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight"
              >
                {activeTab === 'board' ? t?.board_heading : t?.staff_heading}
              </h1>
              <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">
                {activeTab === 'board' ? t?.board_subheading : t?.staff_subheading}
              </p>
            </div>
          </motion.div>

          {/* Main Tabs */}
          <div
            role="tablist"
            aria-label="Team categories"
            className="flex mb-8 sm:mb-12 dark:border-neutral-800 border-neutral-200 border-b overflow-x-auto"
          >
            <TabButton
              active={activeTab === 'board'}
              onClick={() => setActiveTab('board')}
              id="tab-board"
              controls="panel-board"
            >
              Board of Directors
            </TabButton>
            <TabButton
              active={activeTab === 'staff'}
              onClick={() => setActiveTab('staff')}
              id="tab-staff"
              controls="panel-staff"
            >
              Staff
            </TabButton>
          </div>

          {/* Board Panel */}
          <div id="panel-board" role="tabpanel" aria-labelledby="tab-board" hidden={activeTab !== 'board'}>
            {activeTab === 'board' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 sm:space-y-12"
              >
                {/* Board Sub Tabs */}
                <div
                  role="tablist"
                  aria-label="Board member categories"
                  className="flex dark:border-neutral-800 border-neutral-200 border-b overflow-x-auto"
                >
                  <TabButton
                    active={boardSubTab === 'officers'}
                    onClick={() => setBoardSubTab('officers')}
                    id="tab-officers"
                    controls="panel-officers"
                  >
                    Officers
                  </TabButton>
                  <TabButton
                    active={boardSubTab === 'directors'}
                    onClick={() => setBoardSubTab('directors')}
                    id="tab-directors"
                    controls="panel-directors"
                  >
                    Directors
                  </TabButton>
                  <TabButton
                    active={boardSubTab === 'corporators'}
                    onClick={() => setBoardSubTab('corporators')}
                    id="tab-corporators"
                    controls="panel-corporators"
                  >
                    Corporators
                  </TabButton>
                </div>

                <motion.div
                  key={boardSubTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {(
                    [
                      { key: 'officers', label: 'Officers', members: team?.boardMembers?.officers },
                      { key: 'directors', label: 'Directors', members: team?.boardMembers?.directors },
                      { key: 'corporators', label: 'Corporators', members: team?.boardMembers?.corporators }
                    ] as const
                  ).map(({ key, label, members }) =>
                    boardSubTab === key ? (
                      <div key={key} id={`panel-${key}`} role="tabpanel" aria-labelledby={`tab-${key}`}>
                        <h2 className="text-2xl sm:text-3xl font-black dark:text-white text-neutral-900 mb-8 sm:mb-12 uppercase">
                          {label}
                        </h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 list-none p-0">
                          {members?.map((member) => (
                            <li key={member.id}>
                              <TeamMemberCard member={member} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null
                  )}
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Staff Panel */}
          <div id="panel-staff" role="tabpanel" aria-labelledby="tab-staff" hidden={activeTab !== 'staff'}>
            {activeTab === 'staff' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 sm:space-y-12"
              >
                {/* Staff Sub Tabs */}
                <div
                  role="tablist"
                  aria-label="Staff categories"
                  className="flex dark:border-neutral-800 border-neutral-200 border-b overflow-x-auto"
                >
                  <TabButton
                    active={staffSubTab === 'admin'}
                    onClick={() => setStaffSubTab('admin')}
                    id="tab-admin"
                    controls="panel-admin"
                  >
                    Administration
                  </TabButton>
                  <TabButton
                    active={staffSubTab === 'program'}
                    onClick={() => setStaffSubTab('program')}
                    id="tab-program"
                    controls="panel-program"
                  >
                    Program
                  </TabButton>
                  <TabButton
                    active={staffSubTab === 'maintenance'}
                    onClick={() => setStaffSubTab('maintenance')}
                    id="tab-maintenance"
                    controls="panel-maintenance"
                  >
                    Maintenance
                  </TabButton>
                  <TabButton
                    active={staffSubTab === 'tech'}
                    onClick={() => setStaffSubTab('tech')}
                    id="tab-tech"
                    controls="panel-tech"
                  >
                    Tech
                  </TabButton>
                </div>

                <motion.div
                  key={staffSubTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {(
                    [
                      { key: 'admin', label: 'Administration', members: team?.staffMembers?.admin },
                      { key: 'program', label: 'Program Staff', members: team?.staffMembers?.program },
                      { key: 'maintenance', label: 'Maintenance', members: team?.staffMembers?.maintenance }
                    ] as const
                  ).map(({ key, label, members }) =>
                    staffSubTab === key ? (
                      <div key={key} id={`panel-${key}`} role="tabpanel" aria-labelledby={`tab-${key}`}>
                        <h2 className="text-2xl sm:text-3xl font-black dark:text-white text-neutral-900 mb-8 sm:mb-12 uppercase">
                          {label}
                        </h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 list-none p-0">
                          {members?.map((member) => (
                            <li key={member.id}>
                              <TeamMemberCard member={member} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null
                  )}

                  {staffSubTab === 'tech' && (
                    <div id="panel-tech" role="tabpanel" aria-labelledby="tab-tech">
                      <h2 className="text-2xl sm:text-3xl font-black dark:text-white text-neutral-900 mb-8 sm:mb-12 uppercase">
                        Tech
                      </h2>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 list-none p-0">
                        <li>
                          <SqyshCard
                            member={{
                              id: 'id-sqysh',
                              image:
                                'https://firebasestorage.googleapis.com/v0/b/boys-and-girls-club-of-l-a2ad0.firebasestorage.app/o/images%2Fsqysh.gif?alt=media&token=11846ff4-63a3-4bf8-9b49-c913daa4870a',
                              name: '',
                              isSqysh: true
                            }}
                          />
                        </li>
                      </ul>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
