<script lang="ts">
  
</script>


<div>
  <h1 class="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Infrastructure</h1>
  <div
      class="bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700"
    >
      <h3 class="text-3xl font-semibold mb-4 text-green-300">
        Connected Clients
      </h3>
      <div
        class="border border-neutral-700 rounded-lg p-6 bg-neutral-900 min-h-[200px]"
      >
        <!-- {#if connectedSockets.length > 0} -->
          <ul>
            <!-- {#each connectedSockets as s} -->
              <li
                class="flex justify-between items-center p-2 rounded-lg hover:bg-neutral-800"
              >
                <!-- <span class="font-mono text-sm text-neutral-300"
                  >{s.socketId}</span
                > -->
                <div class="flex gap-2">
                  <!-- <span class="text-2xl">{s.status === "ok" ? "✔" : "❌"}</span> -->
                </div>
              </li>
            <!-- {/each} -->
          </ul>
        <!-- {:else} -->
          <p class="text-neutral-400 text-lg text-center pt-8">
            No clients connected.
          </p>
        <!-- {/if} -->
      </div>
    </div>
</div>

