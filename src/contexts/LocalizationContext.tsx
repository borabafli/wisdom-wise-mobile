import React, { createContext, useContext, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type TFunction = (key: string) => string;

interface LocalizationContextType {
  t: TFunction;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

interface LocalizationProviderProps {
  children: ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <LocalizationContext.Provider value={{ t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};