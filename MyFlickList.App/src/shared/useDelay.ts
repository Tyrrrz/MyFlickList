import { useEffect, useState } from 'react';

export default function useDelay(delayMs: number) {
  const [isTriggered, setIsTriggered] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsTriggered(true), delayMs);

    return () => clearTimeout(timeout);
  }, [delayMs]);

  return isTriggered;
}
