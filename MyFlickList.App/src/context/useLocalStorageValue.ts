import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

export default function useLocalStorageValue(key: string) {
  const { localStorage, setLocalStorage } = useLocalStorage();

  const entry = localStorage[key];

  const setEntry = useCallback(
    (value: string | undefined) => {
      setLocalStorage((current) => ({
        ...current,
        [key]: value
      }));
    },
    [key, setLocalStorage]
  );

  return [entry, setEntry] as const;
}
