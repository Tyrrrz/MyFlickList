import React from 'react';
import MdiIcon from '@mdi/react';
import { IconProps } from '@mdi/react/dist/IconProps';

export default function Icon(props: IconProps) {
  return (
    <MdiIcon
      size="1.3rem"
      style={{
        marginTop: '0.18rem',
        verticalAlign: 'top'
      }}
      {...props}
    />
  );
}
