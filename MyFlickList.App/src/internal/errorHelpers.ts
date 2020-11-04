interface NormalizedError {
  title: string;
  details?: string;
  validationErrors?: Record<string, string[]>;
  code?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function castToString(x: any) {
  if (typeof x === 'string') {
    return x;
  }

  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function castToNumber(x: any) {
  if (typeof x === 'number') {
    return x;
  }

  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function castToObject(x: any) {
  if (typeof x === 'object') {
    return x as Record<string, unknown>;
  }

  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeError(error: any) {
  const title =
    castToString(error.title) ||
    castToString(error.name) ||
    castToString(error) ||
    'Unknown error has occurred';

  const details = castToString(error.detail) || castToString(error.message);
  const validationErrors = castToObject(error.errors) as Record<string, string[]> | undefined;
  const code = castToNumber(error.status);

  return <NormalizedError>{ title, details, validationErrors, code };
}
