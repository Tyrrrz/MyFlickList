import { FlickKind, IFlickListingResponse } from './api.generated';
import config from './config';
import { getAbsoluteUrl } from './utils';

export class FlickHelper {
  readonly flick: IFlickListingResponse;

  constructor(flick: IFlickListingResponse) {
    this.flick = flick;
  }

  getImageUrl() {
    if (!this.flick.imageId) {
      return '/images/poster-placeholder.png';
    }

    return getAbsoluteUrl(config.apiUrl, '/catalog/images/' + this.flick.imageId);
  }

  formatKind() {
    if (
      this.flick.kind === FlickKind.Series &&
      this.flick.episodeCount &&
      this.flick.episodeCount > 0
    ) {
      return `${this.flick.kind} (${this.flick.episodeCount} episodes)`;
    }

    return this.flick.kind.toString();
  }

  formatRating() {
    if (!this.flick.externalRating) return '--';

    const formatter = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });

    return formatter.format(this.flick.externalRating);
  }

  formatDate() {
    if (!this.flick.premiereDate) return '--';

    const formatter = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    if (this.flick.kind === FlickKind.Movie) {
      return formatter.format(this.flick.premiereDate);
    }

    if (this.flick.finaleDate) {
      return (
        formatter.format(this.flick.premiereDate) + ' - ' + formatter.format(this.flick.finaleDate)
      );
    }

    return formatter.format(this.flick.premiereDate) + ' - ...';
  }

  formatRuntime() {
    if (!this.flick.runtime) return '--';

    const components = this.flick.runtime.split(':');
    const hours = Number(components[0]);
    const minutes = Number(components[1]);

    if (hours + minutes <= 0) return '--';

    const hoursSuffix = hours === 1 ? 'hour' : 'hours';
    const minutesSuffix = minutes === 1 ? 'minute' : 'minutes';

    const hoursPart = hours > 0 ? `${hours} ${hoursSuffix}` : '';
    const minutesPart = minutes > 0 ? `${minutes} ${minutesSuffix}` : '';

    const formatted = [hoursPart, minutesPart].join(' ');

    if (this.flick.kind === FlickKind.Series) {
      return formatted + ' / episode';
    }

    return formatted;
  }

  formatTags() {
    if (!this.flick.tags || this.flick.tags.length <= 0) return '--';

    return this.flick.tags.join(', ');
  }
}
