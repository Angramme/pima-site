
<script>
	import links from '$data/external-links.json';
	import Banner from '$lib/components/Banner.svelte';

	export let data;
</script>

<div class="banner-cont">
	<img src="/img/banners/1.jpg" alt="banner" class="banner-img" />
	<div class="banner-overlay" />
</div>

<h1 class="header">
	<span><b>D</b>ouble</span>
	<span><b>M</b>ajeure</span>
	<span><b>M</b>athématiques</span>
	<span><b>I</b>nformatique</span>
</h1>

<p>
    Site <i>non-officiel</i> DMMI/PIMA. 
    <br/>"Æ PIMA" : "Anciens-Etudiants-du-Parcours-PIMA"
</p>

<hr/>

<p>
    Ce site est maintenu par les étudiants de la double majeure en Mathématiques et Informatique à Sorbonne Université, également connue sous l'acronyme PIMA. L'objectif de ce site est de rassembler des ressources utiles, telles que des <accent>comptes rendus</accent> au format PDF rédigés par d'anciens étudiants, des instructions pour obtenir des documents administratifs tels que les <accent>descriptifs des Unités d'Enseignement</accent> (UE), des <accent>conseils pour la rédaction</accent> de lettres de recommandation, de lettres de motivation, de CV, et bien plus encore.
</p>

<p>
    Sur ce site, vous trouverez également des informations sur les <accent>procédures d'admission</accent>, des conseils, des documents partagés sur le drive, et même la possibilité de <accent>contacter d'anciens étudiants</accent> de la PIMA qui ont intégré les écoles que vous visez. De plus, nous prévoyons également de fournir des <accent>conseils sur les documents administratifs</accent> et sur la manière de naviguer au mieux dans les méandres de l'administration de la Sorbonne.
</p>

<p>
    L'idée maîtresse qui sous-tend ce projet est que, une fois que vous aurez également réussi à intégrer une école, vous serez encouragés à contribuer au site en partageant vos expériences et connaissances pour aider les générations futures d'étudiants de la PIMA.
</p>

<p>
    Actuellement, l'accès au site est exclusif, ce qui signifie que vous devez créer un compte pour accéder aux informations existantes et ajouter de nouvelles ressources. Cette approche vise à garantir que les contacts des anciens étudiants et les informations demeurent aussi confidentiels que possible. Nous voulons également nous assurer que les personnes extérieures à la PIMA, pour ne pas les nommer, ne puissent pas accéder à nos précieuses données.
</p>

<p>
    Dans l'ensemble, ce site offre un véritable réseau et une source de connaissances précieuses pour la vie académique et professionnelle des étudiants de la PIMA, à condition qu'un nombre suffisant d'étudiants s'y inscrivent.
</p>

<h3>En chiffres :</h3>

<p>
    Actuellement, pima.ozieblowski.dev a 
    <accent><strong>
        {#await data.streamed.members_count}
            ...
        {:then members} 
            {members}
        {/await}
    </strong> membres</accent>, dont 
    <strong>
        {#await data.streamed.ancien_count}
            ...
        {:then members} 
            {members}
        {/await}
    </strong> 
    qui ont obtenu leur licence en {new Date().getFullYear()} ou avant. (i.e. les anciens)
</p>


<h2>Contribuer :</h2>
<p>
    Pour ajouter du contenu à ce site web, veuillez suivre les instructions sur la page <b>GitHub</b> (<a target="_blank" href="https://github.com/Angramme/pima-site">lien</a>). Pour ajouter du contenu sur le <b>Google Drive</b> contacter un des admins pour recevoir les droits. Pour suggerer des changement a ce site web, veuillez contacter les admins. Pour connaitre les admins, chercher simplement "admin" sur la page "anciens" ou consultez la page "login"/"connexion".
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

<style>
	.banner-cont {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: -1;
	}
	.banner-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: blur(5px);
	}
	.banner-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
	}
	p {
		text-align: justify;
		text-justify: distribute;
	}
	accent,
	accent * {
		font-weight: bold;
		text-decoration: underline var(--accent-color);
	}
	.header {
		font-weight: normal;
		text-decoration: none;
		font-size: 3rem;
		text-align: center;
		margin-top: 20vh;
		color: white;
		text-shadow: 0 0 10px black;
	}
	.header > span {
		display: block;
	}
</style>
