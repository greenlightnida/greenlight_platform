import { useState, useEffect } from 'react';

/**
 * DeveloperNotesPanel - Developer Notes Management Interface
 * 
 * PURPOSE: Centralized developer notes and documentation management
 * - Note creation and editing
 * - Documentation organization
 * - Code snippets and examples
 * - Knowledge sharing and collaboration
 */

interface DeveloperNote {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'architecture' | 'api' | 'frontend' | 'backend' | 'deployment' | 'bugfix' | 'feature';
  tags: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'published' | 'archived';
}

interface DeveloperNotesPanelProps {
  className?: string;
}

export const DeveloperNotesPanel: React.FC<DeveloperNotesPanelProps> = ({ 
  className = '' 
}) => {
  const [notes, setNotes] = useState<DeveloperNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<DeveloperNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Mock data initialization
  useEffect(() => {
    loadMockNotes();
  }, []);

  const loadMockNotes = () => {
    const mockNotes: DeveloperNote[] = [
      {
        id: '1',
        title: 'System Architecture Overview',
        content: 'The system follows a holon-based architecture with modular components...',
        category: 'architecture',
        tags: ['architecture', 'design', 'system'],
        author: 'System Architect',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        priority: 'high',
        status: 'published'
      },
      {
        id: '2',
        title: 'API Authentication Flow',
        content: 'JWT-based authentication with refresh token rotation...',
        category: 'api',
        tags: ['api', 'auth', 'security'],
        author: 'Backend Developer',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18'),
        priority: 'critical',
        status: 'published'
      }
    ];
    setNotes(mockNotes);
  };

  const filteredNotes = notes.filter(note => {
    if (searchQuery && !note.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !note.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategory !== 'all' && note.category !== selectedCategory) return false;
    if (selectedPriority !== 'all' && note.priority !== selectedPriority) return false;
    return true;
  });

  const handleNoteSelect = (note: DeveloperNote) => {
    setSelectedNote(note);
    setIsEditing(false);
  };

  const handleEditNote = () => {
    setIsEditing(true);
  };

  const handleCreateNote = () => {
    const newNote: DeveloperNote = {
      id: Date.now().toString(),
      title: 'New Note',
      content: 'Enter your note content here...',
      category: 'general',
      tags: [],
      author: 'Current User',
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium',
      status: 'draft'
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'architecture': return '🏗️';
      case 'api': return '🔌';
      case 'frontend': return '🎨';
      case 'backend': return '⚙️';
      case 'deployment': return '🚀';
      case 'bugfix': return '🐛';
      case 'feature': return '✨';
      default: return '📝';
    }
  };

  return (
    <div className={`developer-notes-panel ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Developer Notes</h1>
        <p className="text-gray-600 dark:text-gray-400">Knowledge management and documentation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Notes List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            {/* Search and Filters */}
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              />
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="general">General</option>
                <option value="architecture">Architecture</option>
                <option value="api">API</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="deployment">Deployment</option>
                <option value="bugfix">Bug Fix</option>
                <option value="feature">Feature</option>
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <button
                onClick={handleCreateNote}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                + Create Note
              </button>
            </div>

            {/* Notes List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  onClick={() => handleNoteSelect(note)}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedNote?.id === note.id
                      ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {note.title}
                    </h3>
                    <span className="text-lg">{getCategoryIcon(note.category)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{note.category}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(note.priority)}`}>
                      {note.priority}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {note.updatedAt.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Note Editor */}
        <div className="lg:col-span-2">
          {selectedNote ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              {/* Note Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedNote.title}
                  </h2>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>By {selectedNote.author}</span>
                    <span>Updated {selectedNote.updatedAt.toLocaleDateString()}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedNote.priority)}`}>
                      {selectedNote.priority}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleEditNote}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Note Content */}
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  {selectedNote.content}
                </pre>
              </div>

              {/* Tags */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedNote.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Select a Note
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a note from the sidebar to view its content, or create a new note to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};