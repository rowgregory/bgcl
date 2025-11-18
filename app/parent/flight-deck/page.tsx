"use client";

import React, { JSX, useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Baby,
  Calendar,
  CreditCard,
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  DollarSign,
  ArrowRight,
  Plus,
  MessageSquare,
} from "lucide-react";

interface Child {
  id: number;
  name: string;
  age: number;
  grade: string;
  avatar: string;
  enrollments: number;
}

interface Enrollment {
  id: number;
  childName: string;
  programName: string;
  status: "active" | "pending" | "waitlist";
  nextSession: string;
  daysUntil: number;
}

interface UpcomingEvent {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  registered: boolean;
}

interface Payment {
  id: number;
  description: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

interface Notification {
  id: number;
  message: string;
  type: "info" | "warning" | "success";
  timestamp: string;
  read: boolean;
}

const ParentDashboard: React.FC = () => {
  const [parentName] = useState<string>("John Doe");
  const [profileComplete] = useState<boolean>(false);

  const [children] = useState<Child[]>([
    {
      id: 1,
      name: "Emma Doe",
      age: 8,
      grade: "3rd Grade",
      avatar: "ED",
      enrollments: 2,
    },
    {
      id: 2,
      name: "Liam Doe",
      age: 10,
      grade: "5th Grade",
      avatar: "LD",
      enrollments: 1,
    },
  ]);

  const [enrollments] = useState<Enrollment[]>([
    {
      id: 1,
      childName: "Emma Doe",
      programName: "Kids Club",
      status: "active",
      nextSession: "Today, 3:00 PM",
      daysUntil: 0,
    },
    {
      id: 2,
      childName: "Emma Doe",
      programName: "Camp Creighton",
      status: "active",
      nextSession: "Tomorrow, 9:00 AM",
      daysUntil: 1,
    },
    {
      id: 3,
      childName: "Liam Doe",
      programName: "Teen Center",
      status: "active",
      nextSession: "Today, 6:00 PM",
      daysUntil: 0,
    },
  ]);

  const [upcomingEvents] = useState<UpcomingEvent[]>([
    {
      id: 1,
      name: "Summer Gala 2024",
      date: "July 15, 2024",
      time: "6:00 PM",
      location: "Lynn Auditorium",
      registered: true,
    },
    {
      id: 2,
      name: "Sports Tournament",
      date: "June 20, 2024",
      time: "9:00 AM",
      location: "BGCL Gymnasium",
      registered: false,
    },
    {
      id: 3,
      name: "Parent Meeting",
      date: "June 5, 2024",
      time: "7:00 PM",
      location: "BGCL Main Hall",
      registered: false,
    },
  ]);

  const [payments] = useState<Payment[]>([
    {
      id: 1,
      description: "Kids Club - June 2024",
      amount: 150.0,
      dueDate: "June 1, 2024",
      status: "pending",
    },
    {
      id: 2,
      description: "Camp Creighton Registration",
      amount: 250.0,
      dueDate: "May 25, 2024",
      status: "paid",
    },
  ]);

  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      message: "Your payment for Kids Club is due in 3 days",
      type: "warning",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      message: "Emma has been enrolled in Camp Creighton successfully",
      type: "success",
      timestamp: "1 day ago",
      read: false,
    },
    {
      id: 3,
      message: "New event: Summer Gala 2024 - Register now!",
      type: "info",
      timestamp: "2 days ago",
      read: true,
    },
  ]);

  const stats = {
    totalChildren: children.length,
    activeEnrollments: enrollments.filter((e) => e.status === "active").length,
    upcomingEvents: upcomingEvents.length,
    pendingPayments: payments.filter((p) => p.status === "pending").length,
    unreadNotifications: notifications.filter((n) => !n.read).length,
  };

  const getStatusBadge = (
    status: "active" | "pending" | "waitlist"
  ): JSX.Element => {
    const config = {
      active: { color: "green", label: "Active" },
      pending: { color: "yellow", label: "Pending" },
      waitlist: { color: "orange", label: "Waitlist" },
    };

    const { color, label } = config[status];

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}
      >
        {label}
      </span>
    );
  };

  const getPaymentStatusBadge = (
    status: "paid" | "pending" | "overdue"
  ): JSX.Element => {
    const config = {
      paid: { color: "green", label: "Paid", icon: CheckCircle },
      pending: { color: "yellow", label: "Pending", icon: Clock },
      overdue: { color: "red", label: "Overdue", icon: AlertTriangle },
    };

    const { color, label, icon: Icon } = config[status];

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}
      >
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
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
    <div className="min-h-screen bg-neutral-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Welcome back, {parentName}! 👋
              </h1>
              <p className="text-sm text-neutral-400">
                Here&apos;s what&apos;s happening with your crew
              </p>
            </div>
          </div>
        </motion.div>

        {/* Profile Incomplete Alert */}
        {!profileComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-yellow-400 mb-1">
                    Complete Your Profile
                  </h3>
                  <p className="text-xs text-neutral-400 mb-3">
                    Please complete your profile to unlock all features and
                    enroll your children in programs.
                  </p>
                  <a
                    href="/parent/command-center"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-neutral-900 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Complete Profile
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-6"
        >
          <motion.div
            variants={cardVariants}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 md:p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <Baby className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Children
              </h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {stats.totalChildren}
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 md:p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Active
              </h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {stats.activeEnrollments}
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 md:p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Events
              </h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {stats.upcomingEvents}
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 md:p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-yellow-400" />
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Pending
              </h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {stats.pendingPayments}
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 md:p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-red-400" />
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Alerts
              </h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {stats.unreadNotifications}
            </p>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Children & Enrollments */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Crew */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-neutral-900 rounded-lg border border-neutral-800 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">My Crew</h2>
                <a
                  href="/parent/crew-roster"
                  className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  Manage <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center gap-3 p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold">
                        {child.avatar}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {child.name}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        {child.grade} • {child.age} years old
                      </p>
                      <p className="text-xs text-indigo-400 mt-1">
                        {child.enrollments} active enrollment
                        {child.enrollments !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                ))}

                <button className="flex items-center justify-center gap-2 p-4 bg-neutral-800/50 border-2 border-dashed border-neutral-700 rounded-lg hover:border-indigo-500 hover:bg-neutral-800 transition-all">
                  <Plus className="w-5 h-5 text-neutral-500" />
                  <span className="text-sm text-neutral-500">Add Child</span>
                </button>
              </div>
            </motion.div>

            {/* Active Missions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-neutral-900 rounded-lg border border-neutral-800 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">
                  Active Missions
                </h2>
                <a
                  href="/parent/active-missions"
                  className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="space-y-3">
                {enrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-start justify-between p-4 bg-neutral-800/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-white">
                          {enrollment.programName}
                        </h3>
                        {getStatusBadge(enrollment.status)}
                      </div>
                      <p className="text-xs text-neutral-500 mb-2">
                        {enrollment.childName}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <Clock className="w-3 h-3" />
                        <span>{enrollment.nextSession}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Events, Payments, Notifications */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-neutral-900 rounded-lg border border-neutral-800 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">
                  Upcoming Events
                </h2>
                <a
                  href="/parent/capsule"
                  className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="space-y-3">
                {upcomingEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-neutral-800/50 rounded-lg"
                  >
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {event.name}
                    </h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {event.date} at {event.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    {event.registered ? (
                      <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Registered
                      </div>
                    ) : (
                      <button className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                        Register Now <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Pending Payments */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-neutral-900 rounded-lg border border-neutral-800 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Payments</h2>
                <a
                  href="/parent/fuel-station"
                  className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-3 bg-neutral-800/50 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-white mb-1">
                          {payment.description}
                        </h3>
                        <p className="text-xs text-neutral-500">
                          Due: {payment.dueDate}
                        </p>
                      </div>
                      {getPaymentStatusBadge(payment.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-400">
                        ${payment.amount.toFixed(2)}
                      </span>
                      {payment.status === "pending" && (
                        <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg transition-colors">
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-neutral-900 rounded-lg border border-neutral-800 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Notifications</h2>
                <a
                  href="/parent/signal-tower"
                  className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="space-y-2">
                {notifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${
                      notification.read
                        ? "bg-neutral-800/30"
                        : "bg-neutral-800/70"
                    }`}
                  >
                    <p className="text-xs text-white mb-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {notification.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <a
            href="/parent/launch-pad"
            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200"
          >
            <Rocket className="w-8 h-8 text-white" />
            <span className="text-sm font-semibold text-white text-center">
              Browse Programs
            </span>
          </a>

          <a
            href="/parent/capsule"
            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
          >
            <Calendar className="w-8 h-8 text-white" />
            <span className="text-sm font-semibold text-white text-center">
              View Events
            </span>
          </a>

          <a
            href="/parent/fuel-station"
            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200"
          >
            <DollarSign className="w-8 h-8 text-white" />
            <span className="text-sm font-semibold text-white text-center">
              Make Payment
            </span>
          </a>

          <a
            href="/parent/ground-support"
            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200"
          >
            <MessageSquare className="w-8 h-8 text-white" />
            <span className="text-sm font-semibold text-white text-center">
              Get Support
            </span>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default ParentDashboard;
