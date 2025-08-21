<script lang="ts">
    import { afterUpdate } from "svelte";

    export let default_open: boolean = false;
    export let closed_height: string = "15vh";

    let open: boolean = default_open;
    let plus_needed: boolean = false;

    let main: HTMLElement;

    afterUpdate(()=>{
        if (!main) return;
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
