<script>
  let username = "";
  let password = "";
  let message = "";

  async function register() {
    const res = await fetch("http://localhost:7355/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      message = "Registration successful!";
    } else {
      message = data.error || "An error occurred";
    }
  }
</script>

<div class="flex items-center justify-center h-screen">
  <div class="w-full max-w-md p-8 space-y-6 bg-neutral-800 rounded-xl shadow-2xl border border-neutral-700">
    <h1 class="text-2xl font-bold text-center text-white">Register</h1>
    <form on:submit|preventDefault={register}>
      <div class="space-y-4">
        <div>
          <label for="username" class="block mb-2 text-sm font-medium text-neutral-300">Username</label>
          <input
            type="text"
            id="username"
            bind:value={username}
            class="w-full px-3 py-2 border rounded-lg bg-neutral-900 border-neutral-600 text-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label for="password" class="block mb-2 text-sm font-medium text-neutral-300">Password</label>
          <input
            type="password"
            id="password"
            bind:value={password}
            class="w-full px-3 py-2 border rounded-lg bg-neutral-900 border-neutral-600 text-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
      </div>
      <button type="submit" class="w-full mt-6 px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700">
        Register
      </button>
    </form>
    {#if message}
      <p class="mt-4 text-center text-sm text-red-600">{message}</p>
    {/if}
  </div>
</div>
