<script>
	import { getContext, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';

	const pages = [
		['/', 'accueil'],
		['/restricted/anciens', 'anciens'],
		['/conseils', 'conseils'],
		['/restricted/external/Google Drive', 'drive']
		// ["/restricted/faq", "FAQ"],
	];

	const user = getContext('user');

	let theme = 'dark';

	onMount(() => {
		if (localStorage.getItem('theme')) {
			theme = localStorage.getItem('theme');
		}
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		localStorage.setItem('theme', theme);
		document.documentElement.setAttribute('data-theme', theme);
	}
</script>

<div id="nav-cont" in:fade>
	<nav>
		<div class="logo">
			<span>Æ PIMA</span>
		</div>
		{#each pages as p}
			<div in:fade={{ delay: 200 }}>
				<a
					data-sveltekit-preload-data="off"
					data-sveltekit-preload-code="off"
					href={p[0]}
					class={$page.url.pathname == p[0] ? 'current' : ''}
				>
					{p[1]}
				</a>
			</div>
		{/each}
		<div class="login" in:fade={{ delay: 400 }}>
			<button on:click={toggleTheme}>{theme === 'dark' ? '🌞' : '🌙'}</button>
			{#if $user}
				<a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/restricted/user">
					{$user.prenom}
				</a>
			{:else}
				<a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/login">
					connexion
				</a>
			{/if}
		</div>
	</nav>
</div>

<style>
	#nav-cont {
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.2);
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	}
	@media (hover: hover) {
		#nav-cont {
			background: none;
		}
		nav {
			backdrop-filter: blur(5px);
		}
	}
	nav {
		display: flex;
		justify-content: right;
		align-items: center;
		padding: 1.5rem;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 1rem;
	}
	nav div * {
		font-weight: normal;
		text-decoration: none;
		font-size: 1.2rem;
		padding: 8px;
		margin: 5px;
		transition: all 0.3s ease;
	}
	a.current {
		color: var(--accent-color);
		border-bottom: 2px solid var(--accent-color);
	}
	.logo {
		flex-grow: 1;
		font-size: 1.5rem;
		font-weight: bold;
	}
	.login {
		border-left: 1px solid var(--font-color);
		padding-left: 1rem;
	}
</style>