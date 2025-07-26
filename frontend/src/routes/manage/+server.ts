// import { json } from '@sveltejs/kit';
// import type { RequestHandler } from './$types';
// import { pb } from '$lib/utils';

// export const GET: RequestHandler = async () => {
//   const authStore = pb.authStore
//   if (!authStore.isValid) return new Response(null, { status: 404 })
//   else {
//     if (!authStore.record) return new Response(null, { status: 404 })

//     if (!authStore.record.admin) return new Response(null, { status: 404 })
//     else return new Response(null, { status: 200 });
//   }
// };