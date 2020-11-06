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
      <Route exact path={routes.home.path} component={HomePage} />
      <Route exact path={routes.search.path} component={SearchPage} />

      <Route exact path={routes.auth.signIn.path} component={SignInPage} />
      <Route exact path={routes.auth.signOut.path} component={SignOutPage} />
      <Route exact path={routes.auth.signUp.path} component={SignUpPage} />

      <Route exact path={routes.flicks.all.path} component={FlicksPage} />
      <Route exact path={routes.flicks.add.path} component={AddFlickPage} />
      <Route exact path={routes.flicks.specific.path} component={FlickPage} />

      <Route exact path={routes.profiles.specific.path} component={ProfilePage} />
      <Route exact path={routes.profiles.current.path} component={ProfilePage} />
      <Route exact path={routes.profiles.edit.path} component={EditProfilePage} />
      <Route exact path={routes.profiles.addFlick.path} component={AddFlickEntryPage} />
      <Route exact path={routes.profiles.editFlick.path} component={EditFlickEntryPage} />
      <Route exact path={routes.profiles.deleteFlick.path} component={DeleteFlickEntryPage} />

      <Route exact path={routes.misc.credits.path} component={CreditsPage} />
      <Route exact path={routes.misc.feedback.path} component={FeedbackPage} />
      <Route exact path={routes.misc.donate.path} component={DonatePage} />

      <Route path="*" component={NotFoundPage} />
    </Switch>
  );
}
