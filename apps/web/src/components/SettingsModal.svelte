<script lang="ts">
	import { validateConfig } from 'tinybird-generator';
	import Modal from '../components/Modal.svelte';

	export let on_close: () => void;

	const endpoint_options = [
		{ label: 'EU (GCP)', value: 'eu_gcp' },
		{ label: 'US (GCP)', value: 'us_gcp' }
	];

	const url_params = new URLSearchParams(
		typeof window !== 'undefined' ? window.location.search : ''
	);
	let endpoint = url_params.get('host') || '';
	let token = url_params.get('token') || '';
	let datasource = url_params.get('datasource') || '';
	let eps = parseInt(url_params.get('eps') || '1');
	let error = '';

	function handle_submit() {
		if (validateConfig({ datasource, endpoint, token })) {
			const url_params = new URLSearchParams(window.location.search);
			url_params.set('host', endpoint.toString());
			url_params.set('token', token.toString());
			url_params.set('datasource', datasource.toString());
			url_params.set('eps', eps.toString());
			window.history.pushState({}, '', `?${url_params}`);
			on_close();
		} else {
			error = 'Invalid configuration';
		}
	}
</script>

<Modal on:close={on_close}>
	<h3 class="font-bold text-2xl mb-5">Settings</h3>
	<form
		on:submit|preventDefault={handle_submit}
		class="grid grid-cols-2 items-center justify-between gap-6"
	>
		<label for="datasource">Data Source</label>
		<input id="datasource" bind:value={datasource} class="input-base" />

		<label for="token">API Token</label>
		<input id="token" bind:value={token} class="input-base" />

		<label for="endpoint">Endpoint</label>
		<select id="endpoint" bind:value={endpoint} class="input-base">
			{#each endpoint_options as { label, value }}
				<option {value}>{label}</option>
			{/each}
		</select>

		<label for="eps">EPS</label>
		<input id="eps" bind:value={eps} type="number" class="input-base" />
		<p class="text-red-500">{error}</p>
		<button type="submit" class="btn-base bg-tb_emerald text-white col-span-2">Save</button>
	</form>
</Modal>
