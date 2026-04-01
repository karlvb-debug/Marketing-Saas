"use client"

import { useState } from "react"
import { ChevronDown, Plus, Building2 } from "lucide-react"
import { useRouter } from "next/navigation"

type Workspace = {
  id: string
  name: string
}

interface WorkspaceSwitcherProps {
  workspaces: Workspace[]
  currentWorkspaceId: string
  isCollapsed?: boolean
}

export function WorkspaceSwitcher({ workspaces, currentWorkspaceId, isCollapsed = false }: WorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  
  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId) || workspaces[0]

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2' : 'justify-between p-3'} rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group`}
        title={isCollapsed ? currentWorkspace?.name : undefined}
      >
        <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'} overflow-hidden`}>
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg group-hover:shadow-indigo-500/20 transition-all">
            <Building2 size={16} className="text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-sm text-gray-200 truncate pr-2">
              {currentWorkspace?.name || "Initializing..."}
            </span>
          )}
        </div>
        {!isCollapsed && (
          <ChevronDown 
            size={16} 
            className={`text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
          />
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#1c1c22] border border-white/10 shadow-2xl overflow-hidden z-50 py-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Workspaces
            </div>
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => {
                  setIsOpen(false)
                  router.push(`/workspaces/${workspace.id}`)
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 transition-colors
                  ${workspace.id === currentWorkspaceId 
                    ? "bg-indigo-500/10 text-indigo-400" 
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <span className="truncate">{workspace.name}</span>
              </button>
            ))}
            <div className="h-px bg-white/10 my-1"></div>
            <button 
              onClick={() => {
                setIsOpen(false)
                router.push('/workspaces/new')
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Create Workspace</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
