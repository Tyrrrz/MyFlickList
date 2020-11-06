// TODO: refactor all of this

type Kind = 'Movie' | 'Series';

export function formatKind({ kind, episodeCount }: { kind: Kind; episodeCount?: number }) {
  if (kind === 'Series' && episodeCount && episodeCount > 0) {
    return `${kind} (${episodeCount} eps)`;
  }

  return kind;
}

export function formatRating({
  rating,
  externalRating
}: {
  rating?: number;
  externalRating?: number;
}) {
  const someRating = rating || externalRating;

  if (!someRating) return '--';

  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1
  });

  return formatter.format(someRating);
}

export function formatFirstAired({ firstAired }: { firstAired?: string }) {
  if (!firstAired) return '--';

  const formatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return formatter.format(new Date(firstAired));
}

export function formatLastAired({ lastAired }: { lastAired?: string }) {
  if (!lastAired) return '--';

  const formatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return formatter.format(new Date(lastAired));
}

export function formatDate({
  kind,
  firstAired,
  lastAired
}: {
  kind: Kind;
  firstAired?: string;
  lastAired?: string;
}) {
  if (!firstAired) return '--';

  const formatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  if (kind === 'Movie') {
    return formatter.format(new Date(firstAired));
  }

  if (lastAired) {
    return formatter.format(new Date(firstAired)) + ' - ' + formatter.format(new Date(lastAired));
  }

  return formatter.format(new Date(firstAired)) + ' - ...';
}

export function formatRuntime({ kind, runtime }: { kind: Kind; runtime?: string }) {
  if (!runtime) return '--';

  const components = runtime.split(':');
  const hours = Number(components[0]);
  const minutes = Number(components[1]);

  if (hours + minutes <= 0) return '--';

  const hoursSuffix = hours === 1 ? 'hr' : 'hrs';
  const minutesSuffix = minutes === 1 ? 'min' : 'mins';

  const hoursPart = hours > 0 ? `${hours} ${hoursSuffix}` : '';
  const minutesPart = minutes > 0 ? `${minutes} ${minutesSuffix}` : '';

  const formatted = [hoursPart, minutesPart].join(' ');

  if (kind === 'Series') {
    return formatted + ' / ep';
  }

  return formatted;
}

export function formatYears({
  kind,
  firstAired,
  lastAired
}: {
  kind: Kind;
  firstAired?: string;
  lastAired?: string;
}) {
  if (!firstAired) return '--';

  const firstAiredYear = new Date(firstAired).getUTCFullYear();

  if (!lastAired) {
    if (kind === 'Movie') {
      return `${firstAiredYear}`;
    } else {
      return `${firstAiredYear} —`;
    }
  }

  const lastAiredYear = new Date(lastAired).getUTCFullYear();

  if (firstAiredYear === lastAiredYear) {
    return `${firstAiredYear}`;
  }

  return `${firstAiredYear} — ${lastAiredYear}`;
}
