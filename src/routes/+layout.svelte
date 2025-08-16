<script lang="ts">
    import { page } from '$app/stores';
    import Cookies from '$lib/components/Cookies.svelte';
    import Nav from '$lib/components/Nav.svelte';
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';
    import "../app.css";

    export let data: import('./$types').PageData;

    // Create a store and update it when necessary...
	const user = writable(data.user);
    const cookies_accepted = writable(Boolean(data.cookies_accepted));
	$: user.set(data.user);
    $: cookies_accepted.set(Boolean(data.cookies_accepted));

	// ...and add it to the context for child components to access
	setContext('user', user);
    setContext('cookies_accepted', cookies_accepted);
</script>

<svelte:head>
    <title>Æ PIMA : {$page.url.pathname.split("/").at(-1)}</title> 
</svelte:head>

<div class="relative min-h-screen max-w-6xl mx-auto flex flex-col pt-[90px] font-['Roboto_Condensed',sans-serif]">
    <Nav></Nav>
    <Cookies/>
    {#if $user?.sleeping}
        <div class="p-5 bg-[var(--background-color)] bg-[image:radial-gradient(gray_1px,_transparent_0)] bg-[length:5px_5px] bg-[position:-19px_-19px] animate-[flicker_1s_linear_2s_infinite_alternate]">
            <div class="p-2.5 bg-[var(--background-color)]">
                Votre compte est pour l'instant caché sur le serveur, pour publier votre compte, mettez a jour vos données dans la section utilisateur en haut a droite!
            </div>
            <div class="p-2.5 bg-[var(--background-color)]">
                Une fois dans la section utilisateur, cherchez la section "Mes donnes" et remplissez vos informations. Un fois terminé, appuyez sur "Mettre a jour".
            </div>
        </div>
    {/if}
    <div class="m-5">
        <slot/>
    </div>
    <footer class="m-5 mt-auto">
        <hr class="mt-20 mb-[30px]"/>
        Copyright &copy; 2023-{new Date().getFullYear()} Kacper Ozieblowski <br/>
        En utilisant ce site et les services y présents vous acceptez la <a href="/reglementation">réglementation</a>
    </footer>
</div>


<style>
    /* @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap'); */
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,400;0,600;1,400;1,600&family=Roboto:ital,wght@0,700;1,300&display=swap');
    @keyframes flicker {
        0% {background-color: blue;}
        50% {background-color: var(--background-color);}
        100% {background-color: var(--background-color);}
    }
</style>
