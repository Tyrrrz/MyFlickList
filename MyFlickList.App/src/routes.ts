import { route } from 'route-descriptor';

export default {
  home: route('/'),
  search: route<{ query?: string }>('/search'),

  auth: {
    signIn: route('/auth/signin'),
    signOut: route('/auth/signout'),
    signUp: route('/auth/signup')
  },

  flicks: {
    one: route<{ flickId: number; flickTitle?: string }>('/flicks/:flickId/:flickTitle?'),
    all: route<{ order?: 'Top' | 'Trending' | 'New'; tag?: string; page?: number }>('/flicks'),
    add: route('/flicks/add')
  },

  profiles: {
    one: route<{ profileId: number; profileName?: string }>('/profiles/:profileId/:profileName?'),
    current: route('/profile'),
    edit: route('/profile/edit'),
    settings: route('/profile/settings'),
    editFlick: route<{ flickId: number }>('/profile/flicks/:flickId/edit')
  },

  misc: {
    credits: route('/misc/credits'),
    feedback: route('/misc/feedback'),
    donate: route('/misc/donate')
  }
};
