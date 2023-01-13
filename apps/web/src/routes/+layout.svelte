<script lang="ts">
	import '../app.css';
	import SettingsModal from '../components/SettingsModal.svelte';

	let is_settings_modal_open = false;
</script>

<nav class="flex justify-between min-h-[3.25rem] px-3 py-2 shadow-sm" aria-label="main navigation">
	<a href="https://tinybird.co">
		<img src="/tblogo.svg" alt="Tinybird" width="112" height="28" />
	</a>

	<button
		class="btn-base bg-tb_emerald text-white"
		on:click={() => (is_settings_modal_open = true)}
	>
		Tinybird Settings
	</button>
</nav>

<main class="p-4 max-w-7xl mx-auto">
	<slot />
</main>

{#if is_settings_modal_open}
	<SettingsModal on_close={() => (is_settings_modal_open = false)} />
{/if}
