import { useSession as useRawSession } from 'next-auth/react';
import { Session } from '~/pages/api/auth/[...nextauth]';

// Custom hook that coerces the session into our own type
const useSession = () => {
  const { data, status, update } = useRawSession();

  return {
    data: data as Session,
    status,
    update
  };
};

export default useSession;
