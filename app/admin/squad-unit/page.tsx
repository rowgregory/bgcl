"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ChevronDown,
  Edit2,
  Trash2,
  X,
  Save,
  Briefcase,
  Shield,
  Award,
  Target,
  Building,
  LucideIcon,
} from "lucide-react";

const MemberDirectoryAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<{ id: number }>({
    id: -1,
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "staff",
    title: "",
    email: "",
    phone: "",
    bio: "",
    photoUrl: "",
    linkedIn: "",
    displayOrder: 0,
  });

  const [members, setMembers] = useState([
    {
      id: 1,
      firstName: "Michael",
      lastName: "Thompson",
      role: "staff",
      title: "Executive Director",
      email: "mthompson@bgclynn.org",
      phone: "(555) 100-0001",
      bio: "Passionate about youth development with 15 years of experience in nonprofit leadership.",
      photoUrl: "",
      linkedIn: "",
      displayOrder: 1,
    },
    {
      id: 2,
      firstName: "Sarah",
      lastName: "Martinez",
      role: "staff",
      title: "Program Director",
      email: "smartinez@bgclynn.org",
      phone: "(555) 100-0002",
      bio: "Dedicated to creating impactful programs that empower youth to reach their full potential.",
      photoUrl: "",
      linkedIn: "",
      displayOrder: 2,
    },
    {
      id: 3,
      firstName: "James",
      lastName: "Wilson",
      role: "board",
      title: "Board Chair",
      email: "jwilson@example.com",
      phone: "(555) 200-0001",
      bio: "Business executive committed to community development and youth empowerment.",
      photoUrl: "",
      linkedIn: "",
      displayOrder: 1,
    },
    {
      id: 4,
      firstName: "Emily",
      lastName: "Chen",
      role: "board",
      title: "Board Vice Chair",
      email: "echen@example.com",
      phone: "(555) 200-0002",
      bio: "Technology leader passionate about bridging the digital divide for underserved youth.",
      photoUrl: "",
      linkedIn: "",
      displayOrder: 2,
    },
    {
      id: 5,
      firstName: "Robert",
      lastName: "Johnson",
      role: "officer",
      title: "Treasurer",
      email: "rjohnson@example.com",
      phone: "(555) 300-0001",
      bio: "CPA with extensive experience in nonprofit financial management.",
      photoUrl: "",
      linkedIn: "",
      displayOrder: 1,
    },
    {
      id: 6,
      firstName: "Lisa",
      lastName: "Anderson",
      role: "director",
      title: "Director",
      email: "landerson@example.com",
      phone: "(555) 400-0001",
      bio: "Community advocate focused on education equity and youth services.",
      photoUrl: "",
      linkedIn: "",
      displayOrder: 1,
    },
    {
      id: 7,
      firstName: "David",
      lastName: "Lee",
      role: "corporator",
      title: "Corporator",
      email: "dlee@example.com",
      phone: "(555) 500-0001",
      bio: "Local business owner supporting community initiatives.",
      photoUrl: "",
      linkedIn: "",
      displayOrder: 1,
    },
  ]);

  const roleConfig: Record<
    string,
    { label: string; icon: LucideIcon; color: string }
  > = {
    staff: { label: "Staff", icon: Briefcase, color: "indigo" },
    board: { label: "Board Members", icon: Shield, color: "purple" },
    officer: { label: "Officers", icon: Award, color: "blue" },
    director: { label: "Directors", icon: Target, color: "violet" },
    corporator: { label: "Corporators", icon: Building, color: "fuchsia" },
  };

  const getRoleStats = () => {
    return {
      staff: members.filter((m) => m.role === "staff").length,
      board: members.filter((m) => m.role === "board").length,
      officer: members.filter((m) => m.role === "officer").length,
      director: members.filter((m) => m.role === "director").length,
      corporator: members.filter((m) => m.role === "corporator").length,
      total: members.length,
    };
  };

  const stats = getRoleStats();

  const openModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData(member);
    } else {
      setEditingMember({ id: -1 });
      setFormData({
        firstName: "",
        lastName: "",
        role: "staff",
        title: "",
        email: "",
        phone: "",
        bio: "",
        photoUrl: "",
        linkedIn: "",
        displayOrder: 0,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember({ id: -1 });
    setFormData({
      firstName: "",
      lastName: "",
      role: "staff",
      title: "",
      email: "",
      phone: "",
      bio: "",
      photoUrl: "",
      linkedIn: "",
      displayOrder: 0,
    });
  };

  const handleSave = () => {
    if (editingMember) {
      // Update existing member
      setMembers(
        members.map((m) =>
          m.id === editingMember.id ? { ...formData, id: m.id } : m
        )
      );
    } else {
      // Create new member
      const newMember = {
        ...formData,
        id: Math.max(...members.map((m) => m.id)) + 1,
      };
      setMembers([...members, newMember]);
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  const filteredMembers = members
    .filter((member) => {
      const matchesSearch =
        member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterRole === "all" || member.role === filterRole;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Sort by role first, then by displayOrder
      if (a.role !== b.role) {
        const roleOrder = [
          "staff",
          "board",
          "officer",
          "director",
          "corporator",
        ];
        return roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role);
      }
      return a.displayOrder - b.displayOrder;
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

  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6"
        >
          <motion.div
            variants={cardVariants}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Total
              </h3>
            </div>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Staff
              </h3>
            </div>
            <p className="text-2xl font-bold text-white">{stats.staff}</p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Board
              </h3>
            </div>
            <p className="text-2xl font-bold text-white">{stats.board}</p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Officers
              </h3>
            </div>
            <p className="text-2xl font-bold text-white">{stats.officer}</p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Directors
              </h3>
            </div>
            <p className="text-2xl font-bold text-white">{stats.director}</p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-fuchsia-400" />
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Corporators
              </h3>
            </div>
            <p className="text-2xl font-bold text-white">{stats.corporator}</p>
          </motion.div>
        </motion.div>

        {/* Actions and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="pl-10 pr-10 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="staff">Staff</option>
                <option value="board">Board Members</option>
                <option value="officer">Officers</option>
                <option value="director">Directors</option>
                <option value="corporator">Corporators</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
            </div>

            {/* Add Member Button */}
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200"
            >
              <UserPlus className="w-5 h-5" />
              Add Member
            </button>
          </div>
        </motion.div>

        {/* Members Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredMembers.map((member) => {
            const RoleIcon = roleConfig[member.role].icon;
            const roleColor = roleConfig[member.role].color;

            return (
              <motion.div
                key={member.id}
                variants={cardVariants}
                className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden hover:border-indigo-500/50 transition-all duration-300"
              >
                {/* Header with role badge */}
                <div
                  className={`bg-gradient-to-r from-${roleColor}-600 to-${roleColor}-700 p-4`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RoleIcon className="w-4 h-4 text-white" />
                      <span className="text-xs font-medium text-white uppercase tracking-wide">
                        {roleConfig[member.role].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        // onClick={() => openModal(member)}
                        className="p-1.5 hover:bg-white/20 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-1.5 hover:bg-white/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Member Info */}
                <div className="p-6">
                  {/* Avatar */}
                  <div className="flex justify-center mb-4">
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-br from-${roleColor}-500 to-${roleColor}-600 flex items-center justify-center`}
                    >
                      <span className="text-white font-bold text-2xl">
                        {member.firstName[0]}
                        {member.lastName[0]}
                      </span>
                    </div>
                  </div>

                  {/* Name and Title */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-sm text-indigo-400 font-medium">
                      {member.title}
                    </p>
                  </div>

                  {/* Contact */}
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-neutral-400">
                      {member.email}
                    </div>
                    <div className="text-sm text-neutral-400">
                      {member.phone}
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-neutral-500 line-clamp-3">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12 bg-neutral-900 rounded-lg border border-neutral-800">
            <Users className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
            <p className="text-neutral-400">
              No members found matching your criteria
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-neutral-900 rounded-lg border border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-800">
                  <h2 className="text-xl font-bold text-white">
                    {editingMember ? "Edit Member" : "Add New Member"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-neutral-400" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">
                        Role *
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="staff">Staff</option>
                        <option value="board">Board Member</option>
                        <option value="officer">Officer</option>
                        <option value="director">Director</option>
                        <option value="corporator">Corporator</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">
                        Photo URL
                      </label>
                      <input
                        type="url"
                        value={formData.photoUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, photoUrl: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={formData.linkedIn}
                        onChange={(e) =>
                          setFormData({ ...formData, linkedIn: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          displayOrder: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-800">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    <Save className="w-4 h-4" />
                    {editingMember ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemberDirectoryAdmin;
