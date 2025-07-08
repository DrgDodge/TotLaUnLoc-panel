<script lang="ts">
  
</script>

<div class="max-w-5xl mx-auto">
      <h2 class="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Manage Your Infrastructure
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700">
          <h3 class="text-3xl font-semibold mb-4 text-blue-300">Machines</h3>
          <p class="text-neutral-300 mb-6 leading-relaxed">
            Oversee all connected machines, monitor their status, and deploy applications with ease.
          </p>
          <div class="border border-neutral-700 rounded-lg p-6 bg-neutral-900 min-h-[150px] flex items-center justify-center">
            <p class="text-neutral-400 text-lg">No machines registered yet. Click below to add one!</p>
            <!-- Future: Dynamic list/table of machines -->
          </div>
          <button class="mt-8 w-full flex items-center justify-center gap-2 bg-transparent hover:bg-neutral-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 border border-green-600 hover:border-green-500">
            Add New Machine
          </button>
        </div>

        <div class="bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700">
          <h3 class="text-3xl font-semibold mb-4 text-purple-300">API Keys</h3>
          <p class="text-neutral-300 mb-6 leading-relaxed">
            Generate, revoke, and manage API keys to control access to your services and applications.
          </p>
          <div class="border border-neutral-700 rounded-lg p-6 bg-neutral-900 min-h-[150px] flex items-center justify-center">
            <p class="text-neutral-400 text-lg">No API keys generated yet. Generate your first key!</p>
            <!-- Future: Dynamic list/table of API keys -->
          </div>
          <button class="mt-8 w-full flex items-center justify-center gap-2 bg-transparent hover:bg-neutral-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 border border-purple-600 hover:border-purple-500">
            Generate New API Key
          </button>
        </div>
      </div>
    </div>