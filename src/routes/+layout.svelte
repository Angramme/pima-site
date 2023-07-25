
<div id="cont">
    <div id="nav-cont">
        <div id="gradient"></div>
        <nav>
            Navigation <br/>
            <a href="/"> acceuil </a> |
            <a href="/restricted/anciens"> anciens </a> |
            <a href="/restricted/faq"> FAQ </a>
        </nav>
    </div>
    <slot/>
    <div id="spacer"></div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap');
    *{
        /* font-family: 'Courier New', Courier, monospace; */
        font-family: 'Roboto Condensed', sans-serif;
    }
    #cont{
        position: relative;
        width: 75vh;
        max-width: 100vw;
        margin: auto;
        margin-top: 70px;
        padding: 20px;
    }
    #gradient{
        width: 100%;
        height: 100px;
        background: linear-gradient(rgba(245, 245, 220, 0), beige);
    }
    #nav-cont{
        width: 75vh;
        max-width: 100vw;
        position: fixed;
        bottom: 0;
    }
    nav{
        border-top: solid 1px black;
        padding-top: 10px;
        padding-bottom: 20px;
        background: beige;
    }
    nav *{
        text-decoration: none;
        font-size: larger;
    }
    #spacer{
        margin-top: 200px;
    }

</style>