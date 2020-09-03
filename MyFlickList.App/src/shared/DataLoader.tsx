import React, { DependencyList } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import ErrorHandler from './ErrorHandler';
import useAsyncStateEffect from './useAsyncStateEffect';
import useDelay from './useDelay';

function Busy() {
  // Only show spinner after a delay, to prevent flickering
  const isSpinnerVisible = useDelay(200);
  if (!isSpinnerVisible) return <></>;

  return (
    <div className="p-12 text-center">
      <AiOutlineLoading3Quarters className="mx-auto animate-spin text-6xl text-blue-600" />
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
