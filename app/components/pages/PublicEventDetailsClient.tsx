'use client'

import { CasinoSignInPrompt } from '../events/casino/CasinoSignInPrompt'
import { CasinoTicketMarquee } from '../events/casino/CasinoTicketMarquee'
import { CasinoWidgets } from '../events/casino/CasinoWidgets'
import { CasinoHero } from '../events/casino/CasinoHero'
import { CasinoStyles, GoldDivider, MetaItem, SectionHeading } from '../events/casino/CasinoUiElements'
import { CasinoSponsorTiers } from '../events/casino/CasinoSponsorTiers'
import { CasinoPrizesAndSchedule } from '../events/casino/CasinoPrizesAndSchedule'
import { CasinoRaffleStats } from '../events/casino/CasinoRaffleStats'
import { CasinoDressCodeAndHighlights } from '../events/casino/CasinoDressCodeAndHighlights'
import { CasinoIntro } from '../events/casino/CasinoIntro'
import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import AddToCartToast from '../unique/AddToCartToast'
import { VantaBackgroundCells } from '../unique/VantaBackground'
import { formatDate } from '@/app/lib/utils/date-utils'
import { formatTime } from '@/app/lib/utils/time-utils'
import { TPublicEventDetailsClient } from '@/types/casino.types'
import { CasinoIndividualTicket } from '../events/casino/CasinoIndividualTicket'
import { CasinoBlackjackTicket } from '../events/casino/CasinoBlackjackTicket'

export function PublicEventDetailsClient({ data, name, savedCards }: TPublicEventDetailsClient) {
  const [introComplete, setIntroComplete] = useState(false)

  const prizes = data?.rafflePrizes ?? []
  const schedule = data?.raffleSchedule ?? []

  const handleIntroComplete = useCallback(() => setIntroComplete(true), [])

  return (
    <>
      <CasinoIntro onComplete={handleIntroComplete} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: introComplete ? 1 : 0 }} transition={{ duration: 0.6 }}>
        <VantaBackgroundCells>
          <div className="casino-page text-white min-h-screen">
            <style>{CasinoStyles}</style>
            <AddToCartToast />

            <div className="max-w-270 mx-auto px-5">
              {/* ── Fixed Buttons ───────────────────────────────────────────────────── */}
              <CasinoWidgets data={data} />

              {/* ── Hero ───────────────────────────────────────────────────── */}
              <CasinoHero data={data} />

              {/* ── MARQUEE ───────────────────────────────────────────────────── */}
              {data?.showTicketMarquee && (
                <CasinoTicketMarquee
                  tickets={data.tickets}
                  eventId={data.id}
                  eventTitle={data.title}
                  ticketSalesStartDate={data.ticketSalesStartDate}
                  ticketSalesEndDate={data.ticketSalesEndDate}
                />
              )}
              <GoldDivider />

              {/* ── SIGN IN PROMPT ───────────────────────────────────────────────────── */}
              <CasinoSignInPrompt eventSlug={data.id} name={name} savedCards={savedCards} />

              <GoldDivider />

              {/* ── RAFFLE TICKET TIER ─────────────────────────────────────────────── */}
              {data?.tickets?.some((t: any) => t.ticketType === 'RAFFLE') && (
                <>
                  <CasinoIndividualTicket data={data} />
                  <GoldDivider />
                </>
              )}

              {/* ── BLACKJACK TOURNAMENT TIER ─────────────────────────────────────────────── */}
              {data?.tickets?.some((t: any) => t.ticketType === 'TOURNAMENT') && (
                <>
                  <CasinoBlackjackTicket data={data} />
                  <GoldDivider />
                </>
              )}

              {/* ── SPONSOR TIERS ─────────────────────────────────────────────── */}
              {data?.tickets?.some((t: any) => t.ticketType === 'SPONSORSHIP') && (
                <>
                  <CasinoSponsorTiers data={data} />
                  <GoldDivider />
                </>
              )}

              {/* ── PRIZES + SCHEDULE ─────────────────────────────────────────── */}
              {(prizes.length > 0 || schedule.length > 0) && (
                <>
                  <CasinoPrizesAndSchedule prizes={prizes} schedule={schedule} />
                  <GoldDivider />
                </>
              )}

              {/* ── RAFFLE STATS ──────────────────────────────────────────────── */}
              {data?.isRaffle && (data?.raffleGrandPrizeLabel || data?.raffleTicketPrice || data?.raffleOddsLabel) && (
                <>
                  <CasinoRaffleStats data={data} />
                  <GoldDivider />
                </>
              )}

              {/* ── DRESS CODE & HIGHLIGHTS ──────────────────────────────────── */}
              {(data?.dressCodeHeadline ||
                data?.dressCodeItems?.length > 0 ||
                data?.dressCodeNote ||
                data?.bestDressedPrizes) && (
                <>
                  <CasinoDressCodeAndHighlights data={data} />
                  <GoldDivider />
                </>
              )}

              {/* ── DRAW DATE ─────────────────────────────────────────────────── */}
              {data?.raffleDrawDate && (
                <>
                  <section aria-labelledby="draw-heading" className="text-center pb-4">
                    <p className="oswald text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600/55 mb-4">
                      ✦ Raffle Draw ✦
                    </p>
                    <h2
                      id="draw-heading"
                      className="oswald font-black uppercase text-white leading-none mb-2"
                      style={{ fontSize: 'clamp(28px, 6vw, 52px)' }}
                    >
                      {formatDate(data.raffleDrawDate, { weekday: 'long' })}
                    </h2>
                    <p className="text-lg text-white/30 mb-8">
                      {formatTime(data.raffleDrawDate)}&nbsp;EST &nbsp;·&nbsp;
                    </p>
                  </section>
                  <GoldDivider />
                </>
              )}

              {/* ── ABOUT ─────────────────────────────────────────────────────── */}
              {data?.description && (
                <>
                  <section
                    aria-labelledby="about-heading"
                    className="max-w-180 mx-auto text-center pb-4 flex flex-col items-center"
                  >
                    <SectionHeading suit="♣" id="about-heading">
                      About the Event
                    </SectionHeading>
                    <p className="text-base text-white/40 leading-[1.8]">{data.description}</p>
                  </section>
                  <GoldDivider />
                </>
              )}
              {data?.showTicketMarquee && (
                <>
                  <CasinoTicketMarquee
                    tickets={data.tickets}
                    eventId={data.id}
                    eventTitle={data.title}
                    ticketSalesStartDate={data.ticketSalesStartDate}
                    ticketSalesEndDate={data.ticketSalesEndDate}
                  />
                  <GoldDivider />
                </>
              )}

              {/* ── MISSION / DRESS / REQUIREMENTS / ADDRESS ──────────────────── */}
              {(data?.missionStatement || data?.dresscode || data?.requirements || data?.address) && (
                <>
                  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 pb-4">
                    {data?.missionStatement && (
                      <MetaItem label="Mission">
                        <span className="italic text-white/35">&ldquo;{data.missionStatement}&rdquo;</span>
                      </MetaItem>
                    )}
                    {data?.dresscode && (
                      <MetaItem label="Dress Code">
                        <span className="text-white/45">{data.dresscode}</span>
                      </MetaItem>
                    )}
                    {data?.requirements && (
                      <MetaItem label="Requirements">
                        <span className="text-white/45">{data.requirements}</span>
                      </MetaItem>
                    )}
                    {data?.address && (
                      <MetaItem label="Venue Address">
                        <span className="text-white/45">{data.address}</span>
                      </MetaItem>
                    )}
                  </section>
                  <GoldDivider />
                </>
              )}

              {/* ── TERMS ─────────────────────────────────────────────────────── */}
              {data?.raffleTerms && (
                <p className="text-[11px] text-white/30 leading-[1.7] text-center pb-12">* {data.raffleTerms}</p>
              )}

              {/* ── FOOTER ────────────────────────────────────────────────────── */}
              <div className="border-t border-amber-500/20 py-6 pb-12 flex flex-col items-center gap-3">
                <div className="flex gap-4 text-base font-black" aria-hidden="true">
                  {['♠', '♥', '♦', '♣'].map((s) => (
                    <span key={s} className="text-amber-500/30 suit">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-white/30 text-center">
                  © {new Date().getFullYear()} &nbsp; Boys &amp; Girls Club of Lynn &nbsp;·&nbsp; 25 North Common
                  Street, Lynn, MA 01902 &nbsp;·&nbsp; (781) 593-1772
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] text-white/30 tracking-[0.08em]">powered by</p>

                  <a
                    href="https://sqysh.io?lead_source=bgcl-casino-madness"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Powered by Sqysh"
                    className="group focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/30 rounded"
                  >
                    <span
                      className="oswald text-sm font-black uppercase tracking-[0.2em] group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #6b4e00, #d4af37, #f5e678, #d4af37, #6b4e00)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        opacity: 0.6
                      }}
                    >
                      Sqysh
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </VantaBackgroundCells>
      </motion.div>
    </>
  )
}
