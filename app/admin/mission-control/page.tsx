'use client'

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   Users,
//   DollarSign,
//   TrendingUp,
//   Activity,
//   Calendar,
//   UserCheck,
//   CreditCard,
//   BarChart3,
// } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
import UnderConstruction from '@/app/components/common/UnderConstruction'

const MissionControl = () => {
  // const [summary] = useState({
  //   totalUsers: 1247,
  //   totalRevenue: 45820,
  //   userGrowth: 12.5,
  //   revenueGrowth: 18.3,
  //   activeMembers: 892,
  //   memberGrowth: 8.4,
  //   donations: 28450,
  //   donationGrowth: 15.7,
  // });

  // Sample data for charts
  // const monthlyData = [
  //   { month: "Jan", users: 950, revenue: 32000, donations: 18000 },
  //   { month: "Feb", users: 1020, revenue: 35000, donations: 20000 },
  //   { month: "Mar", users: 1100, revenue: 38000, donations: 22000 },
  //   { month: "Apr", users: 1150, revenue: 40000, donations: 24000 },
  //   { month: "May", users: 1200, revenue: 43000, donations: 26000 },
  //   { month: "Jun", users: 1247, revenue: 45820, donations: 28450 },
  // ];

  // const programData = [
  //   { name: "Education", value: 35, color: "#6366f1" },
  //   { name: "Sports", value: 25, color: "#8b5cf6" },
  //   { name: "Arts", value: 20, color: "#a855f7" },
  //   { name: "Technology", value: 15, color: "#c084fc" },
  //   { name: "Other", value: 5, color: "#d8b4fe" },
  // ];

  // const ageDistribution = [
  //   { age: "6-8", count: 280 },
  //   { age: "9-11", count: 420 },
  //   { age: "12-14", count: 350 },
  //   { age: "15-18", count: 197 },
  // ];

  // const eventTicketSales = [
  //   { event: "Summer Gala", tickets: 245, revenue: 12250 },
  //   { event: "Sports Tournament", tickets: 189, revenue: 5670 },
  //   { event: "Art Exhibition", tickets: 156, revenue: 4680 },
  //   { event: "Tech Workshop", tickets: 134, revenue: 4020 },
  //   { event: "Music Festival", tickets: 298, revenue: 14900 },
  //   { event: "Career Fair", tickets: 167, revenue: 5010 },
  // ];

  // const donationSources = [
  //   {
  //     month: "Jan",
  //     individual: 1800,
  //     corporate: 1200,
  //     foundations: 600,
  //     events: 400,
  //   },
  //   {
  //     month: "Feb",
  //     individual: 2100,
  //     corporate: 1400,
  //     foundations: 700,
  //     events: 500,
  //   },
  //   {
  //     month: "Mar",
  //     individual: 2300,
  //     corporate: 1600,
  //     foundations: 800,
  //     events: 550,
  //   },
  //   {
  //     month: "Apr",
  //     individual: 2500,
  //     corporate: 1700,
  //     foundations: 900,
  //     events: 600,
  //   },
  //   {
  //     month: "May",
  //     individual: 2800,
  //     corporate: 1800,
  //     foundations: 1000,
  //     events: 650,
  //   },
  //   {
  //     month: "Jun",
  //     individual: 3000,
  //     corporate: 2100,
  //     foundations: 1200,
  //     events: 700,
  //   },
  // ];

  return (
    <UnderConstruction />
    // <div className="h-full bg-neutral-950 p-6">
    //   <div className="mx-auto">
    //     {/* Top Metrics Grid */}
    //     <motion.div
    //       variants={containerVariants}
    //       initial="hidden"
    //       animate="visible"
    //       className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
    //     >
    //       {/* Total Users Card */}
    //       <motion.div
    //         variants={cardVariants}
    //         className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 hover:border-indigo-500/50 transition-all duration-300"
    //       >
    //         <div className="flex items-center gap-3 mb-4">
    //           <div className="p-2 bg-indigo-500/10 rounded-lg">
    //             <Users className="w-5 h-5 text-indigo-400" />
    //           </div>
    //           <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
    //             Total Users
    //           </h3>
    //         </div>
    //         <div className="space-y-3">
    //           <motion.p
    //             initial={{ opacity: 0, scale: 0.5 }}
    //             animate={{ opacity: 1, scale: 1 }}
    //             transition={{ delay: 0.3, duration: 0.5 }}
    //             className="text-3xl font-bold text-white"
    //           >
    //             {summary.totalUsers.toLocaleString()}
    //           </motion.p>
    //           <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
    //             <motion.div
    //               initial={{ width: 0 }}
    //               animate={{ width: "75%" }}
    //               transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
    //               className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-full h-2"
    //             />
    //           </div>
    //           <div className="flex items-center gap-1">
    //             <TrendingUp className="w-3 h-3 text-green-500" />
    //             <span className="text-xs font-medium text-green-500">
    //               +{summary.userGrowth}%
    //             </span>
    //             <span className="text-xs text-neutral-500">vs last month</span>
    //           </div>
    //         </div>
    //       </motion.div>

    //       {/* Total Revenue Card */}
    //       <motion.div
    //         variants={cardVariants}
    //         className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 hover:border-purple-500/50 transition-all duration-300"
    //       >
    //         <div className="flex items-center gap-3 mb-4">
    //           <div className="p-2 bg-purple-500/10 rounded-lg">
    //             <DollarSign className="w-5 h-5 text-purple-400" />
    //           </div>
    //           <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
    //             Total Revenue
    //           </h3>
    //         </div>
    //         <div className="space-y-3">
    //           <motion.p
    //             initial={{ opacity: 0, scale: 0.5 }}
    //             animate={{ opacity: 1, scale: 1 }}
    //             transition={{ delay: 0.3, duration: 0.5 }}
    //             className="text-3xl font-bold text-white"
    //           >
    //             ${summary.totalRevenue.toLocaleString()}
    //           </motion.p>
    //           <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
    //             <motion.div
    //               initial={{ width: 0 }}
    //               animate={{ width: "82%" }}
    //               transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
    //               className="bg-linear-to-r from-purple-600 to-indigo-600 rounded-full h-2"
    //             />
    //           </div>
    //           <div className="flex items-center gap-1">
    //             <Activity className="w-3 h-3 text-green-500" />
    //             <span className="text-xs font-medium text-green-500">
    //               +{summary.revenueGrowth}%
    //             </span>
    //             <span className="text-xs text-neutral-500">vs last month</span>
    //           </div>
    //         </div>
    //       </motion.div>

    //       {/* Active Members Card */}
    //       <motion.div
    //         variants={cardVariants}
    //         className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 hover:border-indigo-500/50 transition-all duration-300"
    //       >
    //         <div className="flex items-center gap-3 mb-4">
    //           <div className="p-2 bg-indigo-500/10 rounded-lg">
    //             <UserCheck className="w-5 h-5 text-indigo-400" />
    //           </div>
    //           <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
    //             Active Members
    //           </h3>
    //         </div>
    //         <div className="space-y-3">
    //           <motion.p
    //             initial={{ opacity: 0, scale: 0.5 }}
    //             animate={{ opacity: 1, scale: 1 }}
    //             transition={{ delay: 0.3, duration: 0.5 }}
    //             className="text-3xl font-bold text-white"
    //           >
    //             {summary.activeMembers.toLocaleString()}
    //           </motion.p>
    //           <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
    //             <motion.div
    //               initial={{ width: 0 }}
    //               animate={{ width: "71%" }}
    //               transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
    //               className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-full h-2"
    //             />
    //           </div>
    //           <div className="flex items-center gap-1">
    //             <TrendingUp className="w-3 h-3 text-green-500" />
    //             <span className="text-xs font-medium text-green-500">
    //               +{summary.memberGrowth}%
    //             </span>
    //             <span className="text-xs text-neutral-500">vs last month</span>
    //           </div>
    //         </div>
    //       </motion.div>

    //       {/* Donations Card */}
    //       <motion.div
    //         variants={cardVariants}
    //         className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 hover:border-purple-500/50 transition-all duration-300"
    //       >
    //         <div className="flex items-center gap-3 mb-4">
    //           <div className="p-2 bg-purple-500/10 rounded-lg">
    //             <CreditCard className="w-5 h-5 text-purple-400" />
    //           </div>
    //           <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
    //             Donations
    //           </h3>
    //         </div>
    //         <div className="space-y-3">
    //           <motion.p
    //             initial={{ opacity: 0, scale: 0.5 }}
    //             animate={{ opacity: 1, scale: 1 }}
    //             transition={{ delay: 0.3, duration: 0.5 }}
    //             className="text-3xl font-bold text-white"
    //           >
    //             ${summary.donations.toLocaleString()}
    //           </motion.p>
    //           <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
    //             <motion.div
    //               initial={{ width: 0 }}
    //               animate={{ width: "78%" }}
    //               transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
    //               className="bg-linear-to-r from-purple-600 to-indigo-600 rounded-full h-2"
    //             />
    //           </div>
    //           <div className="flex items-center gap-1">
    //             <Activity className="w-3 h-3 text-green-500" />
    //             <span className="text-xs font-medium text-green-500">
    //               +{summary.donationGrowth}%
    //             </span>
    //             <span className="text-xs text-neutral-500">vs last month</span>
    //           </div>
    //         </div>
    //       </motion.div>
    //     </motion.div>

    //     {/* Charts Grid */}
    //     <motion.div
    //       variants={containerVariants}
    //       initial="hidden"
    //       animate="visible"
    //       className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
    //     >
    //       {/* User Growth Chart */}
    //       <motion.div
    //         variants={cardVariants}
    //         className="bg-neutral-900 rounded-lg border border-neutral-800 p-6"
    //       >
    //         <div className="flex items-center gap-3 mb-6">
    //           <div className="p-2 bg-indigo-500/10 rounded-lg">
    //             <BarChart3 className="w-5 h-5 text-indigo-400" />
    //           </div>
    //           <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
    //             User Growth Trend
    //           </h3>
    //         </div>
    //         <ResponsiveContainer width="100%" height={300}>
    //           <AreaChart data={monthlyData}>
    //             <defs>
    //               <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
    //                 <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
    //                 <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
    //               </linearGradient>
    //             </defs>
    //             <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
    //             <XAxis dataKey="month" stroke="#737373" />
    //             <YAxis stroke="#737373" />
    //             <Tooltip
    //               contentStyle={{
    //                 backgroundColor: "#171717",
    //                 border: "1px solid #404040",
    //                 borderRadius: "8px",
    //                 color: "#fff",
    //               }}
    //             />
    //             <Area
    //               type="monotone"
    //               dataKey="users"
    //               stroke="#6366f1"
    //               fillOpacity={1}
    //               fill="url(#userGradient)"
    //               strokeWidth={2}
    //             />
    //           </AreaChart>
    //         </ResponsiveContainer>
    //       </motion.div>

    //       {/* Revenue Chart */}
    //       <motion.div
    //         variants={cardVariants}
    //         className="bg-neutral-900 rounded-lg border border-neutral-800 p-6"
    //       >
    //         <div className="flex items-center gap-3 mb-6">
    //           <div className="p-2 bg-purple-500/10 rounded-lg">
    //             <DollarSign className="w-5 h-5 text-purple-400" />
    //           </div>
    //           <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
    //             Revenue & Donations
    //           </h3>
    //         </div>
    //         <ResponsiveContainer width="100%" height={300}>
    //           <LineChart data={monthlyData}>
    //             <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
    //             <XAxis dataKey="month" stroke="#737373" />
    //             <YAxis stroke="#737373" />
    //             <Tooltip
    //               contentStyle={{
    //                 backgroundColor: "#171717",
    //                 border: "1px solid #404040",
    //                 borderRadius: "8px",
    //                 color: "#fff",
    //               }}
    //             />
    //             <Legend wrapperStyle={{ color: "#fff" }} />
    //             <Line
    //               type="monotone"
    //               dataKey="revenue"
    //               stroke="#8b5cf6"
    //               strokeWidth={2}
    //               dot={{ fill: "#8b5cf6", r: 4 }}
    //             />
    //             <Line
    //               type="monotone"
    //               dataKey="donations"
    //               stroke="#6366f1"
    //               strokeWidth={2}
    //               dot={{ fill: "#6366f1", r: 4 }}
    //             />
    //           </LineChart>
    //         </ResponsiveContainer>
    //       </motion.div>
    //     </motion.div>

    //     {/* Bottom Charts */}
    //     <motion.div
    //       variants={containerVariants}
    //       initial="hidden"
    //       animate="visible"
    //       className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
    //     >
    //       {/* Program Distribution */}
    //       <motion.div
    //         variants={cardVariants}
    //         className="bg-neutral-900 rounded-lg border border-neutral-800 p-6"
    //       >
    //         <div className="flex items-center gap-3 mb-6">
    //           <div className="p-2 bg-indigo-500/10 rounded-lg">
    //             <Calendar className="w-5 h-5 text-indigo-400" />
    //           </div>
    //           <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
    //             Program Distribution
    //           </h3>
    //         </div>
    //         <ResponsiveContainer width="100%" height={300}>
    //           <PieChart>
    //             <Pie
    //               data={programData}
    //               cx="50%"
    //               cy="50%"
    //               labelLine={false}
    //               label={({ name, percent }) =>
    //                 `${name} ${(percent * 100).toFixed(0)}%`
    //               }
    //               outerRadius={100}
    //               fill="#8884d8"
    //               dataKey="value"
    //             >
    //               {programData.map((entry, index) => (
    //                 <Cell key={`cell-${index}`} fill={entry.color} />
    //               ))}
    //             </Pie>
    //             <Tooltip
    //               contentStyle={{
    //                 backgroundColor: "#171717",
    //                 border: "1px solid #404040",
    //                 borderRadius: "8px",
    //                 color: "#fff",
    //               }}
    //             />
    //           </PieChart>
    //         </ResponsiveContainer>
    //       </motion.div>

    //       {/* Age Distribution */}
    //       <motion.div
    //         variants={cardVariants}
    //         className="bg-neutral-900 rounded-lg border border-neutral-800 p-6"
    //       >
    //         <div className="flex items-center gap-3 mb-6">
    //           <div className="p-2 bg-purple-500/10 rounded-lg">
    //             <Users className="w-5 h-5 text-purple-400" />
    //           </div>
    //           <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
    //             Age Distribution
    //           </h3>
    //         </div>
    //         <ResponsiveContainer width="100%" height={300}>
    //           <BarChart data={ageDistribution}>
    //             <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
    //             <XAxis dataKey="age" stroke="#737373" />
    //             <YAxis stroke="#737373" />
    //             <Tooltip
    //               contentStyle={{
    //                 backgroundColor: "#171717",
    //                 border: "1px solid #404040",
    //                 borderRadius: "8px",
    //                 color: "#fff",
    //               }}
    //             />
    //             <Bar
    //               dataKey="count"
    //               fill="url(#barGradient)"
    //               radius={[8, 8, 0, 0]}
    //             />
    //             <defs>
    //               <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
    //                 <stop offset="5%" stopColor="#8b5cf6" stopOpacity={1} />
    //                 <stop offset="95%" stopColor="#6366f1" stopOpacity={1} />
    //               </linearGradient>
    //             </defs>
    //           </BarChart>
    //         </ResponsiveContainer>
    //       </motion.div>

    //       {/* Event Ticket Sales */}
    //       <motion.div
    //         variants={cardVariants}
    //         className="bg-neutral-900 rounded-lg border border-neutral-800 p-6"
    //       >
    //         <div className="flex items-center gap-3 mb-6">
    //           <div className="p-2 bg-indigo-500/10 rounded-lg">
    //             <Calendar className="w-5 h-5 text-indigo-400" />
    //           </div>
    //           <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
    //             Event Ticket Sales
    //           </h3>
    //         </div>
    //         <ResponsiveContainer width="100%" height={300}>
    //           <BarChart data={eventTicketSales} layout="vertical">
    //             <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
    //             <XAxis type="number" stroke="#737373" />
    //             <YAxis
    //               dataKey="event"
    //               type="category"
    //               stroke="#737373"
    //               width={120}
    //             />
    //             <Tooltip
    //               contentStyle={{
    //                 backgroundColor: "#171717",
    //                 border: "1px solid #404040",
    //                 borderRadius: "8px",
    //                 color: "#fff",
    //               }}
    //             />
    //             <Bar
    //               dataKey="tickets"
    //               fill="url(#ticketGradient)"
    //               radius={[0, 8, 8, 0]}
    //             />
    //             <defs>
    //               <linearGradient
    //                 id="ticketGradient"
    //                 x1="0"
    //                 y1="0"
    //                 x2="1"
    //                 y2="0"
    //               >
    //                 <stop offset="5%" stopColor="#6366f1" stopOpacity={1} />
    //                 <stop offset="95%" stopColor="#8b5cf6" stopOpacity={1} />
    //               </linearGradient>
    //             </defs>
    //           </BarChart>
    //         </ResponsiveContainer>
    //       </motion.div>

    //       {/* Donation Sources */}
    //       <motion.div
    //         variants={cardVariants}
    //         className="bg-neutral-900 rounded-lg border border-neutral-800 p-6"
    //       >
    //         <div className="flex items-center gap-3 mb-6">
    //           <div className="p-2 bg-purple-500/10 rounded-lg">
    //             <DollarSign className="w-5 h-5 text-purple-400" />
    //           </div>
    //           <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
    //             Donation Trends by Source
    //           </h3>
    //         </div>
    //         <ResponsiveContainer width="100%" height={300}>
    //           <AreaChart data={donationSources}>
    //             <defs>
    //               <linearGradient
    //                 id="individualGradient"
    //                 x1="0"
    //                 y1="0"
    //                 x2="0"
    //                 y2="1"
    //               >
    //                 <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
    //                 <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
    //               </linearGradient>
    //               <linearGradient
    //                 id="corporateGradient"
    //                 x1="0"
    //                 y1="0"
    //                 x2="0"
    //                 y2="1"
    //               >
    //                 <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
    //                 <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
    //               </linearGradient>
    //               <linearGradient
    //                 id="foundationsGradient"
    //                 x1="0"
    //                 y1="0"
    //                 x2="0"
    //                 y2="1"
    //               >
    //                 <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
    //                 <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
    //               </linearGradient>
    //               <linearGradient
    //                 id="eventsGradient"
    //                 x1="0"
    //                 y1="0"
    //                 x2="0"
    //                 y2="1"
    //               >
    //                 <stop offset="5%" stopColor="#c084fc" stopOpacity={0.8} />
    //                 <stop offset="95%" stopColor="#c084fc" stopOpacity={0.1} />
    //               </linearGradient>
    //             </defs>
    //             <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
    //             <XAxis dataKey="month" stroke="#737373" />
    //             <YAxis stroke="#737373" />
    //             <Tooltip
    //               contentStyle={{
    //                 backgroundColor: "#171717",
    //                 border: "1px solid #404040",
    //                 borderRadius: "8px",
    //                 color: "#fff",
    //               }}
    //               formatter={(value) => `$${value.toLocaleString()}`}
    //             />
    //             <Legend wrapperStyle={{ color: "#fff" }} />
    //             <Area
    //               type="monotone"
    //               dataKey="individual"
    //               stackId="1"
    //               stroke="#6366f1"
    //               fill="url(#individualGradient)"
    //               strokeWidth={2}
    //             />
    //             <Area
    //               type="monotone"
    //               dataKey="corporate"
    //               stackId="1"
    //               stroke="#8b5cf6"
    //               fill="url(#corporateGradient)"
    //               strokeWidth={2}
    //             />
    //             <Area
    //               type="monotone"
    //               dataKey="foundations"
    //               stackId="1"
    //               stroke="#a855f7"
    //               fill="url(#foundationsGradient)"
    //               strokeWidth={2}
    //             />
    //             <Area
    //               type="monotone"
    //               dataKey="events"
    //               stackId="1"
    //               stroke="#c084fc"
    //               fill="url(#eventsGradient)"
    //               strokeWidth={2}
    //             />
    //           </AreaChart>
    //         </ResponsiveContainer>
    //       </motion.div>
    //     </motion.div>

    //     {/* Summary Footer */}
    //     <motion.div
    //       initial={{ opacity: 0, y: 20 }}
    //       animate={{ opacity: 1, y: 0 }}
    //       transition={{ delay: 0.8, duration: 0.5 }}
    //       className="grid grid-cols-1 md:grid-cols-3 gap-6"
    //     >
    //       <div className="bg-linear-to-br from-indigo-600 to-indigo-700 rounded-lg p-6 border border-indigo-500/50">
    //         <div className="flex items-center justify-between">
    //           <div>
    //             <p className="text-indigo-200 text-sm font-medium uppercase tracking-wide mb-2">
    //               Total Events
    //             </p>
    //             <p className="text-3xl font-bold text-white">24</p>
    //             <p className="text-indigo-200 text-xs mt-1">This quarter</p>
    //           </div>
    //           <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
    //             <Calendar className="w-6 h-6 text-white" />
    //           </div>
    //         </div>
    //       </div>

    //       <div className="bg-linear-to-br from-purple-600 to-purple-700 rounded-lg p-6 border border-purple-500/50">
    //         <div className="flex items-center justify-between">
    //           <div>
    //             <p className="text-purple-200 text-sm font-medium uppercase tracking-wide mb-2">
    //               Tickets Sold
    //             </p>
    //             <p className="text-3xl font-bold text-white">1,189</p>
    //             <p className="text-purple-200 text-xs mt-1">
    //               Across all events
    //             </p>
    //           </div>
    //           <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
    //             <Activity className="w-6 h-6 text-white" />
    //           </div>
    //         </div>
    //       </div>

    //       <div className="bg-linear-to-br from-indigo-600 to-purple-600 rounded-lg p-6 border border-indigo-500/50">
    //         <div className="flex items-center justify-between">
    //           <div>
    //             <p className="text-indigo-200 text-sm font-medium uppercase tracking-wide mb-2">
    //               Avg Ticket Price
    //             </p>
    //             <p className="text-3xl font-bold text-white">$42</p>
    //             <p className="text-indigo-200 text-xs mt-1">Per ticket sold</p>
    //           </div>
    //           <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
    //             <DollarSign className="w-6 h-6 text-white" />
    //           </div>
    //         </div>
    //       </div>
    //     </motion.div>
    //   </div>
    // </div>
  )
}

export default MissionControl
