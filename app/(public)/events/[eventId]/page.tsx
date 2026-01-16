import KeyEventInfo from '@/app/components/events/KeyEventInfo'
import TicketCard from '@/app/components/ticket/TicketCard'
import { getEventById } from '@/app/lib/actions/getEventById'
import { Clock, Users, Tag, Info, Shirt, Video, Globe, User } from 'lucide-react'

export default async function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params
  const event = await getEventById(eventId)

  const spotsRemaining = event.capacity - event.attendeeCount
  const percentageFilled = (event.attendeeCount / event.capacity) * 100

  return (
    <div className="dark:bg-neutral-950 bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-sky-600 to-sky-700 relative overflow-hidden">
        <div className="dark:bg-black/20 bg-white/20 absolute inset-0" />
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Category & Status Badges */}
              <div className="flex items-center gap-3 mb-6">
                <span className="dark:bg-white/20 dark:border-white/30 dark:text-white bg-white/30 border-white/40 px-4 py-1.5 backdrop-blur-md rounded-full text-sm font-semibold text-white border shadow-lg">
                  {event.category}
                </span>
                <span
                  className={`px-4 py-1.5 backdrop-blur-md rounded-full text-sm font-semibold border shadow-lg ${
                    event.status === 'ONGOING'
                      ? 'dark:bg-emerald-500/30 dark:border-emerald-400/50 dark:text-emerald-100 bg-emerald-500/30 border-emerald-400/60 text-white'
                      : event.status === 'UPCOMING'
                        ? 'dark:bg-yellow-500/30 dark:border-yellow-400/50 dark:text-yellow-100 bg-yellow-500/30 border-yellow-400/60 text-white'
                        : 'dark:bg-neutral-500/30 dark:border-neutral-400/50 dark:text-neutral-100 bg-white/30 border-white/40 text-white'
                  }`}
                >
                  {event.status}
                </span>
                {event.featured && (
                  <span className="dark:bg-yellow-500/30 dark:border-yellow-400/50 dark:text-yellow-100 bg-yellow-500/30 border-yellow-400/60 text-white px-4 py-1.5 backdrop-blur-md rounded-full text-sm font-semibold border shadow-lg">
                    ⭐ Featured
                  </span>
                )}
              </div>

              <h1 className="text-6xl font-bold mb-6 dark:text-white text-white drop-shadow-2xl">{event.title}</h1>

              {event.description && (
                <p className="text-xl dark:text-white/95 text-white/95 mb-8 max-w-3xl leading-relaxed drop-shadow-lg">
                  {event.description}
                </p>
              )}

              {/* Key Event Info */}
              <KeyEventInfo event={event} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details Card */}
            <div className="dark:bg-neutral-800/50 dark:border-neutral-700/50 bg-white border-neutral-200 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border">
              <h2 className="text-3xl font-bold dark:text-white text-neutral-900 mb-8 flex items-center gap-3">
                <div className={`w-1.5 h-8 bg-linear-to-br from-sky-500 to-sky-600 rounded-full`} />
                Event Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type */}
                <div className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-100 border-neutral-300 flex items-start gap-4 p-4 rounded-xl border">
                  <div className={`dark:sky-500/20 sky-500/10 p-2 rounded-lg`}>
                    <Tag className={`w-5 h-5 dark:text-sky-400 text-sky-600`} />
                  </div>
                  <div>
                    <p className="dark:text-neutral-400 text-neutral-600 text-sm font-medium">Event Type</p>
                    <p className="font-semibold dark:text-white text-neutral-900 mt-1">{event.type}</p>
                  </div>
                </div>

                {/* Duration */}
                {event.duration && (
                  <div className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-100 border-neutral-300 flex items-start gap-4 p-4 rounded-xl border">
                    <div className="dark:bg-blue-500/20 bg-blue-100 p-2 rounded-lg">
                      <Clock className="dark:text-blue-400 text-blue-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="dark:text-neutral-400 text-neutral-600 text-sm font-medium">Duration</p>
                      <p className="font-semibold dark:text-white text-neutral-900 mt-1">{event.duration} hours</p>
                    </div>
                  </div>
                )}

                {/* Dress Code */}
                {event.dresscode && (
                  <div className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-100 border-neutral-300 flex items-start gap-4 p-4 rounded-xl border">
                    <div className={`dark:sky-500/20 sky-500/10 p-2 rounded-lg`}>
                      <Shirt className={`w-5 h-5 dark:text-sky-400 text-sky-600`} />
                    </div>
                    <div>
                      <p className="dark:text-neutral-400 text-neutral-600 text-sm font-medium">Dress Code</p>
                      <p className="font-semibold dark:text-white text-neutral-900 mt-1">{event.dresscode}</p>
                    </div>
                  </div>
                )}

                {/* Host */}
                {event.host && (
                  <div className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-100 border-neutral-300 flex items-start gap-4 p-4 rounded-xl border">
                    <div className="dark:bg-blue-500/20 bg-blue-100 p-2 rounded-lg">
                      <User className="dark:text-blue-400 text-blue-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="dark:text-neutral-400 text-neutral-600 text-sm font-medium">Hosted By</p>
                      <p className="font-semibold dark:text-white text-neutral-900 mt-1">{event.host}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Requirements & Materials */}
              {(event.requirements || event.materials) && (
                <div className="mt-6 space-y-4">
                  {event.requirements && (
                    <div className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-100 border-neutral-300 p-4 rounded-xl border">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className={`w-4 h-4 dark:text-sky-400 text-sky-600`} />
                        <p className="dark:text-neutral-400 text-neutral-600 text-sm font-semibold">Requirements</p>
                      </div>
                      <p className="dark:text-white text-neutral-900 leading-relaxed">{event.requirements}</p>
                    </div>
                  )}

                  {event.materials && (
                    <div className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-100 border-neutral-300 p-4 rounded-xl border">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className={`w-4 h-4 dark:text-sky-400 text-sky-600`} />
                        <p className="dark:text-neutral-400 text-neutral-600 text-sm font-semibold">Materials Needed</p>
                      </div>
                      <p className="dark:text-white text-neutral-900 leading-relaxed">{event.materials}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Links Section */}
            {(event.registrationUrl || event.meetingUrl) && (
              <div className="dark:bg-neutral-800/50 dark:border-neutral-700/50 bg-white border-neutral-200 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border">
                <h3 className="text-2xl font-bold dark:text-white text-neutral-900 mb-6 flex items-center gap-3">
                  <div className={`w-1.5 h-6 bg-linear-to-br from-sky-500 to-sky-600 rounded-full`} />
                  Quick Links
                </h3>
                <div className="space-y-3">
                  {event.registrationUrl && (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-4 bg-linear-to-br from-sky-500 to-sky-600 hover:opacity-90 rounded-xl font-semibold text-white transition-all shadow-lg group`}
                    >
                      <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      External Registration
                    </a>
                  )}
                  {event.meetingUrl && (
                    <a
                      href={event.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-4 bg-linear-to-br from-sky-500 to-sky-600 hover:opacity-90 rounded-xl font-semibold text-white transition-all shadow-lg group`}
                    >
                      <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Virtual Meeting Link
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Tickets Section */}
            <div className="dark:bg-neutral-800/50 dark:border-neutral-700/50 bg-white border-neutral-200 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border">
              <h2 className="text-3xl font-bold dark:text-white text-neutral-900 mb-8 flex items-center gap-3">
                <div className={`w-1.5 h-8 bg-linear-to-br from-sky-500 to-sky-600 rounded-full`} />
                Tickets
              </h2>

              {event.tickets.length === 0 ? (
                <div className="text-center py-16">
                  <div className="dark:bg-neutral-700/50 bg-neutral-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Tag className="dark:text-neutral-500 text-neutral-400 w-8 h-8" />
                  </div>
                  <p className="dark:text-neutral-400 text-neutral-600 text-lg">No tickets available yet.</p>
                  {event.requiresRSVP && (
                    <p className="dark:text-neutral-500 text-neutral-500 text-sm mt-2">RSVP required for this event</p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.tickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={{ ...ticket, eventId: event.id }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Registration Deadline */}
            {event.registrationDeadline && (
              <div
                className={`dark:bg-linear-to-br dark:from-cyan-500/20 dark:to-blue-500/20 bg-linear-to-br from-cyan-100/30 to-blue-100/30 dark:border-sky-500/30 border-cyan-300/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl dark:shadow-cyan-900/20`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Clock className={`w-5 h-5 dark:text-sky-400 text-sky-600`} />
                  <h3 className="text-lg font-bold dark:text-white text-neutral-900">Registration Deadline</h3>
                </div>
                <p className="dark:text-cyan-100 text-cyan-700 font-medium">
                  {new Date(event.registrationDeadline).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Capacity Progress */}
            <div className="dark:bg-neutral-800/50 dark:border-neutral-700/50 bg-white border-neutral-200 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border">
              <h3 className="text-xl font-bold dark:text-white text-neutral-900 mb-6 flex items-center gap-2">
                <Users className={`w-5 h-5 dark:text-sky-400 text-sky-600`} />
                Attendance
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="dark:text-neutral-400 text-neutral-600 font-medium">Registered</span>
                  <span className="font-bold dark:text-white text-neutral-900 text-lg">
                    {event.attendeeCount} / {event.capacity}
                  </span>
                </div>

                <div className="dark:bg-neutral-700/50 dark:border-neutral-600/50 bg-neutral-200 border-neutral-300 w-full rounded-full h-4 overflow-hidden border">
                  <div
                    className={`h-full rounded-full transition-all shadow-lg ${
                      percentageFilled >= 90
                        ? 'bg-linear-to-r from-red-500 to-pink-500'
                        : percentageFilled >= 70
                          ? 'bg-linear-to-r from-yellow-500 to-orange-500'
                          : `bg-linear-to-br from-sky-500 to-sky-600`
                    }`}
                    style={{ width: `${Math.min(percentageFilled, 100)}%` }}
                  />
                </div>

                <div className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-100 border-neutral-300 text-center p-3 rounded-xl border">
                  {spotsRemaining > 0 ? (
                    <span className={`dark:text-sky-400 text-sky-600 font-bold text-lg`}>
                      {spotsRemaining} spots remaining
                    </span>
                  ) : (
                    <span className="dark:text-red-400 text-red-600 font-bold text-lg">Event is full</span>
                  )}
                </div>
              </div>
            </div>

            {/* Event Stats */}
            <div className="dark:bg-neutral-800/50 dark:border-neutral-700/50 bg-white border-neutral-200 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border">
              <h3 className="text-xl font-bold dark:text-white text-neutral-900 mb-6">Event Info</h3>

              <div className="space-y-4">
                <div className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-100 border-neutral-300 flex justify-between items-center p-3 rounded-xl border">
                  <span className="dark:text-neutral-400 text-neutral-600 text-sm font-medium">Visibility</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      event.isPublic
                        ? `dark:sky-500/20 dark:text-sky-400 text-sky-600 dark:border-sky-500/30 sky-500/10 border-current`
                        : 'dark:bg-neutral-500/20 dark:text-neutral-400 dark:border-neutral-500/30 bg-neutral-200/20 text-neutral-600 border-neutral-300'
                    }`}
                  >
                    {event.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
                {event.requiresRSVP && (
                  <div className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-100 border-neutral-300 flex justify-between items-center p-3 rounded-xl border">
                    <span className="dark:text-neutral-400 text-neutral-600 text-sm font-medium">RSVP</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold dark:sky-500/20 dark:text-sky-400 text-sky-600 dark:border-sky-500/30 sky-500/10 border-current`}
                    >
                      Required
                    </span>
                  </div>
                )}
                {event.allowMultipleTickets && (
                  <div className="dark:bg-neutral-700/30 dark:border-neutral-600/30 bg-neutral-100 border-neutral-300 flex justify-between items-center p-3 rounded-xl border">
                    <span className="dark:text-neutral-400 text-neutral-600 text-sm font-medium">Multiple Tickets</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold dark:sky-500/20 dark:text-sky-400 text-sky-600 dark:border-sky-500/30 sky-500/10 border-current`}
                    >
                      Allowed
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
