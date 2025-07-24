<script>
	import { onMount } from 'svelte';

	let x = 0;
	let y = 0;
	let rot = 0;

	function handleMousemove(event) {
		x = event.clientX;
		y = event.clientY;
		rot = Math.atan2(event.movementY, event.movementX) * (180 / Math.PI);
	}

	onMount(() => {
		window.addEventListener('mousemove', handleMousemove);
		return () => {
			window.removeEventListener('mousemove', handleMousemove);
		};
	});
</script>

<div class="interactive-background" style="--x: {x}px; --y: {y}px; --rot: {rot}deg" />

<style>
	.interactive-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none;
		z-index: -1;
	}
	.interactive-background::before {
		content: '';
		position: absolute;
		top: var(--y);
		left: var(--x);
		width: 50px;
		height: 50px;
		background: radial-gradient(
			circle at center,
			color-mix(in srgb, var(--accent-color) 50%, transparent),
			transparent 70%
		);
		transform: translate(-50%, -50%) rotate(var(--rot));
		clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
	}
</style>
