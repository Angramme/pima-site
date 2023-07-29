<script>
	import { page } from '$app/stores';
</script>

<h1>{$page.status}</h1>
<h2>error: {$page.error?.message}</h2>

<img src="/img/dancing_dog.gif" alt="avid dancer">

<style>
    h1{
        font-size: 80px;
        padding: 0;
        margin: 0;
    }
    h2{
        margin: 0;
        margin-bottom: 20px;
    }
</style>