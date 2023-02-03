<script lang="ts">
	import { onMount } from 'svelte';
	import Prism from 'prismjs';
	import 'prismjs/components/prism-json';
	import {
		presetSchemas,
		validateSchema,
		initializeGenerator,
		createRowGenerator,
		type TinybirdRowGenerator,
		type TinybirdSchema
	} from '@tinybirdco/mockingbird';
	import { create_worker, stop_worker, start_worker } from '../lib/worker_builder';
	import { decompress_JSON, compress_JSON } from '../lib/helpers';

	const url_params = new URLSearchParams(
		typeof window !== 'undefined' ? window.location.search : ''
	);

	let preset_template_name = url_params.get('schema') as
		| (keyof typeof presetSchemas & string)
		| null;
	let preset_template: string;
	let worker: Worker | undefined;
	let rowGenerator: TinybirdRowGenerator | undefined;
	let is_saved = false;
	let is_generating = false;
	let validation_errors: string[] = [];
	let schema: TinybirdSchema | undefined;
	let sample_code = 'Click Save to preview...';
	let messages_sent_total = 0;
	let messages_sent_session = 0;

	onMount(() => {
		const url_params = new URLSearchParams(
			typeof window !== 'undefined' ? window.location.search : ''
		);
		const schema = url_params.get('schema');

		if (schema && schema in presetSchemas) {
			preset_template = JSON.stringify(
				presetSchemas[schema as keyof typeof presetSchemas],
				null,
				4
			);
			preset_template_name = schema as keyof typeof presetSchemas;
		} else if (schema) {
			let text_json = decompress_JSON(schema);
			preset_template = JSON.stringify(JSON.parse(text_json), null, 4);
		} else {
			preset_template = JSON.stringify(presetSchemas.Default, null, 4);
			preset_template_name = 'Default';
		}
	});

	function start_generating() {
		if (!schema) return;

		const url_params = new URLSearchParams(
			typeof window !== 'undefined' ? window.location.search : ''
		);
		let endpoint = url_params.get('host') || '';
		let token = url_params.get('token') || '';
		let datasource = url_params.get('datasource') || '';
		let eps = parseInt(url_params.get('eps') ?? '1');
		const worker_params = { schema, datasource, endpoint, token, eps, limit: -1 };

		if (schema && initializeGenerator({ datasource, endpoint, token }, true) && is_saved) {
			worker = create_worker(
				worker_params,
				({ data }: MessageEvent<number>) => {
					messages_sent_session += data;
					messages_sent_total += data;
				},
				(e) => {
					console.log(e);
				}
			);

			if (!worker) return;

			start_worker(worker);
			is_generating = true;
			messages_sent_session = 0;
		}
	}

	// Stops the background generator worker
	function stop_generating() {
		if (!worker) return;

		stop_worker(worker);
		worker = undefined;
		is_generating = false;
	}

	const on_template_change = (e: Event) => {
		const url_params = new URLSearchParams(
			typeof window !== 'undefined' ? window.location.search : ''
		);
		url_params.set('schema', (e.target as HTMLSelectElement)?.value);
		window.history.pushState({}, '', `?${url_params}`);

		preset_template = JSON.stringify(
			preset_template_name ? presetSchemas[preset_template_name] : '',
			null,
			4
		);
	};

	const on_save_schema_click = () => {
		const url_params = new URLSearchParams(
			typeof window !== 'undefined' ? window.location.search : ''
		);

		try {
			schema = JSON.parse(preset_template);
			const validate = validateSchema(schema!);
			validation_errors = validate.errors;

			if (schema && validate.valid) {
				preset_template = JSON.stringify(JSON.parse(preset_template), null, 4);
				validation_errors = [];
				rowGenerator = createRowGenerator(schema);
				sample_code = JSON.stringify(rowGenerator.generate(), null, 4);

				if (
					preset_template_name &&
					preset_template !== JSON.stringify(presetSchemas[preset_template_name], null, 4)
				) {
					preset_template_name = null;
				}

				if (!preset_template_name) {
					let lzma = compress_JSON(schema);
					url_params.set('schema', lzma);
					window.history.pushState({}, '', `?${url_params}`);
				}

				is_saved = true;
			}
		} catch (e) {
			validation_errors = [(e as Error).toString()];
			sample_code = 'Save to start generating';
		}
	};

	const on_generation_click = () => {
		if (is_generating) stop_generating();
		else start_generating();
	};
</script>

<svelte:head>
	<link
		href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/themes/prism.min.css"
		rel="stylesheet"
	/>
</svelte:head>

<div class="flex flex-col sm:flex-row gap-6">
	<div class="flex-1 rounded shadow-lg bg-white p-6 flex flex-col gap-2">
		<p class="text-2xl font-semibold">{messages_sent_total}</p>
		<p class="text-xl font-normal text-gray-600">Messages Sent (Total)</p>
	</div>

	<div class="flex-1 rounded shadow-lg bg-white p-6 flex flex-col gap-2">
		<p class="text-2xl font-semibold">{messages_sent_session}</p>
		<p class="text-xl font-normal text-gray-600">Messages Sent (Session)</p>
	</div>
</div>

<button
	class="btn-base w-full my-4  bg-tb_emerald text-white"
	class:bg-opacity-40={!is_saved}
	disabled={!is_saved}
	on:click={on_generation_click}
>
	{is_generating ? 'Stop' : 'Start'} Generating!
</button>

<div class="rounded shadow-lg bg-white p-6 flex flex-col gap-4">
	<div class="flex justify-between">
		<p class="font-bold">Use a template</p>
		<select class="input-base" bind:value={preset_template_name} on:change={on_template_change}>
			{#each Object.keys(presetSchemas) as presetSchemaName}
				<option value={presetSchemaName}>{presetSchemaName}</option>
			{/each}
		</select>
	</div>

	<div class="flex flex-col sm:flex-row gap-6">
		<div class="flex-1 flex flex-col gap-4">
			<h2>Schema Builder</h2>
			<textarea
				bind:value={preset_template}
				class="min-h-[8rem] max-h-[40rem] overflow-y-auto p-3 border outline-gray-300 focus:outline-cyan-500"
			/>
			<button class="btn-base bg-tb_capri text-white" on:click={on_save_schema_click}>Save</button>
		</div>

		<div class="flex-1 flex flex-col gap-4">
			<h2>Data Preview</h2>
			<div class="min-h-[8rem] max-h-[40rem] overflow-y-auto p-3 bg-stone-50 whitespace-pre-wrap">
				{@html Prism.highlight(sample_code, Prism.languages.json, 'json')}
			</div>
		</div>
	</div>

	{#if validation_errors.length > 0}
		<ul>
			{#each validation_errors as validation_error}
				<ul class="text-red-500">{validation_error}</ul>
			{/each}
		</ul>
	{/if}
</div>
