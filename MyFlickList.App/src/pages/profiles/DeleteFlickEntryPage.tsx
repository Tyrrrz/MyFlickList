import React from 'react';
import { useQueryCache } from 'react-query';
import { Redirect, useHistory } from 'react-router';
import Card from '../../components/Card';
import Form from '../../components/Form';
import FormButton from '../../components/FormButton';
import Page from '../../components/Page';
import useAuth from '../../context/useAuth';
import useParams from '../../context/useParams';
import useQuery from '../../context/useQuery';
import api from '../../internal/api';
import routes from '../../routes';

export default function DeleteFlickEntryPage() {
  const history = useHistory();
  const { flickId } = useParams();
  const auth = useAuth();
  const queryCache = useQueryCache();

  const profileId = auth.token?.getProfileId() || -1;

  const flickEntry = useQuery(
    () => api.profiles(auth.token?.value).getFlickEntry(profileId, Number(flickId)),
    ['flickEntry', profileId, flickId]
  );

  // If not signed in, redirect to sign in page
  if (!auth.token) {
    return <Redirect to={routes.auth.signIn()} />;
  }

  return (
    <Page title="Profile - Remove Flick">
      <Card>
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
            Are you sure you want to remove{' '}
            <span className="font-semibold">{flickEntry.flickTitle}</span> from your profile?
          </p>

          <div className="flex flex-row items-center space-x-2">
            <FormButton isSubmit={true}>Delete</FormButton>

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
      </Card>
    </Page>
  );
}
