import React from 'react';
import { Route, Switch } from 'react-router';
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
import SearchPage from './pages/search/SearchPage';

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
        pathname = pathname.replaceAll(RegExp(`:${key}\\??`, 'g'), encodeURIComponent(value));
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
      Object.entries(params).filter(([key]) => RegExp(`:${key}\\??`, 'g').test(this.template))
    );

    const queryParams = Object.fromEntries(
      Object.entries(params).filter(([key]) => !RegExp(`:${key}\\??`, 'g').test(this.template))
    );

    return this.formatRouteParams(routeParams) + this.formatQueryParams(queryParams);
  }
}

interface PaginationParams extends Params {
  page?: number;
}

interface FlicksParams extends PaginationParams {
  order?: FlickOrder;
  filterTag?: string;
}

interface FlickParams extends Params {
  flickId: number;
  flickTitle?: string; // only used for human-friendly URLs
}

interface SearchParams extends Params {
  query?: string;
}

interface ProfileParams extends Params {
  profileId: number;
  profileName?: string; // only used for human-friendly URLs
}

export const routes = {
  flickAdd: new RouteDescriptor('/flicks/add'),
  flick: new RouteDescriptor<FlickParams>('/flicks/:flickId/:flickTitle?'),
  flicks: new RouteDescriptor<FlicksParams>('/flicks'),
  search: new RouteDescriptor<SearchParams>('/search'),
  profileEdit: new RouteDescriptor<ProfileParams>('/profiles/:profileId/:profileName?/edit'),
  profile: new RouteDescriptor<ProfileParams>('/profiles/:profileId/:profileName?'),
  signIn: new RouteDescriptor('/auth/signin'),
  signOut: new RouteDescriptor('/auth/signout'),
  signUp: new RouteDescriptor('/auth/signup'),
  credits: new RouteDescriptor('/misc/credits'),
  feedback: new RouteDescriptor('/misc/feedback'),
  donate: new RouteDescriptor('/misc/donate'),
  home: new RouteDescriptor('/')
};

export default function Routing() {
  return (
    <Switch>
      <Route exact path={routes.flickAdd.template} component={AddFlickPage} />
      <Route exact path={routes.flick.template} component={FlickPage} />
      <Route exact path={routes.flicks.template} component={FlicksPage} />
      <Route exact path={routes.search.template} component={SearchPage} />
      <Route exact path={routes.profileEdit.template} component={EditProfilePage} />
      <Route exact path={routes.profile.template} component={ProfilePage} />
      <Route exact path={routes.signIn.template} component={SignInPage} />
      <Route exact path={routes.signOut.template} component={SignOutPage} />
      <Route exact path={routes.signUp.template} component={SignUpPage} />
      <Route exact path={routes.credits.template} component={CreditsPage} />
      <Route exact path={routes.feedback.template} component={FeedbackPage} />
      <Route exact path={routes.donate.template} component={DonatePage} />
      <Route exact path={routes.home.template} component={HomePage} />
      <Route path="*" component={NotFoundPage} />{' '}
    </Switch>
  );
}
