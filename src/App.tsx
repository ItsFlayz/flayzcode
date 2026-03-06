import React, { useState, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Sidebar } from './components/Sidebar';
import { Terminal } from './components/Terminal';
import { Preview } from './components/Preview';
import { AIAssistant } from './components/AIAssistant';
import { VoiceControl } from './components/VoiceControl';
import { useFileSystem } from './hooks/useFileSystem';
import { Settings, Github, Layout, Play, Sun, Moon, Download, Trash2, Globe } from 'lucide-react';
import { cn } from './lib/utils';

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'html', name: 'HTML' },
  { id: 'css', name: 'CSS' },
  { id: 'python', name: 'Python' },
  { id: 'json', name: 'JSON' },
];

export default function App() {
  const { files, activeFileId, setActiveFileId, updateFileContent, updateFileLanguage, createFile, deleteFile } = useFileSystem();
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [voiceCommand, setVoiceCommand] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const editorRef = useRef<any>(null);

  const activeFile = activeFileId ? files[activeFileId] : null;

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
    
    editor.updateOptions({
      fontSize: 14,
      fontFamily: "'JetBrains Mono', monospace",
      minimap: { enabled: true },
      lineNumbers: 'on',
      roundedSelection: true,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      padding: { top: 20, bottom: 20 },
    });
  };

  const runCode = () => {
    if (!activeFile) return;
    
    if (activeFile.language === 'html' || activeFile.name.endsWith('.html')) {
      setIsPreviewOpen(true);
      return;
    }

    setTerminalOutput([]);
    const originalLog = console.log;
    const originalError = console.error;
    const logs: string[] = [];

    console.log = (...args) => {
      logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
    };
    console.error = (...args) => {
      logs.push(`Error: ${args.join(' ')}`);
    };

    try {
      if (activeFile.language === 'javascript' || activeFile.language === 'typescript') {
        // Simple infinite loop protection (not perfect but helpful)
        const code = `
          let __startTime = Date.now();
          const __checkTimeout = () => {
            if (Date.now() - __startTime > 2000) throw new Error("Execution Timeout: Possible infinite loop detected.");
          };
          ${activeFile.content.replace(/(for|while|do)\s*\(/g, '$1 (__checkTimeout(), ')}
        `;
        new Function(code)();
      } else {
        logs.push(`Execution not supported for ${activeFile.language} in this preview.`);
      }
    } catch (err: any) {
      logs.push(`Error: ${err.message}`);
    }

    console.log = originalLog;
    console.error = originalError;
    setTerminalOutput(logs);
  };

  const downloadFile = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearEditor = () => {
    if (activeFileId && confirm('Are you sure you want to clear the editor?')) {
      updateFileContent(activeFileId, '');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  const handleApplyCode = (code: string) => {
    if (activeFileId) {
      updateFileContent(activeFileId, code);
    }
  };

  const handleVoiceCommand = (command: string) => {
    setVoiceCommand(command);
    setTimeout(() => setVoiceCommand(''), 1000);
  };

  return (
    <div className={cn(
      "flex h-screen w-full overflow-hidden font-sans transition-colors duration-300",
      theme === 'dark' ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"
    )}>
      {isSidebarOpen && (
        <Sidebar 
          files={files} 
          activeFileId={activeFileId} 
          onSelectFile={setActiveFileId}
          onCreateFile={() => {
            const name = prompt('File name (e.g. index.html, script.js):');
            if (name) {
              const ext = name.split('.').pop()?.toLowerCase();
              let lang = 'javascript';
              if (ext === 'html') lang = 'html';
              else if (ext === 'css') lang = 'css';
              else if (ext === 'py') lang = 'python';
              else if (ext === 'json') lang = 'json';
              else if (ext === 'ts') lang = 'typescript';
              createFile(name, lang);
            }
          }}
          onDeleteFile={deleteFile}
          theme={theme}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className={cn(
          "h-14 border-b flex items-center justify-between px-4 backdrop-blur-xl z-10 transition-colors",
          theme === 'dark' ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-white/50"
        )}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn(
                "p-2 rounded-lg transition-all",
                theme === 'dark' ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
              )}
            >
              <Layout size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tighter text-indigo-500">FlayZCode</span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/10 text-indigo-500 rounded-full border border-indigo-500/20">PRO</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {activeFile && (
              <div className="flex items-center gap-2 mr-4">
                <div className="relative group">
                  <select 
                    value={activeFile.language}
                    onChange={(e) => {
                      if (activeFileId) {
                        updateFileLanguage(activeFileId, e.target.value);
                      }
                    }}
                    className={cn(
                      "appearance-none text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none transition-all pr-8",
                      theme === 'dark' 
                        ? "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600" 
                        : "bg-zinc-100 border-zinc-200 text-zinc-700 hover:border-zinc-300"
                    )}
                  >
                    {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                  <Globe size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                </div>

                <button 
                  onClick={runCode}
                  className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-900/20"
                >
                  <Play size={14} fill="currentColor" />
                  RUN
                </button>
              </div>
            )}

            <div className={cn("h-6 w-[1px] mx-1", theme === 'dark' ? "bg-zinc-800" : "bg-zinc-200")} />
            <VoiceControl onCommand={handleVoiceCommand} />
            <div className={cn("h-6 w-[1px] mx-1", theme === 'dark' ? "bg-zinc-800" : "bg-zinc-200")} />
            
            <div className="flex items-center gap-1">
              {activeFile && (
                <>
                  <button 
                    onClick={downloadFile}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      theme === 'dark' ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                    )}
                    title="Download File"
                  >
                    <Download size={18} />
                  </button>
                  <button 
                    onClick={clearEditor}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      theme === 'dark' ? "text-zinc-400 hover:text-red-400 hover:bg-zinc-800" : "text-zinc-500 hover:text-red-500 hover:bg-zinc-100"
                    )}
                    title="Clear Editor"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
              <button 
                onClick={toggleTheme}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  theme === 'dark' ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                )}
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className={cn(
                "p-2 rounded-lg transition-all",
                theme === 'dark' ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
              )}><Github size={18} /></button>
            </div>
          </div>
        </header>

        <div className={cn("flex-1 flex flex-col min-h-0", theme === 'dark' ? "bg-zinc-950" : "bg-white")}>
          {activeFile ? (
            <>
              <div className="flex-1 relative">
                <Editor
                  height="100%"
                  language={activeFile.language}
                  value={activeFile.content}
                  theme={theme === 'dark' ? "vs-dark" : "light"}
                  onChange={(val) => updateFileContent(activeFileId!, val || '')}
                  onMount={handleEditorMount}
                  loading={<div className="flex items-center justify-center h-full text-zinc-500">Initializing Editor...</div>}
                />
              </div>
              <Terminal 
                output={terminalOutput} 
                onClear={() => setTerminalOutput([])} 
                onRun={runCode}
                theme={theme}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-4">
              <Layout size={64} className="opacity-10" />
              <p className="text-sm">Select a file from the sidebar to start coding.</p>
              <button 
                onClick={() => createFile('main.js', 'javascript')}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20"
              >
                Create New File
              </button>
            </div>
          )}
        </div>
      </div>

      <AIAssistant 
        activeFile={activeFile ? { content: activeFile.content, language: activeFile.language || 'javascript', name: activeFile.name } : null} 
        onApplyCode={handleApplyCode}
        voiceCommand={voiceCommand}
      />

      {isPreviewOpen && activeFile && (
        <Preview 
          html={activeFile.content} 
          onClose={() => setIsPreviewOpen(false)} 
        />
      )}
    </div>
  );
}
