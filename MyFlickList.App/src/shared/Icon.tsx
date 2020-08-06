import MdiIcon from '@mdi/react';
import { IconProps } from '@mdi/react/dist/IconProps';
import React from 'react';

export default function Icon(props: IconProps) {
  return <MdiIcon className="mt-1 align-top" size="1.2rem" {...props} />;
}
