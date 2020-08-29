import React, { useState } from 'react';
import { matchPath, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import ProfilePage from './pages/auth/ProfilePage';
import RegisterPage from './pages/auth/RegisterPage';
import FlickPage from './pages/catalog/FlickPage';
import NewFlicksPage from './pages/catalog/NewFlicksPage';
import RequestFlickPage from './pages/catalog/RequestFlickPage';
import SearchFlicksPage from './pages/catalog/SearchFlicksPage';
import TaggedFlicksPage from './pages/catalog/TaggedFlicksPage';
import TagsPage from './pages/catalog/TagsPage';
import TopFlicksPage from './pages/catalog/TopFlicksPage';
import TrendingFlicksPage from './pages/catalog/TrendingFlicksPage';
import CreditsPage from './pages/CreditsPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import Link from './shared/Link';
import Meta from './shared/Meta';
import useTracking from './shared/useTracking';

function Header() {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');

  // Don't render search box on the search page
  const searchVisible = !matchPath(history.location.pathname, '/catalog/flicks/search');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" href="/">
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
            <Link className="nav-link" href="/">
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" href="/profile">
              Profile
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
              <Link className="dropdown-item" href="/catalog/flicks/top">
                Top
              </Link>
              <Link className="dropdown-item" href="/catalog/flicks/trending">
                Trending
              </Link>
              <Link className="dropdown-item" href="/catalog/flicks/new">
                New
              </Link>
              <Link className="dropdown-item" href="/catalog/flicks/search">
                Search
              </Link>
              <Link className="dropdown-item" href="/catalog/flicks/request">
                Add
              </Link>
              <Link className="dropdown-item" href="/catalog/tags">
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
            history.push(`/catalog/flicks/search?query=${searchQuery}`);
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

export default function App() {
  useTracking();

  return (
    <div className="min-vh-100 vw-70 mx-auto d-flex flex-column" style={{ maxWidth: '70rem' }}>
      <Meta />
      <Header />

      <main className="flex-grow-1">
        <Switch>
          <Route path="/catalog/flicks/top" exact component={TopFlicksPage} />
          <Route path="/catalog/flicks/trending" exact component={TrendingFlicksPage} />
          <Route path="/catalog/flicks/new" exact component={NewFlicksPage} />
          <Route path="/catalog/flicks/search" exact component={SearchFlicksPage} />
          <Route path="/catalog/flicks/request" exact component={RequestFlickPage} />
          <Route path="/catalog/flicks/:flickId" exact component={FlickPage} />
          <Route path="/catalog/tags/:tagName" exact component={TaggedFlicksPage} />
          <Route path="/catalog/tags" exact component={TagsPage} />
          <Route path="/catalog" exact render={() => <Redirect to="/catalog/flicks/top" />} />

          <Route path="/profile/login" exact component={LoginPage} />
          <Route path="/profile/register" exact component={RegisterPage} />
          <Route path="/profile" exact component={ProfilePage} />

          <Route path="/credits" exact component={CreditsPage} />

          <Route path="/" exact component={HomePage} />

          <Route path="*" component={NotFoundPage} />
        </Switch>
      </main>

      <footer className="mt-3 mb-1 p-2 text-center">
        <Link href="https://twitter.com/Tyrrrz">Twitter</Link>
        {' • '}
        <Link href="https://discord.gg/hgVa7qS">Discord</Link>
        {' • '}
        <Link href="https://tyrrrz.me/donate">Donate</Link>
        {' • '}
        <Link href="https://github.com/Tyrrrz/MyFlickList">Source</Link>
        {' • '}
        <Link href="/credits">Credits</Link>
      </footer>
    </div>
  );
}
