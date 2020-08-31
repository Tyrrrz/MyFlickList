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

type QueryParams = Record<string, string | number | undefined>;

export interface PaginationQueryParams extends QueryParams {
  page?: number | undefined;
}

export interface SearchQueryParams extends PaginationQueryParams {
  query?: string | undefined;
}

export const routes = {
  catalogFlicksTop: (query: PaginationQueryParams = {}) =>
    '/catalog/flicks/top' + formatQueryParams(query),

  catalogFlicksTrending: (query: PaginationQueryParams = {}) =>
    '/catalog/flicks/trending' + formatQueryParams(query),

  catalogFlicksNew: (query: PaginationQueryParams = {}) =>
    '/catalog/flicks/new' + formatQueryParams(query),

  catalogFlicksSearch: (query: SearchQueryParams = {}) =>
    '/catalog/flicks/search' + formatQueryParams(query),

  catalogFlicksRequest: () => '/catalog/flicks/request',

  catalogFlick: (flickId: string) => '/catalog/flicks/' + flickId,

  catalogTags: () => '/catalog/tags',

  catalogTaggedFlicks: (tagName: string, query: PaginationQueryParams = {}) =>
    '/catalog/tags/' + tagName + formatQueryParams(query),

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

      <Route
        exact
        path={routes.catalog()}
        render={() => <Redirect to={routes.catalogFlicksTop()} />}
      />

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
