import { route } from 'route-descriptor';
import { GetFlicksOrder } from './infra/api.generated';

interface PaginationParams {
  page?: number;
}

interface FlicksParams extends PaginationParams {
  order?: GetFlicksOrder;
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

interface ProfileFlickEntryParams extends ProfileParams {
  flickId: number;
}

export default {
  home: route('/'),

  // Auth
  signIn: route('/auth/signin'),
  signOut: route('/auth/signout'),
  signUp: route('/auth/signup'),

  // Flicks
  flicks: route<FlicksParams>('/flicks'),
  flick: route<FlickParams>('/flicks/:flickId/:flickTitle?'),
  flickAdd: route('/flicks/add'),

  // Profiles
  profile: route<ProfileParams>('/profiles/:profileId/:profileName?'),
  profileEdit: route<ProfileParams>('/profiles/:profileId/:profileName?/edit'),
  profileAddFlickEntry: route<ProfileParams>('/profiles/:profileId/:profileName?/flicks/add'),
  profileEditFlickEntry: route<ProfileFlickEntryParams>(
    '/profiles/:profileId/:profileName?/flicks/:flickId/edit'
  ),
  profileDeleteFlickEntry: route<ProfileFlickEntryParams>(
    '/profiles/:profileId/:profileName?/flicks/:flickId/delete'
  ),

  // Search
  search: route<SearchParams>('/search'),

  // Misc
  credits: route('/misc/credits'),
  feedback: route('/misc/feedback'),
  donate: route('/misc/donate')
};
