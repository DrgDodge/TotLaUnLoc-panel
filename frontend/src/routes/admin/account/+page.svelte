<script lang="ts">
  import { pb } from "$lib/utils";
  import { fly } from "svelte/transition";

  let user = $state(pb.authStore.record);

  $effect(() => {
    user = pb.authStore.record;
  });

  let oldPassword = $state("");
  let newPassword = $state("");
  let newPasswordConfirm = $state("");
  let showPasswordModal = $state(false);

  async function changePassword() {
    if (newPassword !== newPasswordConfirm) {
      alert("New passwords don't match!");
      return;
    }
    if (!user) {
      alert("User not found!");
      return;
    }
    try {
      await pb.collection("users").update(user.id, {
        oldPassword,
        password: newPassword,
        passwordConfirm: newPasswordConfirm,
      });
      oldPassword = "";
      newPassword = "";
      newPasswordConfirm = "";
      showPasswordModal = false;
      alert("Password changed successfully!");
    } catch (err) {
      const error = err as Error;
      alert("Error changing password: " + error.message);
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
</script>

<div class="max-w-4xl mx-auto p-4 md:p-8 text-white">
  <header class="mb-10 pl-23">
    <h1
      class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
    >
      Your account
    </h1>
    <p class="text-neutral-400 mt-2">Manage your account information.</p>
  </header>

  <div class="bg-neutral-800 rounded-xl shadow-2xl border border-neutral-700">
    <div class="p-8 border-b border-neutral-700">
      <div class="flex justify-between items-center ps-4">
        <div class="pr-10">
          <h3 class="text-xl font-semibold text-purple-300">Subscription</h3>
          <p class="text-neutral-300">
            {user?.license || "No active subscription"}
          </p>
        </div>
        <a
          href="/admin/order"
          class="px-4 py-2 text-lg font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-transform transform hover:scale-105"
          >Change Subscription</a
        >
      </div>
    </div>
    <div class="p-8">
      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <dt class="text-sm font-medium text-neutral-400">Email</dt>
          <dd class="mt-1 text-lg text-neutral-200">{user?.email || "N/A"}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-neutral-400">Account Created</dt>
          <dd class="mt-1 text-lg text-neutral-200">
            {user ? formatDate(user.created) : "N/A"}
          </dd>
        </div>
      </dl>
    </div>
  </div>

  <div
    class="mt-10 bg-neutral-800 rounded-xl shadow-2xl border border-neutral-700 p-8"
  >
    <h3 class="text-xl font-semibold text-blue-300 mb-4">Security</h3>
    <div class="flex justify-between items-center">
      <div>
        <p class="text-neutral-300">Change your password.</p>
      </div>
      <button
        onclick={() => (showPasswordModal = true)}
        class="px-6 py-2 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
      >
        Change Password
      </button>
    </div>
  </div>
</div>

{#if showPasswordModal}
  <div
    transition:fly={{ y: -50, duration: 300 }}
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
  >
    <div
      class="bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700 max-w-md w-full"
    >
      <h2 class="text-3xl font-bold text-white mb-6 text-center">
        Change Password
      </h2>
      <div class="space-y-6">
        <div>
          <label
            for="oldPassword"
            class="block text-sm font-medium text-neutral-300 mb-2"
            >Old Password</label
          >
          <input
            type="password"
            id="oldPassword"
            bind:value={oldPassword}
            class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
          />
        </div>
        <div>
          <label
            for="newPassword"
            class="block text-sm font-medium text-neutral-300 mb-2"
            >New Password</label
          >
          <input
            type="password"
            id="newPassword"
            bind:value={newPassword}
            class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
          />
        </div>
        <div>
          <label
            for="newPasswordConfirm"
            class="block text-sm font-medium text-neutral-300 mb-2"
            >Confirm New Password</label
          >
          <input
            type="password"
            id="newPasswordConfirm"
            bind:value={newPasswordConfirm}
            class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
          />
        </div>
        <div class="flex justify-end gap-4 pt-4">
          <button
            onclick={() => (showPasswordModal = false)}
            class="px-6 py-2 text-lg font-semibold text-neutral-300 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors"
            >Cancel</button
          >
          <button
            onclick={changePassword}
            class="px-6 py-2 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >Change Password</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}
