// import { pb } from '$lib/utils';
// import { redirect } from '@sveltejs/kit';
// import type { LayoutServerLoad } from '../$types';

// export const load: LayoutServerLoad = async () => {
//   // let authData = await pb.collection("users").authRefresh()

  
  

//   const authStore = pb.authStore
//   // console.log(pb.authStore)

//   if (!authStore.isValid) throw redirect(303, '/login');
//   else {
//     if (!authStore.record) throw redirect(303, '/login');

//     if (!authStore.record.admin) throw redirect(303, '/login');
//   }

//   // if (!locals.user) {
//   //   throw redirect(303, '/login');
//   // }
//   // if (!locals.user.isSuperUser) {
//   //   throw redirect(303, '/login');
//   // }
//   // return { user: locals.user };
// }