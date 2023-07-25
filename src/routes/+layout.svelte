
<div id="cont">
    <nav>
        <hr/>
        Navigation <br/>
        <a href="/">&lt;&lt; retour</a>
    </nav>
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
        padding: 20px
    }
    nav{
        width: 75vh;
        max-width: 100vw;
        position: fixed;
        bottom: 0;
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