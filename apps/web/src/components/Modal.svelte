<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';

	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');

	let modal: HTMLElement;

	const handle_keydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			close();
			return;
		}

		if (e.key === 'Tab') {
			// trap focus
			const nodes = modal.querySelectorAll('*');
			const tabbable = Array.from(nodes).filter(
				(n) => (n as HTMLElement).tabIndex >= 0
			) as HTMLElement[];

			let index = document.activeElement
				? tabbable.indexOf(document.activeElement as HTMLElement)
				: -1;
			if (index === -1 && e.shiftKey) index = 0;

			index += tabbable.length + (e.shiftKey ? -1 : 1);
			index %= tabbable.length;

			tabbable[index].focus();
			e.preventDefault();
		}
	};

	const previously_focused =
		typeof document !== 'undefined' && (document.activeElement as HTMLElement);

	if (previously_focused) {
		onDestroy(() => {
			previously_focused.focus();
		});
	}
</script>

<svelte:window on:keydown={handle_keydown} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.67)]" on:click={close} />

<div
	class="absolute top-1/2 left-1/2 w-[calc(100vw-4rem)] max-w-[32rem] max-h-[calc(100vh-4rem)] overflow-auto -translate-x-1/2 -translate-y-1/2 p-4 rounded bg-white"
	role="dialog"
	aria-modal="true"
	bind:this={modal}
>
	<slot />
</div>
