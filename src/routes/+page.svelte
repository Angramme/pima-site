
<script>
    import links from "../data/external-links.json"
    import admins from "../data/admins.json"
</script>

<h1>
    <b>D</b>ouble<br/>
    <b>M</b>ajeure<br/>
    <b>M</b>athématiques<br/>
    <b>I</b>nformatique<br/>
</h1>

<p>Site <i>non-officiel</i> DMMI/PIMA.</p>

<hr/>

<p>
    Ce site est entretenu par les étudiants de la double majeure Mathématiques et Informatique à Sorbonne Université. L'autre acronyme commun pour ce dernier est PIMA.  
</p>

<p>
    Ce site a pour but de regrouper les resources utiles, par exemple les comptes rendu <i>pdf</i> des anciens étudiant, les instructions pour récevoir les documents administratifs (ex: descriptifs des UEs), conseils pour les lettres de recommandation, letrres de motivation, CV etc.
</p>

<p>
    L'idée est aussi de centraliser un peu les resources des PIMA des années precendetes et avoir un portail un peu global pour toute les années.
</p>

<h2>Liens externes</h2>
{#each Object.entries(links) as [category, lks]}
<h3>{category}:</h3>
<ul>
    {#each Object.keys(lks) as lk}
        <li>{lk}: <a href="/restricted/external/{lk}" target=”_blank”  data-sveltekit-preload-data="off" data-sveltekit-preload-code="off">lien</a></li>
    {/each}
</ul>
{/each}

<h2>Contribuer:</h2>
<p>
    Pour ajouter du contenu a ce site web, suivre les instructions sur la page <b>GitHub</b>. Pour ajouter du contenu sur le <b>Google Drive</b> contacter un des admin pour récevoir les droits.
</p>
<h4>Admins (details caches pour eviter les bots):</h4>
<ul>
    {#each Object.entries(admins) as [name, data]}
        <li>
            {name}: 
            {#each Object.entries(data) as [ctype, cadd]}
                <button on:click={()=>alert(`${ctype} = ${cadd}`)}>{ctype} </button>
            {/each}
        </li>
    {/each}
</ul>

<style>
    h1{
        font-weight: normal;
    }
    p{
        text-align: justify;
        text-justify: distribute;
    }

</style>
