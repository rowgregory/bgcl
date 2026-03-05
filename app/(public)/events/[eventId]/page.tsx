import Picture from '@/app/components/common/Picture'
import { KeyEventInfo } from '@/app/components/events/KeyEventInfo'
import { TicketCard } from '@/app/components/ticket/TicketCard'
import { getEventById } from '@/app/lib/actions/getEventById'
import { selectCartItems } from '@/app/lib/store/slices/cartSlice'
import { formatEnumLabel } from '@/app/lib/utils/formatEnumLabel'
import { Clock, Users, Tag, Info, Shirt, Video, Globe, User, ChevronRight, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export default async function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params
  const event = await getEventById(eventId)

  const spotsRemaining = event.capacity - event.attendeeCount
  const percentageFilled = (event.attendeeCount / event.capacity) * 100
  const cartItems = selectCartItems

  return (
    <div className="dark:bg-neutral-950 bg-white min-h-screen">
      <nav
        aria-label="Breadcrumb"
        className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <ol className="flex items-center gap-2 text-sm min-w-0" role="list">
            <li>
              <Link
                href="/"
                className="dark:text-neutral-400 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3.5 h-3.5 dark:text-neutral-600 text-neutral-400 shrink-0" />
            </li>
            <li>
              <Link
                href="/events"
                className="dark:text-neutral-400 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              >
                Events
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3.5 h-3.5 dark:text-neutral-600 text-neutral-400 shrink-0" />
            </li>
            <li className="min-w-0">
              <span
                className="dark:text-white text-neutral-900 font-medium truncate max-w-32 sm:max-w-xs block"
                aria-current="page"
              >
                {event.title}
              </span>
            </li>
          </ol>

          {/* Cart */}
          <button
            // onClick={() =>store.dispatch(setOpenCartDrawer())}
            aria-label={`Open cart, ${cartItems.length} item${cartItems.length !== 1 ? 's' : ''}`}
            className="relative p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 shrink-0"
          >
            <ShoppingCart className="w-5 h-5 dark:text-neutral-400 text-neutral-500" aria-hidden="true" />
            {cartItems.length > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-sky-500 text-white text-[9px] font-bold rounded-full"
              >
                {cartItems.length > 99 ? '99+' : cartItems.length}
              </span>
            )}
          </button>
        </div>
      </nav>
      <header className="bg-linear-to-br from-sky-600 to-sky-700 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08]"
          aria-hidden="true"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0 0v34M0 50l28 16 28-16' stroke='%23fff' stroke-width='1' fill='none'/%3E%3C/svg%3E")`
          }}
        />
        <div className="dark:bg-black/20 bg-white/10 absolute inset-0" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-white shadow-lg flex items-center justify-center p-1.5">
              <Picture
                src="/images/vertical-logo-light.png"
                alt="Boys & Girls Club of Lynn"
                className="w-full h-full object-contain"
                priority
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2" role="list" aria-label="Event tags">
                <span
                  role="listitem"
                  className="bg-white/20 border-white/30 px-2 py-0.5 backdrop-blur-md rounded-full text-xs font-semibold text-white border"
                >
                  {event.category}
                </span>
                <span
                  role="listitem"
                  aria-label={`Status: ${event.status}`}
                  className={`px-2 py-0.5 backdrop-blur-md rounded-full text-xs font-semibold border ${
                    event.status === 'ONGOING'
                      ? 'bg-emerald-500/30 border-emerald-400/60 text-white'
                      : event.status === 'UPCOMING'
                        ? 'bg-yellow-500/30 border-yellow-400/60 text-white'
                        : 'bg-white/30 border-white/40 text-white'
                  }`}
                >
                  {event.status}
                </span>
                {event.featured && (
                  <span
                    role="listitem"
                    className="bg-yellow-500/30 border-yellow-400/60 text-white px-2 py-0.5 backdrop-blur-md rounded-full text-xs font-semibold border"
                  >
                    <span aria-hidden="true">⭐ </span>Featured
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-2xl leading-tight truncate">
                {event.title}
              </h1>

              {event.description && (
                <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-2xl leading-relaxed line-clamp-2">
                  {event.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <KeyEventInfo event={event} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details Card */}
            <section
              aria-labelledby="event-details-heading"
              className="dark:bg-neutral-800/50 dark:border-neutral-700/50 bg-white border-neutral-200 rounded-2xl shadow-lg sm:shadow-2xl p-5 sm:p-8 border"
            >
              <h2
                id="event-details-heading"
                className="text-2xl sm:text-3xl font-bold dark:text-white text-neutral-900 mb-6 sm:mb-8 flex items-center gap-3"
              >
                <div
                  className="w-1.5 h-7 sm:h-8 bg-linear-to-br from-sky-500 to-sky-600 rounded-full shrink-0"
                  aria-hidden="true"
                />
                Event Details
              </h2>

              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4 sm:gap-6">
                {/* Type */}
                <div className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-50 border-neutral-200 flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border">
                  <div className="bg-sky-500/10 dark:bg-sky-500/20 p-2 rounded-lg shrink-0" aria-hidden="true">
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5 dark:text-sky-400 text-sky-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm font-medium">Event Type</p>
                    <p className="font-semibold dark:text-white text-neutral-900 mt-1 text-sm sm:text-base truncate">
                      {formatEnumLabel(event.type)}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                {event.duration && (
                  <div className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-50 border-neutral-200 flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border">
                    <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-lg shrink-0" aria-hidden="true">
                      <Clock className="dark:text-blue-400 text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm font-medium">Duration</p>
                      <p className="font-semibold dark:text-white text-neutral-900 mt-1 text-sm sm:text-base">
                        {event.duration} hours
                      </p>
                    </div>
                  </div>
                )}

                {/* Dress Code */}
                {event.dresscode && (
                  <div className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-50 border-neutral-200 flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border">
                    <div className="bg-sky-500/10 dark:bg-sky-500/20 p-2 rounded-lg shrink-0" aria-hidden="true">
                      <Shirt className="w-4 h-4 sm:w-5 sm:h-5 dark:text-sky-400 text-sky-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm font-medium">
                        Dress Code
                      </p>
                      <p className="font-semibold dark:text-white text-neutral-900 mt-1 text-sm sm:text-base">
                        {event.dresscode}
                      </p>
                    </div>
                  </div>
                )}

                {/* Host */}
                {event.host && (
                  <div className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-50 border-neutral-200 flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border">
                    <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-lg shrink-0" aria-hidden="true">
                      <User className="dark:text-blue-400 text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm font-medium">Hosted By</p>
                      <p className="font-semibold dark:text-white text-neutral-900 mt-1 text-sm sm:text-base truncate">
                        {event.host}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Requirements & Materials */}
              {(event.requirements || event.materials) && (
                <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                  {event.requirements && (
                    <div className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-50 border-neutral-200 p-3 sm:p-4 rounded-xl border">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 dark:text-sky-400 text-sky-600 shrink-0" aria-hidden="true" />
                        <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm font-semibold">
                          Requirements
                        </p>
                      </div>
                      <p className="dark:text-white text-neutral-900 leading-relaxed text-sm sm:text-base">
                        {event.requirements}
                      </p>
                    </div>
                  )}
                  {event.materials && (
                    <div className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-50 border-neutral-200 p-3 sm:p-4 rounded-xl border">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 dark:text-sky-400 text-sky-600 shrink-0" aria-hidden="true" />
                        <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm font-semibold">
                          Materials Needed
                        </p>
                      </div>
                      <p className="dark:text-white text-neutral-900 leading-relaxed text-sm sm:text-base">
                        {event.materials}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Links Section */}
            {(event.registrationUrl || event.meetingUrl) && (
              <section
                aria-labelledby="quick-links-heading"
                className="dark:bg-neutral-800/50 dark:border-neutral-700/50 bg-white border-neutral-200 rounded-2xl shadow-lg sm:shadow-2xl p-5 sm:p-8 border"
              >
                <h3
                  id="quick-links-heading"
                  className="text-xl sm:text-2xl font-bold dark:text-white text-neutral-900 mb-4 sm:mb-6 flex items-center gap-3"
                >
                  <div
                    className="w-1.5 h-5 sm:h-6 bg-linear-to-br from-sky-500 to-sky-600 rounded-full shrink-0"
                    aria-hidden="true"
                  />
                  Quick Links
                </h3>
                <div className="space-y-3">
                  {event.registrationUrl && (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 sm:p-4 bg-linear-to-br from-sky-500 to-sky-600 hover:opacity-90 rounded-xl font-semibold text-white transition-all shadow-lg group focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-sky-600 text-sm sm:text-base"
                      aria-label="External Registration — opens in new tab"
                    >
                      <Globe
                        className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:scale-110 transition-transform"
                        aria-hidden="true"
                      />
                      External Registration
                      <span className="sr-only">(opens in new tab)</span>
                    </a>
                  )}
                  {event.meetingUrl && (
                    <a
                      href={event.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 sm:p-4 bg-linear-to-br from-sky-500 to-sky-600 hover:opacity-90 rounded-xl font-semibold text-white transition-all shadow-lg group focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-sky-600 text-sm sm:text-base"
                      aria-label="Virtual Meeting Link — opens in new tab"
                    >
                      <Video
                        className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:scale-110 transition-transform"
                        aria-hidden="true"
                      />
                      Virtual Meeting Link
                      <span className="sr-only">(opens in new tab)</span>
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Tickets Section */}
            <section
              aria-labelledby="tickets-heading"
              className="dark:bg-neutral-800/50 dark:border-neutral-700/50 bg-white border-neutral-200 rounded-2xl shadow-lg sm:shadow-2xl p-5 sm:p-8 border"
            >
              <h2
                id="tickets-heading"
                className="text-2xl sm:text-3xl font-bold dark:text-white text-neutral-900 mb-6 sm:mb-8 flex items-center gap-3"
              >
                <div
                  className="w-1.5 h-7 sm:h-8 bg-linear-to-br from-sky-500 to-sky-600 rounded-full shrink-0"
                  aria-hidden="true"
                />
                Tickets
              </h2>

              {event.tickets.length === 0 ? (
                <div className="text-center py-10 sm:py-16" role="status">
                  <div
                    className="dark:bg-neutral-700/50 bg-neutral-200 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    aria-hidden="true"
                  >
                    <Tag className="dark:text-neutral-500 text-neutral-400 w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <p className="dark:text-neutral-400 text-neutral-600 text-base sm:text-lg">
                    No tickets available yet.
                  </p>
                  {event.requiresRSVP && (
                    <p className="dark:text-neutral-500 text-neutral-500 text-xs sm:text-sm mt-2">
                      RSVP required for this event
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4 sm:gap-6">
                  {event.tickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={{ ...ticket, eventId: event.id, eventTitle: event.title }} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <aside className="space-y-6" aria-label="Event sidebar">
            {/* Registration Deadline */}
            {event.registrationDeadline && (
              <div className="dark:bg-linear-to-br dark:from-cyan-500/20 dark:to-blue-500/20 bg-linear-to-br from-cyan-50 to-blue-50 dark:border-sky-500/30 border-cyan-200 rounded-2xl p-5 sm:p-6 border shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 dark:text-sky-400 text-sky-600 shrink-0" aria-hidden="true" />
                  <h3 className="text-base sm:text-lg font-bold dark:text-white text-neutral-900">
                    Registration Deadline
                  </h3>
                </div>
                <p className="dark:text-cyan-100 text-cyan-700 font-medium text-sm sm:text-base">
                  <time dateTime={new Date(event.registrationDeadline).toISOString()}>
                    {new Date(event.registrationDeadline).toLocaleDateString()}
                  </time>
                </p>
              </div>
            )}

            {/* Capacity Progress */}
            <div className="dark:bg-neutral-800/50 dark:border-neutral-700/50 bg-white border-neutral-200 rounded-2xl shadow-lg sm:shadow-2xl p-5 sm:p-6 border">
              <h3 className="text-lg sm:text-xl font-bold dark:text-white text-neutral-900 mb-4 sm:mb-6 flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 dark:text-sky-400 text-sky-600 shrink-0" aria-hidden="true" />
                Attendance
              </h3>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="dark:text-neutral-400 text-neutral-600 font-medium">Registered</span>
                  <span className="font-bold dark:text-white text-neutral-900 text-base sm:text-lg">
                    {event.attendeeCount} / {event.capacity}
                  </span>
                </div>

                <div
                  role="progressbar"
                  aria-valuenow={percentageFilled}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${percentageFilled}% capacity filled`}
                  className="dark:bg-neutral-700/50 bg-neutral-200 w-full rounded-full h-3 sm:h-4 overflow-hidden border dark:border-neutral-600/50 border-neutral-300"
                >
                  <div
                    className={`h-full rounded-full transition-all shadow-lg ${
                      percentageFilled >= 90
                        ? 'bg-linear-to-r from-red-500 to-pink-500'
                        : percentageFilled >= 70
                          ? 'bg-linear-to-r from-yellow-500 to-orange-500'
                          : 'bg-linear-to-br from-sky-500 to-sky-600'
                    }`}
                    style={{ width: `${Math.min(percentageFilled, 100)}%` }}
                  />
                </div>

                <div
                  className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-50 border-neutral-200 text-center p-2.5 sm:p-3 rounded-xl border"
                  role="status"
                >
                  {spotsRemaining > 0 ? (
                    <span className="dark:text-sky-400 text-sky-600 font-bold text-base sm:text-lg">
                      {spotsRemaining} spots remaining
                    </span>
                  ) : (
                    <span className="dark:text-red-400 text-red-600 font-bold text-base sm:text-lg">Event is full</span>
                  )}
                </div>
              </div>
            </div>

            {/* Event Stats */}
            <div className="dark:bg-neutral-800/50 dark:border-neutral-700/50 bg-white border-neutral-200 rounded-2xl shadow-lg sm:shadow-2xl p-5 sm:p-6 border">
              <h3 className="text-lg sm:text-xl font-bold dark:text-white text-neutral-900 mb-4 sm:mb-6">Event Info</h3>

              <div className="space-y-3 sm:space-y-4">
                <div className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-50 border-neutral-200 flex justify-between items-center p-2.5 sm:p-3 rounded-xl border">
                  <span className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm font-medium">
                    Visibility
                  </span>
                  <span
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold border ${
                      event.isPublic
                        ? 'dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30 bg-sky-50 text-sky-600 border-sky-200'
                        : 'dark:bg-neutral-500/20 dark:text-neutral-400 dark:border-neutral-500/30 bg-neutral-100 text-neutral-600 border-neutral-300'
                    }`}
                  >
                    {event.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>

                {event.requiresRSVP && (
                  <div className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-50 border-neutral-200 flex justify-between items-center p-2.5 sm:p-3 rounded-xl border">
                    <span className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm font-medium">RSVP</span>
                    <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold border dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30 bg-sky-50 text-sky-600 border-sky-200">
                      Required
                    </span>
                  </div>
                )}

                {event.allowMultipleTickets && (
                  <div className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-50 border-neutral-200 flex justify-between items-center p-2.5 sm:p-3 rounded-xl border">
                    <span className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm font-medium">
                      Multiple Tickets
                    </span>
                    <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold border dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30 bg-sky-50 text-sky-600 border-sky-200">
                      Allowed
                    </span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
