import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
  cookies.set('isLoggedIn', '', { path: '/', expires: new Date(0) });
  cookies.set('isSuperUser', '', { path: '/', expires: new Date(0) });
  return json({ success: true });
}