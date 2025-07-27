<script lang="ts">
  import { fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';


  onMount(() => {
    if (!sessionStorage.getItem('manage_reloaded')) {
      sessionStorage.setItem('manage_reloaded', 'true');
      location.reload();
    }
  });

      // Need Backend
  let users = $state([
    { id: 'user-001', name: 'Ionescu Mihai', email: 'mimiionescu07@gmail.com', licenses: ['premium'], machineLimit: 5, apiKeyLimit: 3 },
]);

  let licenseOrders = $state([
    { id: '0000001', userId: 'user-001', licenseType: 'pro', status: 'pending' },
  ]);

  let selectedUser = $state<typeof users[0] | null>(null);
  let showGrantLicenseModal = $state(false);
  let licenseToGrant = $state('');
  let grantMachineLimit = $state(0);
  let grantApiKeyLimit = $state(0);
  let userSearchQuery = $state('');

  const availableLicenses = ['basic', 'premium', 'pro'];
  const orderStatuses = ['pending', 'completed', 'cancelled'];

  const filteredUsers = $derived(users.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  ));

  const openGrantLicenseModal = (user: typeof users[0]) => {
    selectedUser = user;
    licenseToGrant = '';
    grantMachineLimit = user.machineLimit || 0;
    grantApiKeyLimit = user.apiKeyLimit || 0;
    showGrantLicenseModal = true;
  };

  const grantLicense = () => {
    if (selectedUser && licenseToGrant) {
      const userIndex = users.findIndex(u => u.id === selectedUser!.id);
      if (userIndex !== -1) {
        if (!users[userIndex].licenses.includes(licenseToGrant)) {
          users[userIndex].licenses.push(licenseToGrant);
        }
        users[userIndex].machineLimit = grantMachineLimit;
        users[userIndex].apiKeyLimit = grantApiKeyLimit;
      // Need Backend
        alert(`Granted ${licenseToGrant} license to ${selectedUser.name} with machine limit: ${grantMachineLimit}, API key limit: ${grantApiKeyLimit}`);
      }
      showGrantLicenseModal = false;
      selectedUser = null;
      licenseToGrant = '';
      grantMachineLimit = 0;
      grantApiKeyLimit = 0;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const orderIndex = licenseOrders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      licenseOrders[orderIndex].status = newStatus;
      // Need Backend
      alert(`License order ${orderId} status updated to ${newStatus}.`);
    }
  };

  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || 'Unknown User';
  };
</script>

<div class="max-w-7xl mx-auto p-4 md:p-8">
  <h2 class="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
    Organization Management
  </h2>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- User Management -->
    <div class="bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700">
      <h3 class="text-3xl font-semibold mb-4 text-green-300">Users</h3>
      <p class="text-neutral-300 mb-6 leading-relaxed">
        View and manage user accounts and their assigned licenses.
      </p>

      <div class="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          bind:value={userSearchQuery}
          class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-2 text-neutral-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div class="border border-neutral-700 rounded-lg p-6 bg-neutral-900 h-[344px] overflow-y-auto custom-scrollbar flex-shrink-0">
        {#if filteredUsers.length > 0}
          <ul>
            {#each filteredUsers as user}
              <li class="flex justify-between items-center p-2 rounded-lg hover:bg-neutral-800">
                <div>
                  <span class="font-medium text-neutral-200">{user.name}</span>
                  <p class="text-sm text-neutral-400">{user.email}</p>
                  <p class="text-xs text-neutral-500">Licenses: {user.licenses.length > 0 ? user.licenses.join(', ') : 'None'}</p>
                  <p class="text-xs text-neutral-500">Machine Limit: {user.machineLimit}, API Key Limit: {user.apiKeyLimit}</p>
                </div>
                <button
                  onclick={() => openGrantLicenseModal(user)}
                  class="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded-lg transition-colors duration-200 text-sm"
                >
                  Grant License
                </button>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-neutral-400 text-lg text-center pt-8">No users found.</p>
        {/if}
      </div>
    </div>

    <!-- License Order Management -->
    <div class="bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700">
      <h3 class="text-3xl font-semibold mb-4 text-teal-300">License Orders</h3>
      <p class="text-neutral-300 mb-6 leading-relaxed">
        Review and process pending license requests.
      </p>

      <div class="border border-neutral-700 rounded-lg p-6 bg-neutral-900 h-[400px] overflow-y-auto custom-scrollbar">
        {#if licenseOrders.length > 0}
          <ul>
            {#each licenseOrders as order}
              <li class="flex justify-between items-center p-2 rounded-lg hover:bg-neutral-800">
                <div>
                  <span class="font-medium text-neutral-200">Order #{order.id}</span>
                  <p class="text-sm text-neutral-400">User: {getUserName(order.userId)}</p>
                  <p class="text-sm text-neutral-400">License Type: {order.licenseType}</p>
                </div>
                <div class="relative inline-block text-neutral-200">
                  <select
                    bind:value={order.status}
                    onchange={(e) => updateOrderStatus(order.id, (e.target as HTMLSelectElement).value)}
                    class="block appearance-none w-full bg-neutral-900 border border-neutral-600 hover:border-neutral-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {#each orderStatuses as statusOption}
                      <option value={statusOption}>{statusOption}</option>
                    {/each}
                  </select>
                </div>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-neutral-400 text-lg text-center pt-8">No license orders found.</p>
        {/if}
      </div>
    </div>
  </div>
</div>

{#if showGrantLicenseModal}
<div transition:fly={{ y: -50, duration: 300 }}
     class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
  <div class="bg-neutral-800 rounded-xl shadow-2xl p-8 border border-neutral-600 max-w-md w-full text-center">
    <h3 class="text-2xl font-bold mb-4 text-green-300">Grant License to {selectedUser?.name}</h3>
    <div class="mb-4 text-left">
      <label for="license-type" class="block text-neutral-300 mb-2">Select License Type:</label>
      <select
        id="license-type"
        bind:value={licenseToGrant}
        class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="" disabled>Select a license</option>
        {#each availableLicenses as license}
          <option value={license}>{license}</option>
        {/each}
      </select>
    </div>
    <div class="mb-4 text-left">
      <label for="machine-limit" class="block text-neutral-300 mb-2">Machine Limit:</label>
      <input
        type="number"
        id="machine-limit"
        bind:value={grantMachineLimit}
        class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        min="0"
      />
    </div>
    <div class="mb-6 text-left">
      <label for="api-key-limit" class="block text-neutral-300 mb-2">API Key Generation Limit:</label>
      <input
        type="number"
        id="api-key-limit"
        bind:value={grantApiKeyLimit}
        class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        min="0"
      />
    </div>
    <div class="flex justify-end gap-4">
      <button onclick={() => showGrantLicenseModal = false} class="bg-neutral-600 hover:bg-neutral-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
        Cancel
      </button>
      <button onclick={grantLicense} class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
        Grant
      </button>
    </div>
  </div>
</div>
{/if}

<style>

  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: #2a2a2a;
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }

  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #4b5563 #2a2a2a;
  }
</style>