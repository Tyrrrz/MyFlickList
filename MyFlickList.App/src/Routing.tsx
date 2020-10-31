import React from 'react';
import { Route, Switch } from 'react-router';
import { route } from 'route-descriptor';
import { FlickOrder } from './infra/api.generated';
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
import EditProfilePage from './pages/profiles/EditProfilePage';
import ProfilePage from './pages/profiles/ProfilePage';
import UpdateFlickEntryPage from './pages/profiles/UpdateFlickEntryPage';
import SearchPage from './pages/search/SearchPage';

interface PaginationParams {
  page?: number;
}

interface FlicksParams extends PaginationParams {
  order?: FlickOrder;
  filterTag?: string;
}

interface FlickParams {
  flickId: number;
  flickTitle?: string; // only used for human-friendly URLs
}

interface SearchParams {
  query?: string;
}

interface ProfileParams {
  profileId: number;
  profileName?: string; // only used for human-friendly URLs
}

export const routes = {
  flickAdd: route('/flicks/add'),
  flick: route<FlickParams>('/flicks/:flickId/:flickTitle?'),
  flicks: route<FlicksParams>('/flicks'),
  search: route<SearchParams>('/search'),
  profileUpdateFlickEntry: route<ProfileParams>('/profiles/:profileId/:profileName?/flicks/add'),
  profileEdit: route<ProfileParams>('/profiles/:profileId/:profileName?/edit'),
  profile: route<ProfileParams>('/profiles/:profileId/:profileName?'),
  signIn: route('/auth/signin'),
  signOut: route('/auth/signout'),
  signUp: route('/auth/signup'),
  credits: route('/misc/credits'),
  feedback: route('/misc/feedback'),
  donate: route('/misc/donate'),
  home: route('/')
};

export default function Routing() {
  return (
    <Switch>
      <Route exact path={routes.flickAdd.template} component={AddFlickPage} />
      <Route exact path={routes.flick.template} component={FlickPage} />
      <Route exact path={routes.flicks.template} component={FlicksPage} />
      <Route exact path={routes.search.template} component={SearchPage} />
      <Route
        exact
        path={routes.profileUpdateFlickEntry.template}
        component={UpdateFlickEntryPage}
      />
      <Route exact path={routes.profileEdit.template} component={EditProfilePage} />
      <Route exact path={routes.profile.template} component={ProfilePage} />
      <Route exact path={routes.signIn.template} component={SignInPage} />
      <Route exact path={routes.signOut.template} component={SignOutPage} />
      <Route exact path={routes.signUp.template} component={SignUpPage} />
      <Route exact path={routes.credits.template} component={CreditsPage} />
      <Route exact path={routes.feedback.template} component={FeedbackPage} />
      <Route exact path={routes.donate.template} component={DonatePage} />
      <Route exact path={routes.home.template} component={HomePage} />
      <Route path="*" component={NotFoundPage} />
    </Switch>
  );
}
