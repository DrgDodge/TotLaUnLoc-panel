<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(() => {
    const platform = window.navigator.platform.toLowerCase();
    if (platform.includes('win')) {
      goto('/download/windows');
    } else if (platform.includes('linux')) {
      goto('/download/linux');
    } else {
      goto('/download/windows'); // Defaulting to windows for now
    }
  });
</script>

<div class="flex flex-col items-center justify-center h-full p-8">
  <div class="bg-neutral-800 p-10 rounded-xl shadow-2xl text-center max-w-3xl w-full border border-neutral-700">
    <h2 class="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 leading-tight">
      Redirecting...
    </h2>
    <p class="text-xl text-neutral-300 mb-8 leading-relaxed">
      Detecting your operating system and redirecting you to the appropriate download page.
    </p>
  </div>
</div>