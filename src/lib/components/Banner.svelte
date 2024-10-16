<script lang="ts">
    const imgs_m = import.meta.glob("/static/img/banners/*");
    // @ts-ignore
    const imgs = Object.keys(imgs_m).map(k=>k.match(/\/static(.*)/)[1]);
    export let src = imgs[Math.floor(Math.random()*imgs.length)];
    export let title: string | null = null;
</script>

<div class="cont">
    <img loading="lazy" fetchpriority="low" class="banner" src={src} alt="banner">
    {#if title}
        <span>{title}</span>
    {/if}
</div>

<style>
    .banner{
        width: 100%;
        height: 20rem;
        object-fit: cover;
        object-position: center;
    }
    span{
        position: absolute;
        bottom: 0;
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: fit-content;
        height: fit-content;

        padding: 1rem;
        font-size: 2rem;
        font-weight: bold;
        backdrop-filter: blur(5px);
    }
    div.cont{
        position: relative;
        margin-bottom: 2rem;
    }
</style>