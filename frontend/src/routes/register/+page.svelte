<script lang="ts">
  import { goto } from '$app/navigation';

  let username = '';
  let password = '';
  let confirmPassword = '';
  let message = '';

  async function register() {
    if (password !== confirmPassword) {
      message = "Passwords do not match!";
      return;
    }

    const res = await fetch("http://localhost:7355/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      message = "Registration successful! Redirecting to login...";
      setTimeout(() => {
        goto('/login');
      }, 2000);
    } else {
      message = data.error || "An error occurred during registration.";
    }
  }
</script>

<div class="flex items-center justify-center h-full bg-cover bg-center">
  <div class="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20">
    <h1 class="text-3xl font-bold text-center text-white">Register</h1>
    <form on:submit|preventDefault={register} class="space-y-6">
      <div>
        <label for="username" class="block mb-2 text-sm font-medium text-gray-200">Email</label>
        <input type="text" id="username" bind:value={username} class="w-full px-4 py-2 text-white bg-white/10 border border-white/20 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
      </div>
      <div>
        <label for="password" class="block mb-2 text-sm font-medium text-gray-200">Password</label>
        <input type="password" id="password" bind:value={password} class="w-full px-4 py-2 text-white bg-white/10 border border-white/20 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
      </div>
      <div>
        <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-200">Confirm Password</label>
        <input type="password" id="confirm-password" bind:value={confirmPassword} class="w-full px-4 py-2 text-white bg-white/10 border border-white/20 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
      </div>
      <button type="submit" class="w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300">Register</button>
    </form>
    <p class="text-center text-gray-300">
      Already have an account? <a href="/login" class="text-blue-400 hover:underline">Login here</a>
    </p>
    {#if message}
      <p class="mt-4 text-center text-sm text-red-400">{message}</p>
    {/if}
  </div>
</div>
