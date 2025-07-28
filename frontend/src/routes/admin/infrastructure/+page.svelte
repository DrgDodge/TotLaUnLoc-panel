<script lang="ts">
  import { io } from "socket.io-client";

  const apiUrl = "https://api.totlaunloc.top";
  console.log(`SvelteKit backend connecting to API at: ${apiUrl}`);

  const socket = io(`${apiUrl}/admin`, {
    withCredentials: true,
    timeout: 5000,
    reconnection: true,
    reconnectionAttempts: 3,
  });

  socket.on("existing_clients", (clients) => {
    connectedSockets = clients;
  });

  socket.on("client_connected", (client) => {
    connectedSockets.push(client);
  });

  socket.on("heartbeat", (data) => {
    console.log(data);
    connectedSockets.map((s) =>
      s.socketId === data.socketId ? { ...s, status: data.status } : s,
    );
  });

  socket.on("disconnect_signal", (data) => {
    connectedSockets = connectedSockets.filter(
      (s) => s.socketId !== data.socketId,
    );
  });

  let connectedSockets = $state<{ socketId: string; status: string, machineId: string, savedLicenseKey: string }[]>([]);
</script>

<div>
  <h1
    class="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 w-4xl h-20"
  >
    Infrastructure
  </h1>
  <div
    class="bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700"
  >
    <h3 class="text-3xl font-semibold mb-4 text-green-300">
      Connected Clients
    </h3>
    <div
      class="border border-neutral-700 rounded-lg p-6 bg-neutral-900 min-h-[200px]"
    >
      {#if connectedSockets.length > 0}
        <ul>
          {#each connectedSockets as s}
            <li
              class="flex justify-between items-center p-2 rounded-lg hover:bg-neutral-800"
            >
              <span class="font-mono text-sm text-neutral-300"
                >{JSON.stringify(s)}</span
              >
              <div class="flex gap-2">
                <span class="text-2xl">{s.status === "ok" ? "✔" : "❌"}</span>
              </div>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-neutral-400 text-lg text-center pt-8">
          No clients connected.
        </p>
      {/if}
    </div>
  </div>
</div>
