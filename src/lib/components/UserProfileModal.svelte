<script>
	import { createEventDispatcher } from 'svelte';
	import { enhance } from '$app/forms';

	/** @type {Partial<import('@prisma/client').User>} */
	export let user;
	/** @type {Partial<import('@prisma/client').User> | undefined} */
	export let me;

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}
</script>

<div
	class="modal-overlay"
	role="button"
	tabindex="0"
	on:click={closeModal}
	on:keydown={(e) => e.key === 'Escape' && closeModal()}
>
	<div class="modal-content" role="document" on:click|stopPropagation on:keydown>
		<button class="close-button" on:click={closeModal}>X</button>
		<slot />
		{#if me?.admin}
			<div class="admin-controls">
				<h4>Admin Controls</h4>
				<p>ID: {user.id}</p>
				<p>Last updated: {user.updatedAt}</p>
				<p>Sleeping: {user.sleeping}</p>
				<form method="POST" action="?/update_user_status" use:enhance>
					<input type="hidden" name="id" value={user.id} />
					<label for="sleeping">Sleeping:</label>
					<input type="checkbox" name="sleeping" checked={user.sleeping} />
					<button type="submit">Update</button>
				</form>
			</div>
		{/if}
	</div>
</div>

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}
	.modal-content {
		background-color: var(--background-color);
		padding: 2rem;
		border-radius: 10px;
		max-width: 80%;
		max-height: 80%;
		overflow-y: auto;
		position: relative;
	}
	.close-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
	}
</style>
