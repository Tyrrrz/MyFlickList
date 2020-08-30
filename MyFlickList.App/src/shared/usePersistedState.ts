import { useEffect, useState } from 'react';

function getLocalStorageValue(key: string) {
  const json = localStorage.getItem(key);
  return json ? JSON.parse(json) : undefined;
}

function setLocalStorageValue(key: string, value: unknown) {
  const json = JSON.stringify(value);
  localStorage.setItem(key, json);
}

function removeLocalStorageValue(key: string) {
  localStorage.removeItem(key);
}

export default function usePersistedState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(getLocalStorageValue(key) || defaultValue);

  useEffect(() => {
    if (value) {
      setLocalStorageValue(key, value);
    } else {
      removeLocalStorageValue(key);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
