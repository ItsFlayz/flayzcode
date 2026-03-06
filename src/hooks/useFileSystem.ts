import { useState, useCallback, useEffect } from 'react';
import { FileNode, INITIAL_FILES } from '../types';

export function useFileSystem() {
  const [files, setFiles] = useState<Record<string, FileNode>>(() => {
    const saved = localStorage.getItem('flayzcode_files');
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });
  
  const [activeFileId, setActiveFileId] = useState<string | null>(() => {
    const keys = Object.keys(files);
    return keys.length > 0 ? keys[0] : null;
  });

  useEffect(() => {
    localStorage.setItem('flayzcode_files', JSON.stringify(files));
  }, [files]);

  const updateFileContent = useCallback((id: string, content: string) => {
    setFiles(prev => ({
      ...prev,
      [id]: { ...prev[id], content }
    }));
  }, []);

  const updateFileLanguage = useCallback((id: string, language: string) => {
    setFiles(prev => ({
      ...prev,
      [id]: { ...prev[id], language }
    }));
  }, []);

  const createFile = useCallback((name: string, language: string = 'javascript') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newFile: FileNode = {
      id,
      name,
      type: 'file',
      content: '',
      language
    };
    setFiles(prev => ({ ...prev, [id]: newFile }));
    setActiveFileId(id);
    return id;
  }, []);

  const deleteFile = useCallback((id: string) => {
    setFiles(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (activeFileId === id) {
      setActiveFileId(null);
    }
  }, [activeFileId]);

  return {
    files,
    activeFileId,
    setActiveFileId,
    updateFileContent,
    updateFileLanguage,
    createFile,
    deleteFile
  };
}
