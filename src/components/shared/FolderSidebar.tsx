"use client"

import React, { useState } from 'react'
import { 
  DndContext, 
  DragOverlay, 
  closestCenter, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent,
  useDraggable,
  useDroppable
} from '@dnd-kit/core'
import { Folder as FolderIcon, File, Plus, ChevronRight, ChevronDown, AlignLeft, Trash2 } from 'lucide-react'

export type Folder = { id: string; name: string }
export type Item = { id: string; name: string; folder_id: string | null; icon?: React.ReactNode; metadata?: any }

interface FolderSidebarProps {
  title: string
  tabs?: { id: string; label: string }[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  folders: Folder[]
  items: Item[]
  selectedItemId: string | null
  onSelectItem: (id: string | null) => void
  onMoveItem: (itemId: string, folderId: string | null) => void
  onCreateFolder: () => void
  onCreateItem: () => void
  onDeleteFolder?: (folderId: string) => void
  onDeleteItem?: (itemId: string) => void
  itemLabel?: string
}

function DroppableFolder({ folder, items, selectedItemId, onSelectItem, onDelete, children }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const { isOver, setNodeRef } = useDroppable({
    id: folder.id,
    data: { type: 'folder', folderId: folder.id }
  })

  return (
    <div ref={setNodeRef} className={`mb-1 rounded-md transition-colors ${isOver ? 'bg-indigo-50 border border-indigo-200 shadow-inner' : ''}`}>
      <div 
        className="flex items-center space-x-2 px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer group relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <button className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors">
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <FolderIcon size={16} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
        <span className="text-sm font-medium text-gray-700 flex-1 truncate">{folder.name}</span>
        
        <div className="flex flex-shrink-0 items-center space-x-1">
          {onDelete && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(folder.id); }}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete Folder"
            >
              <Trash2 size={12} />
            </button>
          )}
          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full group-hover:bg-white">{items.length}</span>
        </div>
      </div>
      
      {isOpen && (
        <div className="pl-6 pr-2 py-1 space-y-1">
          {items.length === 0 ? (
            <div className="text-xs text-gray-400 italic px-2 py-1">Empty</div>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  )
}

function DraggableItem({ item, isSelected, onClick, onDelete }: any) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    data: { type: 'item', itemId: item.id }
  })

  return (
    <div 
      ref={setNodeRef} 
      {...attributes} 
      {...listeners}
      onClick={(e) => {
        // Prevent drag click from misfiring by relying on pointerdown
        onClick()
      }}
      className={`flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors cursor-grab active:cursor-grabbing group
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${isSelected 
          ? 'bg-indigo-500 text-white shadow-md' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }
      `}
    >
      <div className="flex items-center space-x-2 truncate">
        <div className="flex-shrink-0">
          {item.icon || <File size={16} className={isSelected ? 'text-indigo-200' : 'text-gray-400'} />}
        </div>
        <span className="truncate">{item.name}</span>
      </div>

      {onDelete && (
         <button 
           onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
           className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'text-indigo-200 hover:text-white hover:bg-indigo-600' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
           title="Delete Item"
         >
           <Trash2 size={12} />
         </button>
      )}
    </div>
  )
}

const pointerSensorOptions = { activationConstraint: { distance: 5 } }

export function FolderSidebar({
  title,
  tabs,
  activeTab,
  onTabChange,
  folders,
  items,
  selectedItemId,
  onSelectItem,
  onMoveItem,
  onCreateFolder,
  onCreateItem,
  onDeleteFolder,
  onDeleteItem,
  itemLabel = "Item"
}: FolderSidebarProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, pointerSensorOptions))

  // Uncategorized items (root)
  const rootItems = items.filter(i => !i.folder_id)

  function handleDragStart(event: any) {
    setActiveId(event.active.id)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event

    if (over && active.id !== over.id) {
      // Determine the actual target folder ID
      const targetType = over.data.current?.type
      let targetFolderId: string | null = null
      
      if (targetType === 'folder') {
        targetFolderId = over.data.current?.folderId || null
      } else if (targetType === 'item') {
        // If dropped exactly on another item, move it to that item's parent folder
        const targetItem = items.find(i => i.id === over.id)
        targetFolderId = targetItem?.folder_id || null
      }

      onMoveItem(String(active.id), targetFolderId)
    }
  }

  const { isOver: isRootOver, setNodeRef: setRootNodeRef } = useDroppable({
    id: 'root',
    data: { type: 'folder', folderId: null }
  })

  return (
    <div className="w-72 bg-white border-r border-gray-200 h-full flex flex-col shrink-0">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <AlignLeft size={18} className="text-indigo-500"/>
            <span>{title}</span>
          </span>
          <div className="flex space-x-1">
            <button onClick={onCreateFolder} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="New Folder">
              <FolderIcon size={16} />
            </button>
            <button onClick={onCreateItem} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title={`New ${itemLabel}`}>
              <Plus size={16} />
            </button>
          </div>
        </h2>
        
        {tabs && tabs.length > 0 && (
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange && onTabChange(tab.id)}
                className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-all ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 bg-gray-50/50">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Folders */}
          {folders.map(folder => {
            const folderItems = items.filter(i => i.folder_id === folder.id)
            return (
              <DroppableFolder 
                key={folder.id} 
                folder={folder} 
                items={folderItems}
                onDelete={onDeleteFolder}
              >
                {folderItems.map(item => (
                  <DraggableItem 
                    key={item.id} 
                    item={item} 
                    isSelected={selectedItemId === item.id}
                    onClick={() => onSelectItem(item.id)}
                    onDelete={onDeleteItem}
                  />
                ))}
              </DroppableFolder>
            )
          })}

          <div className="h-px bg-gray-200 my-4 mx-2"></div>
          
          {/* Root/Uncategorized Items */}
          <div ref={setRootNodeRef} className={`min-h-[100px] p-2 rounded-md transition-colors ${isRootOver ? 'bg-indigo-50 border border-indigo-200 shadow-inner' : ''}`}>
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Uncategorized</h3>
             <div className="space-y-1">
               {rootItems.length === 0 && !isRootOver && (
                 <div className="text-xs text-gray-400 italic px-1">No items in root</div>
               )}
               {rootItems.map(item => (
                 <DraggableItem 
                   key={item.id} 
                   item={item} 
                   isSelected={selectedItemId === item.id}
                   onClick={() => onSelectItem(item.id)}
                   onDelete={onDeleteItem}
                 />
               ))}
             </div>
          </div>

          <DragOverlay>
            {activeId ? (
              <div className="flex items-center space-x-2 px-3 py-2 bg-indigo-500 rounded-md text-sm text-white shadow-xl opacity-90 scale-105 cursor-grabbing">
                <File size={16} className="text-indigo-200" />
                <span className="truncate">{items.find(i => i.id === activeId)?.name || 'Dragging Item'}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
