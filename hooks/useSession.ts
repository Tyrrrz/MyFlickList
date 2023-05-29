import { useSession as useRawSession } from 'next-auth/react';
import { Session } from '~/pages/api/auth/[...nextauth]';

// Custom hook that coerces the session into our own type
const useSession = () => {
  const { data, status, ...session } = useRawSession();

  const actualData = status === 'authenticated' ? (data as Session) : null;

  return {
    ...session,
    data: actualData,
    status
  };
};

export default useSession;
