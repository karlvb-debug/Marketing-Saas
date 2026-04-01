"use client"

import React, { useState, useEffect } from 'react'

interface PromptModalProps {
  isOpen: boolean
  title: string
  placeholder?: string
  submitText?: string
  onClose: () => void
  onSubmit: (value: string) => void
}

export function PromptModal({ isOpen, title, placeholder = "Enter value", submitText = "Confirm", onClose, onSubmit }: PromptModalProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (isOpen) {
      setValue('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSubmit(value.trim())
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            autoFocus
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-900 shadow-sm"
          />
          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!value.trim()}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl transition-colors shadow-md"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
