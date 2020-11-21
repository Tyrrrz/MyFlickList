import React from 'react';
import { useQueryCache } from 'react-query';
import { Redirect, useHistory } from 'react-router';
import Form from '../../components/Form';
import FormButton from '../../components/FormButton';
import Page from '../../components/Page';
import Section from '../../components/Section';
import useAuth from '../../context/useAuth';
import useParam from '../../context/useParam';
import useQuery from '../../context/useQuery';
import api from '../../internal/api';
import routes from '../../routes';

export default function DeleteFlickEntryPage() {
  const flickId = useParam('flickId', Number);

  const history = useHistory();
  const auth = useAuth();
  const queryCache = useQueryCache();

  // TODO: clean up
  const profileId = auth.token?.getProfileId() || -1;

  const flickEntry = useQuery(
    () => api.profiles(auth.token?.value).getFlickEntry(profileId, flickId),
    ['flickEntry', profileId, flickId]
  );

  // If not signed in, redirect to sign in page
  if (!auth.token) {
    return <Redirect to={routes.auth.signIn()} />;
  }

  return (
    <Page title={`Entry - ${flickEntry.flickTitle}`}>
      <Section title="Delete Flick Entry">
        <Form
          onSubmit={async () => {
            await api
              .profiles(auth.token?.value)
              .deleteFlickEntry(flickEntry.profileId, flickEntry.flickId);

            queryCache.clear();
            history.push(routes.profiles.current());
          }}
        >
          <p>
            Are you sure you want to delete{' '}
            <span className="font-semibold">{flickEntry.flickTitle}</span> from your profile?
          </p>

          <div className="flex flex-row items-center space-x-2">
            <FormButton type="submit">Delete</FormButton>

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
