import React from 'react';
import { Switch, Route } from 'react-router-dom';
import useTracking from './shared/useTracking';
import Link from './shared/Link';
import Catalog from './Catalog';
import Home from './Home';

function Footer() {
  return (
    <footer style={{ padding: '.5em', textAlign: 'center' }}>
      <Link href="https://github.com/Tyrrrz/MyFlickList">Contribute</Link> • <Link href="https://tyrrrz.me/donate">Donate</Link>
    </footer>
  );
}

export default function App() {
  useTracking();

  return (
    <div style={{ minHeight: '100vh', width: '70vw', maxWidth: '70em', margin: 'auto', display: 'flex', flexDirection: 'column' }}>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/catalog">Catalog</Link>
          </li>
        </ul>
      </nav>

      <main style={{ flexGrow: 1 }}>
        <Switch>
          <Route path="/catalog">
            <Catalog />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </main>

      <div>
        <Footer />
      </div>
    </div>
  );
}
