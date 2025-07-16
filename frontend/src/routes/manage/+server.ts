import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user?.isSuperUser) {
    return new Response(null, { status: 403 });
  }

  return json({ message: 'Welcome, Superuser! This is the manage page.' });
};