<script>
  import { browser } from '$app/environment';
    import { invalidateAll } from '$app/navigation';
    import { page } from '$app/stores';


    export let data;

    $: user = data.user;
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
                        <span>Æ PIMA</span>
                    </td>
                    <td>
                        <a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/"> acceuil </a> &nbsp;
                        <a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/restricted/anciens"> anciens </a> &nbsp;
                        <a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/restricted/faq"> FAQ </a> &nbsp;
                    </td>
                    <td id="user-td">
                        {#if user}
                            <a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/restricted/user"> {user.prenom} </a> &nbsp;    
                        {:else}
                            <a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/login"> connexion </a> &nbsp;    
                        {/if}
                    </td>
                </tr>
            </table>
        </nav>
        <!-- <div id="gradient"></div> -->
    </div>
    {#if (!data.cookies_accepted || (browser && document.cookie.indexOf('cookiesAccepted=')==-1)) && !$page.url.pathname.startsWith("/reglementation")}
        <div class="cookies">
            <div>
                <h2>Cookies</h2>
                <img src="img/dancing_dog.gif" alt="dancing dog gif"/><br/>
                En utilisant ce site web vous acceptez l'utilisation des cookies essentiels pour son fonctionnement, pour plus d'informations veuillez consulter le <a href="/reglementation/cookie_policy">Cookie Policy</a>
                <br/>
                <br/>
                <button on:click={()=>{
                    document.cookie = "cookiesAccepted=1";
                    invalidateAll();
                }}>Je donne mon accord</button>
            </div>
        </div>
    {/if}
    <slot/>
    <div id="spacer"></div>
    <footer>
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
        margin: auto;
        margin-top: 70px;
        padding: 20px;
    }
    @keyframes flicker {
        0% {background-color: blue;}
        50% {background-color: beige;}
        100% {background-color: beige;}
    }
    .cookies{
        position: fixed;
        bottom: 25vh;
        margin: auto;
        left: 0;
        right: 0;
        width: 85vh;
        max-width: 100vw;
        background: beige;
        background-image: radial-gradient(gray 1px, transparent 0);
        background-size: 5px 5px;
        background-position: -19px -19px;
        animation: 0.4s step-end 0.1s infinite alternate flicker;
        padding: 20px;
    }
    .cookies > *{
        background-color: beige;
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
        background: beige;
        background-image: radial-gradient(gray 1px, transparent 0);
        background-size: 5px 5px;
        background-position: -19px -19px;
    }
    nav td *{
        text-decoration: none;
        font-size: larger;
        background: beige;
        padding: 4px;
    }
    table{
        border-spacing: 10px;
        width: 100%;
    }
    #user-td{
        text-align: right;
    }
    #spacer{
        margin-top: 200px;
    }

</style>