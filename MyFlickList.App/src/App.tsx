import React, { useState } from 'react';
import { matchPath, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import NewFlicks from './pages/catalog/NewFlicks';
import RequestFlick from './pages/catalog/RequestFlick';
import SearchFlicks from './pages/catalog/SearchFlicks';
import TopFlicks from './pages/catalog/TopFlicks';
import TrendingFlicks from './pages/catalog/TrendingFlicks';
import ViewFlick from './pages/catalog/ViewFlick';
import Credits from './pages/Credits';
import Home from './pages/Home';
import Link from './shared/Link';
import Meta from './shared/Meta';
import useTracking from './shared/useTracking';

function Header() {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');

  // Don't render search box on the search page, it looks weird with two search box
  const searchVisible = !matchPath(history.location.pathname, '/catalog/flicks/search');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" href="/">
        MyFlickList
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

function Footer() {
  return (
    <footer className="mt-3 mb-1 p-2 text-center">
      <Link href="https://twitter.com/Tyrrrz">Twitter</Link>
      {' • '}
      <Link href="https://tyrrrz.me/donate">Donate</Link>
      {' • '}
      <Link href="https://github.com/Tyrrrz/MyFlickList">Source</Link>
      {' • '}
      <Link href="/credits">Credits</Link>
    </footer>
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
          <Route path="/catalog/flicks/top" component={TopFlicks} />
          <Route path="/catalog/flicks/trending" component={TrendingFlicks} />
          <Route path="/catalog/flicks/new" component={NewFlicks} />
          <Route path="/catalog/flicks/search" component={SearchFlicks} />
          <Route path="/catalog/flicks/request" component={RequestFlick} />
          <Route path="/catalog/flicks/:flickId" component={ViewFlick} />
          <Route path="/catalog" render={() => <Redirect to="/catalog/flicks/top" />} />
          <Route path="/credits" component={Credits} />
          <Route path="/" component={Home} />
        </Switch>
      </main>

      <Footer />
    </div>
  );
}
