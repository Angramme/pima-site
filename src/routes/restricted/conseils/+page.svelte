

<script>

export let data;

</script>


<h1>Conseils des anciens</h1>

<p>Conseils des anciens du parcours listés par l'ordre de plus récent (année fin L3).</p>

{#await data.streamed.descs}
Chargement...
{:then descs}
    {#each descs as des}
        <hr/>
        <h3>
            <a href={`/restricted/anciens/${des.id}`}>{des.prenom}</a> 
            <span style="float:right;font-size:80%;">
                {des.choisi}; 
                PIMA {des.grad_year-3}-{des.grad_year}
            </span>
        </h3>

        <p>{des.description}</p>
    {/each}
{/await}