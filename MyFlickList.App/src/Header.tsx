import classnames from 'classnames';
import React from 'react';
import { FiTv } from 'react-icons/fi';
import { useHistory } from 'react-router';
import Form from './components/Form';
import FormButton from './components/FormButton';
import FormInput from './components/FormInput';
import HStack from './components/HStack';
import Link from './components/Link';
import VerticalSeparator from './components/VerticalSeparator';
import useAuth from './context/useAuth';
import routes from './routes';

function HeaderUserBox() {
  const auth = useAuth();

  // Not signed in
  if (!auth.token) {
    return (
      <Link className={classnames('font-semibold')} href={routes.auth.signIn()} underline={false}>
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
        underline={false}
      >
        {auth.token.getUsername()}
      </Link>

      <Link href={routes.auth.signOut()} underline={false}>
        Sign out
      </Link>
    </HStack>
  );
}

function HeaderSearchBox() {
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

export default function Header() {
  return (
    <header className={classnames(['flex', 'flex-row', 'items-center'])}>
      {/* Brand */}
      <div>
        <Link className="text-2xl text-black tracking-wide" href={routes.home()} underline={false}>
          <HStack>
            <FiTv />
            <div className="ml-2">MyFlickList</div>
          </HStack>
        </Link>
      </div>

      {/* Separator */}
      <VerticalSeparator />

      {/* Navigation */}
      <nav className="text-xl space-x-4">
        <Link href={routes.flicks.all({})} underline={false}>
          Flicks
        </Link>
        <Link href={routes.flicks.all({})} underline={false}>
          Characters
        </Link>
        <Link href={routes.flicks.all({})} underline={false}>
          Actors
        </Link>
        <Link href={routes.flicks.all({})} underline={false}>
          Network
        </Link>
      </nav>

      {/* Spacing */}
      <div className="flex-grow" />

      {/* Profile */}
      <nav className="mx-4 text-xl">
        <HeaderUserBox />
      </nav>

      {/* Search */}
      <div>
        <HeaderSearchBox />
      </div>
    </header>
  );
}
