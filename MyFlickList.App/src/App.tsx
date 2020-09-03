import React, { useState } from 'react';
import { matchPath, useHistory } from 'react-router-dom';
import { FlickOrder } from './infra/api.generated';
import { AuthTokenHelper } from './infra/helpers';
import PageRouter, { routes } from './pages/PageRouter';
import Link from './shared/Link';
import useAuthToken from './shared/useAuthToken';
import useTracking from './shared/useTracking';

function Header() {
  const history = useHistory();
  const [token] = useAuthToken();

  const [searchQuery, setSearchQuery] = useState('');

  // Don't render search box on the search page
  const isSearchVisible = !matchPath(history.location.pathname, routes.search());

  const tokenHelper = token ? new AuthTokenHelper(token) : undefined;

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand mr-auto" href={routes.home()}>
          <img className="align-top" src="/logo.png" alt="Logo" width={32} height={32} />{' '}
          <span>MyFlickList</span>
        </Link>

        <div className="navbar-nav">
          {token && tokenHelper && (
            <>
              <Link
                className="nav-link font-weight-bold"
                href={routes.profile(tokenHelper.getProfileId())}
              >
                {tokenHelper.getUsername()}
              </Link>
              <Link className="nav-link" href={routes.signOut()}>
                Sign out
              </Link>
            </>
          )}
          {!token && (
            <Link className="nav-link" href={routes.signIn()}>
              Sign in
            </Link>
          )}
        </div>
      </nav>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="navbar-nav mr-auto">
          <Link className="nav-link" href={routes.flicks({ order: FlickOrder.Top })}>
            Top
          </Link>
          <Link className="nav-link" href={routes.flicks({ order: FlickOrder.Trending })}>
            Trending
          </Link>
          <Link className="nav-link" href={routes.flicks({ order: FlickOrder.New })}>
            New
          </Link>
          <Link className="nav-link" href={routes.flickAdd()}>
            Request
          </Link>
        </div>

        {isSearchVisible && (
          <form
            className="my-2 form-inline fade-unfocused"
            onSubmit={(e) => {
              e.preventDefault();
              history.push(routes.search({ query: searchQuery }));
            }}
          >
            <input
              className="form-control"
              type="search"
              aria-label="Search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" hidden />
          </form>
        )}
      </nav>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-3 mb-1 p-2 text-center">
      <Link href="https://twitter.com/Tyrrrz">Twitter</Link>
      {' • '}
      <Link href="https://discord.gg/hgVa7qS">Discord</Link>
      {' • '}
      <Link href="https://tyrrrz.me/donate">Donate</Link>
      {' • '}
      <Link href="https://github.com/Tyrrrz/MyFlickList">Source</Link>
      {' • '}
      <Link href={routes.credits()}>Credits</Link>
    </footer>
  );
}

export default function App() {
  useTracking();

  return (
    <div className="min-vh-100 vw-70 mx-auto d-flex flex-column" style={{ maxWidth: '70rem' }}>
      <Header />

      <main className="flex-grow-1">
        <PageRouter />
      </main>

      <Footer />
    </div>
  );
}
