import React, { useState, useEffect } from 'react';
import {
  Folder, File, ChevronRight, ChevronDown, Star, Info,
  Copy, Check, X, Search, Maximize2, Minimize2, Code
} from 'lucide-react';
import OpenInSandbox from './OpenInSandbox';
import { kitStructures } from '../data/kitStructures';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const FolderStructureViewer = ({ structure, onClose }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [selectedPath, setSelectedPath] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) newExpanded.delete(path);
    else newExpanded.add(path);
    setExpandedFolders(newExpanded);
  };

  const copyStructure = () => {
    const generateText = (struct, indent = '') => {
      let text = '';
      Object.entries(struct).forEach(([name, item]) => {
        if (item.type === 'folder') {
          text += `${indent}📁 ${name}\n`;
          if (item.children) text += generateText(item.children, indent + '  ');
        } else {
          text += `${indent}📄 ${name}\n`;
        }
      });
      return text;
    };

    const text = `${structure.name}\n${'='.repeat(structure.name.length)}\n\n${generateText(structure.structure)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCode = () => {
    if (selectedItem?.content) {
      navigator.clipboard.writeText(selectedItem.content);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const expandAll = () => {
    const allPaths = new Set();
    const addPaths = (obj, basePath = '') => {
      Object.entries(obj).forEach(([key, val]) => {
        const path = basePath ? `${basePath}/${key}` : key;
        if (val.type === 'folder') {
          allPaths.add(path);
          if (val.children) addPaths(val.children, path);
        }
      });
    };
    addPaths(structure.structure);
    setExpandedFolders(allPaths);
  };

  const collapseAll = () => setExpandedFolders(new Set());

  const matchesSearch = (name, item) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      name.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search) ||
      item.content?.toLowerCase().includes(search)
    );
  };

  // Improved path finder - handles both "src" and "src/" formats
  const findItemByPath = (path) => {
    if (!path) return null;

    const parts = path.split('/').filter(Boolean);
    let current = structure.structure;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      // Try both with and without trailing slash
      const keyVariants = [part, `${part}/`];
      let found = null;

      for (const key of keyVariants) {
        if (current[key]) {
          found = current[key];
          break;
        }
      }

      if (!found) return null;

      current = found;

      // If last part → we found the target item
      if (i === parts.length - 1) {
        return current;
      }

      // Otherwise continue to children
      if (!current.children) return null;
      current = current.children;
    }

    return null;
  };

  const selectedItem = findItemByPath(selectedPath);

  const getLanguage = (filename) => {
    if (!filename) return 'text';
    const ext = filename.split('.').pop()?.toLowerCase();
    const langMap = {
      js: 'javascript',
      jsx: 'jsx',
      ts: 'typescript',
      tsx: 'tsx',
      py: 'python',
      css: 'css',
      json: 'json',
      html: 'html',
      md: 'markdown',
      yml: 'yaml',
      yaml: 'yaml'
    };
    return langMap[ext] || 'text';
  };

  const renderItem = (name, item, path, level = 0) => {
  if (!matchesSearch(name, item)) return null;

  const isFolder = item.type === 'folder';
  const isExpanded = expandedFolders.has(path);
  const isSelected = !isFolder && selectedPath === path;

  return (
    <div key={path}>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all group hover:bg-slate-800/60 ${
          isSelected ? 'bg-blue-950/40 border-l-4 border-blue-500' : ''
        }`}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
        onClick={() => {
          if (isFolder) {
            toggleFolder(path);
          } else {
            setSelectedPath(path);
          }
        }}
      >
        {isFolder ? (
          isExpanded ? <ChevronDown className="w-4 h-4 text-blue-400" /> : <ChevronRight className="w-4 h-4 text-slate-500" />
        ) : (
          <div className="w-4" />
        )}

        {isFolder ? (
          <Folder className="w-4.5 h-4.5 text-yellow-400" />
        ) : (
          <File className="w-4.5 h-4.5 text-cyan-400" />
        )}

        <span className={`text-sm flex-1 truncate ${item.important ? 'font-semibold text-white' : 'text-slate-200'}`}>
          {name}
        </span>

        {item.important && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />}
      </div>

      {isFolder && isExpanded && item.children && (
        <div className="ml-4 border-l border-slate-700/40">
          {Object.entries(item.children).map(([childName, child]) =>
            renderItem(childName, child, `${path}/${childName}`, level + 1)
          )}
        </div>
      )}
    </div>
  );
};


  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-4">
      <div className={`bg-slate-900/95 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden w-full max-w-7xl max-h-[95vh] ${isFullscreen ? 'w-screen h-screen rounded-none' : ''}`}>

        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 to-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Folder className="w-9 h-9 text-yellow-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">{structure.name}</h2>
                <p className="text-slate-400">{structure.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
            <OpenInSandbox github={structure.githublink} />
              <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 rounded-lg hover:bg-slate-800">
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-red-900/40 text-red-400">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-600"
              />
            </div>
            <button onClick={copyStructure} className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Tree'}
            </button>
            <button onClick={expandAll} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">Expand All</button>
            <button onClick={collapseAll} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">Collapse All</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Tree */}
          <div className="w-80 border-r border-slate-800 overflow-y-auto bg-slate-950/50 p-3">
            {Object.entries(structure.structure).map(([key, item]) =>
              renderItem(key, item, key, 0)
            )}
          </div>

          {/* Preview */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/60">
            {selectedPath && selectedItem ? (
              <>
                <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedItem.type === 'folder' ? (
                      <Folder className="text-yellow-400" size={28} />
                    ) : (
                      <File className="text-cyan-400" size={28} />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg text-white truncate">
                        {selectedItem.name || selectedPath.split('/').pop()}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {selectedPath}
                      </p>
                    </div>
                  </div>
                  {selectedItem.important && <Star className="text-yellow-400 fill-yellow-400" size={22} />}
                </div>

                <div className="flex-1 p-6 overflow-auto">
                  {selectedItem.type === 'folder' ? (
                    <div className="space-y-6 text-slate-300">
                      {selectedItem.description && (
                        <div>
                          <h4 className="text-sm font-semibold text-slate-200 mb-2">Description</h4>
                          <p>{selectedItem.description}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-400 font-mono">
                          {selectedItem.name || selectedPath.split('/').pop()}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs bg-emerald-900/40 text-emerald-400 px-3 py-1 rounded-full font-mono uppercase">
                            {getLanguage(selectedItem.name)}
                          </span>
                          {selectedItem.content && (
                            <button
                              onClick={copyCode}
                              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
                            >
                              {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                              {copiedCode ? 'Copied' : 'Copy'}
                            </button>
                          )}
                        </div>
                      </div>

                      {selectedItem.content ? (
                     <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <pre className="p-5 text-sm text-slate-200 font-mono overflow-auto whitespace-pre">
                      <code>
                        {selectedItem.content}
                      </code>
                    </pre>
                  </div>

                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-10">
                          <Code size={64} className="opacity-40 mb-6" />
                          <p className="text-lg font-medium mb-2">No source code available</p>
                          {selectedItem.description && (
                            <p className="text-slate-400 max-w-md">{selectedItem.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-600">
                <div className="text-center">
                  <File size={48} className="mx-auto mb-4 opacity-40" />
                  <p className="text-lg">Select a file to view content</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderStructureViewer;