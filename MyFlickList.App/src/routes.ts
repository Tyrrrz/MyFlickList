import { route } from 'route-descriptor';
import { GetFlicksOrder } from './internal/api.generated';

interface PaginationParams {
  page?: number;
}

interface SearchParams {
  query?: string;
}

interface FlicksParams extends PaginationParams {
  order?: GetFlicksOrder;
  tag?: string;
}

interface FlickParams {
  flickId: number;
  flickTitle?: string; // only used for human-friendly URLs
}

interface ProfileParams {
  profileId: number;
  profileName?: string; // only used for human-friendly URLs
}

export default {
  home: route('/'),
  search: route<SearchParams>('/search'),

  auth: {
    signIn: route('/auth/signin'),
    signOut: route('/auth/signout'),
    signUp: route('/auth/signup')
  },

  flicks: {
    specific: route<FlickParams>('/flicks/:flickId/:flickTitle?'),
    all: route<FlicksParams>('/flicks'),
    add: route('/flicks/add')
  },

  profiles: {
    specific: route<ProfileParams>('/profiles/:profileId/:profileName?'),

    current: route('/profile'),
    edit: route('/profile/edit'),

    addFlick: route('/profile/flicks/add'),
    editFlick: route<FlickParams>('/profile/flicks/:flickId/edit'),
    deleteFlick: route<FlickParams>('/profile/flicks/:flickId/delete')
  },

  misc: {
    credits: route('/misc/credits'),
    feedback: route('/misc/feedback'),
    donate: route('/misc/donate')
  }
};
