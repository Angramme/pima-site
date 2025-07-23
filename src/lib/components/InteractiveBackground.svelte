<script>
	import { onMount } from 'svelte';

	let x = 0;
	let y = 0;

	function handleMousemove(event) {
		x = event.clientX;
		y = event.clientY;
	}

	onMount(() => {
		window.addEventListener('mousemove', handleMousemove);
		return () => {
			window.removeEventListener('mousemove', handleMousemove);
		};
	});
</script>

<div class="interactive-background" style="--x: {x}px; --y: {y}px" />

<style>
	.interactive-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none;
		z-index: -1;
		background: radial-gradient(
			circle at var(--x) var(--y),
			rgba(255, 62, 0, 0.2),
			transparent 20vw
		);
	}
</style>
