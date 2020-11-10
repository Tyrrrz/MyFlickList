import config from './config';
import { getAbsoluteUrl } from './utils';

export function getFileUrl(fileId: number) {
  return getAbsoluteUrl(config.apiUrl, `/files/${fileId}`);
}
