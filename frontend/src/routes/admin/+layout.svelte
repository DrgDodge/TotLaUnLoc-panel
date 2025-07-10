<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  onMount(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      goto("/login");
      return;
    }

    const res = await fetch("http://localhost:7355/auth/status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (!data.isAuthenticated) {
        goto("/login");
      }
    } else {
      goto("/login");
    }
  });
</script>

<slot />
