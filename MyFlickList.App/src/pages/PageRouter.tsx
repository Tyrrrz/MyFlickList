import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { formatQueryParams } from '../infra/utils';
import FlickPage from './catalog/FlickPage';
import NewFlicksPage from './catalog/NewFlicksPage';
import RequestFlickPage from './catalog/RequestFlickPage';
import SearchFlicksPage from './catalog/SearchFlicksPage';
import TaggedFlicksPage from './catalog/TaggedFlicksPage';
import TagsPage from './catalog/TagsPage';
import TopFlicksPage from './catalog/TopFlicksPage';
import TrendingFlicksPage from './catalog/TrendingFlicksPage';
import CreditsPage from './CreditsPage';
import HomePage from './HomePage';
import NotFoundPage from './NotFoundPage';
import ProfilePage from './profile/ProfilePage';
import SignInPage from './SignInPage';
import SignOutPage from './SignOutPage';
import SignUpPage from './SignUpPage';

export const routes = {
  catalogFlicksTop: (page?: number | undefined) =>
    '/catalog/flicks/top' + formatQueryParams({ page }),

  catalogFlicksTrending: (page?: number | undefined) =>
    '/catalog/flicks/trending' + formatQueryParams({ page }),

  catalogFlicksNew: (page?: number | undefined) =>
    '/catalog/flicks/new' + formatQueryParams({ page }),

  catalogFlicksSearch: (query?: string | undefined, page?: number | undefined) =>
    '/catalog/flicks/search' + formatQueryParams({ query, page }),

  catalogFlicksRequest: () => '/catalog/flicks/request',

  catalogFlick: (flickId: string) => '/catalog/flicks/' + flickId,

  catalogTags: () => '/catalog/tags',

  catalogTaggedFlicks: (tagName: string, page?: number | undefined) =>
    '/catalog/tags/' + tagName + formatQueryParams({ page }),

  catalog: () => '/catalog',

  profile: () => '/profile',

  signIn: () => '/signin',
  signOut: () => '/signout',
  signUp: () => '/signup',

  credits: () => '/credits',

  home: () => '/'
};

export default function PageRouter() {
  return (
    <Switch>
      <Route exact path={routes.catalogFlicksTop()} component={TopFlicksPage} />
      <Route exact path={routes.catalogFlicksTrending()} component={TrendingFlicksPage} />
      <Route exact path={routes.catalogFlicksNew()} component={NewFlicksPage} />
      <Route exact path={routes.catalogFlicksSearch()} component={SearchFlicksPage} />
      <Route exact path={routes.catalogFlicksRequest()} component={RequestFlickPage} />
      <Route exact path={routes.catalogFlick(':flickId')} component={FlickPage} />
      <Route exact path={routes.catalogTags()} component={TagsPage} />
      <Route exact path={routes.catalogTaggedFlicks(':tagName')} component={TaggedFlicksPage} />
      <Route exact path={routes.catalog()} render={() => <Redirect to="/catalog/flicks/top" />} />

      <Route exact path={routes.profile()} component={ProfilePage} />

      <Route exact path={routes.signIn()} component={SignInPage} />
      <Route exact path={routes.signOut()} component={SignOutPage} />
      <Route exact path={routes.signUp()} component={SignUpPage} />

      <Route exact path={routes.credits()} component={CreditsPage} />

      <Route exact path={routes.home()} component={HomePage} />

      <Route path="*" component={NotFoundPage} />
    </Switch>
  );
}
