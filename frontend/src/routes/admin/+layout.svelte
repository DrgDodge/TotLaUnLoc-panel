<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    // Need backend integration
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (isLoggedIn !== 'true') {
      goto('/login');
    }
  });
</script>

<slot />