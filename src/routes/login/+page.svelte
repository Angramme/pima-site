<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

    export let form: import('./$types').ActionData;

    export let data: import('./$types').PageData;

    onMount(()=>{
        invalidate("user:update");
    })
</script>

<div class="mx-auto mt-8 flex max-w-sm flex-col items-center justify-center gap-8">
	<Card.Root class="w-full">
		<Card.Header class="p-6 pb-3">
			<Card.Title class="text-2xl">Connexion</Card.Title>
			<Card.Description class="text-muted-foreground"
				>Entrez votre login et mot de passe pour vous connecter.</Card.Description
			>
		</Card.Header>
		<Card.Content class="p-6 pt-0">
			<form method="POST" use:enhance class="grid gap-4">
				{#if form?.missing}<p class="text-sm font-medium text-red-500">
						Le login <u>et</u> mot de passe sont primordiaux!
					</p>{/if}
				{#if form?.incorrect}<p class="text-sm font-medium text-red-500">
						Mot de passe ou login incorrect!
					</p>{/if}
				{#if form?.success}<p class="text-sm font-medium text-green-500">Connexion réussie!</p>{/if}

				<div class="grid gap-2">
					<Label for="user" class="">Login</Label>
					<Input id="user" type="text" name="login" required class="flex h-9 w-full rounded-md border px-3 py-1 text-sm" />
				</div>
				<div class="grid gap-2">
					<Label for="pwd" class="">Mot de passe</Label>
					<Input id="pwd" type="password" name="password" required class="flex h-9 w-full rounded-md border px-3 py-1 text-sm" />
				</div>

				<Button type="submit" class="w-full" disabled={false}>Connexion</Button>
				<Button variant="outline" class="w-full" disabled>Mot de passe ou identifiant oublié</Button>
			</form>
		</Card.Content>
		<Card.Footer class="text-center text-sm">
			<p>
				En vous connectant, vous acceptez notre <a href="/reglementation" class="underline"
					>réglementation</a
				>.
			</p>
		</Card.Footer>
	</Card.Root>

	<div class="w-full rounded-lg border p-4">
		<h3 class="mb-2 font-bold">Infos</h3>
		<p>Pour créer un compte, veuillez prendre contact avec l'un des administrateurs :</p>
		{#await data.streamed.admins}
			<p>Chargement des admins...</p>
		{:then admins}
			<ul class="mt-2 list-inside list-disc">
				{#each admins as { nom, prenom, email }}
					<li>
						{nom} {prenom} :
						<Button variant="link" class="h-auto p-0" on:click={() => alert(`email = ${email}`)}
							>contacter par email</Button
						>
					</li>
				{/each}
			</ul>
		{/await}
	</div>
</div>
