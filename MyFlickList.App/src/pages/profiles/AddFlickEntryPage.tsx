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
import api from '../../internal/api';
import { ProfileFlickEntryStatus } from '../../internal/api.generated';
import routes from '../../routes';

interface FormValues {
  flickId: number;
  status?: ProfileFlickEntryStatus;
  episodeCount?: number;
  rating?: number;
  review?: string;
}

export default function AddFlickEntryPage() {
  const history = useHistory();
  const auth = useAuth();
  const queryCache = useQueryCache();

  // If not signed in, redirect to sign in page
  if (!auth.token) {
    return <Redirect to={routes.auth.signIn()} />;
  }

  const profileId = auth.token.getProfileId();

  const defaultFormValues: FormValues = {
    flickId: 0
  };

  return (
    <Page title="Profile - Add Flick">
      <Section title="Profile - Add Flick">
        <Form
          defaultValues={defaultFormValues}
          onSubmit={async ({ flickId, ...data }) => {
            await api.profiles(auth.token?.value).putFlickEntry(profileId, flickId, data);

            queryCache.clear();
            history.push(routes.profiles.current());
          }}
        >
          <FormInput name="flickId" label="Flick ID" required />

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
