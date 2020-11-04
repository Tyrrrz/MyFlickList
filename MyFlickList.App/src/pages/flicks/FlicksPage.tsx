import classnames from 'classnames';
import React from 'react';
import { FiCalendar, FiFilm, FiStar } from 'react-icons/fi';
import Card from '../../components/Card';
import Link from '../../components/Link';
import Page from '../../components/Page';
import Pagination from '../../components/Pagination';
import TagLink from '../../components/TagLink';
import useAuth from '../../context/useAuth';
import useParams from '../../context/useParams';
import useQuery from '../../context/useQuery';
import api from '../../internal/api';
import { GetFlicksOrder } from '../../internal/api.generated';
import {
  formatKind,
  formatRating,
  formatYears,
  getCoverImageUrl
} from '../../internal/flickHelpers';
import { slugify } from '../../internal/utils';
import routes from '../../routes';

export default function FlicksPage() {
  const { order, tag, page } = useParams();
  const auth = useAuth();

  const pageNumber = Number(page) || 1;

  const flicks = useQuery(
    () => api.flicks(auth.token?.value).getFlicks(order as GetFlicksOrder, tag, pageNumber),
    ['flicks', order, tag, pageNumber]
  );

  // TODO: bug in `route-descriptor` makes `undefined` appear as a string

  return (
    <Page title={order ? `${order} Flicks` : 'Flicks'}>
      <Card>
        {flicks.items.map((flick) => (
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
        ))}

        <Pagination
          currentPage={pageNumber}
          lastPage={flicks.totalPages}
          getPageHref={(p) => routes.flicks.all({ order: order as GetFlicksOrder, tag, page: p })}
        />
      </Card>
    </Page>
  );
}
