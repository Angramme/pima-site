<script>
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import Markdown from './Markdown.svelte';
	import UserProfileModal from './UserProfileModal.svelte';
	import { quintOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	/** @type {Partial<import('@prisma/client').User>} */
	export let user;
	/** @type {Partial<import('@prisma/client').User> | undefined} */
	export let me;

	let showModal = false;

	const toProperCase = (str) => {
		if (!str) return '';
		return str
			.toLowerCase()
			.split(/([ -])/g)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join('');
	};
</script>

{#if showModal}
	<UserProfileModal {user} {me} on:close={() => (showModal = false)}>
		<div class="user-profile">
			<div class="profile-header">
				<h2>{toProperCase(user.nom)} {toProperCase(user.prenom)}</h2>
				<div class="l3">L3 {user.grad_year}</div>
			</div>
			<div class="profile-details">
				<div class="profile-card">
					<h4>Contact</h4>
					<p>Email: {user.email}</p>
					<p>Contact: {user.contact}</p>
					<p>Nationalité: {user.nationalite}</p>
				</div>
				<div class="profile-card">
					<h4>Parcours</h4>
					<p>Admis: {user.admis}</p>
					<p>Choisi: {user.choisi}</p>
					<p>Moyenne L2: {user.moyenneL2}</p>
					<p>Moyenne L3: {user.moyenneL3}</p>
				</div>
				<div class="profile-card description">
					<h4>Description</h4>
					<Markdown markdown={user.description ?? ''} />
				</div>
				<div class="profile-card">
					<h4>Travails</h4>
					<p>{user.travails}</p>
				</div>
			</div>
		</div>
	</UserProfileModal>
{/if}

<div
	class="user-card"
	role="button"
	tabindex="0"
	on:click={() => (showModal = true)}
	on:keydown={(e) => e.key === 'Enter' && (showModal = true)}
	transition:scale={{ duration: 300, easing: quintOut }}
>
	<div class="user-card-header">
		<h3>{toProperCase(user.nom)} {toProperCase(user.prenom)}</h3>
		<div class="l3">L3 {user.grad_year}</div>
	</div>
	<div class="user-card-body">
		<p>{user.choisi}</p>
	</div>
</div>

<style>
	.user-card {
		background-color: color-mix(in srgb, var(--background-color) 90%, white);
		border: 1px solid #eee;
		border-radius: 10px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		padding: 20px;
		margin: 10px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		transition: all 0.3s ease;
		cursor: pointer;
	}
	.user-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
	}
	.user-card-header {
		margin-bottom: 15px;
	}
	.user-card-header h3 {
		margin: 0 0 10px 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
	.l3 {
		font-size: 0.9rem;
		color: #888;
	}
	.user-card-body {
		flex-grow: 1;
	}
	.user-profile .profile-header {
		margin-bottom: 2rem;
	}
	.user-profile .profile-header h2 {
		margin: 0 0 10px 0;
	}
	.user-profile .profile-details {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
	}
	.user-profile .profile-card {
		background-color: color-mix(in srgb, var(--background-color) 50%, transparent);
		padding: 1rem;
		border-radius: 10px;
	}
	.user-profile .profile-card h4 {
		margin-top: 0;
	}
	.description {
		grid-column: 1 / -1;
	}
</style>
