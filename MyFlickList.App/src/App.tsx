import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import useTracking from './shared/useTracking';
import Meta from './shared/Meta';
import Link from './shared/Link';
import FlickInfo from './pages/catalog/FlickInfo';
import { TopFlicksIndex, TrendingFlicksIndex, NewFlicksIndex } from './pages/catalog/FlicksIndex';
import Home from './pages/Home';

function Header() {
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
          <Nav.Link href="/catalog/flicks/top" as={Link}>
            Top
          </Nav.Link>
          <Nav.Link href="/catalog/flicks/trending" as={Link}>
            Trending
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
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
          <Route path="/catalog/flicks/top">
            <TopFlicksIndex />
          </Route>
          <Route path="/catalog/flicks/trending">
            <TrendingFlicksIndex />
          </Route>
          <Route path="/catalog/flicks/new">
            <NewFlicksIndex />
          </Route>
          <Route path="/catalog/flicks/:flickId">
            <FlickInfo />
          </Route>
          <Route path="/catalog">
            <Redirect to="/catalog/flicks/top" />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </main>

      <Footer />
    </div>
  );
}
