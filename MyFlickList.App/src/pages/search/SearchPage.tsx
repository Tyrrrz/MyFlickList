import React from 'react';
import { useForm } from 'react-hook-form';
import { FiCalendar, FiFilm, FiMapPin, FiStar } from 'react-icons/fi';
import { useHistory } from 'react-router';
import api from '../../infra/api';
import { FlickHelper, ProfileHelper } from '../../infra/helpers';
import { slugify } from '../../infra/utils';
import routes from '../../routes';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';
import useParams from '../../shared/useParams';
import useQuery from '../../shared/useQuery';

function SearchResultsSection({ query }: { query: string }) {
  const results = useQuery(() => api.search().search(query), ['search', query]);

  const isNothingFound =
    (!results.flicks || results.flicks.length <= 0) &&
    (!results.profiles || results.profiles.length <= 0);

  return (
    <div className="space-y-5">
      {/* Flicks */}
      {results.flicks && results.flicks.length > 0 && (
        <div className="space-y-3">
          {/* Count */}
          <div className="flex flex-row items-center space-x-5">
            <div className="text-2xl font-thin tracking-wide">Flicks ({results.flicks.length})</div>{' '}
            <hr className="flex-grow" />
          </div>

          {results.flicks.map((flick) => (
            <div key={flick.id} className="flex flex-row space-x-3">
              <div>
                <img
                  className="rounded shadow"
                  alt={flick.title}
                  src={new FlickHelper(flick).getCoverImageUrl()}
                  width={100}
                  height={150}
                />
              </div>

              <div>
                <div>
                  <Link
                    className="text-lg tracking-wide truncate"
                    href={routes.flick({
                      flickId: flick.id,
                      flickTitle: slugify(flick.title)
                    })}
                  >
                    {flick.title}
                  </Link>
                </div>

                {/* Kind */}
                <div className="flex flex-row items-center space-x-1">
                  <FiFilm strokeWidth={1} />
                  <div>{new FlickHelper(flick).formatKind()}</div>
                </div>

                {/* Years */}
                <div className="flex flex-row items-center space-x-1">
                  <FiCalendar strokeWidth={1} />
                  <div>{new FlickHelper(flick).formatYears()}</div>
                </div>

                {/* Rating */}
                <div className="flex flex-row items-center space-x-1">
                  <FiStar strokeWidth={1} />
                  <div>{new FlickHelper(flick).formatRating()}</div>
                </div>

                {/* Tags */}
                <div className="mt-1 flex flex-row space-x-1">
                  {flick.tags?.map((tag) => (
                    <div key={tag} className="px-3 py-1 rounded bg-gray-200 text-sm">
                      <Link href={routes.flicks({ filterTag: tag })}>{tag}</Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Profiles */}
      {results.profiles && results.profiles.length > 0 && (
        <div className="space-y-3">
          {/* Count */}
          <div className="flex flex-row items-center space-x-5">
            <div className="text-2xl font-thin tracking-wide">
              Profiles ({results.profiles.length})
            </div>{' '}
            <hr className="flex-grow" />
          </div>

          {results.profiles.map((profile) => (
            <div key={profile.id} className="flex flex-row space-x-3">
              <div>
                <img
                  className="rounded-full shadow"
                  alt={profile.name}
                  src={new ProfileHelper(profile).getAvatarImageUrl()}
                  width={100}
                  height={100}
                />
              </div>

              <div>
                <div>
                  <Link
                    className="text-lg tracking-wide truncate"
                    href={routes.profile({
                      profileId: profile.id,
                      profileName: profile.name
                    })}
                  >
                    {profile.name}
                  </Link>
                </div>

                {/* Location */}
                <div className="flex flex-row items-center space-x-1">
                  <FiMapPin strokeWidth={1} />
                  <div>{profile.location || '--'}</div>
                </div>

                {/* Watched */}
                <div className="flex flex-row items-center space-x-1">
                  <FiFilm strokeWidth={1} />
                  <div>123 watched</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Postscriptum */}
      <div>
        {isNothingFound && <p className="text-3xl text-center font-thin">Nothing found :(</p>}

        <p className="text-lg text-center font-thin">
          Didn&apos;t find what you were looking for? You can{' '}
          <Link href={routes.flickAdd()}>request</Link> a new flick to be added.
        </p>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const history = useHistory();
  const { query } = useParams();
  const { register, handleSubmit } = useForm({ defaultValues: { query } });

  return (
    <div>
      <Meta title="Search" />

      <div className="w-3/4 mx-auto space-y-5">
        <h1>Search</h1>

        <form
          className="w-full flex flex-row text-xl space-x-2"
          onSubmit={handleSubmit((data) => {
            history.push(routes.search({ query: data.query as string }));
          })}
        >
          <input
            className="flex-grow"
            type="search"
            name="query"
            autoFocus
            required
            placeholder="Search"
            ref={register}
          />

          <button type="submit">Search</button>
        </form>

        {query && <SearchResultsSection query={query} />}
      </div>
    </div>
  );
}
