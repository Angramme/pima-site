<script lang="ts">
    const imgs_m = import.meta.glob("/static/img/banners/*");
    // @ts-ignore
    const imgs = Object.keys(imgs_m).map(k=>k.match(/\/static(.*)/)[1]);
    export let src = imgs[Math.floor(Math.random()*imgs.length)];
    export let title: string | null = null;
</script>

<div class="relative mb-8">
    <img loading="lazy" fetchpriority="low" class="h-80 w-full object-cover object-center rounded-sm" src={src} alt="banner">
    {#if title}
        <span class="absolute inset-0 m-auto h-fit w-fit p-4 text-3xl font-bold backdrop-blur-[5px]">{title}</span>
    {/if}
</div>
