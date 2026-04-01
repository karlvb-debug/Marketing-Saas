"use client"

import React, { useState, useRef } from 'react'
import { Save, Settings, UploadCloud, Loader2, ChevronDown, ChevronRight, Type, Palette, Layout, MessageSquare } from 'lucide-react'
import { saveThemeConfig } from '@/app/actions/themeConfig'
import { uploadAsset } from '@/app/actions/storage'

export interface ThemeConfig {
  global: {
    backgroundColor: string
    contentWidth: number
    primaryColor: string
    fontFamily: string
  }
  typography: {
    textColor: string
    h1: { fontSize: string, color: string, borderEnabled?: {top: boolean, right: boolean, bottom: boolean, left: boolean}, borderWidth?: string, borderColor?: string }
    h2: { fontSize: string, color: string, borderEnabled?: {top: boolean, right: boolean, bottom: boolean, left: boolean}, borderWidth?: string, borderColor?: string }
    h3: { fontSize: string, color: string, borderEnabled?: {top: boolean, right: boolean, bottom: boolean, left: boolean}, borderWidth?: string, borderColor?: string }
    p: { fontSize: string, lineHeight: string }
    linkDecoration: 'none' | 'underline'
  }
  header: {
    logoUrl: string
    logoWidth?: number
    backgroundColor: string
    paddingY: number
    paddingX?: number
    borderBottomWidth: number
    borderBottomColor: string
  }
  footer: {
    text: string
    backgroundColor: string
    textColor: string
    linkColor: string
    paddingY: number
    borderTopWidth: number
    borderTopColor: string
  }
  callouts: {
    info: { bg: string, border: string, text: string, icon: string }
    warning: { bg: string, border: string, text: string, icon: string }
    quote: { borderLeft: string, text: string, italic: boolean }
  }
}

const WEBSAFE_FONTS = [
  { label: 'Arial, sans-serif', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Verdana, sans-serif', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Tahoma, sans-serif', value: 'Tahoma, Geneva, sans-serif' },
  { label: 'Trebuchet MS, sans-serif', value: '"Trebuchet MS", Helvetica, sans-serif' },
  { label: 'Times New Roman, serif', value: '"Times New Roman", Times, serif' },
  { label: 'Georgia, serif', value: 'Georgia, serif' },
  { label: 'Courier New, monospace', value: '"Courier New", Courier, monospace' },
]

const CALLOUT_ICONS = [
  { label: 'Info Circle (ⓘ)', value: 'ⓘ' },
  { label: 'Warning Sign (⚠)', value: '⚠' },
  { label: 'Star (★)', value: '★' },
  { label: 'Checkmark (✓)', value: '✓' },
  { label: 'Lightbulb (💡)', value: '💡' },
  { label: 'Megaphone (📢)', value: '📢' },
  { label: 'None', value: '' },
]

const defaultConfig: ThemeConfig = {
  global: {
    backgroundColor: "#F3F4F6",
    contentWidth: 600,
    primaryColor: "#4F46E5",
    fontFamily: "Arial, Helvetica, sans-serif"
  },
  typography: {
    textColor: "#374151",
    h1: { fontSize: "28px", color: "#111827" },
    h2: { fontSize: "24px", color: "#1F2937" },
    h3: { fontSize: "20px", color: "#374151" },
    p:  { fontSize: "16px", lineHeight: "1.6" },
    linkDecoration: 'underline'
  },
  header: {
    logoUrl: "",
    logoWidth: 150,
    backgroundColor: "#FFFFFF",
    paddingY: 40,
    paddingX: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB"
  },
  footer: {
    text: "Your Company Name\\n123 Startup Ave, City CA 90000",
    backgroundColor: "#F9FAFB",
    textColor: "#6B7280",
    linkColor: "#4F46E5",
    paddingY: 30,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB"
  },
  callouts: {
    info: { bg: "#EFF6FF", border: "#BFDBFE", text: "#1E3A8A", icon: 'ⓘ' },
    warning: { bg: "#FFFBEB", border: "#FDE68A", text: "#92400E", icon: '⚠' },
    quote: { borderLeft: "#4F46E5", text: "#4B5563", italic: true }
  }
}

const AccordionHeader = ({ id, label, icon: Icon, activeTab, setActiveTab }: { id: any, label: string, icon: any, activeTab: any, setActiveTab: any }) => (
  <button 
    onClick={() => setActiveTab(id)}
    className={`w-full flex items-center justify-between px-5 py-3 border-b transition-colors ${activeTab === id ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50'}`}
  >
    <div className="flex items-center space-x-3">
      <Icon size={16} className={activeTab === id ? 'text-indigo-600' : 'text-gray-400'} />
      <span className="font-bold text-sm tracking-wide">{label}</span>
    </div>
    {activeTab === id ? <ChevronDown size={14} className="text-indigo-400" /> : <ChevronRight size={14} className="text-gray-300" />}
  </button>
)

const ColorInput = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1 leading-none">{label}</label>
    <div className="flex flex-row items-center gap-2 mt-1">
      <div 
        className="rounded cursor-pointer border border-gray-300 shadow-sm overflow-hidden flex items-center justify-center bg-white flex-none"
        style={{ width: '32px', height: '30px', minWidth: '32px', flexShrink: 0, padding: 0 }}
      >
        <input 
          type="color" 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          className="cursor-pointer border-0 p-0 m-0 bg-transparent outline-none flex-none block" 
          style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px', marginLeft: '-4px', marginTop: '-4px' }} 
        />
      </div>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className="flex-1 w-full min-w-0 text-xs rounded-md border-gray-300 border px-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 pt-[7px] pb-[7px] outline-none uppercase font-mono m-0" />
    </div>
  </div>
)

const SelectInput = ({ label, value, options, onChange }: { label: string, value: string, options: {label: string, value: string}[], onChange: (v: string) => void }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full text-xs rounded-md border-gray-300 border px-2 py-1.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
)

const TextInput = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full text-xs rounded-md border-gray-300 border px-2 py-1.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
  </div>
)

const HeadingConfigurator = ({ label, configObj, onChange }: { label: string, configObj: any, onChange: (key: string, v: any) => void }) => {
  const enabled = configObj.borderEnabled || { top: false, right: false, bottom: false, left: false }
  
  const toggleBorder = (side: 'top'|'right'|'bottom'|'left') => {
    onChange('borderEnabled', { ...enabled, [side]: !enabled[side] })
  }

  return (
    <div className="border border-gray-200 p-3 rounded-md bg-white space-y-3">
      <span className="text-xs font-bold text-gray-800 block">{label}</span>
      <div className="flex space-x-2">
        <div className="w-1/3"><TextInput label="Size" value={configObj.fontSize} onChange={v => onChange('fontSize', v)} placeholder="28px" /></div>
        <div className="w-2/3"><ColorInput label="Color" value={configObj.color} onChange={v => onChange('color', v)} /></div>
      </div>
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Borders</span>
        
        <div className="flex items-center space-x-3 text-xs text-gray-600 font-medium">
          <label className="flex items-center space-x-1 cursor-pointer"><input type="checkbox" checked={enabled.top} onChange={() => toggleBorder('top')} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /><span>Top</span></label>
          <label className="flex items-center space-x-1 cursor-pointer"><input type="checkbox" checked={enabled.bottom} onChange={() => toggleBorder('bottom')} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /><span>Bottom</span></label>
          <label className="flex items-center space-x-1 cursor-pointer"><input type="checkbox" checked={enabled.left} onChange={() => toggleBorder('left')} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /><span>Left</span></label>
          <label className="flex items-center space-x-1 cursor-pointer"><input type="checkbox" checked={enabled.right} onChange={() => toggleBorder('right')} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /><span>Right</span></label>
        </div>
        
        <div className="flex space-x-2">
           <div className="w-1/3"><TextInput label="Width (px)" value={configObj.borderWidth || ''} onChange={v => onChange('borderWidth', v)} placeholder="1" /></div>
           <div className="w-2/3"><ColorInput label="Border Color" value={configObj.borderColor || '#E5E7EB'} onChange={v => onChange('borderColor', v)} /></div>
        </div>
      </div>
    </div>
  )
}

const getBorderStyle = (conf: any) => {
  let styles: any = {}
  if (!conf) return styles
  const enabled = conf.borderEnabled || { top: false, right: false, bottom: false, left: false }
  const width = conf.borderWidth || '1'
  const color = conf.borderColor || '#E5E7EB'
  const borderStr = `${width}px solid ${color}`
  if (enabled.top) styles.borderTop = borderStr
  if (enabled.right) styles.borderRight = borderStr
  if (enabled.bottom) styles.borderBottom = borderStr
  if (enabled.left) styles.borderLeft = borderStr
  return styles
}

export function ThemeConfigurator({ initialData, workspaceId }: { initialData: any, workspaceId: string }) {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    // Merge provided config with default config to ensure no missing nested keys
    const saved = initialData.theme_json || {}
    return {
      global: { ...defaultConfig.global, ...(saved.global || {}) },
      typography: { ...defaultConfig.typography, ...(saved.typography || {}) },
      header: { ...defaultConfig.header, ...(saved.header || {}) },
      footer: { ...defaultConfig.footer, ...(saved.footer || {}) },
      callouts: { ...defaultConfig.callouts, ...(saved.callouts || {}) }
    }
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<'global' | 'typography' | 'header' | 'footer' | 'callouts'>('global')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveThemeConfig(initialData.id, { theme_json: config })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeepChange = (category: keyof ThemeConfig, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  const handleDeepNestedChange = (category: keyof ThemeConfig, parentKey: string, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        // @ts-ignore
        [parentKey]: {
          // @ts-ignore
          ...prev[category][parentKey],
          [key]: value
        }
      }
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const publicUrl = await uploadAsset(workspaceId, formData)
      
      const newConfig = {
        ...config,
        header: {
          ...config.header,
          logoUrl: publicUrl
        }
      }
      setConfig(newConfig)
      
      // Auto-save the theme after uploading so it doesn't get lost
      await saveThemeConfig(initialData.id, { theme_json: newConfig })
      
    } catch (err) {
      console.error("Upload failed", err)
      alert("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex h-full bg-gray-50/50">
      {/* Settings Pane */}
      <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col shrink-0 relative z-10 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.05)]">
        
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center space-x-2 text-gray-900">
            <Settings size={18} className="text-indigo-600" />
            <span className="font-bold tracking-tight">Master Theme</span>
          </div>
          <button onClick={handleSave} disabled={isSaving} className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-3 rounded-lg transition-colors disabled:opacity-50 text-xs shadow-sm">
            <Save size={14} />
            <span>{isSaving ? 'Saving' : 'Save'}</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto w-full">
          {/* Global Logic */}
          <AccordionHeader id="global" label="Global Variables" icon={Layout} activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 'global' && (
            <div className="p-5 space-y-4 bg-gray-50/30">
              <SelectInput label="Base Font Family" value={config.global.fontFamily} options={WEBSAFE_FONTS} onChange={v => handleDeepChange('global', 'fontFamily', v)} />
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Max Content Width (px)</label>
                <input type="number" value={config.global.contentWidth} onChange={e => handleDeepChange('global', 'contentWidth', Number(e.target.value))} className="w-full text-xs rounded-md border-gray-300 border px-3 py-1.5 text-right focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
              </div>
              <ColorInput label="Outer Background" value={config.global.backgroundColor} onChange={v => handleDeepChange('global', 'backgroundColor', v)} />
              <ColorInput label="Primary Accent (Buttons)" value={config.global.primaryColor} onChange={v => handleDeepChange('global', 'primaryColor', v)} />
            </div>
          )}

          {/* Typography */}
          <AccordionHeader id="typography" label="Typography Settings" icon={Type} activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 'typography' && (
            <div className="p-5 space-y-5 bg-gray-50/30">
              <ColorInput label="Base Text Color" value={config.typography.textColor} onChange={v => handleDeepChange('typography', 'textColor', v)} />
              
              <HeadingConfigurator label="Heading 1 (H1)" configObj={config.typography.h1} onChange={(k, v) => handleDeepNestedChange('typography', 'h1', k, v)} />
              <HeadingConfigurator label="Heading 2 (H2)" configObj={config.typography.h2} onChange={(k, v) => handleDeepNestedChange('typography', 'h2', k, v)} />
              <HeadingConfigurator label="Heading 3 (H3)" configObj={config.typography.h3} onChange={(k, v) => handleDeepNestedChange('typography', 'h3', k, v)} />

              <div className="border border-gray-200 p-3 rounded-md bg-white">
                <span className="text-xs font-bold text-gray-800 mb-2 block">Paragraph (Body)</span>
                <div className="flex space-x-2">
                  <div className="w-1/2"><TextInput label="Size" value={config.typography.p.fontSize} onChange={v => handleDeepNestedChange('typography', 'p', 'fontSize', v)} placeholder="16px" /></div>
                  <div className="w-1/2"><TextInput label="Line Height" value={config.typography.p.lineHeight} onChange={v => handleDeepNestedChange('typography', 'p', 'lineHeight', v)} placeholder="1.6" /></div>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <AccordionHeader id="header" label="Header Wrapper" icon={Palette} activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 'header' && (
            <div className="p-5 space-y-4 bg-gray-50/30">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Brand Logo URL</label>
                <div className="flex flex-col space-y-2">
                   <input type="text" value={config.header.logoUrl} onChange={e => handleDeepChange('header', 'logoUrl', e.target.value)} className="w-full text-xs rounded-md border-gray-300 border px-3 py-1.5 outline-none font-mono text-gray-600" placeholder="https://..." />
                   <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                   <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full flex justify-center items-center space-x-2 border border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 rounded-md py-1.5 px-3 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white">
                     {isUploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                     <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                   </button>
                </div>
              </div>
              
              <ColorInput label="Header Background" value={config.header.backgroundColor} onChange={v => handleDeepChange('header', 'backgroundColor', v)} />
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Padding Y (px)</label>
                  <input type="number" value={config.header.paddingY} onChange={e => handleDeepChange('header', 'paddingY', Number(e.target.value))} className="w-full text-xs rounded-md border-gray-300 border px-3 py-1.5 outline-none" />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Padding X (px)</label>
                  <input type="number" value={config.header.paddingX ?? 40} onChange={e => handleDeepChange('header', 'paddingX', Number(e.target.value))} className="w-full text-xs rounded-md border-gray-300 border px-3 py-1.5 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Logo Width (px)</label>
                <input type="number" value={config.header.logoWidth ?? 150} onChange={e => handleDeepChange('header', 'logoWidth', Number(e.target.value))} className="w-full text-xs rounded-md border-gray-300 border px-3 py-1.5 outline-none" />
              </div>
              <div className="flex space-x-2">
                 <div className="w-1/3"><TextInput label="Bot Border Width (px)" value={String(config.header.borderBottomWidth)} onChange={v => handleDeepChange('header', 'borderBottomWidth', Number(v))} placeholder="1" /></div>
                 <div className="w-2/3"><ColorInput label="Bot Border Color" value={config.header.borderBottomColor} onChange={v => handleDeepChange('header', 'borderBottomColor', v)} /></div>
              </div>
            </div>
          )}

          {/* Footer */}
          <AccordionHeader id="footer" label="Enforced Footer" icon={Palette} activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 'footer' && (
            <div className="p-5 space-y-4 bg-gray-50/30">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Corporate Address (Plain text)</label>
                <textarea value={config.footer.text} onChange={e => handleDeepChange('footer', 'text', e.target.value)} className="w-full text-xs rounded-md border-gray-300 border px-3 py-2 outline-none h-20 resize-y" placeholder="Acme Corp..." />
              </div>
              <ColorInput label="Background Color" value={config.footer.backgroundColor} onChange={v => handleDeepChange('footer', 'backgroundColor', v)} />
              <ColorInput label="Text Color" value={config.footer.textColor} onChange={v => handleDeepChange('footer', 'textColor', v)} />
              <div className="flex space-x-2">
                 <div className="w-1/3"><TextInput label="Top Border Width (px)" value={String(config.footer.borderTopWidth)} onChange={v => handleDeepChange('footer', 'borderTopWidth', Number(v))} placeholder="1" /></div>
                 <div className="w-2/3"><ColorInput label="Top Border Color" value={config.footer.borderTopColor} onChange={v => handleDeepChange('footer', 'borderTopColor', v)} /></div>
              </div>
            </div>
          )}

          {/* Callouts */}
          <AccordionHeader id="callouts" label="Callout Blocks" icon={MessageSquare} activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 'callouts' && (
            <div className="p-5 space-y-5 bg-gray-50/30">
              <div className="border border-blue-200 p-3 rounded-md bg-white">
                <span className="text-xs font-bold text-blue-800 mb-2 block flex items-center"><span className="mr-1">{config.callouts.info.icon}</span> Info Block</span>
                <div className="space-y-3">
                  <SelectInput label="Icon" value={config.callouts.info.icon} options={CALLOUT_ICONS} onChange={v => handleDeepNestedChange('callouts', 'info', 'icon', v)} />
                  <ColorInput label="Background" value={config.callouts.info.bg} onChange={v => handleDeepNestedChange('callouts', 'info', 'bg', v)} />
                  <div className="flex space-x-2">
                    <div className="w-1/2"><ColorInput label="Border" value={config.callouts.info.border} onChange={v => handleDeepNestedChange('callouts', 'info', 'border', v)} /></div>
                    <div className="w-1/2"><ColorInput label="Text" value={config.callouts.info.text} onChange={v => handleDeepNestedChange('callouts', 'info', 'text', v)} /></div>
                  </div>
                </div>
              </div>

              <div className="border border-orange-200 p-3 rounded-md bg-white">
                <span className="text-xs font-bold text-orange-800 mb-2 block flex items-center"><span className="mr-1">{config.callouts.warning.icon}</span> Warning Block</span>
                <div className="space-y-3">
                  <SelectInput label="Icon" value={config.callouts.warning.icon} options={CALLOUT_ICONS} onChange={v => handleDeepNestedChange('callouts', 'warning', 'icon', v)} />
                  <ColorInput label="Background" value={config.callouts.warning.bg} onChange={v => handleDeepNestedChange('callouts', 'warning', 'bg', v)} />
                  <div className="flex space-x-2">
                    <div className="w-1/2"><ColorInput label="Border" value={config.callouts.warning.border} onChange={v => handleDeepNestedChange('callouts', 'warning', 'border', v)} /></div>
                    <div className="w-1/2"><ColorInput label="Text" value={config.callouts.warning.text} onChange={v => handleDeepNestedChange('callouts', 'warning', 'text', v)} /></div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 p-3 rounded-md bg-white">
                <span className="text-xs font-bold text-gray-800 mb-2 block">Quote Block</span>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <div className="w-1/2"><ColorInput label="Left Border" value={config.callouts.quote.borderLeft} onChange={v => handleDeepNestedChange('callouts', 'quote', 'borderLeft', v)} /></div>
                    <div className="w-1/2"><ColorInput label="Text Color" value={config.callouts.quote.text} onChange={v => handleDeepNestedChange('callouts', 'quote', 'text', v)} /></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Preview Canvas */}
      <div 
        className="flex-1 overflow-y-auto p-12 flex justify-center bg-gray-50/50 w-full" 
        style={{ backgroundColor: config.global.backgroundColor }}
      >
        <div 
          className="bg-white rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden relative"
          style={{ width: `${config.global.contentWidth}px`, minHeight: '600px', transition: 'width 0.3s ease', fontFamily: config.global.fontFamily }}
        >
          {/* Header Preview */}
            <div 
            className="text-center flex-shrink-0"
            style={{ 
              backgroundColor: config.header.backgroundColor,
              paddingTop: `${config.header.paddingY}px`,
              paddingBottom: `${config.header.paddingY}px`,
              paddingLeft: `${config.header.paddingX ?? 40}px`,
              paddingRight: `${config.header.paddingX ?? 40}px`,
              borderBottom: `${config.header.borderBottomWidth}px solid ${config.header.borderBottomColor}`
            }}
          >
             {config.header.logoUrl && config.header.logoUrl.startsWith('http') ? (
                <img src={config.header.logoUrl} alt="Logo" style={{ width: `${config.header.logoWidth ?? 150}px` }} className="mx-auto object-contain" />
             ) : (
                <div style={{ color: config.global.primaryColor }} className="text-xl font-bold tracking-tight">YOUR LOGO HERE</div>
             )}
          </div>

          {/* Body Block Types Preview */}
          <div className="flex-1 p-10 flex flex-col space-y-6" style={{ color: config.typography.textColor, fontSize: config.typography.p.fontSize, lineHeight: config.typography.p.lineHeight }}>
            
            <h1 style={{ fontSize: config.typography.h1.fontSize, color: config.typography.h1.color, fontWeight: 'bold', ...getBorderStyle(config.typography.h1) }}>Heading 1 (H1) Style</h1>
            <h2 style={{ fontSize: config.typography.h2.fontSize, color: config.typography.h2.color, fontWeight: 'bold', ...getBorderStyle(config.typography.h2) }}>Heading 2 (H2) Style</h2>
            <h3 style={{ fontSize: config.typography.h3.fontSize, color: config.typography.h3.color, fontWeight: 'bold', ...getBorderStyle(config.typography.h3) }}>Heading 3 (H3) Style</h3>
            <p>
              This is standard body paragraph text mapping strictly to the Master Theme config settings for `p` tags. All text sizes and fonts injected during campaign builder drops adhere to this exact structural hierarchy.
            </p>

            {/* Info Block */}
            <div style={{ backgroundColor: config.callouts.info.bg, border: `1px solid ${config.callouts.info.border}`, color: config.callouts.info.text, padding: '16px', borderRadius: '6px' }} className="flex">
               {config.callouts.info.icon && <span className="mr-3 text-lg">{config.callouts.info.icon}</span>}
               <div>This is an Info Callout. Use it to highlight neutral instructions or informational tips.</div>
            </div>

            {/* Warning Block */}
            <div style={{ backgroundColor: config.callouts.warning.bg, border: `1px solid ${config.callouts.warning.border}`, color: config.callouts.warning.text, padding: '16px', borderRadius: '6px' }} className="flex">
               {config.callouts.warning.icon && <span className="mr-3 text-lg font-bold">{config.callouts.warning.icon}</span>}
               <div>This is an Warning Callout. Use it to alert your recipients of account expirations or severe notices.</div>
            </div>

            {/* Quote Block */}
            <blockquote style={{ borderLeft: `4px solid ${config.callouts.quote.borderLeft}`, color: config.callouts.quote.text, padding: '12px 0 12px 20px', margin: 0, fontStyle: config.callouts.quote.italic ? 'italic' : 'normal' }}>
               "This is what a pulled quote block looks like cleanly rendered against your design tokens."
            </blockquote>

            <div className="pt-4">
              <a href="#" style={{ display: 'inline-block', backgroundColor: config.global.primaryColor, color: '#ffffff', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
                Primary Button Shape
              </a>
            </div>
          </div>

          {/* Footer Preview */}
          <div 
            className="mt-auto text-center text-xs flex-shrink-0"
            style={{ 
              backgroundColor: config.footer.backgroundColor,
              color: config.footer.textColor,
              paddingTop: `${config.footer.paddingY}px`,
              paddingBottom: `${config.footer.paddingY}px`,
              borderTop: `${config.footer.borderTopWidth}px solid ${config.footer.borderTopColor}`
            }}
          >
             <div className="mb-4 whitespace-pre-wrap font-medium">{config.footer.text}</div>
             <div>
               You are receiving this email because you opted in.<br/>
               <a href="#" style={{ color: config.footer.linkColor, textDecoration: config.typography.linkDecoration }}>Unsubscribe Here</a>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
