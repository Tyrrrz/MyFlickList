import React from 'react';
import { Route, Switch } from 'react-router';
import SignInPage from './pages/auth/SignInPage';
import SignOutPage from './pages/auth/SignOutPage';
import SignUpPage from './pages/auth/SignUpPage';
import AddFlickPage from './pages/flicks/AddFlickPage';
import FlickPage from './pages/flicks/FlickPage';
import FlicksPage from './pages/flicks/FlicksPage';
import HomePage from './pages/HomePage';
import CreditsPage from './pages/misc/CreditsPage';
import DonatePage from './pages/misc/DonatePage';
import FeedbackPage from './pages/misc/FeedbackPage';
import NotFoundPage from './pages/NotFoundPage';
import AddFlickEntryPage from './pages/profiles/AddFlickEntryPage';
import DeleteFlickEntryPage from './pages/profiles/DeleteFlickEntryPage';
import EditFlickEntryPage from './pages/profiles/EditFlickEntryPage';
import EditProfilePage from './pages/profiles/EditProfilePage';
import ProfilePage from './pages/profiles/ProfilePage';
import SearchPage from './pages/search/SearchPage';
import routes from './routes';

export default function Routing() {
  return (
    <Switch>
      <Route exact path={routes.home.template} component={HomePage} />

      {/* Auth */}
      <Route exact path={routes.signIn.template} component={SignInPage} />
      <Route exact path={routes.signOut.template} component={SignOutPage} />
      <Route exact path={routes.signUp.template} component={SignUpPage} />

      {/* Flicks */}
      <Route exact path={routes.flicks.template} component={FlicksPage} />
      <Route exact path={routes.flick.template} component={FlickPage} />
      <Route exact path={routes.flickAdd.template} component={AddFlickPage} />

      {/* Profiles */}
      <Route exact path={routes.profile.template} component={ProfilePage} />
      <Route exact path={routes.profileEdit.template} component={EditProfilePage} />
      <Route exact path={routes.profileAddFlickEntry.template} component={AddFlickEntryPage} />
      <Route exact path={routes.profileEditFlickEntry.template} component={EditFlickEntryPage} />
      <Route
        exact
        path={routes.profileDeleteFlickEntry.template}
        component={DeleteFlickEntryPage}
      />

      {/* Search */}
      <Route exact path={routes.search.template} component={SearchPage} />

      {/* Misc */}
      <Route exact path={routes.credits.template} component={CreditsPage} />
      <Route exact path={routes.feedback.template} component={FeedbackPage} />
      <Route exact path={routes.donate.template} component={DonatePage} />

      {/* Fallback */}
      <Route path="*" component={NotFoundPage} />
    </Switch>
  );
}
