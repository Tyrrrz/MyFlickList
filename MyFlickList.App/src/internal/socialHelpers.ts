interface TwitterShareOptions {
  text?: string;
  hashtags?: string;
  related?: string;
  via?: string;
}

export function createTwitterShareLink(url: string, options?: TwitterShareOptions) {
  const optionsDefined =
    options &&
    Object.fromEntries(Object.entries(options).filter(([, value]) => typeof value !== 'undefined'));

  return (
    'https://twitter.com/share?' +
    new URLSearchParams({
      ...optionsDefined,
      url
    }).toString()
  );
}

interface RedditShareOptions {
  title?: string;
}

export function createRedditShareLink(url: string, options?: RedditShareOptions) {
  const optionsDefined =
    options &&
    Object.fromEntries(Object.entries(options).filter(([, value]) => typeof value !== 'undefined'));

  return 'https://reddit.com/submit?' + new URLSearchParams({ ...optionsDefined, url }).toString();
}

interface FacebookShareOptions {
  title?: string;
}

export function createFacebookShareLink(url: string, options?: FacebookShareOptions) {
  const optionsDefined =
    options &&
    Object.fromEntries(Object.entries(options).filter(([, value]) => typeof value !== 'undefined'));

  return (
    'https://facebook.com/share.php?' +
    new URLSearchParams({ ...optionsDefined, u: url }).toString()
  );
}
