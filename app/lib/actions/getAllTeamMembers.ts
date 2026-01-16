'use server'

import prisma from '@/prisma/client'

interface TeamMember {
  id: string
  name: string
  role: string
  email?: string
  phone?: string
  company?: string
  title?: string
  image?: string
}

interface BoardMembers {
  officers: TeamMember[]
  directors: TeamMember[]
  corporators: TeamMember[]
}

interface StaffMembers {
  admin: TeamMember[]
  program: TeamMember[]
  maintenance: TeamMember[]
}

interface TeamData {
  boardMembers: BoardMembers
  staffMembers: StaffMembers
}

export async function getAllTeamMembers(): Promise<TeamData> {
  try {
    // Fetch all team members
    const allMembers = await prisma.teamMember.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        title: true,
        image: true,
        role: true,
        company: true,
        order: true,
        year: true
      },
      orderBy: {
        order: 'asc'
      }
    })

    // Organize board members by title/category
    const boardMembers: BoardMembers = {
      officers: [],
      directors: [],
      corporators: []
    }

    const staffMembers: StaffMembers = {
      admin: [],
      program: [],
      maintenance: []
    }

    // Process each team member
    allMembers.forEach((member) => {
      const cleanMember: TeamMember = {
        id: member.id,
        name: member.name,
        role: member.role,
        phone: member.phone,
        company: member.company,
        email: member.email,
        title: member.title || undefined,
        ...(member.image && { image: member.image }) // Only include image if it exists
      }

      switch (member.role) {
        case 'officer':
          boardMembers.officers.push(cleanMember)
          break
        case 'director':
          boardMembers.directors.push(cleanMember)
          break
        case 'corporator':
          boardMembers.corporators.push(cleanMember)
          break
        case 'admin_staff':
          staffMembers.admin.push(cleanMember)
          break
        case 'program_staff':
          staffMembers.program.push(cleanMember)
          break
        case 'maintenance_staff':
          staffMembers.maintenance.push(cleanMember)
          break
      }
    })

    return {
      boardMembers,
      staffMembers
    }
  } catch (error) {
    console.error('Error fetching team members:', error)
    throw new Error('Failed to fetch team members')
  }
}
