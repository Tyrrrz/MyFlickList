import React from 'react';
import ErrorHandler from './ErrorHandler';
import LoadingSpinner from './LoadingSpinner';

interface StateLoaderProps<T> {
  state: T | undefined;
  error: unknown | undefined;
  render: (value: T) => React.ReactNode;
}

export default function StateLoader<T>({ state, error, render }: StateLoaderProps<T>) {
  if (error) return <ErrorHandler error={error} />;
  if (state) return <>{render(state)}</>;

  return <LoadingSpinner />;
}
