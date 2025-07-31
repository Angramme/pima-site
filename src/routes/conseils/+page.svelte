<script>
    import Banner from "$lib/components/Banner.svelte";
    import ConseilCard from "$lib/components/ConseilCard.svelte";
    import { getContext } from "svelte";

    export let data;

    const user = getContext("user");
</script>

<Banner title="Conseils" src="/img/banners/5.jpg" />

<div class="container">
    <h1>Conseils des anciens</h1>

    <p>
        Conseils des anciens du parcours listés par l'ordre de plus récent (année
        fin L3).
    </p>

    {#if !$user}
        <p>
            ⚠️ Vous voyez uniquement les conseils des anciens qui ont été partagés publiquement. <a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/login">Connectez-vous</a> pour voir tous les conseils. ⚠️
        </p>
    {/if}

    <br />

    {#await data.streamed.descs}
        <p>Chargement des conseils...</p>
    {:then descs}
        <div class="conseils-list">
            {#each descs as des (des.id)}
                {#if des.description.length > 7}
                    <ConseilCard user={des} me={$user} />
                {/if}
            {/each}
        </div>

        {#if descs.length == 0}
            {#if $user}
                <p>Personne n'a encore partagé de conseil.</p>
            {:else}
                <p>Aucun conseil n'est publique pour le moment. Connectez-vous pour voir les conseils des anciens.</p>
            {/if}
        {/if}
    {:catch error}
        <p style="color: red">Impossible de charger les conseils: {error.message}</p>
    {/await}
</div>

<style>
    .container {
        padding: 0 2rem;
    }
    .conseils-list {
        display: block;
    }
</style>
