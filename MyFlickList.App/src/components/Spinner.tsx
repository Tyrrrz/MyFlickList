import classnames from 'classnames';
import React from 'react';
import { FiLoader } from 'react-icons/fi';

export default function Spinner() {
  return <FiLoader className={classnames('mx-auto', 'text-xl', 'animate-spin')} />;
}
