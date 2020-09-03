import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function castToString(x: any) {
  if (typeof x === 'string' || typeof x === 'undefined') {
    return x;
  }

  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function castToNumber(x: any) {
  if (typeof x === 'number' || typeof x === 'undefined') {
    return x;
  }

  return undefined;
}

interface ResolvedError {
  title: string;
  details?: string | undefined;
  code?: number | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveError(error: any): ResolvedError {
  const title =
    castToString(error.title) ||
    castToString(error.name) ||
    castToString(error) ||
    'Unknown error has occurred';

  const details = castToString(error.detail) || castToString(error.message);
  const code = castToNumber(error.status);

  return { title, details, code };
}

interface ErrorHandlerProps {
  error?: unknown | undefined;
}

export default function ErrorHandler({ error }: ErrorHandlerProps) {
  // Don't render anything if there's no error
  if (!error) return <></>;

  const resolvedError = resolveError(error);

  return (
    <div className="px-4 py-3 border rounded border-red-400 bg-red-100 text-red-700">
      <div className="font-bold">{resolvedError.title}</div>

      {resolvedError.details && <div>{resolvedError.details}</div>}

      {resolvedError.code && <div className="text-sm italic">Code: {resolvedError.code}</div>}
    </div>
  );
}
