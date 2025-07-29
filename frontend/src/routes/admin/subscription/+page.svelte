<script lang="ts">
    import { pb } from "$lib/utils";

  let customPackage = $state(false);
  let devices = $state(0);
  let keys = $state(0);

  function selectPackage(d: number, k: number) {
    devices = d;
    keys = k;
    customPackage = false;
  }

  function selectCustomPackage() {
    customPackage = true;
    devices = 0;
    keys = 0;
  }

  async function placeOrder() {

    if (devices == 0 || keys == 0) return alert("Could not process empty order!");

    const data = {
      userId: pb.authStore.record?.id,
      licensetype: "",
      machineLimit: devices,
      apiLimit: keys,
      status: "created"
    }

    if (customPackage) data.licensetype = "pro"
    else data.licensetype = "standard";

    await pb.collection("orders").create(data).then(() => alert("Order placed!")).catch(() => alert("Error! Could not place error!"));
  }
</script>

<div class="max-w-7xl mx-auto p-4 md:p-8">
  <h2
    class="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
  >
    Subscription Settings
  </h2>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div
      class="bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700"
    >
      <h3 class="text-3xl font-semibold mb-4 text-purple-300">
        Select a Package
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onclick={() => selectPackage(30, 3)}
          class="p-4 border rounded-lg bg-neutral-900 hover:bg-neutral-700 transition-colors duration-200"
          >30 Devices, 3 Keys</button
        >
        <button
          onclick={() => selectPackage(100, 10)}
          class="p-4 border rounded-lg bg-neutral-900 hover:bg-neutral-700 transition-colors duration-200"
          >100 Devices, 10 Keys</button
        >
        <button
          onclick={() => selectPackage(500, 50)}
          class="p-4 border rounded-lg bg-neutral-900 hover:bg-neutral-700 transition-colors duration-200"
          >500 Devices, 50 Keys</button
        >
        <button
          onclick={selectCustomPackage}
          class="p-4 border rounded-lg bg-neutral-900 hover:bg-neutral-700 transition-colors duration-200"
          >Custom</button
        >
      </div>
      <div class="pt-10">
        <button
          onclick={placeOrder}
          class="w-full bg-transparent hover:bg-neutral-700 text-white font-semibold py-6 px-6 rounded-lg transition-colors duration-200 border border-purple-600 hover:border-purple-500"
        >
          Place order
        </button>
      </div>
    </div>

    <div
      class="bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700"
    >
      <h3 class="text-3xl font-semibold mb-4 text-blue-300">Your Order</h3>
      <div class="space-y-4">
        <div>
          <label
            for="devices"
            class="block text-lg font-medium text-neutral-300 mb-2"
            >Number of Devices</label
          >
          <input
            type="number"
            id="devices"
            bind:value={devices}
            class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            readonly={!customPackage}
          />
        </div>
        <div>
          <label
            for="keys"
            class="block text-lg font-medium text-neutral-300 mb-2"
            >Number of Keys</label
          >
          <input
            type="number"
            id="keys"
            bind:value={keys}
            class="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            readonly={!customPackage}
          />
        </div>
      </div>

      <div class="mt-4">
        <h2 class="text-xl">Selected Package:</h2>
        <p>Devices: {devices}</p>
        <p>Keys: {keys}</p>
      </div>
    </div>
  </div>
</div>
