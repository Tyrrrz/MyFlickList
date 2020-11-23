import classnames from 'classnames';
import React from 'react';
import { FiTv } from 'react-icons/fi';
import { useHistory } from 'react-router';
import Form from './components/Form';
import FormButton from './components/FormButton';
import FormInput from './components/FormInput';
import HStack from './components/HStack';
import Link from './components/Link';
import Separator from './components/Separator';
import useAuth from './context/useAuth';
import routes from './routes';

export default function Header() {
  return (
    <header className={classnames(['flex', 'flex-row', 'items-center'])}>
      {/* Brand */}
      <div>
        <Link className="text-2xl text-black tracking-wide" href={routes.home()} underline="never">
          <HStack>
            <FiTv />
            <div className="ml-2">MyFlickList</div>
          </HStack>
        </Link>
      </div>

      {/* Separator */}
      <Separator type="vertical" />

      {/* Navigation */}
      <nav className="text-xl space-x-4">
        <Link href={routes.flicks.all({})} underline="hover">
          Flicks
        </Link>
        <Link href={routes.flicks.all({})} underline="hover">
          Characters
        </Link>
        <Link href={routes.flicks.all({})} underline="hover">
          Actors
        </Link>
        <Link href={routes.flicks.all({})} underline="hover">
          Network
        </Link>
      </nav>

      {/* Spacing */}
      <div className="flex-grow" />

      {/* Profile */}
      <nav className="mx-4 text-xl">
        <HeaderProfileSection />
      </nav>

      {/* Search */}
      <div>
        <HeaderSearchForm />
      </div>
    </header>
  );
}

function HeaderProfileSection() {
  const auth = useAuth();

  // Not signed in
  if (!auth.token) {
    return (
      <Link className={classnames('font-semibold')} href={routes.auth.signIn()} underline="hover">
        Sign in
      </Link>
    );
  }

  // Signed in
  return (
    <HStack>
      <Link
        className={classnames('font-semibold')}
        href={routes.profiles.current()}
        underline="hover"
      >
        {auth.token.getUsername()}
      </Link>

      <Link href={routes.auth.signOut()} underline="hover">
        Sign out
      </Link>
    </HStack>
  );
}

function HeaderSearchForm() {
  const history = useHistory();

  return (
    <Form
      defaultValues={{ query: '' }}
      onSubmit={(data) => {
        history.push(routes.search({ query: data.query }));
      }}
    >
      <FormInput type="search" name="query" placeholder="Search" />
      <FormButton hidden />
    </Form>
  );
}
