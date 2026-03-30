import { createContext, useContext, useState, useCallback } from 'react';

const GenerationContext = createContext(null);

export function GenerationProvider({ children }) {
  // Track all ongoing generations: { id, type, jobTitle, companyName, status, analysisId }
  const [generations, setGenerations] = useState([]);

  const addGeneration = useCallback((generation) => {
    setGenerations(prev => [...prev, { 
      ...generation, 
      id: Date.now(),
      status: 'generating',
      startedAt: new Date()
    }]);
  }, []);

  const updateGeneration = useCallback((id, updates) => {
    setGenerations(prev => 
      prev.map(g => g.id === id ? { ...g, ...updates } : g)
    );
  }, []);

  const removeGeneration = useCallback((id) => {
    setGenerations(prev => prev.filter(g => g.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setGenerations(prev => prev.filter(g => g.status === 'generating'));
  }, []);

  return (
    <GenerationContext.Provider value={{ 
      generations, 
      addGeneration, 
      updateGeneration, 
      removeGeneration,
      clearCompleted
    }}>
      {children}
    </GenerationContext.Provider>
  );
}

export function useGeneration() {
  const context = useContext(GenerationContext);
  if (!context) {
    throw new Error('useGeneration must be used within GenerationProvider');
  }
  return context;
}
