<script>
	// import anciens_r from "$data/contact-anciens.json"

	import Banner from '$lib/components/Banner.svelte';
	import UserCard from '$lib/components/UserCard.svelte';
	import { parse_ast, ast_match } from '$lib/search.js';

    export let data;

    let search_term = "";
    $: ast_term = parse_ast(search_term);
    $: ast_term && console.log(ast_term);

    $: anciens_P = data.streamed.users
        .then(v=>
            v.map(d=>{
                // @ts-ignore
                if(d.admin) d._admin = "admin";
                 d.l3 = d.grad_year;
                 d.conseils = d.conseils;
                return d;
            })
            // @ts-ignore
            .filter(o=>!ast_term ? true : ast_match(ast_term, Object.values(o), o)));

    let show_hint = false;
</script>

<Banner src="/img/banners/4.jpg" 
    title="Anciens"
    />

<h1>Repertoire des anciens :</h1>

<p>
    Exemples d'utilisation <button on:click={()=>show_hint=!show_hint}>{show_hint ? "cacher" : "afficher"}</button>: 
</p>
{#if show_hint}
<ul>
    <li><b>Recherche par nom:</b> tapez le nom ou prénom de la personne. <i>Ex: "fred"</i></li>
    <li><b>Recherche par université:</b> tapez `admis:` suivi du nom de l'université. <i>Ex: "admis:polytechnique"</i></li>
    <li><b>Recherche par entreprise:</b> tapez `travails:` suivi du nom de l'entreprise. <i>Ex: "travails:google"</i></li>
    <li><b>Recherche par mot-clé:</b> tapez un mot-clé pour rechercher dans toutes les propriétés. <i>Ex: "ingénieur"</i></li>
    <br>
    <li><b>Opérateurs logiques:</b>
        <ul>
            <li>`|` pour OU logique</li>
            <li>`&` pour ET logique</li>
            <li>`:` pour l'inclusion</li>
        </ul>
    </li>
    <br>
    <li><b>Exemples combinés:</b>
        <ul>
            <li>Trouver les admis à l'X ou à l'ENS: `"admis:(poly | ens)"`</li>
            <li>Trouver les admis à Télécom en 2023: `"(admis:telecom) & (grad_year:2023)"`</li>
            <li>Trouver les polonais avec 18 de moyenne en L2 ou L3: `"(nationalite:(pl | polo)) & ((moyenneL2|moyenneL3):18)"`</li>
        </ul>
    </li>
</ul>
Voici les proprietes possibles:
<ul>
{#await data.streamed.users}
    <li>Chargement...</li>
{:then dat} 
    {#each Object.keys(dat[0]) as k}
        <li>{k}</li>
    {/each}
{/await}
</ul>
{/if}
<p>
    Les informations présentes ont été fournies par les élèves eux-mêmes avec leur consentement.
</p>

Rechercher : <input type="text" bind:value={search_term}/> - 
{#await anciens_P}
? résultat
{:then anciens} 
{anciens.length} résultat{anciens.length==1 ? "" : "s"}
{/await}
<hr />
<div class="user-cards">
	{#await anciens_P}
		<p>Chargement...</p>
	{:then anciens}
		{#each anciens as user}
			<UserCard {user} />
		{/each}
	{/await}
</div>

<style>
	.user-cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
	}
	.sleeper {
		font-style: italic;
		color: blueviolet;
	}
	.sleeper::after {
		content: ' 😴';
	}
	.admin {
		font-style: italic;
		color: green;
	}
</style>