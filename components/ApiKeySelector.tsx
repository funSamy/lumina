import React from 'react';

// This component is deprecated as we are using the free Gemini model.
export const ApiKeySelector: React.FC<{ onReady: () => void }> = ({ onReady }) => {
  // Immediately signal ready
  React.useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
};