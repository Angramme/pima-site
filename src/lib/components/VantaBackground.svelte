<script>
	import { onMount, onDestroy } from 'svelte';

	let vantaEffect;
	let vantaRef;

	onMount(() => {
		vantaEffect = window.VANTA.CLOUDS({
			el: vantaRef,
			mouseControls: true,
			touchControls: true,
			gyroControls: false,
			minHeight: 200.0,
			minWidth: 200.0,
			skyColor: 0x68b8d7,
			cloudColor: 0xadc1c4,
			cloudShadowColor: 0x18354a,
			sunColor: 0x0,
			sunGlareColor: 0x0,
			sunlightColor: 0x0
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
