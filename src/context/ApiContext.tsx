
import React, { createContext } from 'react';

interface ApiContextType {
  geminiApiKey: string | null;
  setGeminiApiKey: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create context with default values
const ApiContext = createContext<ApiContextType>({
  geminiApiKey: null,
  setGeminiApiKey: () => {},
});

export default ApiContext;

// Custom hook to use the API context
export const useApiContext = () => {
  const context = React.useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApiContext must be used within an ApiContextProvider');
  }
  return context;
};
