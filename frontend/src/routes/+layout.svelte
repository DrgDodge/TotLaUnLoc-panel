<script lang="ts">
	import "../app.css";
	import { page } from "$app/stores";
	import { fade, fly } from "svelte/transition";
	import { spring } from "svelte/motion";
	import { goto } from "$app/navigation";
	import version from "./version.json";
	import { quintOut } from "svelte/easing";

	let { children } = $props();

	let homeLink: HTMLAnchorElement;
	let aboutLink: HTMLAnchorElement;
	let downloadLink: HTMLAnchorElement;
	let pricingLink: HTMLAnchorElement;
	let adminLink: HTMLAnchorElement;

	let indicator = spring(
		{ left: 0, width: 0 },
		{
			stiffness: 0.08,
			damping: 0.6,
		},
	);

	const navLinkText = $derived('Account');
	const navLinkHref = "/admin";

	function updateIndicatorPosition() {
		requestAnimationFrame(() => {
			let activeLinkElement: HTMLAnchorElement | undefined;

			if ($page.url.pathname === "/") {
				activeLinkElement = homeLink;
			} else if ($page.url.pathname === "/about") {
				activeLinkElement = aboutLink;
			} else if ($page.url.pathname === "/download") {
				activeLinkElement = downloadLink;
			} else if ($page.url.pathname.startsWith("/admin")) {
				activeLinkElement = adminLink;
			} else if ($page.url.pathname === "/pricing") {
				activeLinkElement = pricingLink;
			}

			if (activeLinkElement) {
				indicator.set({
					left: activeLinkElement.offsetLeft,
					width: activeLinkElement.offsetWidth,
				});
			} else {
				indicator.set({ left: 0, width: 0 });
			}
		});
	}

	$effect(() => {
		$page.url.pathname;
		updateIndicatorPosition();
	});

	$effect(() => {
		if (homeLink && aboutLink && downloadLink && pricingLink && adminLink) {
			updateIndicatorPosition();
		}
	});
</script>

<div
	class="min-h-screen flex flex-col bg-gradient-to-br from-neutral-950 to-neutral-800 text-neutral-100 font-lexend"
>
	<div class="w-full fixed top-0 left-0 right-0 flex justify-center pt-4">
		<header
			class="z-50 bg-neutral-900/30 backdrop-blur-lg rounded-full p-4 shadow-lg flex items-center justify-between border border-neutral-700 transition-all duration-1000 ease-in-out"
			style={$page.url.pathname.startsWith("/admin")
				? "width: 615px"
				: "width: 540px"}
		>
			<nav class="px-4 flex relative">
				<div
					class="nav-indicator absolute bottom-0 left-0 h-1 bg-blue-400 rounded-t-full"
					style="transform: translateX({$indicator.left}px); width: {$indicator.width}px;"
				></div>
				<a
					bind:this={homeLink}
					href="/"
					class="nav-link text-neutral-300 hover:text-blue-400 transition-colors duration-200 text-lg font-medium px-4 py-2"
					>Home</a>
				<a
					bind:this={aboutLink}
					href="/about"
					class="nav-link text-neutral-300 hover:text-blue-400 transition-colors duration-200 text-lg font-medium px-4 py-2"
					>About</a>
				<a
					bind:this={downloadLink}
					href="/download"
					class="nav-link text-neutral-300 hover:text-blue-400 transition-colors duration-200 text-lg font-medium px-4 py-2"
					>Download</a>
				<a
					bind:this={pricingLink}
					href="/pricing"
					class="nav-link text-neutral-300 hover:text-blue-400 transition-colors duration-200 text-lg font-medium px-4 py-2"
					>Pricing</a>
				<a
					bind:this={adminLink}
					href={navLinkHref}
					class="nav-link text-neutral-300 hover:text-blue-400 transition-colors duration-200 text-lg font-medium px-4 py-2 whitespace-nowrap"
					>{navLinkText}</a>
			</nav>
			{#if $page.url.pathname.startsWith("/admin")}
				<div
					transition:fly={{ x: 20, duration: 500, easing: quintOut }}
				>
					<button
						onclick={() => {
							sessionStorage.removeItem("isLoggedIn");
							goto("/login");
						}}
						class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-100"
					>
						Logout
					</button>
				</div>
			{/if}
		</header>
	</div>

	<main
		class="flex-1 flex flex-col items-center justify-center pt-24 p-8"
		transition:fade
	>
		{@render children()}
	</main>

	<footer
		class="fixed bottom-4 w-full flex justify-between items-center px-4"
	>
		<div
			class="bg-neutral-900/30 backdrop-blur-lg rounded-full py-2 px-4 shadow-lg border border-neutral-700"
		>
			<p class="text-neutral-400 text-sm">
				TotLaUnLoc Panel v{version.version}
			</p>
		</div>
		<div
			class="bg-neutral-900/30 backdrop-blur-lg rounded-full py-2 px-4 shadow-lg border border-neutral-700"
		>
			<p class="text-neutral-400 text-sm">
				&copy; 2025 TotLaUnLoc. All rights reserved.
			</p>
		</div>
	</footer>
</div>

<style>
	.nav-link {
		position: relative;
		z-index: 10;
	}
	.nav-indicator {
		will-change: transform, width;
	}
</style>
