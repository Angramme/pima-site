<script>
    import Banner from "$lib/components/Banner.svelte";
    import Markdown from "$lib/components/Markdown.svelte";
    import Rolldown from "$lib/components/Rolldown.svelte";
    import { getContext } from "svelte";

    export let data;

    const user = getContext("user");
</script>

<Banner title="Conseils" src="/img/banners/5.jpg" />

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
    Chargement...
{:then descs}
    {#each descs as des}
        {#if des.description.length > 7}
            <div class="conseil">
                <hr />
                <h3>
                    <a href={`/restricted/anciens/${des.id}`}>{des.prenom}</a>
                    <span style="float:right;font-size:80%;">
                        {des.choisi}; PIMA {des.grad_year - 3}-{des.grad_year}
                    </span>
                </h3>

                <Rolldown>
                    <Markdown markdown={des.description} />
                </Rolldown>
            </div>
        {/if}
    {/each}

    {#if descs.length == 0}
        {#if $user}
            Personne n'a encore partagé de conseil.
        {:else}
            Aucun conseil n'est publique pour le moment. Connectez-vous pour
            voir les conseils des anciens.
        {/if}
    {/if}
{/await}

<style>
    div.conseil {
        padding-bottom: 0.2rem;
    }
    div.conseil a {
        text-decoration: wavy underline var(--accent-color);
    }
</style>
