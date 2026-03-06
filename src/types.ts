export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  parentId?: string;
  children?: string[]; // IDs of children
}

export interface FileSystemState {
  files: Record<string, FileNode>;
  rootIds: string[];
  activeFileId: string | null;
}

export const INITIAL_FILES: Record<string, FileNode> = {
  'root-1': {
    id: 'root-1',
    name: 'index.html',
    type: 'file',
    content: '<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f0f0; }\n    h1 { color: #4f46e5; }\n  </style>\n</head>\n<body>\n  <h1>Welcome to FlayZCode!</h1>\n  <script>\n    console.log("Hello from index.html");\n  </script>\n</body>\n</html>',
    language: 'html'
  },
  'root-2': {
    id: 'root-2',
    name: 'main.js',
    type: 'file',
    content: '// Welcome to FlayZCode\nconsole.log("Hello, World!");',
    language: 'javascript'
  }
};
