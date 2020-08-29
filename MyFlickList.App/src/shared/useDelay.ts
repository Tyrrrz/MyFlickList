import { useEffect, useState } from 'react';

export default function useDelay(delayMs: number) {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setTriggered(true), delayMs);

    return () => clearTimeout(timeout);
  }, [delayMs]);

  return triggered;
}
