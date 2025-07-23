<script lang="ts">
  import { goto } from '$app/navigation';
  import { slide } from 'svelte/transition';
  import { onMount } from 'svelte';

  let username = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let message = $state('');

  let passwordStrength = $derived(checkPasswordStrength(password));

  let showLength = $state(false);
  let showUppercase = $state(false);
  let showNumber = $state(false);
  let showSpecialChar = $state(false);

  onMount(() => {
    setTimeout(() => { showLength = true; }, 200);
    setTimeout(() => { showUppercase = true; }, 400);
    setTimeout(() => { showNumber = true; }, 600);
    setTimeout(() => { showSpecialChar = true; }, 800);
  });

  function checkPasswordStrength(password: string) {
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasSufficientLength = password.length >= 10;

    let score = 0;
    if (hasUppercase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;
    if (hasSufficientLength) score++;

    return {
      hasUppercase,
      hasNumber,
      hasSpecialChar,
      hasSufficientLength,
      score
    };
  }

  async function register() {
    if (password !== confirmPassword) {
      message = "Passwords do not match!";
      return;
    }

    if (passwordStrength.score < 4) {
      if (!passwordStrength.hasSufficientLength) {
        message = "Password must be at least 10 characters long.";
      } else if (!passwordStrength.hasUppercase) {
        message = "Password must contain at least one uppercase letter.";
      } else if (!passwordStrength.hasNumber) {
        message = "Password must contain at least one number.";
      } else if (!passwordStrength.hasSpecialChar) {
        message = "Password must contain at least one special character.";
      }
      return;
    }

    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      message = "Registration successful! Redirecting to login...";
      setTimeout(() => {
        goto('/login');
      }, 2000);
    } else {
      const error = await response.text();
      message = error || "An error occurred during registration.";
    }
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    register();
  }
</script>

<div class="flex items-center justify-center h-full bg-cover bg-center">
  <div class="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20">
    <h1 class="text-3xl font-bold text-center text-white">Register</h1>
    <form onsubmit={handleSubmit} class="space-y-6">
      <div>
        <label for="username" class="block mb-2 text-sm font-medium text-gray-200">Email</label>
        <input type="email" id="username" bind:value={username} class="w-full px-4 py-2 text-white bg-white/10 border border-white/20 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
      </div>
      <div>
        <label for="password" class="block mb-2 text-sm font-medium text-gray-200">Password</label>
        <input type="password" id="password" bind:value={password} class="w-full px-4 py-2 text-white bg-white/10 border border-white/20 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
      </div>
      <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <div class="w-1/4 h-2 rounded-full {passwordStrength.score >= 1 ? 'bg-green-500' : 'bg-gray-600'}"></div>
            <div class="w-1/4 h-2 rounded-full {passwordStrength.score >= 2 ? 'bg-green-500' : 'bg-gray-600'}"></div>
            <div class="w-1/4 h-2 rounded-full {passwordStrength.score >= 3 ? 'bg-green-500' : 'bg-gray-600'}"></div>
            <div class="w-1/4 h-2 rounded-full {passwordStrength.score >= 4 ? 'bg-green-500' : 'bg-gray-600'}"></div>
          </div>
          <ul class="text-xs text-gray-300 space-y-1">
            <li class="password-criteria {showLength ? 'visible' : ''} {passwordStrength.hasSufficientLength ? 'text-green-400' : 'text-red-400'}">
              {passwordStrength.hasSufficientLength ? '✓' : '✗'} At least 10 characters
            </li>
            <li class="password-criteria {showUppercase ? 'visible' : ''} {passwordStrength.hasUppercase ? 'text-green-400' : 'text-red-400'}">
              {passwordStrength.hasUppercase ? '✓' : '✗'} At least one uppercase letter
            </li>
            <li class="password-criteria {showNumber ? 'visible' : ''} {passwordStrength.hasNumber ? 'text-green-400' : 'text-red-400'}">
              {passwordStrength.hasNumber ? '✓' : '✗'} At least one number
            </li>
            <li class="password-criteria {showSpecialChar ? 'visible' : ''} {passwordStrength.hasSpecialChar ? 'text-green-400' : 'text-red-400'}">
              {passwordStrength.hasSpecialChar ? '✓' : '✗'} At least one special character
            </li>
          </ul>
        </div>
      <div>
        <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-200">Confirm Password</label>
        <input type="password" id="confirm-password" bind:value={confirmPassword} class="w-full px-4 py-2 text-white bg-white/10 border border-white/20 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
      </div>
      <button type="submit" class="w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300">Register</button>
    </form>
    <p class="text-center text-gray-300">
      Already have an account? <a href="/login" class="text-blue-400 hover:underline">Login here</a>
    </p>
    {#if message}
      <p class="mt-4 text-center text-sm text-red-400">{message}</p>
    {/if}
  </div>
</div>

<style>
  .password-criteria {
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
  }

  .password-criteria.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .password-criteria:nth-child(1).visible {
    transition-delay: 0.2s;
  }
  .password-criteria:nth-child(2).visible {
    transition-delay: 0.4s;
  }
  .password-criteria:nth-child(3).visible {
    transition-delay: 0.6s;
  }
  .password-criteria:nth-child(4).visible {
    transition-delay: 0.8s;
  }
</style>

