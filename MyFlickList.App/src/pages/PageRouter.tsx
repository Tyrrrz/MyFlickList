import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { FlickOrder } from '../infra/api.generated';
import { formatQueryParams } from '../infra/utils';
import FlickPage from './catalog/FlickPage';
import FlicksPage from './catalog/FlicksPage';
import RequestFlickPage from './catalog/RequestFlickPage';
import SearchFlicksPage from './catalog/SearchFlicksPage';
import CreditsPage from './CreditsPage';
import HomePage from './HomePage';
import NotFoundPage from './NotFoundPage';
import ProfilePage from './profile/ProfilePage';
import SignInPage from './SignInPage';
import SignOutPage from './SignOutPage';
import SignUpPage from './SignUpPage';

// TODO: figure out a better way to approach named routes

type QueryParams = Record<string, string | number | undefined>;

export interface PaginationQueryParams extends QueryParams {
  page?: number | undefined;
}

export interface FlicksQueryParams extends PaginationQueryParams {
  order?: FlickOrder | undefined;
  filterTag?: string | undefined;
}

export interface SearchQueryParams extends PaginationQueryParams {
  query?: string | undefined;
}

export const routes = {
  flicks: (query: FlicksQueryParams = {}) => '/flicks' + formatQueryParams(query),
  flickAdd: () => '/flicks/request',
  flick: (flickId: number | string) => '/flicks/' + flickId,

  search: (query: SearchQueryParams = {}) => '/search' + formatQueryParams(query),

  profile: (profileId: number | string) => '/profile/' + profileId,

  signIn: () => '/signin',
  signOut: () => '/signout',
  signUp: () => '/signup',

  credits: () => '/credits',

  home: () => '/'
};

export default function PageRouter() {
  return (
    <Switch>
      <Route exact path={routes.flicks()} component={FlicksPage} />
      <Route exact path={routes.flickAdd()} component={RequestFlickPage} />
      <Route exact path={routes.flick(':flickId')} component={FlickPage} />

      <Route exact path={routes.search()} component={SearchFlicksPage} />

      <Route exact path={routes.profile(':profileId')} component={ProfilePage} />

      <Route exact path={routes.signIn()} component={SignInPage} />
      <Route exact path={routes.signOut()} component={SignOutPage} />
      <Route exact path={routes.signUp()} component={SignUpPage} />

      <Route exact path={routes.credits()} component={CreditsPage} />

      <Route exact path={routes.home()} component={HomePage} />

      <Route path="*" component={NotFoundPage} />
    </Switch>
  );
}
