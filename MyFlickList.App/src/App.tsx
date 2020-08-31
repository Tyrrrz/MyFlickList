import React, { useState } from 'react';
import { matchPath, useHistory } from 'react-router-dom';
import { AuthTokenHelper } from './infra/helpers';
import PageRouter, { routes } from './pages/PageRouter';
import Link from './shared/Link';
import useAuth from './shared/useAuth';
import useTracking from './shared/useTracking';

function Header() {
  const history = useHistory();
  const { token } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');

  // Don't render search box on the search page
  const searchVisible = !matchPath(history.location.pathname, routes.catalogFlicksSearch());

  const tokenHelper = token ? new AuthTokenHelper(token) : undefined;

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand mr-auto" href={routes.home()}>
          <img className="align-top" src="/logo.png" alt="Logo" width={32} height={32} />{' '}
          <span>MyFlickList</span>
        </Link>

        <div className="navbar-nav">
          {token && (
            <>
              <div className="nav-link font-weight-bold">{tokenHelper?.getUsername()}</div>
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
          <Link className="nav-link" href={routes.catalogFlicksTop()}>
            Top
          </Link>
          <Link className="nav-link" href={routes.catalogFlicksTrending()}>
            Trending
          </Link>
          <Link className="nav-link" href={routes.catalogFlicksNew()}>
            New
          </Link>
          <Link className="nav-link" href={routes.catalogFlicksRequest()}>
            Request
          </Link>
        </div>

        {searchVisible && (
          <form
            className="my-2 form-inline fade-unfocused"
            onSubmit={(e) => {
              e.preventDefault();
              history.push(routes.catalogFlicksSearch(searchQuery));
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
