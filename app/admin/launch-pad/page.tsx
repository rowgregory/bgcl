"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Clock,
  UserCheck,
  TrendingUp,
  Download,
  Eye,
} from "lucide-react";

const AdminProgramsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProgram, setFilterProgram] = useState("all");

  // Programs data
  const programs = [
    {
      id: 1,
      name: "Kids Club",
      description: "Daily after-school program for elementary students",
      ageRange: "6-12",
      schedule: "Mon-Fri, 3:00 PM - 6:00 PM",
      capacity: 50,
      enrolled: 42,
      waitlist: 3,
    },
    {
      id: 2,
      name: "Kids Club Summer Enrichment",
      description: "Summer program with educational activities and field trips",
      ageRange: "6-12",
      schedule: "Mon-Fri, 9:00 AM - 4:00 PM",
      capacity: 60,
      enrolled: 58,
      waitlist: 8,
    },
    {
      id: 3,
      name: "After School Drop-In Center",
      description: "Flexible after-school program for middle schoolers",
      ageRange: "11-14",
      schedule: "Mon-Fri, 2:30 PM - 6:00 PM",
      capacity: 40,
      enrolled: 31,
      waitlist: 0,
    },
    {
      id: 4,
      name: "Teen Center",
      description: "Evening program for high school students",
      ageRange: "14-18",
      schedule: "Mon-Fri, 3:00 PM - 8:00 PM",
      capacity: 35,
      enrolled: 28,
      waitlist: 2,
    },
    {
      id: 5,
      name: "Camp Creighton",
      description: "Summer day camp with outdoor activities",
      ageRange: "6-15",
      schedule: "Mon-Fri, 8:00 AM - 5:00 PM",
      capacity: 75,
      enrolled: 72,
      waitlist: 12,
    },
  ];

  // Enrollment data
  const enrollments = [
    {
      id: 1,
      programId: 1,
      programName: "Kids Club",
      childName: "Emma Doe",
      childAge: 8,
      parentName: "John Doe",
      parentEmail: "john.doe@email.com",
      parentPhone: "(555) 123-4567",
      enrollmentDate: "2024-01-15",
      status: "active",
    },
    {
      id: 2,
      programId: 1,
      programName: "Kids Club",
      childName: "Liam Doe",
      childAge: 10,
      parentName: "John Doe",
      parentEmail: "john.doe@email.com",
      parentPhone: "(555) 123-4567",
      enrollmentDate: "2024-01-15",
      status: "active",
    },
    {
      id: 3,
      programId: 2,
      programName: "Kids Club Summer Enrichment",
      childName: "Emma Doe",
      childAge: 8,
      parentName: "John Doe",
      parentEmail: "john.doe@email.com",
      parentPhone: "(555) 123-4567",
      enrollmentDate: "2024-03-01",
      status: "active",
    },
    {
      id: 4,
      programId: 1,
      programName: "Kids Club",
      childName: "Olivia Williams",
      childAge: 7,
      parentName: "Jennifer Williams",
      parentEmail: "jennifer.williams@email.com",
      parentPhone: "(555) 345-6789",
      enrollmentDate: "2024-01-25",
      status: "active",
    },
    {
      id: 5,
      programId: 5,
      programName: "Camp Creighton",
      childName: "Olivia Williams",
      childAge: 7,
      parentName: "Jennifer Williams",
      parentEmail: "jennifer.williams@email.com",
      parentPhone: "(555) 345-6789",
      enrollmentDate: "2024-02-10",
      status: "active",
    },
    {
      id: 6,
      programId: 5,
      programName: "Camp Creighton",
      childName: "Noah Davis",
      childAge: 9,
      parentName: "Lisa Davis",
      parentEmail: "lisa.davis@email.com",
      parentPhone: "(555) 456-7890",
      enrollmentDate: "2024-02-01",
      status: "active",
    },
    {
      id: 7,
      programId: 5,
      programName: "Camp Creighton",
      childName: "Ava Davis",
      childAge: 6,
      parentName: "Lisa Davis",
      parentEmail: "lisa.davis@email.com",
      parentPhone: "(555) 456-7890",
      enrollmentDate: "2024-02-01",
      status: "active",
    },
    {
      id: 8,
      programId: 4,
      programName: "Teen Center",
      childName: "Ethan Davis",
      childAge: 15,
      parentName: "Lisa Davis",
      parentEmail: "lisa.davis@email.com",
      parentPhone: "(555) 456-7890",
      enrollmentDate: "2024-02-01",
      status: "active",
    },
    {
      id: 9,
      programId: 3,
      programName: "After School Drop-In Center",
      childName: "Sophia Martinez",
      childAge: 12,
      parentName: "Carlos Martinez",
      parentEmail: "carlos.martinez@email.com",
      parentPhone: "(555) 678-9012",
      enrollmentDate: "2024-02-15",
      status: "active",
    },
    {
      id: 10,
      programId: 1,
      programName: "Kids Club",
      childName: "Mason Johnson",
      childAge: 9,
      parentName: "Amanda Johnson",
      parentEmail: "amanda.johnson@email.com",
      parentPhone: "(555) 789-0123",
      enrollmentDate: "2024-01-20",
      status: "active",
    },
    {
      id: 11,
      programId: 2,
      programName: "Kids Club Summer Enrichment",
      childName: "Isabella Brown",
      childAge: 8,
      parentName: "Michael Brown",
      parentEmail: "michael.brown@email.com",
      parentPhone: "(555) 890-1234",
      enrollmentDate: "2024-03-05",
      status: "waitlist",
    },
    {
      id: 12,
      programId: 5,
      programName: "Camp Creighton",
      childName: "Lucas Wilson",
      childAge: 10,
      parentName: "Sarah Wilson",
      parentEmail: "sarah.wilson@email.com",
      parentPhone: "(555) 901-2345",
      enrollmentDate: "2024-03-10",
      status: "waitlist",
    },
  ];

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesSearch =
      enrollment.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.parentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.programName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterProgram === "all" ||
      enrollment.programId === parseInt(filterProgram);

    return matchesSearch && matchesFilter;
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const getEnrollmentRate = (program: {
    id?: number;
    name?: string;
    description?: string;
    ageRange?: string;
    schedule?: string;
    capacity: number;
    enrolled: number;
    waitlist?: number;
  }) => {
    return Math.round((program.enrolled / program.capacity) * 100);
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Programs Overview Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6"
        >
          {programs.map((program) => {
            const enrollmentRate = getEnrollmentRate(program);
            const isNearCapacity = enrollmentRate >= 90;

            return (
              <motion.div
                key={program.id}
                variants={cardVariants}
                className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 md:p-6 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer"
                // onClick={() => setSelectedProgram(program.id)}
              >
                {/* Program Header */}
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-white mb-1 truncate">
                      {program.name}
                    </h3>
                    <p className="text-xs md:text-sm text-neutral-400 line-clamp-2">
                      {program.description}
                    </p>
                  </div>
                  <button className="p-1.5 md:p-2 hover:bg-neutral-800 rounded-lg transition-colors flex-shrink-0 ml-2">
                    <Eye className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>

                {/* Program Details */}
                <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
                  <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-400">
                    <Users className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="truncate">Ages {program.ageRange}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-400">
                    <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="truncate">{program.schedule}</span>
                  </div>
                </div>

                {/* Enrollment Stats */}
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="text-neutral-400">Enrollment</span>
                    <span
                      className={`font-semibold ${isNearCapacity ? "text-yellow-400" : "text-white"}`}
                    >
                      {program.enrolled}/{program.capacity}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-neutral-800 rounded-full h-1.5 md:h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${enrollmentRate}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-1.5 md:h-2 rounded-full ${
                        enrollmentRate >= 90
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600"
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-500">
                        {enrollmentRate}% full
                      </span>
                    </div>
                    {program.waitlist > 0 && (
                      <span className="text-xs text-yellow-400">
                        {program.waitlist} on waitlist
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 md:p-6 mb-6"
        >
          <div className="flex flex-col gap-3">
            {/* Search - Full Width on Mobile */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search by child, parent, or program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter and Export - Side by Side on Mobile */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
                <select
                  value={filterProgram}
                  onChange={(e) => setFilterProgram(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer text-sm"
                >
                  <option value="all">All Programs</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
              </div>

              {/* Export Button */}
              <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Enrollments Table - Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="hidden lg:block bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-800 border-b border-neutral-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Child
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Parent
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Enrolled
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredEnrollments.map((enrollment, index) => (
                  <motion.tr
                    key={enrollment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                          <Calendar className="w-4 h-4 text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-white">
                          {enrollment.programName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">
                            {enrollment.childName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {enrollment.childName}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {enrollment.childAge} years old
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">
                        {enrollment.parentName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-neutral-400">
                          {enrollment.parentEmail}
                        </div>
                        <div className="text-neutral-500 text-xs">
                          {enrollment.parentPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                      {new Date(enrollment.enrollmentDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {enrollment.status === "active" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          <UserCheck className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                          <Clock className="w-3 h-3" />
                          Waitlist
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEnrollments.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
              <p className="text-neutral-400">
                No enrollments found matching your criteria
              </p>
            </div>
          )}
        </motion.div>

        {/* Enrollments Cards - Mobile/Tablet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:hidden space-y-4"
        >
          {filteredEnrollments.map((enrollment, index) => (
            <motion.div
              key={enrollment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-neutral-900 rounded-lg border border-neutral-800 p-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">
                      {enrollment.childName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {enrollment.childName}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {enrollment.childAge} years old
                    </p>
                  </div>
                </div>
                {enrollment.status === "active" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                    <UserCheck className="w-3 h-3" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    <Clock className="w-3 h-3" />
                    Waitlist
                  </span>
                )}
              </div>

              {/* Program */}
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-neutral-800">
                <div className="p-1.5 bg-indigo-500/10 rounded">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-white">
                  {enrollment.programName}
                </span>
              </div>

              {/* Parent Info */}
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Parent</p>
                  <p className="text-sm text-white font-medium">
                    {enrollment.parentName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Contact</p>
                  <p className="text-sm text-neutral-400">
                    {enrollment.parentEmail}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {enrollment.parentPhone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Enrolled</p>
                  <p className="text-sm text-neutral-400">
                    {new Date(enrollment.enrollmentDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredEnrollments.length === 0 && (
            <div className="text-center py-12 bg-neutral-900 rounded-lg border border-neutral-800">
              <Users className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
              <p className="text-neutral-400">
                No enrollments found matching your criteria
              </p>
            </div>
          )}
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center text-sm text-neutral-500"
        >
          Showing {filteredEnrollments.length} of {enrollments.length}{" "}
          enrollments
        </motion.div>
      </div>
    </div>
  );
};

export default AdminProgramsPage;
