<script lang="ts">
  import { fly } from 'svelte/transition';

  // Test data, need backend implementation
  let apiKeyLimit = 5;
  let apiKeys = [
    { key: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', nickname: 'Production Server' },
    { key: 'f0e9d8c7-b6a5-4321-fedc-ba9876543210', nickname: 'Staging Environment' }
  ];
  let machines = [
    { id: 'machine-001', apiKey: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', name: 'Web Server 1' },
    { id: 'machine-002', apiKey: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', name: 'Database Server' },
    { id: 'machine-003', apiKey: 'f0e9d8c7-b6a5-4321-fedc-ba9876543210', name: 'Test Machine A' }
  ];

  let newApiKey = '';
  let newApiKeyNickname = '';
  let selectedApiKey = apiKeys[0]?.key || '';
  let showModal = false;
  let modalApiKey = '';

  function generateApiKey() {
    if (apiKeys.length < apiKeyLimit) {
      newApiKey = crypto.randomUUID();
    } else {
      alert('API key limit reached.');
    }
  }

  function addApiKey() {
    if (newApiKey && newApiKeyNickname) {
      apiKeys = [...apiKeys, { key: newApiKey, nickname: newApiKeyNickname }];
      newApiKey = '';
      newApiKeyNickname = '';
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('API Key copied to clipboard!');
    });
  }

  function showApiKeyModal(key: string) {
    modalApiKey = key;
    showModal = true;
  }

  function checkForNewMachines() {
    // Request backend
    alert('Checking for new machines...');
  }

  // To be linked to real backend
  function addTestMachine() {
    if (selectedApiKey) {
      const newMachine = {
        id: `machine-${Math.random().toString(36).substring(2, 7)}`,
        apiKey: selectedApiKey,
        name: `Test Machine ${Math.floor(Math.random() * 100)}`
      };
      machines = [...machines, newMachine];
    } else {
      alert('Please select an API key first.');
    }
  }

  $: filteredMachines = machines.filter(m => m.apiKey === selectedApiKey);
</script>

<div class="max-w-7xl mx-auto p-4 md:p-8">
  <h2 class="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
    Manage Your Infrastructure
  </h2>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- API Key Management -->
    <div class="bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700">
      <h3 class="text-3xl font-semibold mb-4 text-purple-300">API Keys</h3>
      <p class="text-neutral-300 mb-6 leading-relaxed">
        Generate and manage API keys. You have used {apiKeys.length} of {apiKeyLimit} keys.
      </p>

      <div class="mb-6">
        <h4 class="text-xl font-semibold mb-2 text-neutral-200">Generate New API Key</h4>
        {#if newApiKey}
          <div class="flex flex-col sm:flex-row gap-4">
            <input type="text" readonly bind:value={newApiKey} class="flex-grow bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-2 text-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <input type="text" placeholder="Enter Nickname" bind:value={newApiKeyNickname} class="bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-2 text-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <button on:click={addApiKey} class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
              Add Key
            </button>
          </div>
        {:else if apiKeys.length < apiKeyLimit}
          <button on:click={generateApiKey} class="w-full bg-transparent hover:bg-neutral-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 border border-purple-600 hover:border-purple-500">
            Generate New API Key
          </button>
        {:else}
           <p class="text-center text-lg text-yellow-400">API Key limit reached</p>
        {/if}
      </div>

      <div class="border border-neutral-700 rounded-lg p-6 bg-neutral-900 min-h-[200px]">
        <h4 class="text-xl font-semibold mb-4 text-neutral-200">Your API Keys</h4>
        {#if apiKeys.length > 0}
          <ul>
            {#each apiKeys as apiKey}
              <li class="flex justify-between items-center p-2 rounded-lg hover:bg-neutral-800">
                <span class="font-mono text-sm text-neutral-300">{apiKey.nickname}</span>
                <div class="flex gap-2">
                  <button on:click={() => copyToClipboard(apiKey.key)} aria-label="Copy API Key" class="text-neutral-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 2a1 1 0 00-1 1v1H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-2V3a1 1 0 00-1-1H8zM7 4h6v1H7V4zM6 8a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" /></svg>
                  </button>
                  <button on:click={() => showApiKeyModal(apiKey.key)} aria-label="Show API Key" class="text-neutral-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 11a1 1 0 112 0v4a1 1 0 11-2 0v-4zm2-5a1 1 0 10-2 0v.01a1 1 0 102 0V6z" clip-rule="evenodd" /></svg>
                  </button>
                </div>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-neutral-400 text-lg text-center pt-8">No API keys generated yet.</p>
        {/if}
      </div>
    </div>

    <!-- Machine Management -->
    <div class="bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700">
      <h3 class="text-3xl font-semibold mb-4 text-blue-300">Machines</h3>
      <p class="text-neutral-300 mb-6 leading-relaxed">
        Oversee all connected machines, monitor their status, and manage pairings.
      </p>

      <div class="mb-6">
        <label for="api-key-select" class="block text-lg font-medium text-neutral-300 mb-2">View machines for API Key:</label>
        <select id="api-key-select" bind:value={selectedApiKey} class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {#each apiKeys as apiKey}
            <option value={apiKey.key}>{apiKey.nickname}</option>
          {/each}
        </select>
      </div>

      <div class="border border-neutral-700 rounded-lg p-6 bg-neutral-900 min-h-[200px]">
        {#if filteredMachines.length > 0}
          <ul>
            {#each filteredMachines as machine}
              <li class="p-2 rounded-lg hover:bg-neutral-800 text-neutral-300">
                {machine.name}
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-neutral-400 text-lg text-center pt-8">No machines registered for this API key.</p>
        {/if}
      </div>
       <div class="flex gap-4 mt-8">
        <button on:click={checkForNewMachines} class="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-neutral-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 border border-green-600 hover:border-green-500">
          Check for New Machines
        </button>
        <button on:click={addTestMachine} class="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
          Add Test Machine
        </button>
      </div>
    </div>
  </div>
</div>

{#if showModal}
<div transition:fly={{ y: -50, duration: 300 }}
     class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
  <div class="bg-neutral-800 rounded-xl shadow-2xl p-8 border border-neutral-600 max-w-md w-full text-center">
    <h3 class="text-2xl font-bold mb-4 text-purple-300">API Key</h3>
    <p class="font-mono bg-neutral-900 p-4 rounded-lg text-neutral-200 break-all">{modalApiKey}</p>
    <button on:click={() => showModal = false} class="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
      Close
    </button>
  </div>
</div>
{/if}