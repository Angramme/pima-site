<script>
    const imgs_m = import.meta.glob("/static/img/banners/*");
    // @ts-ignore
    const imgs = Object.keys(imgs_m).map(k=>k.match(/\/static(.*)/)[1]);
    export let src = imgs[Math.floor(Math.random()*imgs.length)];
</script>

<img class="banner" src={src} alt="banner">

<style>
    .banner{
        width: 100%;
        height: 20rem;
        object-fit: cover;
        object-position: center;
        margin-bottom: 2rem;
    }
</style>