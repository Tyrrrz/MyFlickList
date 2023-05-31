import { DateString } from '~/pages/api/shared';

type SharedProps = {
  id: number;
  coverImageId?: number;
  title: string;
  originalTitle?: string;
  tags?: string[];
};

type TvSharedProps = SharedProps & {
  external?: {
    imdb: {
      id: string;
      rating: number;
    };
    netflix?: {
      id: string;
    };
  };
};

export type Movie = TvSharedProps & {
  releaseDate?: DateString;
  runtimeMinutes?: number;
};

export type Series = TvSharedProps & {
  firstAirDate?: DateString;
  lastAirDate?: DateString;
  runtimeMinutes?: number;
  episodes?: number;
};

export type CatalogItem = Movie | Series;
