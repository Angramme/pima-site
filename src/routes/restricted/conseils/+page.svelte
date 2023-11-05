

<script>
    import Markdown from "$lib/components/Markdown.svelte";
    import Rolldown from "$lib/components/Rolldown.svelte";


export let data;

</script>


<h1>Conseils des anciens</h1>

<p>Conseils des anciens du parcours listés par l'ordre de plus récent (année fin L3).</p>

{#await data.streamed.descs}
Chargement...
{:then descs}
    {#each descs as des}
    {#if des.description.length > 7}
    <div class="conseil">
        <hr/>
        <h3>
            <a href={`/restricted/anciens/${des.id}`}>{des.prenom}</a> 
            <span style="float:right;font-size:80%;">
                {des.choisi}; 
                PIMA {des.grad_year-3}-{des.grad_year}
            </span>
        </h3>
    
        <Rolldown>
            <Markdown markdown={des.description}/>
        </Rolldown>
    </div>
    {/if}
    {/each}
{/await}

<style>
    div.conseil{
        padding-bottom: 0.2rem;
    }
    div.conseil a {
        text-decoration: wavy underline var(--accent-color);
    }
</style>