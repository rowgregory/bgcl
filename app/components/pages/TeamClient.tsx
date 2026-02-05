'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ITeamMember } from '@/types/entities/team-member'
import { Mail, Phone } from 'lucide-react'
import Picture from '../common/Picture'
import SqyshCard from '../SqyshCard'

const TabButton = ({
  active,
  onClick,
  children
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) => (
  <button
    onClick={onClick}
    className={`px-0 py-2 mr-8 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 rounded-lg overflow-hidden border hover:border-sky-500/50 transition-colors group flex flex-col h-full"
    >
      {member.image && (
        <div className="relative shrink-0 h-92 overflow-hidden dark:bg-neutral-800 bg-neutral-100">
          <Picture
            src={member.image}
            alt={member.name}
            priority={true}
            className="object-cover object-top group-hover:scale-105 transition-transform duration-300 w-full h-full"
          />
        </div>
      )}

      <div className={`p-4 grow flex flex-col ${isStaffWithContact ? 'justify-between' : ''}`}>
        <h3 className={`text-lg font-bold dark:text-white text-neutral-900 ${member?.isSqysh ? 'sqysh-gradient' : ''}`}>
          {member.name}
        </h3>
        <p className="dark:text-sky-400 text-sky-600 font-semibold text-sm mt-1">{member.title}</p>
        <p className="dark:text-neutral-100 text-neutral-600 text-sm">{member.company}</p>

        {/* Contact Information for Staff */}
        {isStaffWithContact && (
          <div className="pt-3 border-t dark:border-neutral-700 border-neutral-200 space-y-2 mt-3">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="flex items-center gap-2 text-xs dark:text-neutral-400 text-neutral-600 hover:dark:text-sky-400 hover:text-sky-600 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{member.email}</span>
              </a>
            )}
            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                className="flex items-center gap-2 text-xs dark:text-neutral-400 text-neutral-600 hover:dark:text-sky-400 hover:text-sky-600 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{member.phone}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export const TeamClient = ({ team }) => {
  const [activeTab, setActiveTab] = useState<'board' | 'staff'>('board')
  const [boardSubTab, setBoardSubTab] = useState<'officers' | 'directors' | 'corporators'>('officers')
  const [staffSubTab, setStaffSubTab] = useState<'admin' | 'program' | 'maintenance' | 'tech'>('admin')

  return (
    <div className="dark:bg-neutral-950 bg-white">
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
        <div className="max-w-334 mx-auto">
          <motion.div
            className="space-y-4 sm:space-y-6 mb-12 sm:mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-3 sm:space-y-4">
              <p className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
                MEET OUR TEAM
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
                {activeTab === 'board' ? 'Board of Directors' : 'Our Team'}
              </h1>
              <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">
                {activeTab === 'board'
                  ? 'Our Board of Directors provides strategic guidance and governance to ensure we continue our mission of transforming youth lives'
                  : 'Dedicated professionals committed to transforming lives and building brighter futures for our youth.'}
              </p>
            </div>
          </motion.div>

          {/* Main Tabs - Left Aligned with Border Bottom */}
          <div className="flex mb-8 sm:mb-12 dark:border-neutral-800 border-neutral-200 border-b overflow-x-auto">
            <TabButton active={activeTab === 'board'} onClick={() => setActiveTab('board')}>
              BOARD OF DIRECTORS
            </TabButton>
            <TabButton active={activeTab === 'staff'} onClick={() => setActiveTab('staff')}>
              STAFF
            </TabButton>
          </div>

          {activeTab === 'board' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 sm:space-y-12"
            >
              {/* Board Sub Tabs */}
              <div className="flex dark:border-neutral-800 border-neutral-200 border-b overflow-x-auto">
                <TabButton active={boardSubTab === 'officers'} onClick={() => setBoardSubTab('officers')}>
                  OFFICERS
                </TabButton>
                <TabButton active={boardSubTab === 'directors'} onClick={() => setBoardSubTab('directors')}>
                  DIRECTORS
                </TabButton>
                <TabButton active={boardSubTab === 'corporators'} onClick={() => setBoardSubTab('corporators')}>
                  CORPORATORS
                </TabButton>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                key={boardSubTab}
              >
                {boardSubTab === 'officers' && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black dark:text-white text-neutral-900 mb-8 sm:mb-12 uppercase">
                      Officers
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {team?.boardMembers.officers.map((member) => (
                        <TeamMemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                )}

                {boardSubTab === 'directors' && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black dark:text-white text-neutral-900 mb-8 sm:mb-12 uppercase">
                      Directors
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {team?.boardMembers.directors.map((member) => (
                        <TeamMemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                )}

                {boardSubTab === 'corporators' && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black dark:text-white text-neutral-900 mb-8 sm:mb-12 uppercase">
                      Corporators
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {team?.boardMembers.corporators.map((member) => (
                        <TeamMemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'staff' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 sm:space-y-12"
            >
              {/* Staff Sub Tabs */}
              <div className="flex dark:border-neutral-800 border-neutral-200 border-b overflow-x-auto">
                <TabButton active={staffSubTab === 'admin'} onClick={() => setStaffSubTab('admin')}>
                  ADMINISTRATION
                </TabButton>
                <TabButton active={staffSubTab === 'program'} onClick={() => setStaffSubTab('program')}>
                  PROGRAM
                </TabButton>
                <TabButton active={staffSubTab === 'maintenance'} onClick={() => setStaffSubTab('maintenance')}>
                  MAINTENANCE
                </TabButton>
                <TabButton active={staffSubTab === 'tech'} onClick={() => setStaffSubTab('tech')}>
                  TECH
                </TabButton>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                key={staffSubTab}
              >
                {staffSubTab === 'admin' && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black dark:text-white text-neutral-900 mb-8 sm:mb-12 uppercase">
                      Administration
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {team?.staffMembers.admin.map((member) => (
                        <TeamMemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                )}

                {staffSubTab === 'program' && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black dark:text-white text-neutral-900 mb-8 sm:mb-12 uppercase">
                      Program Staff
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {team?.staffMembers.program.map((member) => (
                        <TeamMemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                )}

                {staffSubTab === 'maintenance' && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black dark:text-white text-neutral-900 mb-8 sm:mb-12 uppercase">
                      Maintenance
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {team?.staffMembers.maintenance.map((member) => (
                        <TeamMemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                )}
                {staffSubTab === 'tech' && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black dark:text-white text-neutral-900 mb-8 sm:mb-12 uppercase">
                      Tech
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {[
                        {
                          company: '',
                          email: '',
                          id: 'id-sqysh',
                          image:
                            'https://firebasestorage.googleapis.com/v0/b/boys-and-girls-club-of-l-a2ad0.firebasestorage.app/o/images%2Fsqysh.gif?alt=media&token=11846ff4-63a3-4bf8-9b49-c913daa4870a',
                          name: '',
                          phone: '',
                          role: 'tech_staff',
                          title: '',
                          isSqysh: true
                        }
                      ].map((member) => (
                        <SqyshCard key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
