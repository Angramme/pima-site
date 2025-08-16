<script lang="ts">
    import { page } from '$app/stores';
    import Cookies from '$lib/components/Cookies.svelte';
    import Nav from '$lib/components/Nav.svelte';
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';

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

<div id="cont">
    <Nav></Nav>
    <Cookies/>
    {#if $user?.sleeping}
        <div class="pls-wake-up">
            <div>
                Votre compte est pour l'instant caché sur le serveur, pour publier votre compte, mettez a jour vos données dans la section utilisateur en haut a droite!
            </div>
            <div>
                Une fois dans la section utilisateur, cherchez la section "Mes donnes" et remplissez vos informations. Un fois terminé, appuyez sur "Mettre a jour".
            </div>
        </div>
    {/if}
    <div id="slot-cont">
        <slot/>
    </div>
    <footer>
        <hr/>
        Copyright &copy; 2023-{new Date().getFullYear()} Kacper Ozieblowski <br/>
        En utilisant ce site et les services y présents vous acceptez la <a href="/reglementation">réglementation</a>
    </footer>
</div>


<style>
    /* @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap'); */
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,400;0,600;1,400;1,600&family=Roboto:ital,wght@0,700;1,300&display=swap');
    *{
        /* font-family: 'Courier New', Courier, monospace; */
        font-family: 'Roboto Condensed', sans-serif;
    }
    #cont{
        position: relative;
        /* width: 85vh; */
        max-width: 100vh;
        min-height: 100vh;
        margin: auto;
        padding-top: 90px;
        /* background-color: var(--background-color); */
        display: flex;
        flex-direction: column;
        /* box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.42); */
    }
    #slot-cont{
        margin: 20px;
    }
    footer{
        margin: 20px;
        margin-top: auto;
    }
    footer > hr{
        margin-top: 80px;
        margin-bottom: 30px;
    }
    @keyframes flicker {
        0% {background-color: blue;}
        50% {background-color: var(--background-color);}
        100% {background-color: var(--background-color);}
    }

    .pls-wake-up{
        background: var(--background-color);
        background-image: radial-gradient(gray 1px, transparent 0);
        background-size: 5px 5px;
        background-position: -19px -19px;
        animation: 1s linear 2s infinite alternate flicker;
        padding: 20px;
    }
    .pls-wake-up > * {
        padding: 10px;
        background: var(--background-color);
    }
</style>
