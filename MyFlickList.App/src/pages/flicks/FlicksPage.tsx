import classnames from 'classnames';
import React from 'react';
import { FiCalendar, FiFilm, FiStar } from 'react-icons/fi';
import { useHistory } from 'react-router';
import posterFallbackAsset from '../../assets/poster-fallback.png';
import Form from '../../components/Form';
import FormButton from '../../components/FormButton';
import FormInput from '../../components/FormInput';
import Link from '../../components/Link';
import Page from '../../components/Page';
import Pagination from '../../components/Pagination';
import Section from '../../components/Section';
import TagLink from '../../components/TagLink';
import useAuth from '../../context/useAuth';
import useParam from '../../context/useParam';
import useQuery from '../../context/useQuery';
import api from '../../internal/api';
import { getFileUrl } from '../../internal/fileHelpers';
import { formatKind, formatRating, formatYears } from '../../internal/flickHelpers';
import { slugify } from '../../internal/utils';
import routes from '../../routes';

function parseOrder(order?: string) {
  if (order === 'Top' || order === 'Trending' || order === 'New') {
    return order;
  }

  return 'Top';
}

function parsePage(page?: string) {
  const parsed = Number(page);
  if (parsed && parsed >= 1) {
    return parsed;
  }

  return 1;
}

interface FormValues {
  order?: 'Top' | 'Trending' | 'New';
  tag?: string;
}

export default function FlicksPage() {
  const order = useParam('order', parseOrder);
  const tag = useParam('tag');
  const page = useParam('page', parsePage);

  const history = useHistory();
  const auth = useAuth();

  const flicks = useQuery(() => api.flicks(auth.token?.value).getFlicks(order, tag, page), [
    'flicks',
    order,
    tag,
    page
  ]);

  // TODO: form inputs are not properly updated when navigating
  // TODO: replace inputs with selects with autocomplete
  const defaultFormValues: FormValues = { order, tag };

  return (
    <Page title={order ? `${order} Flicks` : 'Flicks'}>
      {/* Parmeters */}
      <Section>
        <Form
          orientation="horizontal"
          defaultValues={defaultFormValues}
          onSubmit={(data) => {
            history.push(routes.flicks.all(data));
          }}
        >
          <FormInput name="order" label="Order" />
          <FormInput name="tag" label="Tag" />
          <FormButton isSubmit={true}>Show</FormButton>
        </Form>
      </Section>

      {/* Flicks */}
      <Section>
        {flicks.items.map((flick) => (
          <div key={flick.id} className={classnames('flex', 'space-x-3')}>
            <div>
              <img
                className={classnames('rounded', 'shadow')}
                alt={flick.title}
                src={flick.coverImageId ? getFileUrl(flick.coverImageId) : posterFallbackAsset}
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

        {/* Page buttons */}
        <Pagination
          currentPage={page}
          lastPage={flicks.totalPages}
          getPageHref={(p) => routes.flicks.all({ order, tag, page: p })}
        />
      </Section>
    </Page>
  );
}
