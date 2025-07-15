<script lang="ts">
  import { goto } from '$app/navigation';

  let username = '';
  let password = '';

  function login() {
    if (username === 'admin' && password === 'admin') {
      sessionStorage.setItem('isLoggedIn', 'true');
      goto('/admin');
    } else {
      alert('Invalid credentials');
    }
  }
</script>

<div class="flex items-center justify-center h-full bg-cover bg-center">
  <div class="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20">
    <h1 class="text-3xl font-bold text-center text-white">Login</h1>
    <form on:submit|preventDefault={login} class="space-y-6">
      <div>
        <label for="username" class="block mb-2 text-sm font-medium text-gray-200">Username</label>
        <input type="text" id="username" bind:value={username} class="w-full px-4 py-2 text-white bg-white/10 border border-white/20 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
      </div>
      <div>
        <label for="password" class="block mb-2 text-sm font-medium text-gray-200">Password</label>
        <input type="password" id="password" bind:value={password} class="w-full px-4 py-2 text-white bg-white/10 border border-white/20 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
      </div>
      <button type="submit" class="w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300">Login</button>
    </form>
    <p class="text-center text-gray-300">
      Don't have an account? <a href="/register" class="text-blue-400 hover:underline">Register here</a>
    </p>
  </div>
</div>