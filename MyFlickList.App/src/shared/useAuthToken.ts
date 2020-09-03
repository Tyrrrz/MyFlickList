import useLocalStorageEntry from './useLocalStorageEntry';

export default function useAuthToken() {
  return useLocalStorageEntry('auth-token');
}
