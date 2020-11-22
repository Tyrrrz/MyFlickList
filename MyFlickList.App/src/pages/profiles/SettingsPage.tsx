import React from 'react';
import { FiLock } from 'react-icons/fi';
import { useQueryCache } from 'react-query';
import { Redirect, useHistory } from 'react-router';
import Form from '../../components/Form';
import FormButton from '../../components/FormButton';
import FormInput from '../../components/FormInput';
import Page from '../../components/Page';
import Section from '../../components/Section';
import useAuth from '../../context/useAuth';
import api from '../../internal/api';
import routes from '../../routes';

export default function SettingsPage() {
  const history = useHistory();
  const auth = useAuth();
  const queryCache = useQueryCache();

  // If not signed in, redirect to sign in page
  if (!auth.token) {
    return <Redirect to={routes.auth.signIn()} />;
  }

  return (
    <Page title="Settings">
      <Section title="Settings">
        <Form
          defaultValues={{ oldPassword: '', newPassword: '', newPasswordConfirm: '' }}
          onSubmit={async ({ newPasswordConfirm, ...data }) => {
            if (data.newPassword !== newPasswordConfirm) {
              throw Error('Passwords must match');
            }

            await api.auth(auth.token?.value).changePassword(data);

            queryCache.clear();
            history.push(routes.profiles.current());
          }}
        >
          <FormInput
            type="password"
            name="oldPassword"
            icon={<FiLock />}
            label="Current password"
            required
            minLength={6}
            maxLength={1024}
            placeholder="••••••"
          />

          <FormInput
            type="password"
            name="newPassword"
            icon={<FiLock />}
            label="New password"
            required
            minLength={6}
            maxLength={1024}
            placeholder="••••••"
          />

          <FormInput
            type="password"
            name="newPasswordConfirm"
            icon={<FiLock />}
            label="New password (confirm)"
            required
            minLength={6}
            maxLength={1024}
            placeholder="••••••"
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
