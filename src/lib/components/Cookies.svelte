<script>
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    import { getContext } from 'svelte';

    export const prerender = false;

    $: cookies_accepted = getContext('cookies_accepted');
</script>

{#if (!$cookies_accepted) && !$page.url.pathname.startsWith("/reglementation")}
    <div class="cookies">
        <div> 
            <h2>Cookies</h2>
            En utilisant ce site web vous acceptez l'utilisation des cookies essentiels pour son fonctionnement, pour plus d'informations veuillez consulter le <a target="_blank" href="/reglementation/cookie_policy">Cookie Policy</a>
            <br/>
            <br/>
            <form method="post" action="/?/accept_cookies" use:enhance>
                <input type="hidden" name="cookies_accepted" value="true"/>
                <button type="submit">Je donne mon accord</button>
            </form>
        </div>
    </div>
{/if}


<style>
    .cookies{
        z-index: 1000;
        position: fixed;
        display: flex;
        bottom: 25vh;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.743);
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
</style>