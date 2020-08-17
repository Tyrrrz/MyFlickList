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
