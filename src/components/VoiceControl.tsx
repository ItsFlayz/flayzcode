import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Globe } from 'lucide-react';
import { cn } from '../utils';

interface VoiceControlProps {
  onCommand: (command: string) => void;
}

const LANGUAGES = [
  { code: 'en-US', name: 'English' },
  { code: 'ur-PK', name: 'Urdu' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
];

export function VoiceControl({ onCommand }: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en-US');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = selectedLang;

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onCommand(transcript);
        setIsListening(false);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [onCommand, selectedLang]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start recognition:', err);
        setIsListening(false);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative group">
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="appearance-none bg-zinc-800 text-zinc-400 text-[10px] px-2 py-1 pr-6 rounded-lg border border-zinc-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer hover:text-white transition-colors"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <Globe size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
      </div>

      <button
        onClick={toggleListening}
        className={cn(
          "p-2 rounded-full transition-all duration-300 flex items-center gap-2",
          isListening ? "bg-red-500 text-white animate-pulse" : "bg-zinc-800 text-zinc-400 hover:text-white"
        )}
        title={isListening ? "Stop Listening" : "Voice Command"}
      >
        {isListening ? <Mic size={20} /> : <MicOff size={20} />}
        {isListening && <span className="text-xs font-medium">Listening...</span>}
      </button>
    </div>
  );
}
