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
    <li>Trouver une personne: taper son nom ou prenom, par exemple "fred"</li>
    <li>Recherche par mot clef: taper le mot clef, par exemple "ingé", cela cherche dans toutes les proprietes</li>
    <li>Sinon il y a 3 operateurs
        <ul>
            <li>| ou logique</li>
            <li>& et logique</li>
            <li>: inclusion</li>
        </ul>
    </li>
    <li>Trouver tout le monde admis a l'X: taper "admis : (poly | X)" (i.e le champ "admis" contient "poly" ou "X")</li>
    <li>Trouver des Telecom admis en 2023: taper "(admis:tele) & (grad_year:2023)".</li>
    <li>Trouver des Telecom admis strictement apres 2022: taper "(admis:tele) & (grad_year:>2022)".</li>
    <li>Trouver des gens de nationalié Polonaise: taper "nationalite:(pl | polo)"</li>
    <li>Trouver tout le monde avec 18 de moyenne en L2 OU en L3: taper "(moyenneL2|moyenneL3):18" </li>
    <li>Trouver tout le monde avec au moins 15 de moyenne en L2 ET en L3: taper "(moyenneL2&moyenneL3):>14" </li>
    <li>En general vous pouvez cherchez toutes les données :)</li>
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