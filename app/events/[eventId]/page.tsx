import KeyEventInfo from '@/app/components/events/KeyEventInfo'
import TicketCard from '@/app/components/events/TicketCard'
import prisma from '@/prisma/client'
import { Clock, Users, Tag, Info, Shirt, Video, Globe, User } from 'lucide-react'

export default async function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      tickets: {
        where: { isAvailable: true },
        orderBy: { sortOrder: 'asc' }
      }
    }
  })

  if (!event) {
    //  TODO
    return
  }

  const spotsRemaining = event.capacity - event.attendeeCount
  const percentageFilled = (event.attendeeCount / event.capacity) * 100

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Category & Status Badges */}
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold text-white border border-white/30 shadow-lg">
                  {event.category}
                </span>
                <span
                  className={`px-4 py-1.5 backdrop-blur-md rounded-full text-sm font-semibold border shadow-lg ${
                    event.status === 'ONGOING'
                      ? 'bg-green-500/30 border-green-400/50 text-green-100'
                      : event.status === 'UPCOMING'
                        ? 'bg-yellow-500/30 border-yellow-400/50 text-yellow-100'
                        : 'bg-gray-500/30 border-gray-400/50 text-gray-100'
                  }`}
                >
                  {event.status}
                </span>
                {event.featured && (
                  <span className="px-4 py-1.5 bg-yellow-500/30 backdrop-blur-md rounded-full text-sm font-semibold text-yellow-100 border border-yellow-400/50 shadow-lg">
                    ⭐ Featured
                  </span>
                )}
              </div>

              <h1 className="text-6xl font-bold mb-6 text-white drop-shadow-2xl">{event.title}</h1>

              {event.description && (
                <p className="text-xl text-white/95 mb-8 max-w-3xl leading-relaxed drop-shadow-lg">
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
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details Card */}
            <div className="bg-neutral-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-neutral-700/50">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-linear-to-b from-indigo-500 to-purple-500 rounded-full" />
                Event Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type */}
                <div className="flex items-start gap-4 p-4 bg-neutral-700/30 rounded-xl border border-neutral-600/30">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Tag className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400 font-medium">Event Type</p>
                    <p className="font-semibold text-white mt-1">{event.type}</p>
                  </div>
                </div>

                {/* Duration */}
                {event.duration && (
                  <div className="flex items-start gap-4 p-4 bg-neutral-700/30 rounded-xl border border-neutral-600/30">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Clock className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400 font-medium">Duration</p>
                      <p className="font-semibold text-white mt-1">{event.duration} hours</p>
                    </div>
                  </div>
                )}

                {/* Dress Code */}
                {event.dresscode && (
                  <div className="flex items-start gap-4 p-4 bg-neutral-700/30 rounded-xl border border-neutral-600/30">
                    <div className="p-2 bg-pink-500/20 rounded-lg">
                      <Shirt className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400 font-medium">Dress Code</p>
                      <p className="font-semibold text-white mt-1">{event.dresscode}</p>
                    </div>
                  </div>
                )}

                {/* Host */}
                {event.host && (
                  <div className="flex items-start gap-4 p-4 bg-neutral-700/30 rounded-xl border border-neutral-600/30">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400 font-medium">Hosted By</p>
                      <p className="font-semibold text-white mt-1">{event.host}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Requirements & Materials */}
              {(event.requirements || event.materials) && (
                <div className="mt-6 space-y-4">
                  {event.requirements && (
                    <div className="p-4 bg-neutral-700/30 rounded-xl border border-neutral-600/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-yellow-400" />
                        <p className="text-sm text-neutral-400 font-semibold">Requirements</p>
                      </div>
                      <p className="text-white leading-relaxed">{event.requirements}</p>
                    </div>
                  )}

                  {event.materials && (
                    <div className="p-4 bg-neutral-700/30 rounded-xl border border-neutral-600/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-green-400" />
                        <p className="text-sm text-neutral-400 font-semibold">Materials Needed</p>
                      </div>
                      <p className="text-white leading-relaxed">{event.materials}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Links Section */}
            {(event.registrationUrl || event.meetingUrl) && (
              <div className="bg-neutral-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-neutral-700/50">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-linear-to-b from-indigo-500 to-purple-500 rounded-full" />
                  Quick Links
                </h3>
                <div className="space-y-3">
                  {event.registrationUrl && (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-indigo-500/50 group"
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
                      className="flex items-center gap-3 p-4 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-blue-500/50 group"
                    >
                      <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Virtual Meeting Link
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Tickets Section */}
            <div className="bg-neutral-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-neutral-700/50">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-linear-to-b from-indigo-500 to-purple-500 rounded-full" />
                Tickets
              </h2>

              {event.tickets.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-neutral-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Tag className="w-8 h-8 text-neutral-500" />
                  </div>
                  <p className="text-neutral-400 text-lg">No tickets available yet.</p>
                  {event.requiresRSVP && <p className="text-sm text-neutral-500 mt-2">RSVP required for this event</p>}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.tickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Registration Deadline */}
            {event.registrationDeadline && (
              <div className="bg-linear-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-bold text-white">Registration Deadline</h3>
                </div>
                <p className="text-yellow-100 font-medium">
                  {new Date(event.registrationDeadline).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}

            {/* Capacity Progress */}
            <div className="bg-neutral-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-neutral-700/50">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Attendance
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400 font-medium">Registered</span>
                  <span className="font-bold text-white text-lg">
                    {event.attendeeCount} / {event.capacity}
                  </span>
                </div>

                <div className="w-full bg-neutral-700/50 rounded-full h-4 overflow-hidden border border-neutral-600/50">
                  <div
                    className={`h-full rounded-full transition-all shadow-lg ${
                      percentageFilled >= 90
                        ? 'bg-linear-to-r from-red-500 to-pink-500'
                        : percentageFilled >= 70
                          ? 'bg-linear-to-r from-yellow-500 to-orange-500'
                          : 'bg-linear-to-r from-green-500 to-emerald-500'
                    }`}
                    style={{ width: `${Math.min(percentageFilled, 100)}%` }}
                  />
                </div>

                <div className="text-center p-3 bg-neutral-700/30 rounded-xl border border-neutral-600/30">
                  {spotsRemaining > 0 ? (
                    <span className="text-green-400 font-bold text-lg">{spotsRemaining} spots remaining</span>
                  ) : (
                    <span className="text-red-400 font-bold text-lg">Event is full</span>
                  )}
                </div>
              </div>
            </div>

            {/* Event Stats */}
            <div className="bg-neutral-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-neutral-700/50">
              <h3 className="text-xl font-bold text-white mb-6">Event Info</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-neutral-700/30 rounded-xl">
                  <span className="text-sm text-neutral-400 font-medium">Visibility</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      event.isPublic
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}
                  >
                    {event.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
                {event.requiresRSVP && (
                  <div className="flex justify-between items-center p-3 bg-neutral-700/30 rounded-xl">
                    <span className="text-sm text-neutral-400 font-medium">RSVP</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      Required
                    </span>
                  </div>
                )}
                {event.allowMultipleTickets && (
                  <div className="flex justify-between items-center p-3 bg-neutral-700/30 rounded-xl">
                    <span className="text-sm text-neutral-400 font-medium">Multiple Tickets</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
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
