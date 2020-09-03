import { useEffect, useState } from 'react';

export default function useDelay(delayMs: number) {
  const [isTriggered, setIsTriggered] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsTriggered(true), delayMs);

    return () => window.clearTimeout(timeout);
  }, [delayMs]);

  return isTriggered;
}
