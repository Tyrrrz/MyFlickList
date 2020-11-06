import config from './config';
import { getAbsoluteUrl } from './utils';

export function getFileUrl(fileId: number) {
  if (!fileId) {
    return undefined;
  }

  return getAbsoluteUrl(config.apiUrl, `/files/${fileId}`);
}
