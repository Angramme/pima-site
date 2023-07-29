<script>
    export let data;

    $: user = data.user;
</script>


<div id="cont">
    <div id="nav-cont">
        <nav>
            <table>
                <tr>
                    <td>
                        <span>PIMA</span>
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
    <slot/>
    <div id="spacer"></div>
    <footer>
        Copyright &copy; 2023-{new Date().getFullYear()} Kacper Ozieblowski <br/>
        <a href="/reglementation">reglementation</a>
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
    /* #gradient{
        width: 100%;
        height: 100px;
        background: linear-gradient(beige, rgba(245, 245, 220, 0));
    } */
    #nav-cont{
        width: 80vh;
        max-width: 100vw;
        position: fixed;
        top: 0;
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