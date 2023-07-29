
<script>
    import links from "$data/external-links.json"
    import admins from "$data/admins.json"
</script>

<h1 style="font-weight:normal;">
    <b>D</b>ouble<br/>
    <b>M</b>ajeure<br/>
    <b>M</b>athématiques<br/>
    <b>I</b>nformatique<br/>
</h1>

<p>
    Site <i>non-officiel</i> DMMI/PIMA. 
    <br/>"Æ PIMA" : "anciens étudiants du parcours PIMA"
</p>

<hr/>

<p>
    Ce site est entretenu par les étudiants de la double majeure Mathématiques et Informatique à Sorbonne Université. L'autre acronyme commun pour ce dernier est PIMA.  
</p>

<p>
    Ce site a pour but de regrouper les resources utiles, par exemple les compte rendus <i>pdf</i> des anciens étudiant, les instructions pour recevoir les documents administratifs (ex: descriptifs des UEs), conseils pour les lettres de recommandation, lettre de motivation, CV etc. L'idée est aussi de centraliser un peu les resources des PIMA des années précédentes et avoir un portail un peu global pour toutes les années.
</p>
<p>
    Ce site permet également de rechercher facilement des étudiants ayant fait certaines écoles ou acceptés dans certaines écoles (en effet il suffit de taper le nom de l'école dans la barre de recherche). Il est de même pour des entreprises, labos, unviersités a l'étranger etc. Ce site permet aux anciens d'écrire des conseils et descriptions pour les futures générations des PIMA et facilite la recherche par mot clef dans ces conseils. 
</p>
<p>
    Ce site, à condition que suffisament des étudiants s'inscrivent, offre donc un véritable réseau et base de savoir benefiques pour la vie academique et profesionelle. 
</p>

<h2>Liens externes : </h2>
<p>🔒 protegé</p>
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
    Pour ajouter du contenu à ce site web, veuillez suivre les instructions sur la page <b>GitHub</b> (<a target="_blank" href="https://github.com/Angramme/pima-site">lien</a>). Pour ajouter du contenu sur le <b>Google Drive</b> contacter un des admins pour recevoir les droits. Pour suggerer des changement a ce site web, veuillez contacter les admins. Pour connaitre les admins, chercher simplement "admin" sur la page "anciens" ou consultez la page "login"/"connexion".
</p>

<style>
    p{
        text-align: justify;
        text-justify: distribute;
    }

</style>
