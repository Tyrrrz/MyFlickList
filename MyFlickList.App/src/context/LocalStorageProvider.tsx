import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react';

type LocalStorage = Record<string, string | undefined>;

interface LocalStorageContextValue {
  localStorage: LocalStorage;
  setLocalStorage: Dispatch<SetStateAction<LocalStorage>>;
}

// Used when there is no provider in the tree
const dummyContextValue: LocalStorageContextValue = {
  localStorage: {},
  setLocalStorage: () => {
    // Do nothing
  }
};

export const LocalStorageContext = createContext<LocalStorageContextValue>(dummyContextValue);

interface LocalStorageProviderProps {
  children?: React.ReactNode;
}

export default function LocalStorageProvider({ children }: LocalStorageProviderProps) {
  const [localStorage, setLocalStorage] = useState<LocalStorage>({
    ...window.localStorage
  });

  useEffect(() => {
    window.localStorage.clear();

    Object.entries(localStorage).forEach(([key, value]) => {
      if (typeof value !== 'undefined') {
        window.localStorage.setItem(key, value);
      }
    });
  }, [localStorage]);

  return (
    <LocalStorageContext.Provider value={{ localStorage, setLocalStorage }}>
      {children}
    </LocalStorageContext.Provider>
  );
}
