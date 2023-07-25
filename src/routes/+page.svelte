
<script>
    import links from "../data/external-links.json"
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


<h3>Contact:</h3>
<ul>
    {#each Object.keys(links) as lk}
        <li>{lk}: <a href="/restricted/external/{lk}" target=”_blank”  data-sveltekit-preload-data="off" data-sveltekit-preload-code="off">lien</a></li>
    {/each}
</ul>

<h3>Resources:</h3>
<ul>
    <li>hello</li>
    <li><a href="/restricted/kitty" data-sveltekit-preload-data="off" data-sveltekit-preload-code="off">kitty</a></li>
</ul>

<h3>Contribuer:</h3>
<p>
    Pour ajouter du contenu a ce site web, suivre les instructions sur la page <b>GitHub</b>. Pour ajouter du contenu sur le <b>Google Drive</b> contacter un des admin pour récevoir les droits.
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
