// import type { LayoutServerLoad } from './$types';

import { pb } from "$lib/utils";
import type { LayoutLoad } from "./$types";

// export const load: LayoutServerLoad = async ({ locals }) => {
//   return {
//     isSuperUser: locals.user?.isSuperUser || false,
//   };
// };

export const load: LayoutLoad = async () => {
  await pb.collection("users").authRefresh().catch(() => { /*user not logged*/ })
  console.log(pb.authStore)
}
