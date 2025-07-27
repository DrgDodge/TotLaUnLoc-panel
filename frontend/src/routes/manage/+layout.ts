import { pb } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const ssr = false

export const load: LayoutLoad = async () => {

  try {
    await pb.collection("users").authRefresh()
    const authStore = pb.authStore

    if (!authStore.isValid) throw redirect(303, '/login');
    else {
      if (!authStore.record) throw redirect(303, '/login');
      if (!authStore.record.admin) throw redirect(303, '/login');
    }

  } catch {
    throw redirect(303, '/login');
  }

}