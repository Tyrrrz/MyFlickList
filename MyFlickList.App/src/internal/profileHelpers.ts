import config from './config';
import { getAbsoluteUrl } from './utils';

export function getAvatarImageUrl({
  id,
  name,
  avatarImageId
}: {
  id: number;
  name: string;
  avatarImageId?: number;
}) {
  if (!avatarImageId) {
    return `https://robohash.org/${id}_${name}.png?size=300x300`;
  }

  return getAbsoluteUrl(config.apiUrl, `/files/${avatarImageId}`);
}
