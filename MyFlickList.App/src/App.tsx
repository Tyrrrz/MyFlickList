import React, { useState } from 'react';
import { matchPath, useHistory } from 'react-router-dom';
import PageRouter, { routes } from './pages/PageRouter';
import Link from './shared/Link';
import useTracking from './shared/useTracking';

function Header() {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');

  // Don't render search box on the search page
  const searchVisible = !matchPath(history.location.pathname, routes.catalogFlicksSearch());

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" href={routes.home()}>
        <img className="align-top" src="/logo.png" alt="Logo" width={32} height={32} />{' '}
        <span>MyFlickList</span>
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarCollapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" href={routes.home()}>
              Home
            </Link>
          </li>

          <li className="nav-item dropdown">
            <Link
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              href="#"
            >
              Catalog
            </Link>

            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <Link className="dropdown-item" href={routes.catalogFlicksTop()}>
                Top
              </Link>
              <Link className="dropdown-item" href={routes.catalogFlicksTrending()}>
                Trending
              </Link>
              <Link className="dropdown-item" href={routes.catalogFlicksNew()}>
                New
              </Link>
              <Link className="dropdown-item" href={routes.catalogFlicksSearch()}>
                Search
              </Link>
              <Link className="dropdown-item" href={routes.catalogFlicksRequest()}>
                Add
              </Link>
              <Link className="dropdown-item" href={routes.catalogTags()}>
                Tags
              </Link>
            </div>
          </li>
        </ul>
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
