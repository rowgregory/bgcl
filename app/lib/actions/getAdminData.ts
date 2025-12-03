// import { auth } from '@/auth'
import { createLog } from './createLog'
import prisma from '@/prisma/client'
import { Role } from '@/types/entities/user'
import { Prisma } from '@prisma/client'

// Authorization helper
// async function checkAdminAccess() {
//   const session = await auth()

//   if (!session || !session.user) {
//     await createLog('warn', 'Unauthorized admin access attempt', {
//       reason: 'No session'
//     })
//     return { authorized: false, userId: null }
//   }

//   const user = await prisma.user.findUnique({
//     where: { id: session.user.id },
//     select: { role: true, id: true }
//   })

//   if (!user || user.role !== Role.ADMIN) {
//     await createLog('warn', 'Unauthorized admin access attempt', {
//       userId: session.user.id,
//       role: user?.role
//     })
//     return { authorized: false, userId: session.user.id }
//   }

//   return { authorized: true, userId: user.id }
// }

// Get all users with filtering and pagination
export async function getAllUsers(params?: {
  role?: Role
  hasLoginAccess?: boolean
  page?: number
  limit?: number
  searchTerm?: string
}) {
  try {
    // const { authorized, userId } = await checkAdminAccess()
    // if (!authorized) {
    //   return { success: false, error: 'Unauthorized' }
    // }

    const page = params?.page || 1
    const limit = params?.limit || 50
    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.UserWhereInput = {}
    if (params?.role) where.role = params.role
    if (params?.searchTerm) {
      where.OR = [
        { email: { contains: params.searchTerm, mode: 'insensitive' } },
        { firstName: { contains: params.searchTerm, mode: 'insensitive' } },
        { lastName: { contains: params.searchTerm, mode: 'insensitive' } }
      ]
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
          firstName: true,
          lastName: true,
          phone: true,
          position: true,
          department: true,
          hireDate: true,
          staffStatus: true,
          _count: {
            select: {
              accounts: true,
              sessions: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ])

    await createLog('info', 'Users fetched by admin', {
      // adminId: userId,
      count: users.length,
      totalCount,
      filters: params
    })

    return {
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch users', {
      error: error instanceof Error ? error.message : 'Unknown error',
      params
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch users'
    }
  }
}

// Get all events with filtering and pagination
export async function getAllEvents(params?: {
  userId?: string
  page?: number
  limit?: number
  startDate?: Date
  endDate?: Date
}) {
  try {
    // const { authorized, userId: adminId } = await checkAdminAccess()
    // if (!authorized) {
    //   return { success: false, error: 'Unauthorized' }
    // }

    const page = params?.page || 1
    const limit = params?.limit || 50
    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.EventWhereInput = {}
    // if (params?.userId) where.userId = params.userId
    if (params?.startDate || params?.endDate) {
      where.createdAt = {}
      if (params?.startDate) where.createdAt.gte = params.startDate
      if (params?.endDate) where.createdAt.lte = params.endDate
    }

    const [events, totalCount] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          attendees: true
        }
      }),
      prisma.event.count({ where })
    ])

    await createLog('info', 'Events fetched by admin', {
      // adminId,
      count: events.length,
      totalCount,
      filters: params
    })

    return {
      success: true,
      data: {
        events,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch events', {
      error: error instanceof Error ? error.message : 'Unknown error',
      params
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch events'
    }
  }
}

// Get all heroes
export async function getAllHeroesAdmin() {
  try {
    // const { authorized, userId } = await checkAdminAccess()
    // if (!authorized) {
    //   return { success: false, error: 'Unauthorized' }
    // }

    const heroes = await prisma.hero.findMany({
      orderBy: { createdAt: 'desc' }
    })

    await createLog('info', 'Heroes fetched by admin', {
      // adminId: userId,
      count: heroes.length
    })

    return { success: true, data: heroes }
  } catch (error) {
    await createLog('error', 'Failed to fetch heroes', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch heroes'
    }
  }
}

// Get dashboard statistics
export async function getAdminDashboardStats() {
  try {
    // const { authorized, userId } = await checkAdminAccess()
    // if (!authorized) {
    //   return { success: false, error: 'Unauthorized' }
    // }

    const [totalUsers, staffCount, adminCount, supporterCount, eventCount, recentEventCount, totalHeroes, activeHero] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: Role.STAFF } }),
        prisma.user.count({ where: { role: Role.ADMIN } }),
        prisma.user.count({ where: { role: Role.SUPPORTER } }),
        prisma.event.count(),
        prisma.event.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
            }
          }
        }),
        prisma.hero.count(),
        prisma.hero.findFirst({ where: { status: 'ACTIVE' } })
      ])

    // Get user growth (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const userGrowth = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: thirtyDaysAgo }
      },
      _count: true
    })

    // await createLog('info', 'Dashboard stats fetched', { adminId: userId })

    return {
      success: true,
      data: {
        users: {
          total: totalUsers,
          supporters: supporterCount,
          staff: staffCount,
          admins: adminCount,
          growth: userGrowth.length
        },
        events: {
          total: eventCount,
          recentWeek: recentEventCount
        },
        heroes: {
          total: totalHeroes,
          active: activeHero ? 1 : 0,
          activeHeroId: activeHero?.id
        }
      }
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch dashboard stats', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats'
    }
  }
}

// Get comprehensive admin data (all in one call)
export async function getAdminData() {
  try {
    // const { authorized, userId } = await checkAdminAccess();
    // if (!authorized) {
    //   return { success: false, error: "Unauthorized" };
    // }

    const [usersResult, eventsResult, heroesResult, statsResult] = await Promise.all([
      getAllUsers({ limit: 100 }), // Get first 100 users
      getAllEvents({ limit: 100 }), // Get first 100 events
      getAllHeroesAdmin(),
      getAdminDashboardStats()
    ])

    await createLog('info', 'Complete admin data fetched', {
      adminId: 'TESTADMINID',
      usersCount: usersResult.success ? usersResult.data?.users.length : 0,
      eventsCount: eventsResult.success ? eventsResult.data?.events.length : 0,
      heroesCount: heroesResult.success ? heroesResult.data?.length : 0
    })

    return {
      success: true,
      data: {
        users: usersResult.success ? usersResult.data : null,
        events: eventsResult.success ? eventsResult.data : null,
        heroes: heroesResult.success ? heroesResult.data : null,
        stats: statsResult.success ? statsResult.data : null
      }
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch admin data', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch admin data'
    }
  }
}
