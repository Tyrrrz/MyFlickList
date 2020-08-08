export function isAbsoluteUrl(url: string) {
  return /^[a-z][a-z\d+\-.]*:/iu.test(url);
}
