<script>
	import UserProfileModal from './UserProfileModal.svelte';
	import { quintOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let user;

	let showModal = false;
</script>

{#if showModal}
	<UserProfileModal {user} on:close={() => (showModal = false)}>
		<div class="user-profile">
			<h2>{user.nom} {user.prenom}</h2>
			<p>Email: {user.email}</p>
			<p>Contact: {user.contact}</p>
			<p>Nationalité: {user.nationalite}</p>
			<p>Admis: {user.admis}</p>
			<p>Choisi: {user.choisi}</p>
			<div class="description">
				<h4>Description:</h4>
				{@html user.description.replace(/\\n/g, '<br>')}
			</div>
			<p>Travails: {user.travails}</p>
			<p>Moyenne L2: {user.moyenneL2}</p>
			<p>Moyenne L3: {user.moyenneL3}</p>
		</div>
	</UserProfileModal>
{/if}

<div
	class="user-card"
	on:click={() => (showModal = true)}
	transition:scale={{ duration: 300, easing: quintOut }}
>
	<div class="user-card-header">
		<div class="initials">
			{user.prenom[0]}{user.nom[0]}
		</div>
		<h3>{user.nom} {user.prenom}</h3>
		<div class="l3">L3 {user.l3}</div>
	</div>
	<div class="user-card-body">
		<p>{user.choisi}</p>
	</div>
</div>

<style>
	.user-card {
		background-color: var(--background-color);
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		padding: 20px;
		margin: 20px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		transition: all 0.3s ease;
		cursor: pointer;
	}
	.user-card:hover {
		transform: scale(1.05);
	}
	.user-card-header {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
	}
	.initials {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: var(--accent-color);
		color: var(--background-color);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		font-weight: bold;
		margin-right: 20px;
	}
	.user-card-header h3 {
		margin: 0;
		flex-grow: 1;
	}
	.l3 {
		font-size: 0.9rem;
		color: #aaa;
	}
	.user-card-body {
		flex-grow: 1;
	}
	.user-profile h2 {
		margin-top: 0;
	}
	.description {
		margin-top: 1rem;
	}
	.description h4 {
		margin-bottom: 0.5rem;
	}
</style>
