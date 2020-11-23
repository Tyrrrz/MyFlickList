import classnames from 'classnames';
import React from 'react';
import { useQueryCache } from 'react-query';
import { Redirect, useHistory } from 'react-router';
import posterFallbackAsset from '../../assets/poster-fallback.png';
import Form from '../../components/Form';
import FormButton from '../../components/FormButton';
import FormInput from '../../components/FormInput';
import FormSelect from '../../components/FormSelect';
import FormTextArea from '../../components/FormTextArea';
import Link from '../../components/Link';
import Page from '../../components/Page';
import Section from '../../components/Section';
import useApi from '../../context/useApi';
import useAuth from '../../context/useAuth';
import useParam from '../../context/useParam';
import useQuery from '../../context/useQuery';
import { ProfileFlickEntryStatus } from '../../internal/api.generated';
import { getFileUrl } from '../../internal/fileHelpers';
import { slugify } from '../../internal/utils';
import routes from '../../routes';

interface FormValues {
  status?: ProfileFlickEntryStatus;
  episodeCount?: number;
  rating?: number;
  review?: string;
}

export default function EditFlickEntryPage() {
  const flickId = useParam('flickId', Number);

  const history = useHistory();
  const auth = useAuth();

  const api = useApi();
  const queryCache = useQueryCache();

  const profileId = auth.token?.getProfileId() || -1;

  const flick = useQuery(() => api.flicks.getFlick(flickId), ['flick', flickId]);

  const flickEntry = useQuery(async () => {
    try {
      return await api.profiles.getFlickEntry(profileId!, flickId);
    } catch {
      return null;
    }
  }, ['flickEntry', profileId, flickId]);

  // If not signed in, redirect to sign in page
  if (!auth.token) {
    return <Redirect to={routes.auth.signIn()} />;
  }

  const defaultFormValues: FormValues = {
    ...flickEntry
  };

  return (
    <Page title={`Entry - ${flick.title}`}>
      <Section title="Edit Flick Entry">
        <div className={classnames('flex', 'space-x-3')}>
          {/* Cover */}
          <div style={{ minWidth: 'max-content' }}>
            <img
              className={classnames('rounded-md', 'shadow')}
              alt={flick.title}
              src={flick.coverImageId ? getFileUrl(flick.coverImageId) : posterFallbackAsset}
              width={70}
              height={105}
            />
          </div>

          {/* Metadata */}
          <div>
            <div className={classnames('text-xl')}>
              <Link
                href={routes.flicks.one({
                  flickId: flick.id,
                  flickTitle: slugify(flick.title)
                })}
                underline="hover"
              >
                {flick.title}
              </Link>
            </div>
            <div>{flick.kind}</div>
            {flick.episodeCount && <div>{flick.episodeCount} episodes</div>}
          </div>
        </div>

        <Form
          defaultValues={defaultFormValues}
          onSubmit={async (data) => {
            await api.profiles.putFlickEntry(profileId, flickId, data);

            queryCache.clear();

            history.push(
              routes.flicks.one({ flickId: flick.id, flickTitle: slugify(flick.title) })
            );
          }}
        >
          <FormSelect
            name="status"
            label="Status"
            options={[
              { label: 'Plan to watch', value: 'Planned' },
              { label: 'Currently watching', value: 'Watching' },
              { label: 'Already watched', value: 'Watched' },
              { label: 'Dropped', value: 'Dropped' }
            ]}
          />

          {flick.episodeCount && (
            <FormInput
              type="number"
              name="episodeCount"
              label="Episodes"
              min={0}
              max={flick.episodeCount}
              placeholder="How many episodes have you watched so far?"
            />
          )}

          <FormSelect
            name="rating"
            label="Rating"
            options={[
              { label: '--', value: null },
              { label: '🟊 1/10 — Appalling', value: 1 },
              { label: '🟊 2/10 — Horrible', value: 2 },
              { label: '🟊 3/10 — Very Bad', value: 3 },
              { label: '🟊 4/10 — Bad', value: 4 },
              { label: '🟊 5/10 — Average', value: 5 },
              { label: '🟊 6/10 — Fine', value: 6 },
              { label: '🟊 7/10 — Good', value: 7 },
              { label: '🟊 8/10 — Very Good', value: 8 },
              { label: '🟊 9/10 — Great', value: 9 },
              { label: '🟊 10/10 — Masterpiece', value: 10 }
            ]}
          />

          <FormTextArea
            name="review"
            label="Review"
            placeholder={`What did you think about ${flick.title}?`}
          />

          <div className="flex flex-row items-center space-x-2">
            <FormButton type="submit">Save</FormButton>

            <FormButton
              onClick={(e) => {
                e.preventDefault();
                history.goBack();
              }}
            >
              Cancel
            </FormButton>
          </div>
        </Form>
      </Section>
    </Page>
  );
}
