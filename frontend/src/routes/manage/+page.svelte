<script lang="ts">
  import { fly } from "svelte/transition";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { pb } from "$lib/utils";

  onMount(async () => {
    if (!sessionStorage.getItem("manage_reloaded")) {
      sessionStorage.setItem("manage_reloaded", "true");
      location.reload();
    }

    const recordLicenses = await pb.collection("orders").getFullList();

    if (recordLicenses) licenseOrders = recordLicenses;

    const recordUsers = await pb.collection("users").getFullList();

    users = recordUsers;

    licenseOrders.forEach((order: any, index: number) => {
      const user = users.find((x: any) => x.id == order.userId);
      licenseOrders[index].email = user.email;
    })

  });

  // Need Backend
  let users: any = $state([]);

  let licenseOrders: any = $state([]);
  1;
  let selectedUser = $state<(typeof users)[0] | null>(null);
  let showGrantLicenseModal = $state(false);
  let licenseToGrant = $state("");
  let grantMachineLimit = $state(0);
  let grantApiKeyLimit = $state(0);
  let userSearchQuery = $state("");
  let selectedOrder = $state<any | null>(null);
  let showOrderStatusModal = $state(false);
  let selectedOrderStatus = $state("");

  const availableLicenses = ["standard", "pro"];
  const orderStatuses = ["pending", "completed", "canceled"];

  const openGrantLicenseModal = (user: (typeof users)[0]) => {
    selectedUser = user;
    licenseToGrant = "";
    grantMachineLimit = user.machineLimit || 0;
    grantApiKeyLimit = user.apiKeyLimit || 0;
    showGrantLicenseModal = true;
  };

  const openOrderStatusModal = (order: any) => {
    selectedOrder = order;
    selectedOrderStatus = order.status;
    showOrderStatusModal = true;
  };

  const grantLicense = async () => {
    if (selectedUser && licenseToGrant) {
      selectedUser.license = licenseToGrant;
      selectedUser.apiLimit = grantApiKeyLimit;
      selectedUser.machineLimit = grantMachineLimit;

      await pb
        .collection("users")
        .update($state.snapshot(selectedUser.id), $state.snapshot(selectedUser))
        .then(() => {
          alert(
            `Granted ${licenseToGrant} license to ${selectedUser.name} with machine limit: ${grantMachineLimit}, API key limit: ${grantApiKeyLimit}`,
          );

          showGrantLicenseModal = false;
          selectedUser = null;
          licenseToGrant = "";
          grantMachineLimit = 0;
          grantApiKeyLimit = 0;
        })
        .catch(() => alert("Error! Could not grant license!"));
    }
  };

  const confirmUpdateOrderStatus = async () => {
    if (selectedOrder && selectedOrderStatus) {
      selectedOrder.status = selectedOrderStatus;

      await pb.collection("orders").update(selectedOrder.id, selectedOrder)
        .then(() => {
          alert(`License order ${selectedOrder.id} status updated to ${selectedOrderStatus}.`);
          showOrderStatusModal = false;
          selectedOrder = null;
          selectedOrderStatus = "";
        })
        .catch(() => alert("Error! Could not update order status!"));

    }
  };
</script>

<div class="max-w-7xl mx-auto p-4 md:p-8">
  <h2
    class="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500"
  >
    Organization Management
  </h2>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- User Management -->
    <div
      class="bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700"
    >
      <h3 class="text-3xl font-semibold mb-4 text-purple-300">Users</h3>
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

      <div
        class="border border-neutral-700 rounded-lg p-6 bg-neutral-900 h-[344px] overflow-y-auto custom-scrollbar flex-shrink-0"
      >
        {#if users.length > 0}
          <ul>
            {#each users as user}
              {#if user.email
                .toLowerCase()
                .includes(userSearchQuery.toLowerCase())}
                <li
                  class="flex justify-between items-center p-2 rounded-lg hover:bg-neutral-800"
                >
                  <div class="pr-10">
                    <span class="font-medium text-neutral-200"
                      >{user.email}</span
                    >
                    <p class="text-xs text-neutral-500">
                      Machine Limit: {user.machineLimit}, API Key Limit: {user.apiLimit}
                    </p>
                  </div>
                  <button
                    onclick={() => openGrantLicenseModal(user)}
                    class="w-50 bg-transparent hover:bg-neutral-700 text-white font-semibold py-3 px-3 rounded-lg transition-colors duration-200 border border-purple-600 hover:border-purple-500"
                    >
                    Grant License
                  </button>
                </li>
              {/if}
            {/each}
          </ul>
        {:else}
          <p class="text-neutral-400 text-lg text-center pt-8">
            No users found.
          </p>
        {/if}
      </div>
    </div>

    <!-- License Order Management -->
    <div
      class="bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700"
    >
      <h3 class="text-3xl font-semibold mb-4 text-teal-300">License Orders</h3>
      <p class="text-neutral-300 mb-6 leading-relaxed">
        Review and process pending license requests.
      </p>

      <div
        class="border border-neutral-700 rounded-lg p-6 bg-neutral-900 h-[400px] overflow-y-auto custom-scrollbar"
      >
        {#if licenseOrders.length > 0}
          <ul>
            {#each licenseOrders as order}
              <li
                class="flex justify-between items-center p-2 rounded-lg hover:bg-neutral-800"
              >
                <div>
                  <span class="font-medium text-neutral-200"
                    >Order #{order.id}</span
                  >
                  <p class="text-sm text-neutral-400">
                    User: {order.email}
                  </p>
                  <p class="text-sm text-neutral-400">
                    License Type: {order.licenseType}
                  </p>
                  <p class="text-sm text-neutral-400">
                    API Limit: {order.apiLimit}
                  </p>
                  <p class="text-sm text-neutral-400">
                    Machine Limit: {order.machineLimit}
                  </p>
                </div>
                <div class="relative inline-block text-neutral-200">
                  <button
                    onclick={() => openOrderStatusModal(order)}
                    class="w-50 bg-transparent hover:bg-neutral-700 text-white font-semibold py-3 px-3 rounded-lg transition-colors duration-200 border border-blue-600 hover:border-blue-500"
                  >
                    Change Status
                  </button>
                </div>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-neutral-400 text-lg text-center pt-8">
            No license orders found.
          </p>
        {/if}
      </div>
    </div>
  </div>
</div>

{#if showGrantLicenseModal}
  <div
    transition:fly={{ y: -50, duration: 300 }}
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
  >
    <div
      class="bg-neutral-800 rounded-xl shadow-2xl p-8 border border-neutral-600 max-w-md w-full text-center"
    >
      <h3 class="text-2xl font-bold mb-4 text-green-300">
        Grant License to {selectedUser?.name}
      </h3>
      <div class="mb-4 text-left">
        <label for="license-type" class="block text-neutral-300 mb-2"
          >Select License Type:</label
        >
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
        <label for="machine-limit" class="block text-neutral-300 mb-2"
          >Machine Limit:</label
        >
        <input
          type="number"
          id="machine-limit"
          bind:value={grantMachineLimit}
          class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          min="0"
        />
      </div>
      <div class="mb-6 text-left">
        <label for="api-key-limit" class="block text-neutral-300 mb-2"
          >API Key Generation Limit:</label
        >
        <input
          type="number"
          id="api-key-limit"
          bind:value={grantApiKeyLimit}
          class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          min="0"
        />
      </div>
      <div class="flex justify-end gap-4">
        <button
          onclick={() => (showGrantLicenseModal = false)}
          class="bg-neutral-600 hover:bg-neutral-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onclick={grantLicense}
          class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Grant
        </button>
      </div>
    </div>
  </div>
{/if}

{#if showOrderStatusModal}
  <div
    transition:fly={{ y: -50, duration: 300 }}
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
  >
    <div
      class="bg-neutral-800 rounded-xl shadow-2xl p-8 border border-neutral-600 max-w-md w-full text-center"
    >
      <h3 class="text-2xl font-bold mb-4 text-blue-300">
        Change Order Status for #{selectedOrder?.id}
      </h3>
      <div class="mb-4 text-left">
        <label for="order-status" class="block text-neutral-300 mb-2"
          >Select New Status:</label
        >
        <select
          id="order-status"
          bind:value={selectedOrderStatus}
          class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {#each orderStatuses as statusOption}
            <option value={statusOption}>{statusOption}</option>
          {/each}
        </select>
      </div>
      <div class="flex justify-end gap-4">
        <button
          onclick={() => (showOrderStatusModal = false)}
          class="bg-neutral-600 hover:bg-neutral-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onclick={confirmUpdateOrderStatus}
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Update Status
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
