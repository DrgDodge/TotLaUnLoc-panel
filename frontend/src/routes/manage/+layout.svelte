<script lang="ts">
  import { page } from '$app/stores';
  import { spring } from 'svelte/motion';
  import { goto } from '$app/navigation';

  let { children } = $props();

  const tabs = [
    { name: 'Manage', path: '/manage' },
  ];

  let indicator = spring({ top: 0, height: 0 }, {
		stiffness: 0.1,
		damping: 0.7,
	});

  let linkElements: (HTMLAnchorElement | null)[] = [];

  $effect(() => {
    const activeTabIndex = tabs.findIndex(tab => $page.url.pathname.startsWith(tab.path));
    if (activeTabIndex !== -1) {
      const activeElement = linkElements[activeTabIndex];
      if (activeElement) {
        indicator.set({
          top: activeElement.offsetTop,
          height: activeElement.offsetHeight,
        });
      }
    }
  });

  async function logout() {
    sessionStorage.removeItem('manage_reloaded');
    await fetch('/logout', { method: 'POST' });
    goto('/login');
  }
</script>

<div class="flex">
  <aside class="fixed top-1/2 -translate-y-1/2 left-4">
    <nav class="relative flex flex-col gap-2 bg-neutral-900/30 backdrop-blur-lg rounded-3xl p-4 shadow-lg border border-neutral-700">
      <div class="nav-indicator absolute left-0 top-0 w-1 bg-blue-400 rounded-full" style="transform: translateY({$indicator.top}px); height: {$indicator.height}px;"></div>
      {#each tabs as tab, i}
        <a
          href={tab.path}
          class="nav-link p-4 rounded-lg transition-colors duration-200 {$page.url.pathname.startsWith(tab.path)
            ? 'text-white'
            : 'text-neutral-400 hover:text-white'}"
          bind:this={linkElements[i]}
        >
          {tab.name}
        </a>
      {/each}
      <!-- <button onclick={logout} class="nav-link p-4 rounded-lg transition-colors duration-200 text-neutral-400 hover:text-white">Logout</button> -->
    </nav>
  </aside>

  <main class="flex-1 ml-80 p-8">
    {@render children()}
  </main>
</div>

<style>
  .nav-link {
    position: relative;
    z-index: 10;
  }
  .nav-indicator {
    will-change: transform, height;
    transition: transform 0.2s, height 0.2s;
  }
</style>
