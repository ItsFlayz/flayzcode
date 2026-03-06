import React from 'react';
import { Folder, FileCode, Plus, Search, Trash2 } from 'lucide-react';
import { FileNode } from '../types';
import { cn } from '../utils';

interface SidebarProps {
  files: Record<string, FileNode>;
  activeFileId: string | null;
  onSelectFile: (id: string) => void;
  onCreateFile: () => void;
  onDeleteFile: (id: string) => void;
  theme?: 'dark' | 'light';
}

export function Sidebar({ files, activeFileId, onSelectFile, onCreateFile, onDeleteFile, theme = 'dark' }: SidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredFiles = Object.values(files).filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn(
      "w-64 border-r flex flex-col h-full transition-colors duration-300",
      theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-zinc-50 border-zinc-200"
    )}>
      <div className={cn("p-4 border-b", theme === 'dark' ? "border-zinc-800" : "border-zinc-200")}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={cn("text-sm font-bold flex items-center gap-2", theme === 'dark' ? "text-zinc-100" : "text-zinc-800")}>
            <Folder size={18} className="text-indigo-500" />
            EXPLORER
          </h2>
          <button 
            onClick={onCreateFile}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              theme === 'dark' ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200"
            )}
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
          <input 
            type="text" 
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full border rounded-lg py-1.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all",
              theme === 'dark' ? "bg-zinc-950 border-zinc-800 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700"
            )}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Files</div>
        {filteredFiles.map(file => (
          <div 
            key={file.id}
            onClick={() => onSelectFile(file.id)}
            className={cn(
              "group flex items-center justify-between px-4 py-2 cursor-pointer transition-all",
              activeFileId === file.id 
                ? "bg-indigo-500/10 text-indigo-500 border-l-2 border-indigo-500" 
                : theme === 'dark' ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200" : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
            )}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <FileCode size={16} className={cn(activeFileId === file.id ? "text-indigo-500" : "text-zinc-500")} />
              <span className="text-sm truncate">{file.name}</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFile(file.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-500 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className={cn("p-4 border-t", theme === 'dark' ? "border-zinc-800 bg-zinc-950/50" : "border-zinc-200 bg-zinc-100/50")}>
        <div className="flex items-center gap-3 text-zinc-500 text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Connected to Cloud</span>
        </div>
      </div>
    </div>
  );
}
