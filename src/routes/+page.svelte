
<script>
    import links from "$data/external-links.json"
    import admins from "$data/admins.json"
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
    Ce site a pour but de regrouper les resources utiles, par exemple les compte rendus <i>pdf</i> des anciens étudiant, les instructions pour recevoir les documents administratifs (ex: descriptifs des UEs), conseils pour les lettres de recommandation, lettre de motivation, CV etc.
</p>

<p>
    L'idée est aussi de centraliser un peu les resources des PIMA des années précédentes et avoir un portail un peu global pour toutes les années.
</p>

<h2>Liens externes : </h2>
{#each Object.entries(links) as [category, lks]}
<h3>{category} : </h3>
<ul>
    {#each Object.keys(lks) as lk}
        <li>{lk} : <a href="/restricted/external/{lk}" target=”_blank”  data-sveltekit-preload-data="off" data-sveltekit-preload-code="off">lien</a></li>
    {/each}
</ul>
{/each}

<h2>Contribuer :</h2>
<p>
    Pour ajouter du contenu à ce site web, veuillez suivre les instructions sur la page <b>GitHub</b> (<a target="_blank" href="https://github.com/Angramme/pima-site">lien</a>). Pour ajouter du contenu sur le <b>Google Drive</b> contacter un des admins pour recevoir les droits. Pour connaitre les admins, chercher simplement "admin" sur la page "anciens".
</p>

<style>
    h1{
        font-weight: normal;
    }
    p{
        text-align: justify;
        text-justify: distribute;
    }

</style>
