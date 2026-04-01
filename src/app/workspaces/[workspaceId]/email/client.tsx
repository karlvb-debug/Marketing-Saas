"use client"

import React, { useState } from 'react'
import { FolderSidebar } from '@/components/shared/FolderSidebar'
import { TemplateBuilder } from '@/components/email/TemplateBuilder'
import { ThemeConfigurator } from '@/components/email/ThemeConfigurator'
import { createFolder, moveItem, createDraft, deleteFolder, deleteItem } from '@/app/actions/folders'
import { LayoutTemplate } from 'lucide-react'
import { PromptModal } from '@/components/shared/PromptModal'
import { ConfirmModal } from '@/components/shared/ConfirmModal'

// Basic Item structure we expect from server
type DBItem = { id: string; name: string; folder_id: string | null; [key:string]: any }

export function EmailSectionClient({ workspaceId, initialFolders, initialCampaigns, initialTemplates }: any) {
  const [activeTab, setActiveTab] = useState('campaigns')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  
  // Modal State
  const [modalState, setModalState] = useState<{isOpen: boolean, type: 'folder' | 'item'}>({ isOpen: false, type: 'folder' })
  const [deleteModalState, setDeleteModalState] = useState<{isOpen: boolean, type: 'folder' | 'item', id: string}>({ isOpen: false, type: 'item', id: '' })

  // Derive logical dataset from tabs
  const isCampaign = activeTab === 'campaigns'
  const items: DBItem[] = isCampaign ? initialCampaigns : initialTemplates
  const folders = initialFolders.filter((f: any) => f.feature_type === (isCampaign ? 'email_campaigns' : 'email_templates'))
  const table = isCampaign ? 'campaigns' : 'email_templates'
  const selectedItemData = items.find(i => i.id === selectedId)

  // Actions
  const handleMoveItem = async (itemId: string, folderId: string | null) => {
    await moveItem(table, itemId, folderId)
  }

  const handleModalSubmit = async (name: string) => {
    if (modalState.type === 'folder') {
      await createFolder(workspaceId, name, isCampaign ? 'email_campaigns' : 'email_templates')
    } else {
      await createDraft(workspaceId, table, null, name)
    }
  }

  const handleDeleteConfirm = async () => {
    if (deleteModalState.type === 'folder') {
      await deleteFolder(deleteModalState.id)
    } else if (deleteModalState.type === 'item') {
      await deleteItem(table, deleteModalState.id)
      if (selectedId === deleteModalState.id) setSelectedId(null)
    }
    setDeleteModalState({ isOpen: false, type: 'item', id: '' })
  }

  return (
    <div className="flex w-full h-full relative">
      <PromptModal 
        isOpen={modalState.isOpen}
        title={modalState.type === 'folder' ? 'Create New Folder' : `Create New ${isCampaign ? 'Campaign' : 'Template'}`}
        placeholder={`Enter ${modalState.type === 'folder' ? 'folder' : (isCampaign ? 'campaign' : 'template')} name...`}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        onSubmit={handleModalSubmit}
      />
      
      <ConfirmModal
        isOpen={deleteModalState.isOpen}
        title={`Delete ${deleteModalState.type === 'folder' ? 'Folder' : (isCampaign ? 'Campaign' : 'Template')}`}
        message={`Are you sure you want to delete this ${deleteModalState.type === 'folder' ? 'folder' : 'item'}? This action cannot be undone.`}
        onClose={() => setDeleteModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleDeleteConfirm}
      />

      <FolderSidebar
        title="Email"
        tabs={[
          { id: 'campaigns', label: 'Campaigns' },
          { id: 'templates', label: 'Templates' }
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab)
          setSelectedId(null)
        }}
        folders={folders}
        items={items.map(i => ({ 
          id: i.id, 
          name: i.name, 
          folder_id: i.folder_id,
          icon: <LayoutTemplate size={16} className={selectedId === i.id ? 'text-indigo-200' : 'text-gray-400'} />
        }))}
        selectedItemId={selectedId}
        onSelectItem={setSelectedId}
        onCreateFolder={() => setModalState({ isOpen: true, type: 'folder' })}
        onCreateItem={() => setModalState({ isOpen: true, type: 'item' })}
        onDeleteFolder={(id) => setDeleteModalState({ isOpen: true, type: 'folder', id })}
        onDeleteItem={(id) => setDeleteModalState({ isOpen: true, type: 'item', id })}
        onMoveItem={handleMoveItem}
        itemLabel={isCampaign ? 'Campaign' : 'Template'}
      />

      <div className="flex-1 bg-white h-full overflow-hidden flex flex-col relative w-full">
        {selectedItemData ? (
          <div className="h-full flex flex-col">
             {isCampaign ? (
               <TemplateBuilder 
                 key={selectedItemData.id} 
                 initialData={selectedItemData} 
                 table={table} 
                 availableTemplates={initialTemplates}
               />
             ) : (
               <ThemeConfigurator 
                 key={selectedItemData.id} 
                 initialData={selectedItemData}
                 workspaceId={workspaceId}
               />
             )}
          </div>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50/50">
             <LayoutTemplate size={48} className="text-gray-300 mb-4" />
             <h3 className="text-lg font-bold text-gray-500">Select an item to edit</h3>
             <p className="text-gray-400 text-sm mt-1">Choose a {isCampaign ? 'campaign' : 'template'} from the left sidebar to begin editing.</p>
          </div>
        )}
      </div>
    </div>
  )
}
