<script lang="ts">
    import Banner from "$lib/components/Banner.svelte";
</script>

<Banner title="Contributeurs" src="/img/banners/3.jpg" />

<div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-4 text-center">Hommage aux Héros de la PIMA</h1>
    <p class="mb-8 text-center">
        Hommage à tous les héros de la PIMA qui ont contribué à la création de l'empire de la PIMA.
    </p>

    <div class="tree-container">
        <h2 class="text-2xl font-bold mb-8 text-center">Arbre des Contributeurs</h2>
        <div class="tree">
            <ul>
                <li>
                    <div class="contributor">
                        <img src="/img/contributors/kacper.png" alt="Kacper Ozieblowski" class="contributor-photo" />
                        <p class="font-bold text-xl mt-2">👑 Kacper Ozieblowski (The King)</p>
                    </div>
                    <ul>
                        <li>
                            <div class="contributor">
                                <img src="/img/contributors/zein.png" alt="Zein SAKKOUR" class="contributor-photo" />
                                <p class="font-bold text-lg mt-2">⚔️ Zein SAKKOUR (Knight Tier 1)</p>
                            </div>
                        </li>
                        <li>
                            <div class="contributor">
                                <img src="/img/contributors/rodrigue.png" alt="Rodrigue Tavernier" class="contributor-photo" />
                                <p class="font-bold text-lg mt-2">⚔️ Rodrigue Tavernier (Knight Tier 1)</p>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</div>

<style>
    .tree-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-x: auto;
        white-space: nowrap;
    }

    .tree ul {
        padding-top: 20px;
        position: relative;
        transition: all 0.5s;
        display: flex;
        justify-content: center;
    }

    .tree li {
        float: left;
        text-align: center;
        list-style-type: none;
        position: relative;
        padding: 20px 5px 0 5px;
        transition: all 0.5s;
    }

    /*We will use ::before and ::after to draw the connectors*/
    .tree li::before, .tree li::after{
        content: '';
        position: absolute;
        top: 0;
        right: 50%;
        border-top: 1px solid #ccc;
        width: 50%;
        height: 20px;
    }

    .tree li::after{
        right: auto;
        left: 50%;
        border-left: 1px solid #ccc;
    }

    /*We need to remove left-right connectors from elements without
    any siblings*/
    .tree li:only-child::after, .tree li:only-child::before {
        display: none;
    }

    /*Remove space from the top of single children*/
    .tree li:only-child{
        padding-top: 0;
    }

    /*Remove left connector from first child and
    right connector from last child*/
    .tree li:first-child::before, .tree li:last-child::after{
        border: 0 none;
    }
    /*Adding back the vertical connector to the last child*/
    .tree li:last-child::before{
        border-right: 1px solid #ccc;
        border-radius: 0 5px 0 0;
    }
    .tree li:first-child::after{
        border-radius: 5px 0 0 0;
    }

    /*Time to add downward connectors from parents*/
    .tree ul ul::before{
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        border-left: 1px solid #ccc;
        width: 0;
        height: 20px;
    }

    .contributor {
        padding: 10px;
        text-decoration: none;
        color: #666;
        font-family: arial, verdana, tahoma;
        font-size: 11px;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: all 0.5s;
        min-width: 150px;
    }

    .contributor-photo {
        width: 240px;
        height: 240px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .tree li .contributor:hover,
    .tree li .contributor:hover+ul li .contributor {
        transform: scale(1.1);
    }

    .tree li .contributor:hover+ul li::after,
    .tree li .contributor:hover+ul li::before,
    .tree li .contributor:hover+ul::before,
    .tree li .contributor:hover+ul ul::before{
        border-color:  #94a0b4;
    }
</style>
