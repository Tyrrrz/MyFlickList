import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { FlickOrder } from '../infra/api.generated';
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

type Params = Record<string, string | number | undefined>;

class RouteDescriptor<TParams extends Params> {
  readonly template: string;

  constructor(template: string) {
    this.template = template;
  }

  private formatRouteParams(routeParams: Params) {
    let pathname = this.template;

    Object.entries(routeParams).forEach(([key, value]) => {
      if (value) {
        pathname = pathname.replaceAll(RegExp(`:${key}`, 'g'), encodeURIComponent(value));
      }
    });

    // Remove any unset params
    pathname = pathname.replaceAll(/\/:\w+/g, '');

    return pathname;
  }

  private formatQueryParams(queryParams: Params) {
    const searchBuilder = new URLSearchParams();

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) {
        searchBuilder.append(key, value.toString());
      }
    });

    const search = searchBuilder.toString();

    return search && '?' + search;
  }

  href(params?: TParams) {
    if (!params) {
      return this.template;
    }

    const routeParams = Object.fromEntries(
      Object.entries(params).filter(([key]) => RegExp(`:${key}`, 'g').test(this.template))
    );

    const queryParams = Object.fromEntries(
      Object.entries(params).filter(([key]) => !RegExp(`:${key}`, 'g').test(this.template))
    );

    return this.formatRouteParams(routeParams) + this.formatQueryParams(queryParams);
  }
}

interface PaginationParams extends Params {
  page?: number | undefined;
}

interface FlicksParams extends PaginationParams {
  order?: FlickOrder | undefined;
  filterTag?: string | undefined;
}

interface FlickParams extends Params {
  flickId: number;
  flickTitle?: string; // only used for human-friendly URLs
}

interface SearchParams extends Params {
  query?: string | undefined;
}

interface ProfileParams extends Params {
  profileId: number;
  profileName?: string; // only used for human-friendly URLs
}

export const routes = {
  flickAdd: new RouteDescriptor('/flicks/request'),
  flicks: new RouteDescriptor<FlicksParams>('/flicks'),
  flick: new RouteDescriptor<FlickParams>('/flicks/:flickId/:flickTitle?'),
  search: new RouteDescriptor<SearchParams>('/search'),
  profile: new RouteDescriptor<ProfileParams>('/profiles/:profileId/:profileName?'),
  signIn: new RouteDescriptor('/signin'),
  signOut: new RouteDescriptor('/signout'),
  signUp: new RouteDescriptor('/signup'),
  credits: new RouteDescriptor('/credits'),
  home: new RouteDescriptor('/')
};

export default function Routing() {
  return (
    <Switch>
      <Route exact path={routes.flicks.template} component={FlicksPage} />
      <Route exact path={routes.flickAdd.template} component={RequestFlickPage} />
      <Route exact path={routes.flick.template} component={FlickPage} />

      <Route exact path={routes.search.template} component={SearchFlicksPage} />

      <Route exact path={routes.profile.template} component={ProfilePage} />

      <Route exact path={routes.signIn.template} component={SignInPage} />
      <Route exact path={routes.signOut.template} component={SignOutPage} />
      <Route exact path={routes.signUp.template} component={SignUpPage} />

      <Route exact path={routes.credits.template} component={CreditsPage} />

      <Route exact path={routes.home.template} component={HomePage} />

      <Route path="*" component={NotFoundPage} />
    </Switch>
  );
}
