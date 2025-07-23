<script>
	import { onMount, onDestroy } from 'svelte';

	let vantaEffect;
	let vantaRef;

	onMount(() => {
		vantaEffect = window.VANTA.GLOBE({
			el: vantaRef,
			mouseControls: true,
			touchControls: true,
			gyroControls: false,
			minHeight: 200.0,
			minWidth: 200.0,
			scale: 1.0,
			scaleMobile: 1.0,
			color: 0xff3f81,
			backgroundColor: 0x121212
		});
	});

	onDestroy(() => {
		if (vantaEffect) {
			vantaEffect.destroy();
		}
	});
</script>

<div bind:this={vantaRef} class="vanta-background" />

<style>
	.vanta-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: -2;
	}
</style>
