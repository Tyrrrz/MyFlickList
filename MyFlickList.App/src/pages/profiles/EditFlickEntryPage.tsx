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
      <Section title="Profile - Edit Flick">
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
              { label: 'Unrated', value: null },
              { label: 'Horrible', value: 0 },
              { label: 'Average', value: 0.5 },
              { label: 'Amazing', value: 1 }
            ]}
          />

          <FormTextArea name="review" label="Review" />

          <div className="flex flex-row items-center space-x-2">
            <FormButton isSubmit={true}>Add</FormButton>

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
