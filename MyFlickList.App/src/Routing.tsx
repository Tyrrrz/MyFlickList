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
      <Route exact path={routes.search.template} component={SearchPage} />

      <Route exact path={routes.auth.signIn.template} component={SignInPage} />
      <Route exact path={routes.auth.signOut.template} component={SignOutPage} />
      <Route exact path={routes.auth.signUp.template} component={SignUpPage} />

      <Route exact path={routes.flicks.all.template} component={FlicksPage} />
      <Route exact path={routes.flicks.add.template} component={AddFlickPage} />
      <Route exact path={routes.flicks.specific.template} component={FlickPage} />

      <Route exact path={routes.profiles.specific.template} component={ProfilePage} />
      <Route exact path={routes.profiles.current.template} component={ProfilePage} />
      <Route exact path={routes.profiles.edit.template} component={EditProfilePage} />
      <Route exact path={routes.profiles.addFlick.template} component={AddFlickEntryPage} />
      <Route exact path={routes.profiles.editFlick.template} component={EditFlickEntryPage} />
      <Route exact path={routes.profiles.deleteFlick.template} component={DeleteFlickEntryPage} />

      <Route exact path={routes.misc.credits.template} component={CreditsPage} />
      <Route exact path={routes.misc.feedback.template} component={FeedbackPage} />
      <Route exact path={routes.misc.donate.template} component={DonatePage} />

      <Route path="*" component={NotFoundPage} />
    </Switch>
  );
}
