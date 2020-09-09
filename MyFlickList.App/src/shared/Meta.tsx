import React from 'react';
import { Helmet } from 'react-helmet';
import config from '../infra/config';
import { getAbsoluteUrl } from '../infra/utils';

interface MetaProps {
  title?: string;
  description?: string;
  keywords?: string[];
  imageUrl?: string;
  contentType?: 'website' | 'profile' | 'video.movie' | 'video.tv_show';
}

export default function Meta({ title, description, keywords, imageUrl, contentType }: MetaProps) {
  const defaults = {
    title: 'MyFlickList',
    description: 'Social cataloging app',
    imageUrl: '/logo.png',
    contentType: 'website'
  };

  const actual = {
    title: title ? `${title} - ${defaults.title}` : defaults.title,
    description: description || defaults.description,
    keywords: keywords?.join(', '),
    imageUrl: getAbsoluteUrl(config.appUrl, imageUrl || defaults.imageUrl),
    contentType: contentType || defaults.contentType
  };

  return (
    <Helmet>
      <title>{actual.title}</title>

      <meta name="description" content={actual.description} />
      <meta name="keywords" content={actual.keywords} />

      <meta property="og:title" content={actual.title} />
      <meta property="og:description" content={actual.description} />
      <meta name="og:type" content={actual.contentType} />
      <meta property="og:image" content={actual.imageUrl} />

      <meta name="twitter:title" content={actual.title} />
      <meta name="twitter:site" content="@My_Flick_List" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:description" content={actual.description} />
      <meta name="twitter:image" content={actual.imageUrl} />
    </Helmet>
  );
}
