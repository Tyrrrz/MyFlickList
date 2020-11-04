import { useContext } from 'react';
import { LocalStorageContext } from './LocalStorageProvider';

export default function useLocalStorage() {
  return useContext(LocalStorageContext);
}
