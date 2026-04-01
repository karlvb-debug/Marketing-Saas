"use client"

import React, { useState } from 'react'
import { Trash, Save, Heading1, Heading2, Heading3, Type, Link as LinkIcon, Info, AlertTriangle, Quote, Palette, AlignLeft, AlignCenter, AlignRight, AlignJustify, X } from 'lucide-react'
import { saveEmailTemplate } from '@/app/actions/emailBuilder'
import { updateCampaignTemplate } from '@/app/actions/themeConfig'
import type { ThemeConfig } from './ThemeConfigurator'

const WEBSAFE_FONTS = [
  'Arial, Helvetica, sans-serif',
  '"Comic Sans MS", cursive, sans-serif',
  '"Courier New", Courier, monospace',
  'Georgia, serif',
  '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
  'Tahoma, Geneva, sans-serif',
  '"Times New Roman", Times, serif',
  '"Trebuchet MS", Helvetica, sans-serif',
  'Verdana, Geneva, sans-serif'
]

type BlockType = 'h1' | 'h2' | 'h3' | 'h4' | 'text' | 'button' | 'info' | 'warning' | 'quote'

interface Block {
  id: string
  type: BlockType
  content: string
  config?: any
}

function getBorderStylesString(b: any, themeObj: any) {
  let styles = '';
  const enabled = b.config?.borderEnabled || themeObj?.borderEnabled || { top: false, right: false, bottom: false, left: false };
  const width = b.config?.borderWidth || themeObj?.borderWidth || '1';
  const color = b.config?.borderColor || themeObj?.borderColor || '#000000';
  const borderStr = `${width}px solid ${color}`;
  
  if (enabled.top) styles += `border-top:${borderStr};`;
  if (enabled.right) styles += `border-right:${borderStr};`;
  if (enabled.bottom) styles += `border-bottom:${borderStr};`;
  if (enabled.left) styles += `border-left:${borderStr};`;
  return styles;
}

function getBorderStylesObject(b: any, themeObj: any) {
  let styles: any = {};
  const enabled = b.config?.borderEnabled || themeObj?.borderEnabled || { top: false, right: false, bottom: false, left: false };
  const width = b.config?.borderWidth || themeObj?.borderWidth || '1';
  const color = b.config?.borderColor || themeObj?.borderColor || '#000000';
  const borderStr = `${width}px solid ${color}`;
  
  if (enabled.top) styles.borderTop = borderStr;
  if (enabled.right) styles.borderRight = borderStr;
  if (enabled.bottom) styles.borderBottom = borderStr;
  if (enabled.left) styles.borderLeft = borderStr;
  return styles;
}

function compileEmailHTML(blocks: Block[], theme: ThemeConfig) {
  const innerHtml = blocks.map(b => {
    if (b.type === 'h1') return `<h1 style="color:${b.config?.color || theme.typography.h1.color || '#111827'};font-size:${b.config?.fontSize || theme.typography.h1.fontSize || '28px'};font-family:${b.config?.fontFamily || 'inherit'};text-align:${b.config?.textAlign || 'left'};margin-bottom:20px;margin-top:0;${getBorderStylesString(b, theme.typography.h1)}">${b.content}</h1>`
    if (b.type === 'h2') return `<h2 style="color:${b.config?.color || theme.typography.h2.color || '#1F2937'};font-size:${b.config?.fontSize || theme.typography.h2.fontSize || '24px'};font-family:${b.config?.fontFamily || 'inherit'};text-align:${b.config?.textAlign || 'left'};margin-bottom:20px;margin-top:0;${getBorderStylesString(b, theme.typography.h2)}">${b.content}</h2>`
    if (b.type === 'h3') return `<h3 style="color:${b.config?.color || theme.typography.h3.color || '#374151'};font-size:${b.config?.fontSize || theme.typography.h3.fontSize || '20px'};font-family:${b.config?.fontFamily || 'inherit'};text-align:${b.config?.textAlign || 'left'};margin-bottom:20px;margin-top:0;${getBorderStylesString(b, theme.typography.h3)}">${b.content}</h3>`
    
    if (b.type === 'text') return `<p style="color:${b.config?.color || theme.typography.textColor || '#374151'};font-size:${b.config?.fontSize || theme.typography.p.fontSize || '16px'};font-family:${b.config?.fontFamily || 'inherit'};text-align:${b.config?.textAlign || 'left'};line-height:${theme.typography.p.lineHeight || '1.6'};margin-bottom:20px;margin-top:0;">${b.content.replace(/\\n/g, '<br/>')}</p>`
    
    if (b.type === 'button') return `<div style="text-align:${b.config?.textAlign || 'left'};margin-bottom:20px;"><a href="${b.config?.url || '#'}" style="display:inline-block;background-color:${b.config?.backgroundColor || theme.global.primaryColor || '#4F46E5'};color:${b.config?.color || '#ffffff'};padding:${b.config?.padding || '12px 24px'};border-radius:${b.config?.borderRadius || '6px'};text-decoration:none;font-weight:bold;font-family:${b.config?.fontFamily || 'inherit'};font-size:${b.config?.fontSize || '16px'};">${b.content}</a></div>`

    if (b.type === 'info') return `<div style="background-color:${b.config?.backgroundColor || theme.callouts.info.bg};border:1px solid ${b.config?.borderColor || theme.callouts.info.border};color:${theme.callouts.info.text};padding:16px;border-radius:${b.config?.borderRadius || '6px'};margin-bottom:20px;text-align:${b.config?.textAlign || 'left'};">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            ${theme.callouts.info.icon ? `<td width="30" valign="top" style="font-size:18px;">${theme.callouts.info.icon}</td>` : ''}
            <td valign="top" style="font-size:${theme.typography.p.fontSize};line-height:${theme.typography.p.lineHeight}">${b.content.replace(/\\n/g, '<br/>')}</td>
          </tr>
        </table>
      </div>`

    if (b.type === 'warning') return `<div style="background-color:${b.config?.backgroundColor || theme.callouts.warning.bg};border:1px solid ${b.config?.borderColor || theme.callouts.warning.border};color:${theme.callouts.warning.text};padding:16px;border-radius:${b.config?.borderRadius || '6px'};margin-bottom:20px;text-align:${b.config?.textAlign || 'left'};">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            ${theme.callouts.warning.icon ? `<td width="30" valign="top" style="font-size:18px;font-weight:bold;">${theme.callouts.warning.icon}</td>` : ''}
            <td valign="top" style="font-size:${theme.typography.p.fontSize};line-height:${theme.typography.p.lineHeight}">${b.content.replace(/\\n/g, '<br/>')}</td>
          </tr>
        </table>
      </div>`

    if (b.type === 'quote') return `<blockquote style="text-align:${b.config?.textAlign || 'left'};margin:0 0 20px 0;padding:12px 0 12px 20px;border-left:4px solid ${b.config?.borderColor || theme.callouts.quote.borderLeft};color:${theme.callouts.quote.text};font-style:${theme.callouts.quote.italic ? 'italic' : 'normal'};font-size:${theme.typography.p.fontSize};line-height:${theme.typography.p.lineHeight};">${b.content}</blockquote>`

    return ''
  }).join('\\n')

  return `
<div style="font-family:${theme.global.fontFamily || 'sans-serif'};background-color:${theme.global.backgroundColor || '#F3F4F6'};padding:40px 0;">
  <div style="max-width:${theme.global.contentWidth || 600}px;margin:0 auto;background-color:#ffffff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.1);overflow:hidden;">
    
    <!-- THEME HEADER -->
    <div style="padding:${theme.header?.paddingY ?? 40}px ${theme.header?.paddingX ?? 40}px;text-align:center;background-color:${theme.header?.backgroundColor || '#ffffff'};border-bottom:${theme.header?.borderBottomWidth || 1}px solid ${theme.header?.borderBottomColor || '#F9FAFB'};">
      ${theme.header?.logoUrl ? `<img src="${theme.header.logoUrl}" style="width:${theme.header?.logoWidth ?? 150}px;margin:0 auto;display:block;"/>` : `<h2 style="color:${theme.global.primaryColor};margin:0;font-size:24px;">BRAND LOGO</h2>`}
    </div>

    <!-- BLOCKS -->
    <div style="padding:40px;">
      ${innerHtml}
    </div>
    
    <!-- ENFORCED THEME FOOTER -->
    <div style="background-color:${theme.footer?.backgroundColor || '#F9FAFB'};padding:${theme.footer?.paddingY || 30}px 30px;border-top:${theme.footer?.borderTopWidth || 1}px solid ${theme.footer?.borderTopColor || '#E5E7EB'};color:${theme.footer?.textColor || '#6B7280'};font-size:12px;text-align:center;">
      <p style="margin:0 0 10px 0;white-space:pre-wrap;">${theme.footer?.text}</p>
      <p style="margin:0;">You are receiving this email because you opted in via our website.<br/>
      <a href="{{unsubscribe_url}}" style="color:${theme.footer?.linkColor || theme.global.primaryColor};text-decoration:${theme.typography?.linkDecoration || 'underline'};">Unsubscribe completely from our lists</a></p>
    </div>
    
  </div>
</div>
  `
}

export function TemplateBuilder({ initialData, table, availableTemplates }: { initialData: any, table: 'campaigns' | 'email_templates', availableTemplates: any[] }) {
  const [blocks, setBlocks] = useState<Block[]>(initialData.structural_json || [])
  const [senderName, setSenderName] = useState(initialData.sender_name || '')
  const [replyTo, setReplyTo] = useState(initialData.reply_to || '')
  
  // Find currently attached template
  const [activeThemeId, setActiveThemeId] = useState<string>(initialData.template_id || (availableTemplates.length > 0 ? availableTemplates[0].id : ''))
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const activeTemplate = availableTemplates.find(t => t.id === activeThemeId)
  
  // Fallback to strict empty config if no templates exist yet or hasn't migrated
  const theme: ThemeConfig = activeTemplate?.theme_json?.global ? activeTemplate.theme_json : {
    global: { backgroundColor: '#F3F4F6', contentWidth: 600, primaryColor: '#4F46E5', fontFamily: "Arial, sans-serif" },
    typography: { textColor: "#374151", h1: { fontSize: "28px", color: "#111827" }, h2: { fontSize: "24px", color: "#1F2937" }, h3: { fontSize: "20px", color: "#374151" }, p: { fontSize: "16px", lineHeight: "1.6" }, linkDecoration: 'underline' },
    header: { logoUrl: '', logoWidth: 150, paddingX: 40, backgroundColor: '#FFFFFF', paddingY: 40, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
    footer: { text: 'Company Name\\nAddress Line 1', backgroundColor: '#F9FAFB', textColor: '#6B7280', linkColor: '#4F46E5', paddingY: 30, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
    callouts: { info: { bg: "#EFF6FF", border: "#BFDBFE", text: "#1E3A8A", icon: 'ⓘ' }, warning: { bg: "#FFFBEB", border: "#FDE68A", text: "#92400E", icon: '⚠' }, quote: { borderLeft: "#4F46E5", text: "#4B5563", italic: true } }
  }

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: crypto.randomUUID(),
      type,
      content: type.startsWith('h') ? `Heading ${type.toUpperCase()}` : type === 'button' ? 'Click Here' : type === 'quote' ? 'Quote text...' : type === 'info' ? 'Informational notice...' : type === 'warning' ? 'Warning alert...' : 'Write your email content...',
      config: type === 'button' ? { url: 'https://google.com' } : {}
    }
    setBlocks([...blocks, newBlock])
  }

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const htmlContent = compileEmailHTML(blocks, theme)
      await saveEmailTemplate(table, initialData.id, {
        sender_name: senderName,
        reply_to: replyTo,
        structural_json: blocks,
        content: htmlContent
      })
      if (table === 'campaigns') {
        await updateCampaignTemplate(initialData.id, activeThemeId)
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Top Toolbar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
             <h1 className="text-xl font-bold tracking-tight text-gray-900">{initialData.name}</h1>
             {table === 'campaigns' && (
               <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                  <Palette size={14} className="text-indigo-500" />
                  <select 
                    value={activeThemeId} 
                    onChange={e => setActiveThemeId(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled>Select Master Theme...</option>
                    {availableTemplates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
               </div>
             )}
          </div>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
          </button>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-1">Sender Display Name</label>
            <input 
              className="w-full text-sm rounded-md border-gray-300 border px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500/20 outline-none transition-all" 
              placeholder="e.g. Acme Sales"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-1">Reply-To Address</label>
            <input 
              className="w-full text-sm rounded-md border-gray-300 border px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500/20 outline-none transition-all" 
              placeholder="e.g. hello@acme.com"
              type="email"
              value={replyTo}
              onChange={(e) => setReplyTo(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden" style={{ backgroundColor: theme.global.backgroundColor }}>
        {/* Render Canvas */}
        <div className="flex-1 overflow-y-auto p-12 flex justify-center" onClick={() => setActiveBlockId(null)}>
          
          <div 
            className="bg-white rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden min-h-[500px]"
            style={{ width: `${theme.global.contentWidth}px`, transition: 'width 0.3s ease', fontFamily: theme.global.fontFamily }}
          >
             {/* THEMED HEADER */}
             <div 
                className="text-center flex-shrink-0"
                style={{
                  backgroundColor: theme.header?.backgroundColor,
                  paddingTop: `${theme.header?.paddingY}px`,
                  paddingBottom: `${theme.header?.paddingY}px`,
                  paddingLeft: `${theme.header?.paddingX ?? 40}px`,
                  paddingRight: `${theme.header?.paddingX ?? 40}px`,
                  borderBottom: `${theme.header?.borderBottomWidth}px solid ${theme.header?.borderBottomColor}`
                }}
             >
               {theme.header?.logoUrl ? (
                  <img src={theme.header.logoUrl} alt="Logo" style={{ width: `${theme.header?.logoWidth ?? 150}px` }} className="mx-auto object-contain" />
               ) : (
                  <div style={{ color: theme.global.primaryColor }} className="text-xl font-bold tracking-tight">Your Brand Logo</div>
               )}
             </div>

              {/* Dynamic Blocks Area */}
              <div className="flex-1 p-10 space-y-4">
                {blocks.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                    <p>Drag content blocks into your master theme here.</p>
                  </div>
                )}
                
                {blocks.map((block) => (
                  <div 
                    key={block.id} 
                    onClick={(e) => { e.stopPropagation(); setActiveBlockId(block.id); }}
                    className={`group relative border rounded-lg -mx-4 px-4 py-2 transition-all cursor-pointer ${activeBlockId === block.id ? 'border-indigo-400 bg-indigo-50/10 shadow-[0_0_0_2px_rgba(99,102,241,0.1)]' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-md rounded-md overflow-hidden flex border border-gray-100 z-10 translate-x-2 -translate-y-2">
                       <button onClick={() => removeBlock(block.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 bg-white transition-colors"><Trash size={14}/></button>
                    </div>

                    {(block.type === 'h1' || block.type === 'h2' || block.type === 'h3') && (
                      <input 
                        value={block.content} 
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        className="w-full focus:outline-none bg-transparent placeholder-gray-300 font-bold" 
                        style={{
                          fontSize: block.config?.fontSize || theme.typography[block.type as 'h1'|'h2'|'h3'].fontSize,
                          color: block.config?.color || theme.typography[block.type as 'h1'|'h2'|'h3'].color,
                          fontFamily: block.config?.fontFamily || 'inherit',
                          textAlign: block.config?.textAlign || 'left',
                          ...getBorderStylesObject(block, theme.typography[block.type as 'h1'|'h2'|'h3'])
                        }}
                        placeholder={`${block.type.toUpperCase()} text...`}
                      />
                    )}

                    {block.type === 'text' && (
                      <textarea 
                        value={block.content} 
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        className="w-full focus:outline-none bg-transparent resize-y min-h-[80px] placeholder-gray-300" 
                        style={{
                          fontSize: block.config?.fontSize || theme.typography.p.fontSize,
                          lineHeight: theme.typography.p.lineHeight,
                          color: block.config?.color || theme.typography.textColor,
                          fontFamily: block.config?.fontFamily || 'inherit',
                          textAlign: block.config?.textAlign || 'left'
                        }}
                        placeholder="Write your email content..." 
                      />
                    )}

                    {block.type === 'info' && (
                      <div className="flex" style={{ backgroundColor: block.config?.backgroundColor || theme.callouts.info.bg, border: `1px solid ${block.config?.borderColor || theme.callouts.info.border}`, color: theme.callouts.info.text, padding: '16px', borderRadius: block.config?.borderRadius || '6px', textAlign: block.config?.textAlign || 'left' }}>
                        {theme.callouts.info.icon && <span className="mr-3 text-lg">{theme.callouts.info.icon}</span>}
                        <textarea 
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          className="w-full focus:outline-none bg-transparent resize-y min-h-[40px] placeholder-blue-300" 
                          style={{ fontSize: theme.typography.p.fontSize, lineHeight: theme.typography.p.lineHeight }}
                        />
                      </div>
                    )}

                    {block.type === 'warning' && (
                      <div className="flex" style={{ backgroundColor: block.config?.backgroundColor || theme.callouts.warning.bg, border: `1px solid ${block.config?.borderColor || theme.callouts.warning.border}`, color: theme.callouts.warning.text, padding: '16px', borderRadius: block.config?.borderRadius || '6px', textAlign: block.config?.textAlign || 'left' }}>
                        {theme.callouts.warning.icon && <span className="mr-3 text-lg font-bold">{theme.callouts.warning.icon}</span>}
                        <textarea 
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          className="w-full focus:outline-none bg-transparent resize-y min-h-[40px] placeholder-orange-300" 
                          style={{ fontSize: theme.typography.p.fontSize, lineHeight: theme.typography.p.lineHeight }}
                        />
                      </div>
                    )}

                    {block.type === 'quote' && (
                      <div style={{ borderLeft: `4px solid ${block.config?.borderColor || theme.callouts.quote.borderLeft}`, color: theme.callouts.quote.text, padding: '12px 0 12px 20px', fontStyle: theme.callouts.quote.italic ? 'italic' : 'normal', textAlign: block.config?.textAlign || 'left' }}>
                         <textarea 
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          className="w-full focus:outline-none bg-transparent resize-y min-h-[40px] placeholder-gray-300" 
                          style={{ fontSize: theme.typography.p.fontSize, lineHeight: theme.typography.p.lineHeight }}
                        />
                      </div>
                    )}

                    {block.type === 'button' && (
                      <div className="flex items-center space-x-2" style={{ textAlign: block.config?.textAlign || 'left' }}>
                        <input 
                          value={block.content} 
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          className="font-bold focus:outline-none focus:ring-2 focus:ring-offset-1" 
                          style={{ 
                            backgroundColor: block.config?.backgroundColor || theme.global.primaryColor,
                            color: block.config?.color || '#ffffff',
                            padding: block.config?.padding || '12px 24px',
                            borderRadius: block.config?.borderRadius || '6px',
                            fontFamily: block.config?.fontFamily || 'inherit',
                            fontSize: block.config?.fontSize || '16px'
                          }}
                          placeholder="Button Text" 
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* THEMED FOOTER */}
              <div 
                className="mt-auto text-center text-xs flex-shrink-0"
                style={{
                  backgroundColor: theme.footer?.backgroundColor,
                  color: theme.footer?.textColor,
                  paddingTop: `${theme.footer?.paddingY}px`,
                  paddingBottom: `${theme.footer?.paddingY}px`,
                  borderTop: `${theme.footer?.borderTopWidth}px solid ${theme.footer?.borderTopColor}`
                }}
              >
                 <div className="mb-4 whitespace-pre-wrap font-medium">{theme.footer?.text}</div>
                 <div>
                   You are receiving this email because you opted in.<br/>
                   <a href="#" style={{ color: theme.footer?.linkColor || theme.global.primaryColor, textDecoration: theme.typography?.linkDecoration || 'underline' }}>Unsubscribe Here</a>
                 </div>
              </div>
          </div>

        </div>

        {/* Right Sidebar - Tools or Inspector */}
        <div className="w-64 bg-white border-l border-gray-200 shrink-0 p-4 overflow-y-auto shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)] hidden md:block select-none">
          {activeBlockId && blocks.find(b => b.id === activeBlockId) ? (
            (() => {
              const b = blocks.find(x => x.id === activeBlockId)!
              return (
                <div className="flex flex-col space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{b.type.toUpperCase()} Properties</span>
                    <button onClick={() => setActiveBlockId(null)} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"><X size={14}/></button>
                  </div>
                  
                  {/* Shared Alignment */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600 block">Alignment</label>
                    <div className="flex bg-gray-50 rounded p-1">
                      {['left', 'center', 'right', 'justify'].map(align => (
                        <button
                          key={align}
                          onClick={() => updateBlock(b.id, { config: { ...b.config, textAlign: align } })}
                          className={`flex-1 p-1.5 rounded flex justify-center transition-colors ${b.config?.textAlign === align || (!b.config?.textAlign && align === 'left') ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          {align === 'left' && <AlignLeft size={14} />}
                          {align === 'center' && <AlignCenter size={14} />}
                          {align === 'right' && <AlignRight size={14} />}
                          {align === 'justify' && <AlignJustify size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Typography Settings */}
                  {(b.type === 'h1' || b.type === 'h2' || b.type === 'h3' || b.type === 'text' || b.type === 'button') && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-600 block">Font Family</label>
                        <select 
                          value={b.config?.fontFamily || 'inherit'}
                          onChange={e => updateBlock(b.id, { config: { ...b.config, fontFamily: e.target.value } })}
                          className="w-full text-sm border-gray-200 border rounded p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                        >
                          <option value="inherit">Theme Default</option>
                          {WEBSAFE_FONTS.map(f => <option key={f} value={f}>{f.split(',')[0].replace(/"/g, '')}</option>)}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-600 block">Font Size</label>
                        <input 
                          value={b.config?.fontSize || ''}
                          onChange={e => updateBlock(b.id, { config: { ...b.config, fontSize: e.target.value } })}
                          placeholder={`Theme Default (${b.type === 'text' ? theme.typography.p.fontSize : b.type === 'button' ? '16px' : theme.typography[b.type as 'h1'|'h2'|'h3'].fontSize})`}
                          className="w-full text-sm border-gray-200 border rounded p-2 focus:border-indigo-500 outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-600 block">Text Color</label>
                        <div className="flex space-x-2 items-center">
                          <div 
                            className="rounded cursor-pointer border border-gray-300 shadow-sm overflow-hidden flex items-center justify-center bg-white flex-none"
                            style={{ width: '32px', height: '30px', minWidth: '32px', flexShrink: 0, padding: 0 }}
                          >
                            <input 
                              type="color" 
                              value={b.config?.color || (b.type === 'button' ? '#ffffff' : b.type === 'text' ? theme.typography.textColor : theme.typography[b.type as 'h1'|'h2'|'h3'].color)}
                              onChange={e => updateBlock(b.id, { config: { ...b.config, color: e.target.value } })}
                              className="cursor-pointer border-0 p-0 m-0 bg-transparent outline-none flex-none block" 
                              style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px', marginLeft: '-4px', marginTop: '-4px' }}
                            />
                          </div>
                          <button 
                            onClick={() => { const { color, ...rest } = b.config || {}; updateBlock(b.id, { config: rest }) }}
                            className="text-xs text-gray-400 hover:text-red-500 underline"
                          >Reset / Default</button>
                        </div>
                      </div>

                      {/* Heading Border settings */}
                      {(b.type === 'h1' || b.type === 'h2' || b.type === 'h3') && (
                        <div className="space-y-3 pt-3 border-t border-gray-100">
                          <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Borders</label>
                          
                          <div className="flex items-center justify-between text-xs text-gray-600 font-medium bg-gray-50 p-2 rounded border border-gray-100">
                            {['top', 'bottom', 'left', 'right'].map((side) => {
                               const currentEnabled = b.config?.borderEnabled || {};
                               return (
                                  <label key={side} className="flex items-center space-x-1 cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      checked={!!currentEnabled[side]} 
                                      onChange={() => updateBlock(b.id, { config: { ...b.config, borderEnabled: { ...currentEnabled, [side]: !currentEnabled[side] } } })}
                                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                                    />
                                    <span className="capitalize">{side}</span>
                                  </label>
                               )
                            })}
                          </div>

                          <div className="flex space-x-2">
                             <div className="w-1/3 space-y-1">
                                <label className="text-[10px] font-semibold text-gray-500 block">Width (px)</label>
                                <input 
                                  value={b.config?.borderWidth || ''} 
                                  onChange={e => updateBlock(b.id, { config: { ...b.config, borderWidth: e.target.value } })} 
                                  placeholder="1" 
                                  className="w-full text-xs border-gray-200 border rounded p-1.5 focus:border-indigo-500 outline-none" 
                                />
                             </div>
                             
                             <div className="w-2/3 space-y-1">
                               <label className="text-[10px] font-semibold text-gray-500 block">Color</label>
                               <div className="flex space-x-2 items-center">
                                 <div 
                                   className="rounded cursor-pointer border border-gray-300 shadow-sm overflow-hidden flex items-center justify-center bg-white flex-none"
                                   style={{ width: '28px', height: '26px', minWidth: '28px', flexShrink: 0, padding: 0 }}
                                 >
                                   <input 
                                     type="color" 
                                     value={b.config?.borderColor || '#E5E7EB'}
                                     onChange={e => updateBlock(b.id, { config: { ...b.config, borderColor: e.target.value } })}
                                     className="cursor-pointer border-0 p-0 m-0 bg-transparent outline-none flex-none block" 
                                     style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px', marginLeft: '-4px', marginTop: '-4px' }}
                                   />
                                 </div>
                                 <input 
                                    value={b.config?.borderColor || ''} 
                                    onChange={e => updateBlock(b.id, { config: { ...b.config, borderColor: e.target.value } })} 
                                    placeholder="#E5E7EB" 
                                    className="w-full text-xs border-gray-200 border rounded p-1.5 focus:border-indigo-500 outline-none uppercase font-mono" 
                                  />
                               </div>
                             </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Button Settings */}
                  {b.type === 'button' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-600 flex items-center"><LinkIcon size={12} className="mr-1"/> Button URL</label>
                        <input 
                          value={b.config?.url || ''}
                          onChange={e => updateBlock(b.id, { config: { ...b.config, url: e.target.value } })}
                          placeholder="https://..."
                          className="w-full text-sm border-gray-200 border rounded p-2 focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2 flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-600 block">Background Color</label>
                        <div 
                          className="rounded cursor-pointer border border-gray-300 shadow-sm overflow-hidden flex items-center justify-center bg-white flex-none"
                          style={{ width: '32px', height: '30px', minWidth: '32px', flexShrink: 0, padding: 0 }}
                        >
                          <input type="color" value={b.config?.backgroundColor || theme.global.primaryColor} onChange={e => updateBlock(b.id, { config: { ...b.config, backgroundColor: e.target.value } })} className="cursor-pointer border-0 p-0 m-0 bg-transparent outline-none flex-none block" style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px', marginLeft: '-4px', marginTop: '-4px' }} />
                        </div>
                      </div>
                      <div className="space-y-2 flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-600 block">Border Radius</label>
                        <input value={b.config?.borderRadius || ''} onChange={e => updateBlock(b.id, { config: { ...b.config, borderRadius: e.target.value } })} placeholder="e.g. 6px" className="w-20 text-sm border-gray-200 border rounded p-1 focus:border-indigo-500 outline-none text-right" />
                      </div>
                    </>
                  )}

                  {/* Callout Settings */}
                  {(b.type === 'info' || b.type === 'warning' || b.type === 'quote') && (
                    <>
                      <div className="space-y-2 flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-600 block">Accent Color</label>
                        <div 
                          className="rounded cursor-pointer border border-gray-300 shadow-sm overflow-hidden flex items-center justify-center bg-white flex-none"
                          style={{ width: '32px', height: '30px', minWidth: '32px', flexShrink: 0, padding: 0 }}
                        >
                          <input type="color" value={b.config?.borderColor || (b.type === 'info' ? theme.callouts.info.border : b.type === 'warning' ? theme.callouts.warning.border : theme.callouts.quote.borderLeft)} onChange={e => updateBlock(b.id, { config: { ...b.config, borderColor: e.target.value } })} className="cursor-pointer border-0 p-0 m-0 bg-transparent outline-none flex-none block" style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px', marginLeft: '-4px', marginTop: '-4px' }} />
                        </div>
                      </div>
                      {b.type !== 'quote' && (
                        <div className="space-y-2 flex items-center justify-between">
                          <label className="text-xs font-semibold text-gray-600 block">Background Color</label>
                          <div 
                            className="rounded cursor-pointer border border-gray-300 shadow-sm overflow-hidden flex items-center justify-center bg-white flex-none"
                            style={{ width: '32px', height: '30px', minWidth: '32px', flexShrink: 0, padding: 0 }}
                          >
                            <input type="color" value={b.config?.backgroundColor || (b.type === 'info' ? theme.callouts.info.bg : theme.callouts.warning.bg)} onChange={e => updateBlock(b.id, { config: { ...b.config, backgroundColor: e.target.value } })} className="cursor-pointer border-0 p-0 m-0 bg-transparent outline-none flex-none block" style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px', marginLeft: '-4px', marginTop: '-4px' }} />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })()
          ) : (
            <>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Typography</h3>
              <div className="space-y-2 mb-6">
                {['h1', 'h2', 'h3'].map(type => (
                   <button 
                    key={type}
                    onClick={() => addBlock(type as BlockType)}
                    className="w-full flex items-center space-x-3 px-3 py-2 border border-gray-200 rounded hover:border-indigo-500 hover:text-indigo-600 transition-all text-xs font-medium text-gray-700 bg-white"
                   >
                     <div className="bg-gray-50 p-1 rounded text-gray-500">
                        {type === 'h1' && <Heading1 size={14} />}
                        {type === 'h2' && <Heading2 size={14} />}
                        {type === 'h3' && <Heading3 size={14} />}
                     </div>
                     <span>Heading {type.toUpperCase()}</span>
                   </button>
                ))}
                <button 
                  onClick={() => addBlock('text')}
                  className="w-full flex items-center space-x-3 px-3 py-2 border border-gray-200 rounded hover:border-indigo-500 hover:text-indigo-600 transition-all text-xs font-medium text-gray-700 bg-white"
                >
                  <div className="bg-gray-50 p-1 rounded text-gray-500"><Type size={14} /></div>
                  <span>Paragraph Text</span>
                </button>
                <button 
                  onClick={() => addBlock('button')}
                  className="w-full flex items-center space-x-3 px-3 py-2 border border-blue-500 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-all text-xs font-bold"
                >
                  <div className="bg-blue-100 p-1 rounded"><LinkIcon size={14} /></div>
                  <span>Action Button</span>
                </button>
              </div>

              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Callouts & Accents</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => addBlock('info')}
                  className="w-full flex items-center space-x-3 px-3 py-2 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded transition-all text-xs font-medium text-blue-800"
                >
                  <Info size={14} />
                  <span>Info Notice</span>
                </button>
                <button 
                  onClick={() => addBlock('warning')}
                  className="w-full flex items-center space-x-3 px-3 py-2 border border-orange-200 bg-orange-50 hover:bg-orange-100 rounded transition-all text-xs font-medium text-orange-800"
                >
                  <AlertTriangle size={14} />
                  <span>Warning Alert</span>
                </button>
                <button 
                  onClick={() => addBlock('quote')}
                  className="w-full flex items-center space-x-3 px-3 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded transition-all text-xs font-medium text-gray-700"
                >
                  <Quote size={14} />
                  <span>Block Quote</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
