<script lang="ts">
  let devices = $state(30);

  const licenseKeys = $derived(() => {
    if (devices > 100) {
      return 'Contact Us';
    } else {
      return Math.ceil(devices / 10);
    }
  });
  const estimatedPrice = $derived(() => {
    if (devices <= 30) {
      return 10;
    } else if (devices <= 100) {
      return 20;
    } else if (devices <= 500) {
      return 50;
    } else {
      return 'Contact Us';
    }
  });
</script>

<div class="flex flex-col items-center justify-center h-full p-8">
  <div class="bg-neutral-800 p-10 rounded-xl shadow-2xl text-center max-w-7xl w-full border border-neutral-700">
    <h2 class="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 leading-tight">
      TotLaUnLoc Licensing & Pricing
    </h2>
    <p class="text-xl text-neutral-300 mb-8 leading-relaxed">
      TotLaUnLoc desktop application is completely free for individual users. For organizations and IT professionals, we offer flexible licensing options to manage multiple devices.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-neutral-900 p-6 rounded-lg border border-neutral-700">
        <h3 class="text-2xl font-bold text-blue-400 mb-4">Individual User</h3>
        <p class="text-lg text-neutral-300 mb-4">Perfect for personal use.</p>
        <p class="text-4xl font-extrabold text-white mb-6">FREE</p>
        <ul class="list-disc list-inside text-left text-neutral-300 mb-6">
          <li>Secure password management</li>
          <li>TOTP generation</li>
          <li>Data breach checks</li>
          <li>Local encryption</li>
        </ul>
        <a href="/download" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
          Download Free Version
        </a>
      </div>

      <div class="bg-neutral-900 p-6 rounded-lg border border-neutral-700">
        <h3 class="text-2xl font-bold text-purple-400 mb-4">Organizational License</h3>
        <p class="text-lg text-neutral-300 mb-4">For IT professionals and businesses managing multiple devices.</p>
        <p class="text-4xl font-extrabold text-white mb-6">Contact Us</p>
        <ul class="list-disc list-inside text-left text-neutral-300 mb-6">
          <li>All features of Individual User</li>
          <li>Centralized management via TotLaUnLoc-panel</li>
          <li>License key management for multiple devices</li>
          <li>Dedicated support</li>
        </ul>
        <a href="https://totlaunloc-panel.com" target="_blank" class="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
          Learn More about TotLaUnLoc-panel
        </a>
      </div>
    </div>

    <div class="mt-12 bg-neutral-900 p-8 rounded-xl shadow-2xl border border-neutral-700 w-full">
      <h3 class="text-3xl font-bold text-green-400 mb-6">License Key Calculator</h3>
      <p class="text-lg text-neutral-300 mb-4">Estimate the number of license keys and monthly cost for your organization.</p>
      
      <div class="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
        <label for="devices" class="text-xl font-medium">Number of Devices: <span class="font-bold text-blue-400">{devices >= 1000 ? '1000+' : devices}</span></label>
        <input type="range" id="devices" bind:value={devices} min="30" max="1000" step="10" class="w-full md:w-96 h-4 bg-neutral-700 rounded-lg appearance-none cursor-pointer range-lg">
      </div>

      <div class="text-2xl text-neutral-200">
        <p class="mb-2">Max License Keys: <span class="font-bold text-blue-400">{licenseKeys()}</span></p>
        <p>Estimated Monthly Price: <span class="font-bold text-green-400">{estimatedPrice() === 'Contact Us' ? estimatedPrice() : `€${estimatedPrice()}`}</span></p>
      </div>
    </div>
  </div>
</div>