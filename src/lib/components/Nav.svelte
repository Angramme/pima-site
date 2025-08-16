<script lang="ts">
    import { getContext } from "svelte";
    import { page } from '$app/stores';
    import type { Writable } from "svelte/store";
    import { Button } from "$lib/components/ui/button/index.js";

    const pages: string[][] = [
        ["/", "accueil"],
        ["/restricted/anciens", "anciens"],
        ["/conseils", "conseils"],
        ["/restricted/external/Google Drive", "drive"],
        // ["/restricted/faq", "FAQ"],
    ];

    const user = getContext<Writable<App.Locals['user']>>('user');
</script>


<div id="nav-cont">
    <nav>
        <div class="logo">
            <span>Æ PIMA</span>
        </div>
        {#each pages as [link, name]}
            <div>
                <a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href={link} class={$page.url.pathname == link ? "current":""}> {name} </a> 
            </div>
        {/each}
        <div class="login">
            {#if $user}
                <a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/restricted/user"> {$user.prenom}</a>  
            {:else}
                <a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/login"> connexion </a>
            {/if}
        </div>
    </nav>
</div>

<style>
    #nav-cont{
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        right: 0;
        background: var(--background-color);
    }
    @media (hover:hover) {
        #nav-cont{
            background: none;
        }
        nav{
            backdrop-filter: blur(5px);
        }
    }
    nav{
        display: flex;
        justify-content :right;
        align-items: center;
        padding: 1rem;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    nav div *{
        font-weight: normal;
        text-decoration: none;
        font-size: larger;
        padding: 4px;
        margin: 5px;
    }
    a.current{
        color: var(--background-color);
        background-color: var(--font-color);
    }
    .logo{
        flex-grow: 1;
    }
    .login{
        border-left: 1px solid var(--font-color);
        padding-left: 0.5rem;
    }
</style>
