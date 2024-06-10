'use client';

import { createContext, useContext, useState } from 'react';
import { subYears } from 'date-fns';

interface AppContextType {
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
  packages: string[];
  setPackages: (packages: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
};

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [startDate, setStartDate] = useState<Date>(subYears(new Date(), 1));
  const [endDate, setEndDate] = useState(new Date());
  const [packages, setPackages] = useState<string[]>([
    '@sd-jwt/core',
    '@sd-jwt/types',
    '@sd-jwt/decode',
    '@sd-jwt/utils',
    '@sd-jwt/present',
    '@sd-jwt/sd-jwt-vc',
    '@sd-jwt/hash',
    '@sd-jwt/jwt-status-list',
    '@sd-jwt/crypto-nodejs',
    '@sd-jwt/crypto-browser',
  ]);

  return (
    <AppContext.Provider
      value={{
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        packages,
        setPackages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
