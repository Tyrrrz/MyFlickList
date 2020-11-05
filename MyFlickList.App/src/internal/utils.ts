export function trimEnd(str: string, end: string) {
  let temp = str;

  while (temp.endsWith(end)) {
    temp = temp.substr(0, temp.length - end.length);
  }

  return temp;
}

export function isAbsoluteUrl(url: string) {
  return /^[a-z][a-z\d+\-.]*:/iu.test(url);
}

export function getAbsoluteUrl(baseUrl: string, url: string) {
  return new URL(url, baseUrl).toString();
}

export function slugify(value: string) {
  return value.replaceAll(/[\s&/\\#,+()$~%.'":*?<>{}]/g, '_');
}
