import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import useTracking from './shared/useTracking';
import Catalog from './Catalog';
import Home from './Home';

export default function App() {
  useTracking();

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/catalog">Catalog</Link>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route path="/catalog">
          <Catalog />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </>
  );
}
