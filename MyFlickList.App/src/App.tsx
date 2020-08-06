import React, { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { matchPath, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import FlickInfo from './pages/catalog/FlickInfo';
import FlickRequest from './pages/catalog/FlickRequest';
import { NewFlicksIndex, TopFlicksIndex, TrendingFlicksIndex } from './pages/catalog/FlicksIndex';
import FlicksSearch from './pages/catalog/FlicksSearch';
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
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/" as={Link}>
        MyFlickList
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar" />
      <Navbar.Collapse id="navbar">
        <Nav className="mr-auto">
          <Nav.Link href="/" as={Link}>
            Home
          </Nav.Link>
          <NavDropdown title="Catalog" id="catalog-dropdown">
            <NavDropdown.Item href="/catalog/flicks/top" as={Link}>
              Top
            </NavDropdown.Item>
            <NavDropdown.Item href="/catalog/flicks/trending" as={Link}>
              Trending
            </NavDropdown.Item>
            <NavDropdown.Item href="/catalog/flicks/new" as={Link}>
              New
            </NavDropdown.Item>
            <NavDropdown.Item href="/catalog/flicks/search" as={Link}>
              Search
            </NavDropdown.Item>
            <NavDropdown.Item href="/catalog/flicks/request" as={Link}>
              Add
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>

      {searchVisible && (
        <form
          className="form-inline my-2 my-lg-0"
          onSubmit={(e) => {
            e.preventDefault();
            history.push(`/catalog/flicks/search?query=${searchQuery}`);
          }}
        >
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
            Search
          </button>
        </form>
      )}
    </Navbar>
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
          <Route path="/catalog/flicks/top" component={TopFlicksIndex} />
          <Route path="/catalog/flicks/trending" component={TrendingFlicksIndex} />
          <Route path="/catalog/flicks/new" component={NewFlicksIndex} />
          <Route path="/catalog/flicks/search" component={FlicksSearch} />
          <Route path="/catalog/flicks/request" component={FlickRequest} />
          <Route path="/catalog/flicks/:flickId" component={FlickInfo} />
          <Route path="/catalog" render={() => <Redirect to="/catalog/flicks/top" />} />
          <Route path="/" component={Home} />
        </Switch>
      </main>

      <Footer />
    </div>
  );
}
