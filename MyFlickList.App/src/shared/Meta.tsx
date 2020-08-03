import React from 'react';
import { Helmet } from 'react-helmet';

interface Props {
  title?: string | undefined;
  description?: string | undefined;
  imageUrl?: string | undefined;
  contentType?: string | undefined;
}

export default function Meta({ title, description, imageUrl, contentType }: Props) {
  const actualTitle = title ? `${title} - MyFlickList` : `MyFlickList`;
  const actualDescription = description || 'Social cataloging app';

  return (
    <Helmet>
      <title>{actualTitle}</title>
      <meta property="og:title" content={actualTitle} />
      <meta name="twitter:title" content={actualTitle} />

      <meta name="description" content={actualDescription} />
      <meta property="og:description" content={actualDescription} />
      <meta name="twitter:description" content={actualDescription} />

      <meta name="og:type" content={contentType || 'website'} />
      <meta property="og:image" content={imageUrl} />
    </Helmet>
  );
}
