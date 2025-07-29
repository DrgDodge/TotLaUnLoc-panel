<script lang="ts">
  import { fly } from "svelte/transition";
  import { pb } from "$lib/utils";
  import { onMount } from "svelte";
    import { io } from "socket.io-client";

  let apiKeyLimit = $state(pb.authStore.record?.apiLimit || 0);

  let licenses: Array<any> = $state([]);

  onMount(() => {
    if (pb.authStore.record!.licenses != null)
      licenses = pb.authStore.record!.licenses;
  });

  let newApiKey = $state("");
  let newApiKeyNickname = $state("");
  let selectedApiKey = $derived("");
  let showModal = $state(false);
  let modalApiKey = $state("");
  let apiKeySearchTerm = $state("");
  let machineSearchTerm = $state("");
  let showDeleteConfirmation = $state(false);
  let machineToDelete = $state("");
  let showDeleteAllConfirmation = $state(false);
  let apiKeyToDeleteAll = $state("");

  const generateApiKey = () => {
    if (licenses.length < apiKeyLimit) {
      newApiKey = crypto.randomUUID();
    } else {
      alert("API key limit reached.");
    }
  };

  const addApiKey = async () => {
    if (!newApiKey && !newApiKeyNickname) return;
    let apiObject = {
      apiKey: newApiKey,
      apiKeyName: newApiKeyNickname,
      machines: [],
    };

    const data = await pb.collection("users").getOne(pb.authStore.record!.id);

    if (data.licenses == null) {
      licenses = [apiObject];
    } else {
      licenses.push(apiObject);
    }

    data.licenses = $state.snapshot(licenses);

    await pb.collection("users").update(pb.authStore.record!.id, data);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("API Key copied to clipboard!");
    });
  };

  const deleteKey = async (key: string) => {
    const data = await pb.collection("users").getOne(pb.authStore.record!.id);

    const mappedLicenses = data.licenses.filter((x: any) => x.apiKey != key);

    data.licenses = mappedLicenses;

    licenses = mappedLicenses;

    await pb.collection("users").update(pb.authStore.record!.id, data);
  };

  const socket = io("https://api.totlaunloc.top", {
    transports: ["websockets"],
    withCredentials: true
  })

  const confirmDelete = async () => {

    // IntegrateThisMimi
    // socket.emit("appDelete", machineToDelete);
    socket.emit("deletesocket", {machineId: machineToDelete, location: "user"})
    console.log("sent socket")

    console.log(`Deleting passwords from machine: ${machineToDelete}`);
    showDeleteConfirmation = false;
    machineToDelete = "";
  };

  const confirmDeleteAll = async () => {
    console.log(`Deleting all passwords from machines linked to API Key: ${apiKeyToDeleteAll}`);
    // IntegrateThisMimi
    showDeleteAllConfirmation = false;
    apiKeyToDeleteAll = "";
  };

  const showDeleteConfirm = (machineName: string) => {
    machineToDelete = machineName;
    showDeleteConfirmation = true;
  };

  const showDeleteAllConfirm = (apiKey: string) => {
    apiKeyToDeleteAll = apiKey;
    showDeleteAllConfirmation = true;
  };

  const showApiKeyModal = (key: string) => {
    modalApiKey = key;
    showModal = true;
  };
</script>

<div class="max-w-7xl mx-auto p-4 md:p-8">
  <h2
    class="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
  >
    Manage Your Infrastructure
  </h2>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- API Key Management -->
    <div
      class="bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700"
    >
      <h3 class="text-3xl font-semibold mb-4 text-purple-300">
        Your API Keys: {licenses.length}
      </h3>
      <p class="text-neutral-300 mb-6 leading-relaxed">
        Generate and manage API keys. You have used {licenses.length} of {apiKeyLimit}
        keys.
      </p>

      <div class="mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          bind:value={apiKeySearchTerm}
          class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div class="mb-6">
        <h4 class="text-xl font-semibold mb-2 text-neutral-200">
          Generate New API Key
        </h4>
        {#if newApiKey}
          <div class="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              readonly
              bind:value={newApiKey}
              class="flex-grow bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-2 text-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Enter Nickname"
              bind:value={newApiKeyNickname}
              class="bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-2 text-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onclick={addApiKey}
              class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Add Key
            </button>
          </div>
        {:else if licenses.length < apiKeyLimit}
          <button
            onclick={generateApiKey}
            class="w-full bg-transparent hover:bg-neutral-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 border border-purple-600 hover:border-purple-500"
          >
            Generate New API Key
          </button>
        {:else}
          <p class="text-center text-lg text-yellow-400">
            API Key limit reached
          </p>
        {/if}
      </div>

      <div
        class="border border-neutral-700 rounded-lg p-6 bg-neutral-900 min-h-[200px]"
      >
        {#if licenses.length > 0}
          <ul class="overflow-auto h-38">
            {#each licenses.filter((l) => l.apiKeyName
                .toLowerCase()
                .includes(apiKeySearchTerm.toLowerCase())) as license}
              <li
                class="flex justify-between items-center p-2 rounded-lg hover:bg-neutral-800"
              >
                <span class="font-mono text-sm text-neutral-300"
                  >{license.apiKeyName}</span
                >
                <div class="flex gap-2">
                  <button
                    onclick={() => deleteKey(license.apiKey)}
                    aria-label="Delete API Key"
                    class="text-neutral-400 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 25 25"
                      fill="currentColor"
                      ><path
                        d="M 10 2 L 9 3 L 5 3 C 4.4 3 4 3.4 4 4 C 4 4.6 4.4 5 5 5 L 7 5 L 17 5 L 19 5 C 19.6 5 20 4.6 20 4 C 20 3.4 19.6 3 19 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.1 5.9 22 7 22 L 17 22 C 18.1 22 19 21.1 19 20 L 19 7 L 5 7 z M 9 9 C 9.6 9 10 9.4 10 10 L 10 19 C 10 19.6 9.6 20 9 20 C 8.4 20 8 19.6 8 19 L 8 10 C 8 9.4 8.4 9 9 9 z M 15 9 C 15.6 9 16 9.4 16 10 L 16 19 C 16 19.6 15.6 20 15 20 C 14.4 20 14 19.6 14 19 L 14 10 C 14 9.4 14.4 9 15 9 z"
                      /></svg
                    >
                  </button>
                  <button
                    onclick={() => copyToClipboard(license.apiKey)}
                    aria-label="Copy API Key"
                    class="text-neutral-400 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      ><path
                        d="M8 2a1 1 0 00-1 1v1H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-2V3a1 1 0 00-1-1H8zM7 4h6v1H7V4zM6 8a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                      /></svg
                    >
                  </button>
                  <button
                    onclick={() => showApiKeyModal(license.apiKey)}
                    aria-label="Show API Key"
                    class="text-neutral-400 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      ><path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 11a1 1 0 112 0v4a1 1 0 11-2 0v-4zm2-5a1 1 0 10-2 0v.01a1 1 0 102 0V6z"
                        clip-rule="evenodd"
                      /></svg
                    >
                  </button>
                </div>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-neutral-400 text-lg text-center pt-8">
            No API keys generated yet.
          </p>
        {/if}
      </div>
    </div>

    <!-- Machine Management -->
    <div
      class="bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700"
    >
      <h3 class="text-3xl font-semibold mb-4 text-blue-300">Machines</h3>
      <p class="text-neutral-300 mb-6 leading-relaxed">
        See all connected machines, monitor their status, and manage pairings.
      </p>

      <div class="mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          bind:value={machineSearchTerm}
          class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="mb-6">
        <label
          for="api-key-select"
          class="block text-lg font-medium text-neutral-300 mb-2"
          >View machines for API Key:</label
        >
        <select
          id="api-key-select"
          bind:value={selectedApiKey}
          class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {#each licenses as license}
            <option value={license.apiKey}>{license.apiKeyName}</option>
          {/each}
        </select>
      </div>

      <div class="mb-6">
        <button
          onclick={() => showDeleteAllConfirm(selectedApiKey)}
          class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Delete All Passwords from Machines using this API Key
        </button>
      </div>

      <div
        class="border border-neutral-700 rounded-lg p-6 bg-neutral-900 min-h-[200px]"
      >
        {#if licenses}
          <ul class="overflow-auto h-38">
            {#each licenses as license}
              {#if license.apiKey == selectedApiKey}
                {#each license.machines.filter((m: any) => m.name
                    .toLowerCase()
                    .includes(machineSearchTerm.toLowerCase())) as machine}
                  <li
                    class="flex justify-between items-center p-2 rounded-lg hover:bg-neutral-800"
                  >
                    <span class="font-mono text-sm text-neutral-300"
                      >{machine.name}</span
                    >
                    <div class="flex gap-2">
                      <button
                        onclick={() => showDeleteConfirm(machine.name)}
                        aria-label="Delete all passwords from this machine"
                        class="text-neutral-400 hover:text-white transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5"
                          viewBox="0 0 25 25"
                          fill="currentColor"
                          ><path
                            d="M 10 2 L 9 3 L 5 3 C 4.4 3 4 3.4 4 4 C 4 4.6 4.4 5 5 5 L 7 5 L 17 5 L 19 5 C 19.6 5 20 4.6 20 4 C 20 3.4 19.6 3 19 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.1 5.9 22 7 22 L 17 22 C 18.1 22 19 21.1 19 20 L 19 7 L 5 7 z M 9 9 C 9.6 9 10 9.4 10 10 L 10 19 C 10 19.6 9.6 20 9 20 C 8.4 20 8 19.6 8 19 L 8 10 C 8 9.4 8.4 9 9 9 z M 15 9 C 15.6 9 16 9.4 16 10 L 16 19 C 16 19.6 15.6 20 15 20 C 14.4 20 14 19.6 14 19 L 14 10 C 14 9.4 14.4 9 15 9 z"
                          /></svg
                        >
                      </button>
                    </div>
                  </li>
                {/each}
              {/if}
            {/each}
          </ul>
          <!-- {licenses} -->
          <!-- <ul>
            {#each licenses as license}
              <li class="p-2 rounded-lg hover:bg-neutral-800 text-neutral-300">
                {license}
              </li>
            {/each}
          </ul> -->
        {:else}
          <p class="text-neutral-400 text-lg text-center pt-8">
            No machines registered for this API key.
          </p>
        {/if}
      </div>
      <div class="flex gap-4 mt-8"></div>
    </div>
  </div>
</div>

{#if showModal}
  <div
    transition:fly={{ y: -50, duration: 300 }}
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
  >
    <div
      class="bg-neutral-800 rounded-xl shadow-2xl p-8 border border-neutral-600 max-w-md w-full text-center"
    >
      <h3 class="text-2xl font-bold mb-4 text-purple-300">API Key</h3>
      <button
        onclick={() => copyToClipboard(modalApiKey)}
        class="font-mono bg-neutral-900 p-4 rounded-lg text-neutral-200 break-all cursor-pointer w-full text-left hover:bg-neutral-700"
        >{modalApiKey}</button
      >
      <button
        onclick={() => (showModal = false)}
        class="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
      >
        Close
      </button>
    </div>
  </div>
{/if}

{#if showDeleteConfirmation}
  <div
    transition:fly={{ y: -50, duration: 300 }}
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
  >
    <div
      class="bg-neutral-800 rounded-xl shadow-2xl p-8 border border-neutral-600 max-w-md w-full text-center"
    >
      <h3 class="text-2xl font-bold mb-4 text-red-400">Confirm Deletion</h3>
      <p class="text-neutral-300 mb-6">
        Are you sure you want to delete all passwords from this machine: <span class="font-bold">{machineToDelete}</span>?
      </p>
      <div class="flex justify-center gap-4">
        <button
          onclick={confirmDelete}
          class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Yes
        </button>
        <button
          onclick={() => (showDeleteConfirmation = false)}
          class="bg-neutral-600 hover:bg-neutral-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          No
        </button>
      </div>
    </div>
  </div>
{/if}

{#if showDeleteAllConfirmation}
  <div
    transition:fly={{ y: -50, duration: 300 }}
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
  >
    <div
      class="bg-neutral-800 rounded-xl shadow-2xl p-8 border border-neutral-600 max-w-md w-full text-center"
    >
      <h3 class="text-2xl font-bold mb-4 text-red-400">Confirm Bulk Deletion</h3>
      <p class="text-neutral-300 mb-6">
        Are you sure you want to delete all passwords from ALL machines linked to API Key: <span class="font-bold">{apiKeyToDeleteAll}</span>?
      </p>
      <div class="flex justify-center gap-4">
        <button
          onclick={confirmDeleteAll}
          class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Yes, Delete All
        </button>
        <button
          onclick={() => (showDeleteAllConfirmation = false)}
          class="bg-neutral-600 hover:bg-neutral-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          No
        </button>
      </div>
    </div>
  </div>
{/if}
