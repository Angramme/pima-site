<script>
    import { afterUpdate, onMount } from "svelte";

    /** @type {boolean} */
    export let default_open = false;
    /** @type {string} */
    export let closed_height = "15vh";

    let open = default_open;
    let plus_needed = false;

    /** @type {HTMLElement}*/
    let main;

    afterUpdate(()=>{
        plus_needed = plus_needed || open || main.scrollHeight != main.clientHeight;
    });

    const roll = ()=>{
        open=!open;
        setTimeout(()=>{
            main.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'start',
            });
        }, 200);
    };
</script>

<div bind:this={main} class="main" style={open ? "" : `max-height: ${closed_height};overflow: hidden !important;`}>
    <slot>
        No content provided...
    </slot>
</div>
{#if plus_needed}
    <div class="plus">
        <button on:click={roll}>{open ? "- cacher -" : "+ afficher plus +"}</button>
    </div>
{/if}

<style>
    div.main{
        overflow: scroll;
        max-height: 90vh;
        transition: max-height 0.2s ease-in-out;
    }
    .plus{
        margin-top: 0.2rem;
        text-align: center;
    }
</style>