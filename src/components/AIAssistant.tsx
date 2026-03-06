import React, { useState } from 'react';
import { Sparkles, Send, Loader2, X, MessageSquare, Code2, Zap, Wrench, Languages } from 'lucide-react';
import { aiService, AIResponse } from '../services/aiService';
import Markdown from 'react-markdown';
import { cn } from '../utils';

interface AIAssistantProps {
  activeFile: { content: string; language: string; name: string } | null;
  onApplyCode: (code: string) => void;
  voiceCommand?: string;
  theme?: 'dark' | 'light';
}

export function AIAssistant({ activeFile, onApplyCode, voiceCommand, theme = 'dark' }: AIAssistantProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; data?: AIResponse; isError?: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || !activeFile) return;

    const userMessage = { role: 'user' as const, content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await aiService.generate(text, activeFile.language, activeFile.content);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.explanation || 'No explanation provided.',
        data 
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message || 'Failed to get response from AI.'}`,
        isError: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!activeFile) return;
    setIsLoading(true);
    setIsOpen(true);
    try {
      const data = await aiService.explain(activeFile.content, activeFile.language);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.explanation || 'No explanation available.',
        data 
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message || 'Failed to explain code.'}`,
        isError: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!activeFile) return;
    setIsLoading(true);
    setIsOpen(true);
    try {
      const data = await aiService.optimize(activeFile.content, activeFile.language);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.explanation || 'No suggestions available.',
        data 
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message || 'Failed to optimize code.'}`,
        isError: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFix = async () => {
    if (!activeFile) return;
    setIsLoading(true);
    setIsOpen(true);
    try {
      const data = await aiService.fix(activeFile.content, activeFile.language);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.explanation || 'No fixes found.',
        data 
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message || 'Failed to fix code.'}`,
        isError: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvert = async () => {
    if (!activeFile) return;
    const toLang = prompt("Enter target language (e.g., python, javascript, rust):");
    if (!toLang) return;
    
    setIsLoading(true);
    setIsOpen(true);
    try {
      const data = await aiService.convert(activeFile.content, activeFile.language, toLang);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.explanation || `Converted to ${toLang}.`,
        data 
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message || 'Failed to convert code.'}`,
        isError: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (voiceCommand) {
      setIsOpen(true);
      handleSend(voiceCommand);
    }
  }, [voiceCommand]);

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <button
          onClick={handleConvert}
          disabled={isLoading}
          className={cn(
            "p-3 rounded-xl shadow-lg border transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:scale-100",
            theme === 'dark' ? "bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white" : "bg-white text-zinc-600 border-zinc-200 hover:text-zinc-900"
          )}
          title="Convert Language"
        >
          <Languages size={20} />
          <span className="text-xs font-medium hidden md:block">Convert</span>
        </button>
        <button
          onClick={handleFix}
          disabled={isLoading}
          className={cn(
            "p-3 rounded-xl shadow-lg border transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:scale-100",
            theme === 'dark' ? "bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white" : "bg-white text-zinc-600 border-zinc-200 hover:text-zinc-900"
          )}
          title="Fix Errors"
        >
          <Wrench size={20} />
          <span className="text-xs font-medium hidden md:block">Fix</span>
        </button>
        <button
          onClick={handleExplain}
          disabled={isLoading}
          className={cn(
            "p-3 rounded-xl shadow-lg border transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:scale-100",
            theme === 'dark' ? "bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white" : "bg-white text-zinc-600 border-zinc-200 hover:text-zinc-900"
          )}
          title="Explain Code"
        >
          <MessageSquare size={20} />
          <span className="text-xs font-medium hidden md:block">Explain</span>
        </button>
        <button
          onClick={handleOptimize}
          disabled={isLoading}
          className={cn(
            "p-3 rounded-xl shadow-lg border transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:scale-100",
            theme === 'dark' ? "bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white" : "bg-white text-zinc-600 border-zinc-200 hover:text-zinc-900"
          )}
          title="Optimize Code"
        >
          <Zap size={20} />
          <span className="text-xs font-medium hidden md:block">Optimize</span>
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-500 transition-all hover:scale-110 flex items-center gap-2"
        >
          <Sparkles size={24} />
          <span className="font-semibold hidden md:block">FlayZ AI</span>
        </button>
      </div>

      {/* Assistant Panel */}
      {isOpen && (
        <div className={cn(
          "fixed bottom-24 right-6 w-[400px] max-w-[90vw] h-[600px] max-h-[70vh] border rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden transition-colors",
          theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
        )}>
          <div className={cn(
            "p-4 border-b flex justify-between items-center backdrop-blur-xl",
            theme === 'dark' ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-100 bg-zinc-50/50"
          )}>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-500" />
              <h3 className={cn("font-semibold", theme === 'dark' ? "text-zinc-100" : "text-zinc-800")}>FlayZ AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.length === 0 && (
              <div className="text-center py-10 text-zinc-500">
                <Code2 size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-sm">Ask me to write code, explain logic, or fix bugs.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "max-w-[85%] p-3 rounded-2xl text-sm transition-all",
                msg.role === 'user' 
                  ? "bg-indigo-600 text-white ml-auto" 
                  : cn(
                      "mr-auto",
                      msg.isError ? "bg-red-500/10 text-red-500 border border-red-500/20" : theme === 'dark' ? "bg-zinc-800 text-zinc-200" : "bg-zinc-100 text-zinc-800"
                    )
              )}>
                <div className="markdown-body">
                  <Markdown>{msg.content}</Markdown>
                </div>
                
                {msg.data?.code && (
                  <div className="mt-4 space-y-2">
                    <div className={cn(
                      "p-2 rounded-lg border font-mono text-[10px] overflow-x-auto",
                      theme === 'dark' ? "bg-zinc-950 border-zinc-700" : "bg-white border-zinc-200"
                    )}>
                      <pre>{msg.data.code}</pre>
                    </div>
                    <button 
                      onClick={() => onApplyCode(msg.data!.code)}
                      className="text-xs text-indigo-500 hover:text-indigo-400 font-bold underline"
                    >
                      Apply code to editor
                    </button>
                  </div>
                )}

                {msg.data?.suggestions && msg.data.suggestions.length > 0 && (
                  <div className={cn("mt-3 pt-3 border-t", theme === 'dark' ? "border-zinc-700" : "border-zinc-200")}>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Suggestions</p>
                    <ul className="list-disc list-inside text-[11px] text-zinc-400 space-y-1">
                      {msg.data.suggestions.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className={cn(
                "mr-auto p-3 rounded-2xl flex items-center gap-2 text-sm",
                theme === 'dark' ? "bg-zinc-800 text-zinc-200" : "bg-zinc-100 text-zinc-800"
              )}>
                <Loader2 size={16} className="animate-spin text-indigo-500" />
                <span>Thinking...</span>
              </div>
            )}
          </div>

          <div className={cn("p-4 border-t", theme === 'dark' ? "border-zinc-800 bg-zinc-900" : "border-zinc-200 bg-zinc-50")}>
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your command..."
                className={cn(
                  "w-full border rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all",
                  theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-white border-zinc-200 text-zinc-900"
                )}
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-500 hover:text-indigo-400 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
