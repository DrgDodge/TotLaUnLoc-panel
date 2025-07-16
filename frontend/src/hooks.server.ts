import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const isLoggedIn = event.cookies.get('isLoggedIn');
  const isSuperUser = event.cookies.get('isSuperUser') === 'true';

  if (isLoggedIn) {
    event.locals.user = { isSuperUser };
  } else {
    event.locals.user = null;
  }

  return resolve(event);
};