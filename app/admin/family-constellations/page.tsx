"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Mail,
  CheckCircle,
  Circle,
  User,
  Baby,
  Search,
  Filter,
  ChevronDown,
  UserCheck,
  UserX,
} from "lucide-react";

const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, email-only, profile-complete, has-children

  // Sample user data
  const [users] = useState([
    {
      id: 1,
      email: "john.doe@email.com",
      status: "complete",
      hasProfile: true,
      profileData: {
        firstName: "John",
        lastName: "Doe",
        phone: "(555) 123-4567",
        address: "123 Main St, Boston, MA",
      },
      children: [
        { name: "Emma Doe", age: 8 },
        { name: "Liam Doe", age: 10 },
      ],
      joinedDate: "2024-01-15",
    },
    {
      id: 2,
      email: "sarah.smith@email.com",
      status: "profile-only",
      hasProfile: true,
      profileData: {
        firstName: "Sarah",
        lastName: "Smith",
        phone: "(555) 234-5678",
        address: "456 Oak Ave, Lynn, MA",
      },
      children: [],
      joinedDate: "2024-02-20",
    },
    {
      id: 3,
      email: "mike.johnson@email.com",
      status: "email-only",
      hasProfile: false,
      profileData: null,
      children: [],
      joinedDate: "2024-03-10",
    },
    {
      id: 4,
      email: "jennifer.williams@email.com",
      status: "complete",
      hasProfile: true,
      profileData: {
        firstName: "Jennifer",
        lastName: "Williams",
        phone: "(555) 345-6789",
        address: "789 Pine Rd, Salem, MA",
      },
      children: [{ name: "Olivia Williams", age: 7 }],
      joinedDate: "2024-01-25",
    },
    {
      id: 5,
      email: "david.brown@email.com",
      status: "email-only",
      hasProfile: false,
      profileData: null,
      children: [],
      joinedDate: "2024-04-05",
    },
    {
      id: 6,
      email: "lisa.davis@email.com",
      status: "complete",
      hasProfile: true,
      profileData: {
        firstName: "Lisa",
        lastName: "Davis",
        phone: "(555) 456-7890",
        address: "321 Elm St, Peabody, MA",
      },
      children: [
        { name: "Noah Davis", age: 9 },
        { name: "Ava Davis", age: 6 },
        { name: "Ethan Davis", age: 12 },
      ],
      joinedDate: "2024-02-01",
    },
    {
      id: 7,
      email: "robert.martinez@email.com",
      status: "profile-only",
      hasProfile: true,
      profileData: {
        firstName: "Robert",
        lastName: "Martinez",
        phone: "(555) 567-8901",
        address: "654 Maple Dr, Beverly, MA",
      },
      children: [],
      joinedDate: "2024-03-15",
    },
    {
      id: 8,
      email: "amanda.garcia@email.com",
      status: "email-only",
      hasProfile: false,
      profileData: null,
      children: [],
      joinedDate: "2024-04-20",
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
            <CheckCircle className="w-3 h-3" />
            Complete
          </span>
        );
      case "profile-only":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <UserCheck className="w-3 h-3" />
            Profile Only
          </span>
        );
      case "email-only":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-500/10 text-neutral-400 border border-neutral-500/20">
            <UserX className="w-3 h-3" />
            Email Only
          </span>
        );
      default:
        return null;
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.profileData?.firstName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.profileData?.lastName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "email-only" && user.status === "email-only") ||
      (filterStatus === "profile-complete" && user.hasProfile) ||
      (filterStatus === "has-children" && user.children.length > 0);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: users.length,
    emailOnly: users.filter((u) => u.status === "email-only").length,
    profileComplete: users.filter((u) => u.hasProfile).length,
    hasChildren: users.filter((u) => u.children.length > 0).length,
  };

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

  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
        >
          <motion.div
            variants={cardVariants}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
                Total Users
              </h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-neutral-500/10 rounded-lg">
                <Mail className="w-5 h-5 text-neutral-400" />
              </div>
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
                Email Only
              </h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats.emailOnly}</p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <User className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
                Has Profile
              </h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {stats.profileComplete}
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Baby className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
                With Children
              </h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats.hasChildren}</p>
          </motion.div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-10 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
              >
                <option value="all">All Users</option>
                <option value="email-only">Email Only</option>
                <option value="profile-complete">Has Profile</option>
                <option value="has-children">With Children</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-800 border-b border-neutral-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Children
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.profileData
                              ? `${user.profileData.firstName[0]}${user.profileData.lastName[0]}`
                              : user.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {user.profileData
                              ? `${user.profileData.firstName} ${user.profileData.lastName}`
                              : "No profile"}
                          </div>
                          <div className="text-sm text-neutral-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4">
                      {user.profileData ? (
                        <div className="text-sm">
                          <div className="text-white">
                            {user.profileData.phone}
                          </div>
                          <div className="text-neutral-400 text-xs">
                            {user.profileData.address}
                          </div>
                        </div>
                      ) : (
                        <span className="text-neutral-500 text-sm">
                          No contact info
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.children.length > 0 ? (
                        <div className="space-y-1">
                          {user.children.map((child, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Baby className="w-3 h-3 text-indigo-400" />
                              <span className="text-white">{child.name}</span>
                              <span className="text-neutral-500">
                                ({child.age}y)
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-neutral-500 text-sm">
                          No children
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                      {new Date(user.joinedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Circle className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
              <p className="text-neutral-400">
                No users found matching your criteria
              </p>
            </div>
          )}
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-center text-sm text-neutral-500"
        >
          Showing {filteredUsers.length} of {users.length} users
        </motion.div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
