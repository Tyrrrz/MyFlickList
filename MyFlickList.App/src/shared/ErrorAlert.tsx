import React from 'react';

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
    return x as object;
  }

  return undefined;
}

interface ResolvedError {
  title: string;
  details?: string;
  validationErrors?: Record<string, string[]>;
  code?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveError(error: any): ResolvedError {
  const title =
    castToString(error.title) ||
    castToString(error.name) ||
    castToString(error) ||
    'Unknown error has occurred';

  const details = castToString(error.detail) || castToString(error.message);
  const validationErrors = castToObject(error.errors) as Record<string, string[]> | undefined;
  const code = castToNumber(error.status);

  return { title, details, validationErrors, code };
}

interface ErrorHandlerProps {
  error?: unknown;
}

export default function ErrorAlert({ error }: ErrorHandlerProps) {
  // Don't render anything if there's no error
  if (!error) return <></>;

  const resolvedError = resolveError(error);

  return (
    <div className="px-4 py-3 border rounded border-red-400 bg-red-100 text-red-700">
      <div className="font-bold">{resolvedError.title}</div>

      {resolvedError.details && <div>{resolvedError.details}</div>}

      {resolvedError.validationErrors && (
        <ul>
          {Object.entries(resolvedError.validationErrors).map(([, values]) =>
            values.map((value, i) => <li key={value + i}>{value}</li>)
          )}
        </ul>
      )}

      {resolvedError.code && <div className="text-sm italic">Code: {resolvedError.code}</div>}
    </div>
  );
}
