import classnames from 'classnames';
import React from 'react';
import { Redirect } from 'react-router';
import Form from '../../components/Form';
import FormButton from '../../components/FormButton';
import FormInput from '../../components/FormInput';
import Link from '../../components/Link';
import Page from '../../components/Page';
import Section from '../../components/Section';
import useAuth from '../../context/useAuth';
import api from '../../internal/api';
import routes from '../../routes';

export default function SignInPage() {
  const auth = useAuth();

  // If already signed in, redirect to profile
  if (auth.token) {
    return <Redirect to={routes.profiles.current()} />;
  }

  return (
    <Page title="Sign in">
      <Section className={classnames(['w-1/2', 'mx-auto'])} title="Sign in">
        <Form
          defaultValues={{
            username: '',
            password: ''
          }}
          onSubmit={async (data) => {
            const res = await api.auth().signIn(data);
            auth.setToken(res.token);
          }}
        >
          <FormInput
            className={classnames(['w-full'])}
            name="username"
            placeholder="Username"
            autoFocus
          />

          <FormInput
            className={classnames(['w-full'])}
            type="password"
            name="password"
            placeholder="Password"
          />

          <FormButton className={classnames(['w-full'])} isSubmit={true}>
            Submit
          </FormButton>
        </Form>
      </Section>

      <Section className={classnames(['w-1/2', 'mx-auto', 'text-lg', 'text-center'])}>
        Don&apos;t have a profile yet? <Link href={routes.auth.signUp()}>Sign up</Link> now
      </Section>
    </Page>
  );
}
