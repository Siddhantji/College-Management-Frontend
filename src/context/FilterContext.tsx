import React, { createContext, useContext, useState } from 'react';

interface FilterContextType {
  clearFilters: () => void;
  shouldClearFilters: boolean;
  setShouldClearFilters: (value: boolean) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shouldClearFilters, setShouldClearFilters] = useState(false);

  const clearFilters = () => {
    setShouldClearFilters(true);
  };

  return (
    <FilterContext.Provider value={{ clearFilters, shouldClearFilters, setShouldClearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
