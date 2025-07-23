<script>
	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let user;

	let clicked = false;

	function handleClick() {
		clicked = !clicked;
	}
</script>

<div
	class="user-card"
	on:click={handleClick}
	transition:scale={{ duration: 300, easing: quintOut }}
	style={clicked ? 'transform: scale(1.1); z-index: 10;' : ''}
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
	<div class="user-card-footer">
		<a href={`/restricted/anciens/${user.id}`}>View Profile</a>
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
	.user-card-footer {
		text-align: right;
	}
</style>
