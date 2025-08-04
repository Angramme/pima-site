<script>
	import { getContext, onMount } from 'svelte';
	import { page } from '$app/stores';

	const pages = [
		['/', 'Accueil'],
		['/restricted/anciens', 'Anciens'],
		['/conseils', 'Conseils'],
		['/restricted/external/Google Drive', 'Drive']
		// ["/restricted/faq", "FAQ"],
	];

	const user = getContext('user');

	let theme = 'dark';

	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

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

<div id="nav-cont">
	<nav>
		<div class="logo">
			<a href="/">Æ PIMA</a>
		</div>
		<div class="nav-links-actions-wrapper" class:open={isMenuOpen}>
			<div class="links">
				{#each pages as p}
					<a
						data-sveltekit-preload-data="off"
						data-sveltekit-preload-code="off"
						href={p[0]}
						class={$page.url.pathname == p[0] ? 'current' : ''}
					>
						{p[1]}
					</a>
				{/each}
			</div>
			<div class="actions">
				<button on:click={toggleTheme}>{theme === 'dark' ? '🌞' : '🌙'}</button>
				{#if $user}
					<a class="button" data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/restricted/user">
						{$user.prenom}
					</a>
				{:else}
					<a class="button" data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/login">
						connexion
					</a>
				{/if}
			</div>
		</div>
		<button class="hamburger" on:click={toggleMenu}>
			<span></span>
			<span></span>
			<span></span>
		</button>
	</nav>
</div>

<style>
	#nav-cont {
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		right: 0;
		background-color: transparent;
		transition: background-color 0.3s ease;
	}
	#nav-cont:hover {
		background-color: var(--background-color);
	}
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		backdrop-filter: blur(5px);
	}
	.logo {
		margin-right: 2rem;
	}
	.logo a {
		font-weight: bold;
		font-size: 1.5rem;
		text-decoration: none;
		color: var(--font-color);
	}

	.nav-links-actions-wrapper {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.hamburger {
		display: none;
		flex-direction: column;
		gap: 5px;
		cursor: pointer;
		background: none;
		border: none;
	}

	.hamburger span {
		display: block;
		width: 25px;
		height: 3px;
		background-color: var(--font-color);
	}
	.links {
		display: flex;
		gap: 1.5rem;
	}
	.links a {
		text-decoration: none;
		font-size: 1.1rem;
		color: var(--font-color);
		position: relative;
		text-transform: capitalize;
	}
	.links a::after {
		content: '';
		position: absolute;
		bottom: -5px;
		left: 0;
		width: 0;
		height: 2px;
		background-color: var(--accent-color);
		transition: width 0.3s ease;
	}
	.links a:hover::after,
	.links a.current::after {
		width: 100%;
	}
	.actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.actions button {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1.5rem;
	}
	.actions .button {
		padding: 0.5rem 1rem;
		border: 1px solid var(--accent-color);
		border-radius: 5px;
		text-decoration: none;
		color: var(--accent-color);
		transition: background-color 0.3s ease, color 0.3s ease;
	}
	.actions .button:hover {
		background-color: var(--accent-color);
		color: var(--background-color);
	}
	@media (max-width: 768px) {
		.nav-links-actions-wrapper {
			position: fixed;
			top: 0;
			left: 0;
			width: 250px;
			height: 100vh;
			background-color: rgba(30, 30, 30, 0.8);
			backdrop-filter: blur(10px);
			padding: 2rem;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			transform: translateX(-100%);
			transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s;
			z-index: 10;
			visibility: hidden;
			opacity: 0;
		}

		.nav-links-actions-wrapper.open {
			transform: translateX(0);
			visibility: visible;
			opacity: 1;
		}

		.hamburger {
			display: flex;
			z-index: 11;
		}

		.links, .actions {
			flex-direction: column;
			align-items: flex-start;
			gap: 1.5rem;
			width: 100%;
		}
	}
</style>