import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Session {
  id: string;
  name: string;
  type: 'development' | 'testing' | 'production';
  status: 'active' | 'paused' | 'completed';
  startTime: Date;
  endTime?: Date;
  metadata: Record<string, unknown>;
}

export interface SessionContextType {
  sessions: Session[];
  activeSession: Session | null;
  addSession: (session: Omit<Session, 'id' | 'startTime'>) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  removeSession: (id: string) => void;
  setActiveSession: (session: Session | null) => void;
  getSession: (id: string) => Session | undefined;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  const addSession = (sessionData: Omit<Session, 'id' | 'startTime'>) => {
    const newSession: Session = {
      ...sessionData,
      id: Date.now().toString(),
      startTime: new Date()
    };

    setSessions(prev => [...prev, newSession]);
  };

  const updateSession = (id: string, updates: Partial<Session>) => {
    setSessions(prev => 
      prev.map(session => 
        session.id === id 
          ? { ...session, ...updates }
          : session
      )
    );

    // Update active session if it's the one being updated
    if (activeSession?.id === id) {
      setActiveSession(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const removeSession = (id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
    
    // Clear active session if it's the one being removed
    if (activeSession?.id === id) {
      setActiveSession(null);
    }
  };

  const getSession = (id: string): Session | undefined => {
    return sessions.find(session => session.id === id);
  };

  const value: SessionContextType = {
    sessions,
    activeSession,
    addSession,
    updateSession,
    removeSession,
    setActiveSession,
    getSession
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}; 