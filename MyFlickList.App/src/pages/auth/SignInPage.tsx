import classnames from 'classnames';
import React from 'react';
import { Redirect } from 'react-router';
import Card from '../../components/Card';
import Form from '../../components/Form';
import FormButton from '../../components/FormButton';
import FormInput from '../../components/FormInput';
import Link from '../../components/Link';
import Page from '../../components/Page';
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
      <Card className={classnames(['w-1/2', 'mx-auto'])}>
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
            Sign in
          </FormButton>
        </Form>
      </Card>

      <Card className={classnames(['w-1/2', 'mx-auto', 'text-lg', 'text-center'])}>
        Don&apos;t have a profile yet? <Link href={routes.auth.signUp()}>Sign up</Link> now
      </Card>
    </Page>
  );
}
