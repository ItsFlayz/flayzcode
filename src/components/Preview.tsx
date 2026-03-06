import React from 'react';
import { X, RefreshCw, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

interface PreviewProps {
  html: string;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export function Preview({ html, onClose, theme = 'dark' }: PreviewProps) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const refresh = () => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  };

  React.useEffect(() => {
    refresh();
  }, [html]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-10">
      <div className={cn(
        "w-full h-full rounded-2xl shadow-2xl overflow-hidden flex flex-col",
        theme === 'dark' ? "bg-zinc-900" : "bg-white"
      )}>
        <div className={cn(
          "h-12 border-b flex items-center justify-between px-4",
          theme === 'dark' ? "bg-zinc-950 border-zinc-800" : "bg-zinc-100 border-zinc-200"
        )}>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className={cn("text-xs font-medium ml-2", theme === 'dark' ? "text-zinc-400" : "text-zinc-500")}>Live Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={refresh}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                theme === 'dark' ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200"
              )}
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
            <button 
              onClick={onClose}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                theme === 'dark' ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200"
              )}
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 bg-white">
          <iframe 
            ref={iframeRef}
            title="preview"
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-modals"
          />
        </div>
      </div>
    </div>
  );
}
