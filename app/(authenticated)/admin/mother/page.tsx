'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrainCircuit, Send, Sparkles, Activity } from 'lucide-react'

const Mother = () => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      type: 'system',
      text: 'MOTHER SYSTEMS ONLINE',
      timestamp: new Date()
    },
    {
      type: 'mother',
      text: 'Good afternoon. I am Mother, your central intelligence system. I have access to all organizational data across The Fuel Station, The Events, programs, and youth records.',
      timestamp: new Date()
    },
    {
      type: 'mother',
      text: 'What would you like to know?',
      timestamp: new Date()
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      type: 'user',
      text: input,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate Mother's response
    setTimeout(() => {
      const motherResponse = {
        type: 'mother',
        text: 'Processing your request. This feature is currently in development. Soon I will provide real-time analytics, generate custom reports, and offer predictive insights across all your systems.',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, motherResponse])
      setIsTyping(false)
    }, 1500)
  }

  const suggestions = [
    'Show me donation trends for the past 6 months',
    'Which events had the highest attendance?',
    'How many youth are enrolled in STEM programs?',
    'Compare revenue across all platforms'
  ]

  return (
    <div className="h-[calc(100vh-68px)] bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 255, 0, 0.02) 50%)',
          backgroundSize: '100% 4px'
        }}
        animate={{
          backgroundPosition: ['0% 0%', '0% 100%']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto p-6 h-full flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 pb-6 border-b border-green-400/30"
        >
          <div className="flex items-center space-x-4 mb-3">
            <BrainCircuit className="w-12 h-12 text-green-400" />

            <div>
              <h1 className="text-3xl font-bold tracking-wider">MOTHER</h1>
              <p className="text-green-400/70 text-sm">Central Intelligence System v2.0</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              />
              <span>SYSTEMS ONLINE</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-3 h-3" />
              <span>ALL MODULES CONNECTED</span>
            </div>
            <div>
              <span className="text-green-400/50">CLEARANCE: ADMIN</span>
            </div>
          </div>
        </motion.div>

        {/* Messages Container */}
        <div className="flex-1 mb-6 overflow-y-auto space-y-4 pr-4 scrollbar-thin scrollbar-track-black scrollbar-thumb-green-400/30">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: message.type === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl ${
                    message.type === 'system'
                      ? 'text-center text-green-400/50 text-xs italic w-full'
                      : message.type === 'user'
                        ? 'bg-green-400/10 border border-green-400/30 rounded-lg p-4'
                        : 'border-l-2 border-green-400/50 pl-4'
                  }`}
                >
                  {message.type !== 'system' && (
                    <div className="flex items-center space-x-2 mb-2 text-xs text-green-400/70">
                      {message.type === 'mother' && <BrainCircuit className="w-3 h-3" />}
                      <span className="font-bold">{message.type === 'mother' ? 'MOTHER' : 'ADMIN'}</span>
                      <span className="text-green-400/50">{message.timestamp.toLocaleTimeString()}</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-green-400/70 text-sm"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Mother is analyzing</span>
              <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                ...
              </motion.span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length <= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center space-x-2 mb-3 text-xs text-green-400/50">
              <Sparkles className="w-3 h-3" />
              <span>SUGGESTED QUERIES</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  whileHover={{ x: 4 }}
                  onClick={() => setInput(suggestion)}
                  className="text-left p-3 bg-green-400/5 border border-green-400/20 hover:border-green-400/40 rounded text-xs transition-colors"
                >
                  <span className="text-green-400/40 mr-2">›</span>
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="relative"
        >
          <div className="flex items-center space-x-3 bg-black border-2 border-green-400/30 rounded-lg p-2 focus-within:border-green-400/60 transition-colors">
            <span className="text-green-400 pl-2 text-lg">›</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Mother anything about your organization..."
              className="flex-1 bg-transparent text-green-400 placeholder-green-400/30 outline-none text-sm"
              disabled={isTyping}
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isTyping || !input.trim()}
              className="p-2 bg-green-400/10 hover:bg-green-400/20 border border-green-400/30 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>

          <p className="text-xs text-green-400/30 mt-2 pl-2">
            Press Enter to submit • Mother has access to all system data
          </p>
        </motion.form>
      </div>
    </div>
  )
}

export default Mother
