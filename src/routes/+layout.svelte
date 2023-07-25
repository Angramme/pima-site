
<div id="cont">
    <div id="nav-cont">
        <nav>
            &nbsp;&nbsp;
            <a>PIMA</a> &nbsp; &nbsp;
            <a href="/"> acceuil </a> &nbsp;
            <a href="/restricted/anciens"> anciens </a> &nbsp;
            <a href="/restricted/faq"> FAQ </a> &nbsp;
        </nav>
        <!-- <div id="gradient"></div> -->
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
    /* #gradient{
        width: 100%;
        height: 100px;
        background: linear-gradient(beige, rgba(245, 245, 220, 0));
    } */
    #nav-cont{
        width: 75vh;
        max-width: 100vw;
        position: fixed;
        top: 0;
    }
    nav{
        border-bottom: solid 1px black;
        padding-top: 15px;
        padding-bottom: 15px;
        background: beige;
        background-image: radial-gradient(gray 1px, transparent 0);
        background-size: 5px 5px;
        background-position: -19px -19px;
    }
    nav *{
        text-decoration: none;
        font-size: larger;
        background: beige;
        padding: 2px;
    }
    #spacer{
        margin-top: 200px;
    }

</style>