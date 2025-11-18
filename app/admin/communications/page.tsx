"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Mail,
  Bell,
  AlertTriangle,
  Users,
  Clock,
  Eye,
  ChevronDown,
  Filter,
  Search,
  Paperclip,
} from "lucide-react";

const AdminCommunicationsPage = () => {
  const [activeTab, setActiveTab] = useState("send"); // send, history
  const [messageType, setMessageType] = useState("email"); // email, push, emergency
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Form states
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    recipient: "all", // all, parents, staff, members
    scheduledDate: "",
    scheduledTime: "",
    attachments: [],
  });

  // Message history
  const [messageHistory] = useState([
    {
      id: 1,
      type: "email",
      subject: "Summer Camp Registration Now Open",
      message:
        "We are excited to announce that registration for our Summer Camp program is now open...",
      recipient: "All Parents",
      sentBy: "Admin",
      sentDate: "2024-11-10",
      sentTime: "9:30 AM",
      recipientCount: 245,
      opened: 198,
      status: "sent",
    },
    {
      id: 2,
      type: "push",
      subject: "Event Tomorrow: Sports Tournament",
      message:
        "Reminder: The Sports Tournament starts tomorrow at 9:00 AM. Don't forget to arrive early!",
      recipient: "Sports Program Members",
      sentBy: "Sarah Martinez",
      sentDate: "2024-11-09",
      sentTime: "6:00 PM",
      recipientCount: 89,
      opened: 76,
      status: "sent",
    },
    {
      id: 3,
      type: "emergency",
      subject: "Weather Alert - Early Closure",
      message:
        "Due to severe weather conditions, the Boys & Girls Club will be closing at 3:00 PM today. Please arrange for early pickup.",
      recipient: "All Users",
      sentBy: "Admin",
      sentDate: "2024-11-08",
      sentTime: "1:15 PM",
      recipientCount: 487,
      opened: 465,
      status: "sent",
    },
    {
      id: 4,
      type: "email",
      subject: "Thanksgiving Holiday Schedule",
      message:
        "The club will be closed November 23-24 for Thanksgiving. We will resume normal operations on November 27.",
      recipient: "All Users",
      sentBy: "Admin",
      sentDate: "2024-11-07",
      sentTime: "10:00 AM",
      recipientCount: 487,
      opened: 412,
      status: "sent",
    },
    {
      id: 5,
      type: "push",
      subject: "New Art Exhibition Photos Posted",
      message:
        "Check out the amazing photos from last week's Art Exhibition in the app gallery!",
      recipient: "Arts Program Members",
      sentBy: "Lisa Chen",
      sentDate: "2024-11-06",
      sentTime: "2:45 PM",
      recipientCount: 67,
      opened: 52,
      status: "sent",
    },
    {
      id: 6,
      type: "email",
      subject: "Monthly Newsletter - November",
      message:
        "Check out what's happening this month at the Boys & Girls Club...",
      recipient: "All Users",
      sentBy: "Admin",
      sentDate: "2024-11-01",
      sentTime: "8:00 AM",
      recipientCount: 487,
      opened: 389,
      status: "sent",
    },
  ]);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "email":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Mail className="w-3 h-3" />
            Email
          </span>
        );
      case "push":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Bell className="w-3 h-3" />
            Push
          </span>
        );
      case "emergency":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertTriangle className="w-3 h-3" />
            Emergency
          </span>
        );
      default:
        return null;
    }
  };

  const handleSend = () => {
    console.log("Sending message:", formData);
    // Reset form
    setFormData({
      subject: "",
      message: "",
      recipient: "all",
      scheduledDate: "",
      scheduledTime: "",
      attachments: [],
    });
  };

  const filteredMessages = messageHistory.filter((msg) => {
    const matchesSearch =
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.recipient.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === "all" || msg.type === filterType;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalSent: messageHistory.length,
    emailsSent: messageHistory.filter((m) => m.type === "email").length,
    pushSent: messageHistory.filter((m) => m.type === "push").length,
    emergencySent: messageHistory.filter((m) => m.type === "emergency").length,
    avgOpenRate: Math.round(
      (messageHistory.reduce((sum, m) => sum + m.opened / m.recipientCount, 0) /
        messageHistory.length) *
        100
    ),
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
              <Send className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Total Sent
              </h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {stats.totalSent}
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 md:p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Emails
              </h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {stats.emailsSent}
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 md:p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Push
              </h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {stats.pushSent}
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 md:p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Emergency
              </h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {stats.emergencySent}
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 md:p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-green-400" />
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Avg Open Rate
              </h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {stats.avgOpenRate}%
            </p>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-6"
        >
          <button
            onClick={() => setActiveTab("send")}
            className={`flex-1 md:flex-none px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "send"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <Send className="w-4 h-4 inline mr-2" />
            Send Message
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 md:flex-none px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "history"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            History
          </button>
        </motion.div>

        {/* Send Message Tab */}
        {activeTab === "send" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 md:p-6"
          >
            {/* Message Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-400 mb-3">
                Message Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => setMessageType("email")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    messageType === "email"
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-neutral-800 bg-neutral-800/50 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Mail
                      className={`w-5 h-5 ${messageType === "email" ? "text-indigo-400" : "text-neutral-400"}`}
                    />
                    <span
                      className={`font-semibold ${messageType === "email" ? "text-white" : "text-neutral-400"}`}
                    >
                      Email
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Send detailed messages with attachments
                  </p>
                </button>

                <button
                  onClick={() => setMessageType("push")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    messageType === "push"
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-neutral-800 bg-neutral-800/50 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Bell
                      className={`w-5 h-5 ${messageType === "push" ? "text-purple-400" : "text-neutral-400"}`}
                    />
                    <span
                      className={`font-semibold ${messageType === "push" ? "text-white" : "text-neutral-400"}`}
                    >
                      Push Notification
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Quick alerts to mobile devices
                  </p>
                </button>

                <button
                  onClick={() => setMessageType("emergency")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    messageType === "emergency"
                      ? "border-red-500 bg-red-500/10"
                      : "border-neutral-800 bg-neutral-800/50 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <AlertTriangle
                      className={`w-5 h-5 ${messageType === "emergency" ? "text-red-400" : "text-neutral-400"}`}
                    />
                    <span
                      className={`font-semibold ${messageType === "emergency" ? "text-white" : "text-neutral-400"}`}
                    >
                      Emergency Broadcast
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Urgent alerts to all channels
                  </p>
                </button>
              </div>
            </div>

            {/* Recipient Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Recipients
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
                <select
                  value={formData.recipient}
                  onChange={(e) =>
                    setFormData({ ...formData, recipient: e.target.value })
                  }
                  className="w-full pl-10 pr-8 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                >
                  <option value="all">All Users (487 recipients)</option>
                  <option value="parents">All Parents (245 recipients)</option>
                  <option value="staff">All Staff (12 recipients)</option>
                  <option value="members">
                    All Members (1,247 recipients)
                  </option>
                  <option value="kids-club">
                    Kids Club Members (42 recipients)
                  </option>
                  <option value="teen-center">
                    Teen Center Members (28 recipients)
                  </option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
              </div>
            </div>

            {/* Subject */}
            {messageType !== "push" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-400 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Enter subject line..."
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Message */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder={
                  messageType === "push"
                    ? "Keep it short for push notifications..."
                    : "Type your message here..."
                }
                rows={messageType === "push" ? 4 : 8}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
              {messageType === "push" && (
                <p className="text-xs text-neutral-500 mt-2">
                  {formData.message.length}/150 characters (recommended)
                </p>
              )}
            </div>

            {/* Attachments (Email only) */}
            {messageType === "email" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-400 mb-2">
                  Attachments
                </label>
                <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors border border-neutral-700">
                  <Paperclip className="w-4 h-4" />
                  Add Attachment
                </button>
              </div>
            )}

            {/* Schedule (Optional) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Schedule (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledDate: e.target.value })
                  }
                  className="px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledTime: e.target.value })
                  }
                  className="px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSend}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200"
              >
                <Send className="w-5 h-5" />
                {formData.scheduledDate ? "Schedule Message" : "Send Now"}
              </button>
              <button className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors border border-neutral-700">
                Save Draft
              </button>
            </div>

            {/* Warning for Emergency */}
            {messageType === "emergency" && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-1">
                      Emergency Broadcast
                    </h4>
                    <p className="text-xs text-neutral-400">
                      This will send an immediate notification to all users via
                      email, push notification, and SMS. Use only for urgent
                      situations requiring immediate attention.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <>
            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 md:p-6 mb-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-10 pr-8 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer min-w-[200px]"
                  >
                    <option value="all">All Types</option>
                    <option value="email">Emails Only</option>
                    <option value="push">Push Notifications</option>
                    <option value="emergency">Emergency Broadcasts</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
                </div>
              </div>
            </motion.div>

            {/* Message History List - Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="hidden lg:block bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden"
            >
              <table className="w-full">
                <thead className="bg-neutral-800 border-b border-neutral-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Sent By
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Open Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {filteredMessages.map((msg, index) => (
                    <motion.tr
                      key={msg.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypeBadge(msg.type)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">
                          {msg.subject}
                        </div>
                        <div className="text-xs text-neutral-500 line-clamp-1">
                          {msg.message}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-400">
                          {msg.recipient}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {msg.recipientCount} recipients
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-400">
                        {msg.sentBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-400">
                          {msg.sentDate}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {msg.sentTime}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-neutral-800 rounded-full h-2 overflow-hidden max-w-[100px]">
                            <div
                              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                              style={{
                                width: `${(msg.opened / msg.recipientCount) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-neutral-400">
                            {Math.round(
                              (msg.opened / msg.recipientCount) * 100
                            )}
                            %
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* Message History Cards - Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:hidden space-y-4"
            >
              {filteredMessages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-neutral-900 rounded-lg border border-neutral-800 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    {getTypeBadge(msg.type)}
                    <div className="text-right">
                      <div className="text-xs text-neutral-400">
                        {msg.sentDate}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {msg.sentTime}
                      </div>
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-white mb-1">
                    {msg.subject}
                  </h4>
                  <p className="text-xs text-neutral-500 mb-3 line-clamp-2">
                    {msg.message}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-neutral-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500">To:</span>
                      <span className="text-neutral-400">
                        {msg.recipient} ({msg.recipientCount})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500">Sent by:</span>
                      <span className="text-neutral-400">{msg.sentBy}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500">Open Rate:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-1.5 rounded-full"
                            style={{
                              width: `${(msg.opened / msg.recipientCount) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-neutral-400">
                          {Math.round((msg.opened / msg.recipientCount) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {filteredMessages.length === 0 && (
              <div className="text-center py-12 bg-neutral-900 rounded-lg border border-neutral-800">
                <Mail className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                <p className="text-neutral-400">
                  No messages found matching your criteria
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCommunicationsPage;
