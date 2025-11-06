"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Filter,
  Download,
  Search,
  MoreVertical,
  Mail,
  Heart,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";
import { containerVariants, itemVariants } from "@/app/lib/motion";

const stats = [
  {
    icon: DollarSign,
    label: "Total Donations",
    value: "$127,450",
    change: "+18.2%",
    trend: "up",
    color: "bg-green-500",
    period: "vs last month",
  },
  {
    icon: Users,
    label: "Active Donors",
    value: "847",
    change: "+12.5%",
    trend: "up",
    color: "bg-blue-500",
    period: "vs last month",
  },
  {
    icon: Heart,
    label: "Recurring Donors",
    value: "234",
    change: "+8.3%",
    trend: "up",
    color: "bg-purple-500",
    period: "vs last month",
  },
  {
    icon: TrendingUp,
    label: "Avg Donation",
    value: "$150.47",
    change: "-2.1%",
    trend: "down",
    color: "bg-amber-500",
    period: "vs last month",
  },
];

const recentDonations = [
  {
    id: 1,
    donor: "Sarah Anderson",
    email: "s.anderson@email.com",
    amount: 500,
    type: "one-time",
    status: "completed",
    method: "Credit Card",
    date: "2 hours ago",
    campaign: "Summer Programs",
  },
  {
    id: 2,
    donor: "Michael Chen",
    email: "m.chen@email.com",
    amount: 100,
    type: "recurring",
    status: "completed",
    method: "ACH",
    date: "5 hours ago",
    campaign: "General Fund",
  },
  {
    id: 3,
    donor: "Jennifer Martinez",
    email: "j.martinez@email.com",
    amount: 250,
    type: "one-time",
    status: "completed",
    method: "Credit Card",
    date: "1 day ago",
    campaign: "STEM Initiative",
  },
  {
    id: 4,
    donor: "Robert Williams",
    email: "r.williams@email.com",
    amount: 75,
    type: "recurring",
    status: "pending",
    method: "Credit Card",
    date: "1 day ago",
    campaign: "General Fund",
  },
  {
    id: 5,
    donor: "Emily Thompson",
    email: "e.thompson@email.com",
    amount: 1000,
    type: "one-time",
    status: "completed",
    method: "Check",
    date: "2 days ago",
    campaign: "Building Fund",
  },
  {
    id: 6,
    donor: "David Park",
    email: "d.park@email.com",
    amount: 150,
    type: "one-time",
    status: "completed",
    method: "Credit Card",
    date: "2 days ago",
    campaign: "Summer Programs",
  },
];

const campaigns = [
  { name: "Summer Programs", raised: 45820, goal: 60000, donors: 234 },
  { name: "STEM Initiative", raised: 28450, goal: 35000, donors: 128 },
  { name: "Building Fund", raised: 82300, goal: 150000, donors: 167 },
  { name: "General Fund", raised: 34200, goal: 50000, donors: 318 },
];

const FuelStationEnergyHub = () => {
  return (
    <div className="h-full text-white p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Donation Management</h1>
            <p className="text-zinc-400">
              Track and manage all donations in one place
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-colors border border-zinc-700 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="bg-zinc-900/90 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div
                  className={`flex items-center ${stat.trend === "up" ? "text-green-400" : "text-red-400"} text-sm font-medium`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-zinc-400 text-sm mb-1">{stat.label}</h3>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-zinc-500">{stat.period}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Donations Table */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-zinc-900/90 backdrop-blur-sm rounded-xl p-6 border border-zinc-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Donations</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search donors..."
                    className="bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {recentDonations.map((donation) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ x: 4 }}
                  className="p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-all border border-zinc-700/50 hover:border-zinc-600 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold">
                        {donation.donor
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{donation.donor}</p>
                          {donation.type === "recurring" && (
                            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs border border-purple-500/30">
                              Recurring
                            </span>
                          )}
                          {donation.status === "pending" && (
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs border border-amber-500/30">
                              Pending
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-zinc-400 mt-1">
                          <span className="flex items-center">
                            <CreditCard className="w-3 h-3 mr-1" />
                            {donation.method}
                          </span>
                          <span>•</span>
                          <span>{donation.campaign}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {donation.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">
                          ${donation.amount.toLocaleString()}
                        </p>
                      </div>
                      <button className="p-2 hover:bg-zinc-700 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              className="w-full mt-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-colors border border-zinc-700"
            >
              View All Donations
            </motion.button>
          </motion.div>

          {/* Campaign Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/90 backdrop-blur-sm rounded-xl p-6 border border-zinc-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Active Campaigns</h2>
              <Calendar className="w-5 h-5 text-zinc-400" />
            </div>

            <div className="space-y-4">
              {campaigns.map((campaign, index) => {
                const progress = (campaign.raised / campaign.goal) * 100;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-all cursor-pointer border border-zinc-700/50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{campaign.name}</h3>
                      <span className="text-xs text-zinc-400">
                        {Math.round(progress)}%
                      </span>
                    </div>

                    <div className="w-full bg-zinc-700 rounded-full h-2 mb-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">
                        ${campaign.raised.toLocaleString()} raised
                      </span>
                      <span className="text-zinc-500">
                        of ${campaign.goal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-zinc-500 mt-2">
                      <Users className="w-3 h-3 mr-1" />
                      {campaign.donors} donors
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Create New Campaign
            </motion.button>
          </motion.div>
        </div>

        {/* Quick Actions Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-500/30 rounded-xl p-6 cursor-pointer"
          >
            <Mail className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="font-bold mb-1">Send Thank You</h3>
            <p className="text-sm text-zinc-400">
              Email donors and show appreciation
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-500/30 rounded-xl p-6 cursor-pointer"
          >
            <TrendingUp className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="font-bold mb-1">View Reports</h3>
            <p className="text-sm text-zinc-400">
              Analyze donation trends and insights
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-500/30 rounded-xl p-6 cursor-pointer"
          >
            <Heart className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="font-bold mb-1">Donor Engagement</h3>
            <p className="text-sm text-zinc-400">Build lasting relationships</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FuelStationEnergyHub;
