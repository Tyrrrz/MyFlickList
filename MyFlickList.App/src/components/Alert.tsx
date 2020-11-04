import classnames from 'classnames';
import React from 'react';

type AlertType = 'info' | 'error';

function getBorderClass(kind: AlertType) {
  if (kind === 'error') {
    return 'border-red-400';
  }

  return 'border-blue-400';
}

function getBackgroundClass(kind: AlertType) {
  if (kind === 'error') {
    return 'bg-red-100';
  }

  return 'bg-blue-100';
}

function getTextClass(kind: AlertType) {
  if (kind === 'error') {
    return 'text-red-700';
  }

  return 'text-blue-700';
}

interface AlertProps {
  className?: string;
  type?: AlertType;
  title?: string;
  message?: string;
  sub?: string;
  children?: React.ReactNode;
}

export default function Alert({
  className,
  type = 'info',
  title,
  message,
  sub,
  children
}: AlertProps) {
  return (
    <div
      className={classnames(
        className,
        'p-4',
        'border',
        'rounded',
        getBorderClass(type),
        getBackgroundClass(type),
        getTextClass(type)
      )}
    >
      {title && <div className="font-semibold">{title}</div>}
      {message && <div>{message}</div>}
      {children}
      {sub && <div className="text-sm italic">{sub}</div>}
    </div>
  );
}
