import React, { useState } from 'react';
import { Terminal as TerminalIcon, Play, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../utils';

interface TerminalProps {
  output: string[];
  onClear: () => void;
  onRun: () => void;
  theme?: 'dark' | 'light';
}

export function Terminal({ output, onClear, onRun, theme = 'dark' }: TerminalProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn(
      "border-t flex flex-col transition-all duration-300",
      theme === 'dark' ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200",
      isExpanded ? "h-[400px]" : "h-[150px]"
    )}>
      <div className={cn(
        "flex items-center justify-between px-4 py-2 border-b transition-colors",
        theme === 'dark' ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-zinc-50"
      )}>
        <div className="flex items-center gap-2 text-zinc-400">
          <TerminalIcon size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Console Output</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onRun}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-lg text-xs font-medium transition-colors"
          >
            <Play size={14} />
            Run
          </button>
          <button 
            onClick={onClear}
            className={cn(
              "p-1.5 transition-colors",
              theme === 'dark' ? "text-zinc-500 hover:text-white" : "text-zinc-400 hover:text-zinc-900"
            )}
            title="Clear Console"
          >
            <Trash2 size={14} />
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "p-1.5 transition-colors",
              theme === 'dark' ? "text-zinc-500 hover:text-white" : "text-zinc-400 hover:text-zinc-900"
            )}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1 custom-scrollbar">
        {output.length === 0 ? (
          <span className="text-zinc-500 italic text-xs">No output yet. Click 'Run' to execute your code.</span>
        ) : (
          output.map((line, i) => (
            <div key={i} className={cn(
              "whitespace-pre-wrap",
              line.startsWith('Error:') ? "text-red-500" : 
              line.startsWith('Warning:') ? "text-yellow-500" : 
              theme === 'dark' ? "text-zinc-300" : "text-zinc-700"
            )}>
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
