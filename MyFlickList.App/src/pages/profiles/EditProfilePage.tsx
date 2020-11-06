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
import useQuery from '../../context/useQuery';
import api from '../../internal/api';
import routes from '../../routes';

interface FormValues {
  isPublic?: boolean;
  location?: string;
  bio?: string;
  externalLinks?: string[];
}

export default function EditProfilePage() {
  const history = useHistory();
  const auth = useAuth();
  const queryCache = useQueryCache();

  const profileId = auth.token?.getProfileId() || -1;

  const profile = useQuery(() => api.profiles(auth.token?.value).getProfile(profileId), [
    'profile',
    profileId
  ]);

  // If not signed in, redirect to sign in page
  if (!auth.token) {
    return <Redirect to={routes.auth.signIn()} />;
  }

  const defaultFormValues: FormValues = { ...profile };

  return (
    <Page title="Edit Profile">
      <Section title="Edit Profile">
        <Form
          defaultValues={defaultFormValues}
          onSubmit={async (data) => {
            await api.profiles(auth.token?.value).putProfile(profile.id, data);

            queryCache.clear();
            history.push(routes.profiles.current());
          }}
        >
          <FormInput name="name" label="Name" disabled />

          <FormSelect
            name="isPublic"
            label="Profile privacy"
            options={[
              { label: 'Public', value: true },
              { label: 'Private', value: false }
            ]}
          />

          <FormInput name="location" label="Location" placeholder="Bag End, Shire" />

          <FormTextArea name="bio" label="Bio" placeholder="Lorem ipsum dolor sit amet..." />

          <FormTextArea name="externalLinks" label="External links" />

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
