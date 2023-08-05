<script>
    import { browser } from '$app/environment';
    import { invalidate } from '$app/navigation';
    import { page } from '$app/stores';


    export let data;

    let hide_cookie_msg = Boolean(data.cookies_accepted);

    $: user = data.user;
    $: cookies_accepted = data.cookies_accepted;
</script>

<svelte:head>
    <title>Æ PIMA : {$page.url.pathname.split("/").at(-1)}</title> 
</svelte:head>

<div id="cont">
    <div id="nav-cont">
        <nav>
            <table>
                <tr>
                    <td>
                        <span class="logo-text">Æ PIMA</span>
                    </td>
                    <td>
                        <a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/"> acceuil </a> &nbsp;
                        <a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/restricted/anciens"> anciens </a> &nbsp;
                        <a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/restricted/faq"> FAQ </a> &nbsp;
                    </td>
                    <td id="user-td">
                        {#if user}
                            <a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/restricted/user"> {user.prenom} 🛠</a> &nbsp;    
                        {:else}
                            <a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/login"> connexion </a> &nbsp;    
                        {/if}
                    </td>
                </tr>
            </table>
        </nav>
        <!-- <div id="gradient"></div> -->
    </div>
    {#if user?.sleeping}
        <div class="pls-wake-up">
            <div>
                Votre compte est pour l'instant caché sur le serveur, pour publier votre compte, mettez a jour vos données dans la section utilisateur en haut a droite!
            </div>
            <div>
                Une fois dans la section utilisateur, cherchez la section "Mes donnes" et remplissez vos informations. Un fois terminé, appuyez sur "Mettre a jour".
            </div>
        </div>
    {/if}
    {#if (browser ? document.cookie.indexOf('cookiesAccepted=')==-1 : !cookies_accepted) && !hide_cookie_msg && !$page.url.pathname.startsWith("/reglementation")}
        <div class="cookies">
            <div>
                <h2>Cookies</h2>
                <img src="img/dancing_dog.gif" alt="dancing dog gif"/><br/>
                En utilisant ce site web vous acceptez l'utilisation des cookies essentiels pour son fonctionnement, pour plus d'informations veuillez consulter le <a target="_blank" href="/reglementation/cookie_policy">Cookie Policy</a>
                <br/>
                <br/>
                <button on:click={()=>{
                    document.cookie="cookiesAccepted=1;path=/";
                    hide_cookie_msg = true;
                    invalidate("cookies:update");
                }}>Je donne mon accord</button>
            </div>
        </div>
    {/if}
    <div id="slot-cont">
        <slot/>
    </div>
    <footer>
        <hr/>
        Copyright &copy; 2023-{new Date().getFullYear()} Kacper Ozieblowski <br/>
        <a href="/reglementation">réglementation</a>
    </footer>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap');
    *{
        /* font-family: 'Courier New', Courier, monospace; */
        font-family: 'Roboto Condensed', sans-serif;
    }
    #cont{
        position: relative;
        width: 80vh;
        max-width: 100vw;
        min-height: 100vh;
        margin: auto;
        padding: 20px;
        padding-top: 90px;
        background-color: var(--background-color);
        display: flex;
        flex-direction: column;
    }
    footer{
        margin-top: auto;
    }
    footer > hr{
        margin-top: 80px;
    }
    @keyframes flicker {
        0% {background-color: blue;}
        50% {background-color: var(--background-color);}
        100% {background-color: var(--background-color);}
    }
    .cookies{
        position: fixed;
        display: flex;
        bottom: 25vh;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.619);
    }
    .cookies > div{
        margin: auto;
        padding: 20px;
        width: 75vh;
        max-width: 100vw;
    }
    .cookies > *{
        background-color: var(--background-color);
        padding: 10px;
    }
    .cookies img{
        display: block;
        margin: auto;
    }

    #nav-cont{
        /* width: 80vh;
        max-width: 100vw; */
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
    }
    nav{
        border-bottom: solid 1px black;
        padding-top: 5px;
        padding-bottom: 5px;
        background: var(--accent-color);
        /* background-image: radial-gradient(gray 1px, transparent 0);
        background-size: 5px 5px; */
    }
    nav td *{
        color: var(--background-color);
        text-decoration: none;
        font-size: larger;
        background: var(--accent-color);
        padding: 4px;
    }
    table{
        border-spacing: 10px;
        width: 100%;
    }
    #user-td{
        text-align: right;
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
    .logo-text{
        margin-left: 10px;
    }
</style>