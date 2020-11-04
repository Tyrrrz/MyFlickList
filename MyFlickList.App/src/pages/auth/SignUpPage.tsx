import classnames from 'classnames';
import React from 'react';
import { FiAtSign, FiLock, FiUser } from 'react-icons/fi';
import { Redirect, useHistory } from 'react-router';
import Card from '../../components/Card';
import Form from '../../components/Form';
import FormButton from '../../components/FormButton';
import FormInput from '../../components/FormInput';
import Page from '../../components/Page';
import useAuth from '../../context/useAuth';
import api from '../../internal/api';
import routes from '../../routes';

export default function SignUpPage() {
  const history = useHistory();
  const auth = useAuth();

  // If already signed in, redirect to profile
  if (auth.token) {
    return <Redirect to={routes.profiles.current()} />;
  }

  return (
    <Page title="Sign up">
      <Card className={classnames(['w-1/2', 'mx-auto'])}>
        <Form
          defaultValues={{
            username: '',
            email: '',
            password: '',
            passwordConfirm: ''
          }}
          onSubmit={async (data) => {
            if (data.password !== data.passwordConfirm) {
              throw Error('Passwords must match');
            }

            await api.auth().signUp(data);
            history.push(routes.auth.signIn());
          }}
        >
          <FormInput
            type="text"
            name="username"
            icon={<FiUser />}
            label="Username"
            required
            minLength={3}
            maxLength={48}
            pattern="^[a-zA-Z0-9_\-]+$"
            placeholder="john_titor1"
          />

          <FormInput
            type="email"
            name="email"
            icon={<FiAtSign />}
            label="Email"
            required
            minLength={3}
            maxLength={256}
            placeholder="sern@dmail.com"
          />

          <FormInput
            type="password"
            name="password"
            icon={<FiLock />}
            label="Password"
            required
            minLength={6}
            maxLength={1024}
            placeholder="••••••"
          />

          <FormInput
            type="password"
            name="passwordConfirm"
            icon={<FiLock />}
            label="Password (confirm)"
            required
            minLength={6}
            maxLength={1024}
            placeholder="••••••"
          />

          <FormButton className={classnames(['w-full'])} isSubmit={true}>
            Sign up
          </FormButton>
        </Form>
      </Card>
    </Page>
  );
}
