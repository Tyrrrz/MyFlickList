import React, { DependencyList } from 'react';
import ErrorHandler from './ErrorHandler';
import LoadingSpinner from './LoadingSpinner';
import useAsyncStateEffect from './useAsyncStateEffect';
import useDelay from './useDelay';

function Busy() {
  // Only show spinner after a delay, to prevent flickering
  const spinnerVisible = useDelay(200);
  if (!spinnerVisible) return <></>;

  return (
    <div className="mt-5 text-center">
      <LoadingSpinner kind="pulse" size={5} />
    </div>
  );
}

function Error({ error }: { error: unknown }) {
  return <ErrorHandler error={error} />;
}

interface DataLoaderProps<T> {
  getData: () => Promise<T>;
  deps?: DependencyList | undefined;
  render: (data: T) => React.ReactNode;
  renderBusy?: () => React.ReactNode | undefined;
  renderError?: (error: unknown) => React.ReactNode | undefined;
}

export default function DataLoader<T>({
  getData,
  deps = [],
  render,
  renderBusy = () => <Busy />,
  renderError = (error) => <Error error={error} />
}: DataLoaderProps<T>) {
  const [data, error] = useAsyncStateEffect(getData, deps);

  if (error) {
    return <>{renderError(error)}</>;
  }

  if (data) {
    return <>{render(data)}</>;
  }

  return <>{renderBusy()}</>;
}
