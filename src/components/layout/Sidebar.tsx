"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { WorkspaceSwitcher } from "./WorkspaceSwitcher"
import { 
  LayoutDashboard, 
  UsersRound, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Inbox, 
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react"
import { signout } from "@/app/login/actions"

type Workspace = { id: string; name: string }

interface SidebarProps {
  workspaces: Workspace[]
  currentWorkspaceId: string
  userEmail: string
}

export function Sidebar({ workspaces, currentWorkspaceId, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  const navItems = [
    { name: "Dashboard", href: `/workspaces/${currentWorkspaceId}`, icon: LayoutDashboard },
    { name: "Contacts", href: `/workspaces/${currentWorkspaceId}/contacts`, icon: UsersRound },
    { name: "Email", href: `/workspaces/${currentWorkspaceId}/email`, icon: Mail },
    { name: "SMS", href: `/workspaces/${currentWorkspaceId}/sms`, icon: MessageSquare },
    { name: "Scheduler", href: `/workspaces/${currentWorkspaceId}/scheduler`, icon: Calendar },
    { name: "Inbox", href: `/workspaces/${currentWorkspaceId}/inbox`, icon: Inbox },
  ]

  const isActive = (href: string) => {
    if (href === `/workspaces/${currentWorkspaceId}`) {
       return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className={`${isCollapsed ? "w-[72px]" : "w-64"} transition-all duration-300 ease-in-out bg-[#0a0a0b] border-r border-white/5 flex flex-col h-screen overflow-hidden shrink-0 text-white relative z-20`}>
      {/* Top branding / Switcher */}
      <div className={`p-4 flex flex-col ${isCollapsed ? 'space-y-4 items-center' : 'space-y-4'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
          {!isCollapsed && (
            <>
              <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500 truncate">
                SendSphere
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full ring-1 ring-indigo-500/30 flex-shrink-0">
                PRO
              </span>
            </>
          )}
          {isCollapsed && (
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500">
              S
            </span>
          )}
        </div>
        
        <WorkspaceSwitcher workspaces={workspaces} currentWorkspaceId={currentWorkspaceId} isCollapsed={isCollapsed} />
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-3'} py-2.5 rounded-lg transition-all duration-200 group
                ${active 
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-100"
                }
              `}
            >
              <Icon size={isCollapsed ? 20 : 18} className={`${active ? "text-white" : "text-gray-500 group-hover:text-gray-300"} transition-colors`} />
              {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
            </Link>
          )
        })}
      </div>

      {/* Bottom User Area */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-3'} py-2.5 rounded-lg transition-all duration-200 text-gray-400 hover:bg-white/5 hover:text-gray-100 group mb-1`}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen size={20} className="text-gray-500 group-hover:text-gray-300 transition-colors" /> : <PanelLeftClose size={18} className="text-gray-500 group-hover:text-gray-300 transition-colors" />}
          {!isCollapsed && <span className="font-medium text-sm">Collapse</span>}
        </button>

        <Link
          href={`/workspaces/${currentWorkspaceId}/settings`}
          title={isCollapsed ? "Settings" : undefined}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-3'} py-2.5 rounded-lg transition-all duration-200 group
            ${isActive(`/workspaces/${currentWorkspaceId}/settings`) 
              ? "bg-white/10 text-white" 
              : "text-gray-400 hover:bg-white/5 hover:text-gray-100"
            }
          `}
        >
          <Settings size={isCollapsed ? 20 : 18} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
          {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
        </Link>
        
        <form action={signout} className="mt-2 text-center w-full">
          <button type="submit" title={isCollapsed ? "Sign Out" : undefined} className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-3'} py-2.5 rounded-lg transition-all duration-200 text-gray-400 hover:bg-red-500/10 hover:text-red-400 group`}>
             <LogOut size={isCollapsed ? 20 : 18} className="text-gray-500 group-hover:text-red-400 transition-colors" />
             {!isCollapsed && <span className="font-medium text-sm">Sign Out</span>}
          </button>
        </form>
      </div>
    </div>
  )
}
