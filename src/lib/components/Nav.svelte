<script>
    import { getContext } from "svelte";
    import { page } from '$app/stores';

    const pages = [
        ["/", "acceuil"],
        ["/restricted/anciens", "anciens"],
        ["/restricted/conseils", "conseils"],
        ["/restricted/external/Google Drive", "drive"],
        // ["/restricted/faq", "FAQ"],
    ];

    const user = getContext('user');
</script>


<div id="nav-cont">
    <nav>
        <table>
            <tr>
                <td>
                    <span class="logo-text">Æ PIMA</span>
                </td>
                <td class="menu-items">
                    {#each pages as p}
                        <a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href={p[0]} class={$page.url.pathname == p[0] ? "current":""}> {p[1]} </a> 
                    {/each}
                </td>
                <td>
                    {#if $user}
                        <a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/restricted/user"> {$user.prenom}</a>  
                    {:else}
                        <a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/login"> connexion </a>
                    {/if}
                </td>
            </tr>
        </table>
    </nav>
</div>

<style>
    #nav-cont{
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        right: 0;
        /* border-bottom: solid 1px white; */
        background: var(--background-color);
    }
    nav{
        /* border-bottom: solid 1.2px var(--font-color); */
        padding: 1rem;
        /* padding-top: 5px;
        padding-bottom: 5px; */
    }
    @media (hover:hover) {
        #nav-cont{
            background: none;
        }
        nav{
            backdrop-filter: blur(5px);
        }
    }
    nav td{
        text-align: right;
        vertical-align: middle;
        white-space: nowrap;
    }
    .menu-items{
        text-align: right;
        width: 100%;
        border-right: solid 1px var(--font-color);
    }
    nav td *{
        font-weight: normal;
        text-decoration: none;
        font-size: larger;
        padding: 4px;
        margin: 5px;
    }
    nav > table{
        /* table-layout: fixed; */
        margin: auto;
        width: 100%;
        /* width: calc(85vh + 30px - 1rem); */
        /* max-width: 100vw; */
        /* border-spacing: 10px; */
    }

    a.current{
        color: var(--background-color);
        background-color: var(--font-color);
    }
</style>