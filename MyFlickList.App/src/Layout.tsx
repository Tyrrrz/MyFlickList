import React, { useState } from 'react';
import { FiTv } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { AuthTokenHelper } from './infra/helpers';
import Routing, { routes } from './pages/Routing';
import Link from './shared/Link';
import useAuthToken from './shared/useAuthToken';
import useTracking from './shared/useTracking';

function HeaderUserBox() {
  const [token] = useAuthToken();

  // Not signed in
  if (!token) {
    return (
      <Link className="text-xl font-semibold" href={routes.signIn.href()}>
        Sign in
      </Link>
    );
  }

  const tokenHelper = new AuthTokenHelper(token);

  // TODO: use actual avatar
  const avatarUrl = `https://robohash.org/${tokenHelper.getProfileId()}_${tokenHelper.getUsername()}.png?size=300x300`;

  // Signed in
  return (
    <Link
      className="inline-flex items-center text-xl font-semibold"
      href={routes.profile.href({
        profileId: tokenHelper.getProfileId(),
        profileName: tokenHelper.getUsername()
      })}
    >
      <img
        className="rounded-full shadow-outline"
        alt="Avatar"
        width={32}
        height={32}
        src={avatarUrl}
      />

      <span className="ml-3 truncate">{tokenHelper.getUsername()}</span>
    </Link>
  );
}

function HeaderSearchBox() {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        history.push(routes.search.href({ query: searchQuery }));
      }}
    >
      <input
        className="mt-1 rounded-full"
        type="search"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <input type="submit" hidden />
    </form>
  );
}

function Header() {
  return (
    <header className="flex flex-row items-center py-4">
      {/* Brand */}
      <div className="mr-3 flex-grow">
        <Link
          className="inline-flex items-center text-4xl text-black tracking-wide font-normal"
          href={routes.home.href()}
        >
          <FiTv /> <span className="ml-2">MyFlickList</span>
        </Link>
      </div>

      {/* Profile */}
      <HeaderUserBox />

      {/* Separator */}
      <div className="w-px h-8 mt-1 mx-4 border border-gray-200" />

      {/* Navigation */}
      <nav className="mr-6 text-xl space-x-4">
        <Link className="font-normal" href={routes.flicks.href()}>
          Flicks
        </Link>
        <Link className="font-normal" href={routes.flicks.href()}>
          Characters
        </Link>
        <Link className="font-normal" href={routes.flicks.href()}>
          Actors
        </Link>
        <Link className="font-normal" href={routes.flicks.href()}>
          Network
        </Link>
      </nav>

      {/* Search */}
      <HeaderSearchBox />
    </header>
  );
}

function PageContainer() {
  return (
    <main className="flex-grow py-8">
      <Routing />
    </main>
  );
}

function Footer() {
  return (
    <footer className="m-4 mx-auto uppercase text-sm">
      <Link className="font-normal" href="https://twitter.com/My_Flick_List">
        Twitter
      </Link>
      {' • '}
      <Link className="font-normal" href="https://discord.gg/hgVa7qS">
        Discord
      </Link>
      {' • '}
      <Link className="font-normal" href="https://github.com/Tyrrrz/MyFlickList">
        Source
      </Link>
      {' • '}
      <Link className="font-normal" href={routes.credits.href()}>
        Credits
      </Link>
      {' • '}
      <Link className="font-normal" href="https://tyrrrz.me/donate">
        Donate
      </Link>
    </footer>
  );
}

export default function Layout() {
  useTracking();

  return (
    <div className="flex flex-col container min-h-screen mx-auto">
      <Header />
      <PageContainer />
      <Footer />
    </div>
  );
}
