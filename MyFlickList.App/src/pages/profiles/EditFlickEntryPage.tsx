import React from 'react';
import { useQueryCache } from 'react-query';
import { Redirect, useHistory } from 'react-router';
import Form from '../../components/Form';
import FormButton from '../../components/FormButton';
import FormInput from '../../components/FormInput';
import FormSelect from '../../components/FormSelect';
import FormTextArea from '../../components/FormTextArea';
import Page from '../../components/Page';
import Section from '../../components/Section';
import useAuth from '../../context/useAuth';
import useParam from '../../context/useParam';
import useQuery from '../../context/useQuery';
import api from '../../internal/api';
import { ProfileFlickEntryStatus } from '../../internal/api.generated';
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
  const queryCache = useQueryCache();

  const profileId = auth.token?.getProfileId() || -1;

  const flickEntry = useQuery(
    () => api.profiles(auth.token?.value).getFlickEntry(profileId, flickId),
    ['flickEntry', profileId, flickId]
  );

  // If not signed in, redirect to sign in page
  if (!auth.token) {
    return <Redirect to={routes.auth.signIn()} />;
  }

  const defaultFormValues: FormValues = { ...flickEntry };

  return (
    <Page title="Profile - Edit Flick">
      <Section title="Edit Flick">
        <Form
          defaultValues={defaultFormValues}
          onSubmit={async (data) => {
            await api
              .profiles(auth.token?.value)
              .putFlickEntry(flickEntry.profileId, flickEntry.flickId, data);

            queryCache.clear();
            history.push(routes.profiles.current());
          }}
        >
          <FormInput name="flickId" label="Flick ID" disabled />

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

          <FormInput name="episodeCount" label="Episodes" />

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

          <FormTextArea name="review" label="Review" />

          <div className="flex flex-row items-center space-x-2">
            <FormButton isSubmit={true}>Save</FormButton>

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
