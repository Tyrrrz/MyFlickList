import classnames from 'classnames';
import React from 'react';
import { FiCalendar, FiFilm, FiMapPin, FiStar } from 'react-icons/fi';
import { useHistory } from 'react-router';
import Card from '../../components/Card';
import Form from '../../components/Form';
import FormButton from '../../components/FormButton';
import FormInput from '../../components/FormInput';
import Link from '../../components/Link';
import Page from '../../components/Page';
import TagLink from '../../components/TagLink';
import useParam from '../../context/useParam';
import useQuery from '../../context/useQuery';
import api from '../../internal/api';
import {
  formatKind,
  formatRating,
  formatYears,
  getCoverImageUrl
} from '../../internal/flickHelpers';
import { getAvatarImageUrl } from '../../internal/profileHelpers';
import { slugify } from '../../internal/utils';
import routes from '../../routes';

function SearchResultsSection({ query }: { query: string }) {
  const results = useQuery(() => api.search().search(query), ['search', query]);

  return (
    <>
      {/* Flicks */}
      <Card>
        {/* Count */}
        <div className={classnames('text-2xl', 'font-thin', 'tracking-wide')}>
          Flicks ({results.flicks?.length || 0})
        </div>

        {results.flicks && results.flicks.length > 0 ? (
          results.flicks.map((flick) => (
            <div key={flick.id} className={classnames('flex', 'space-x-3')}>
              <div>
                <img
                  className={classnames('rounded', 'shadow')}
                  alt={flick.title}
                  src={getCoverImageUrl(flick)}
                  width={100}
                  height={150}
                />
              </div>

              <div className={classnames('flex', 'flex-col')}>
                <div>
                  <Link
                    className={classnames('text-lg', 'font-semibold', 'truncate')}
                    href={routes.flicks.specific({
                      flickId: flick.id,
                      flickTitle: slugify(flick.title)
                    })}
                    underline={false}
                  >
                    {flick.title}
                  </Link>
                </div>

                {/* Kind */}
                <div className={classnames('flex', 'items-center', 'space-x-1')}>
                  <FiFilm strokeWidth={1} />
                  <div>{formatKind(flick)}</div>
                </div>

                {/* Years */}
                <div className={classnames('flex', 'items-center', 'space-x-1')}>
                  <FiCalendar strokeWidth={1} />
                  <div>{formatYears(flick)}</div>
                </div>

                {/* Rating */}
                <div className={classnames('flex', 'items-center', 'space-x-1')}>
                  <FiStar strokeWidth={1} />
                  <div>{formatRating(flick)}</div>
                </div>

                {/* Spacer */}
                <div className={classnames('flex-grow')} />

                {/* Tags */}
                <div className={classnames('flex', 'items-center', 'space-x-1')}>
                  {flick.tags?.map((tag) => (
                    <TagLink key={tag} href={routes.flicks.all({ tag })}>
                      {tag}
                    </TagLink>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Not found</div>
        )}
      </Card>

      {/* Profiles */}
      <Card>
        {/* Count */}
        <div className={classnames('text-2xl', 'font-thin', 'tracking-wide')}>
          Profiles ({results.profiles?.length || 0})
        </div>

        {results.profiles && results.profiles.length > 0 ? (
          results.profiles.map((profile) => (
            <div key={profile.id} className={classnames('flex', 'space-x-3')}>
              <div>
                <img
                  className={classnames('rounded-full', 'shadow')}
                  alt={profile.name}
                  src={getAvatarImageUrl(profile)}
                  width={100}
                  height={100}
                />
              </div>

              <div>
                <div>
                  <Link
                    className={classnames('text-lg', 'font-semibold', 'truncate')}
                    href={routes.profiles.specific({
                      profileId: profile.id,
                      profileName: profile.name
                    })}
                    underline={false}
                  >
                    {profile.name}
                  </Link>
                </div>

                {/* Location */}
                <div className={classnames('flex', 'items-center', 'space-x-1')}>
                  <FiMapPin strokeWidth={1} />
                  <div>{profile.location || '--'}</div>
                </div>

                {/* Watched */}
                <div className={classnames('flex', 'items-center', 'space-x-1')}>
                  <FiFilm strokeWidth={1} />
                  <div>{profile.flickEntriesCount} entries</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Not found</div>
        )}
      </Card>
    </>
  );
}

export default function SearchPage() {
  const query = useParam('query');
  const history = useHistory();

  return (
    <Page title="Search">
      <Card>
        <Form
          orientation="horizontal"
          defaultValues={{ query }}
          onSubmit={(data) => {
            history.push(routes.search({ query: data.query }));
          }}
        >
          <FormInput
            className={classnames('flex-grow')}
            type="search"
            name="query"
            autoFocus
            required
            placeholder="Search"
          />

          <FormButton isSubmit={true}>Search</FormButton>
        </Form>

        <div className={classnames('text-lg', 'text-center', 'font-thin')}>
          Can&apos;t find a specific flick? You can <Link href={routes.flicks.add()}>request</Link>{' '}
          it to be added
        </div>
      </Card>

      {query && <SearchResultsSection query={query} />}
    </Page>
  );
}
