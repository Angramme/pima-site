<script>
  import { enhance } from '$app/forms';
  import { invalidate } from '$app/navigation';
    import Banner from '$lib/components/Banner.svelte';
  import { onMount } from 'svelte';

    /** @type {import('./$types').ActionData} */
    export let form;

    export let data;

    onMount(()=>{
        invalidate("user:update");
    })
</script>

<Banner/>


<h2>Connexion</h2>

<form method="POST" use:enhance>
    {#if form?.missing}<p class="error">Le login <u>et</u> mot de passe sont primordiaux!</p>{/if}
    {#if form?.incorrect}<p class="error">Mot de passe ou login incorrect!</p>{/if}
    {#if form?.success}<p class="success">Connexion réussie!</p>{/if}
    <div class="form">
        <div>
            <label for="user">Login:</label>
            <input type="text" id="user" name="login" placeholder="jean-pierre"/>
        </div>
        <div>
            <label for="pwd">Mot de passe:</label>
            <input type="password" id="pwd" name="password" placeholder="*******"/>
        </div>
        <div>
            <input type="submit" id="submit" value="Connexion"/>
            <input type="button" id="forgot" value="mdb ou identifiant oublié" disabled/>
        </div>
        <div>
            Veuillez noter qu'en vous connectant sur ce site, vous acceptez l'utilisation de cookies essentiels. En utilisant ce site et les services qui y sont proposés, vous acceptez la <a href="/reglementation">réglementation</a>
        </div>
    </div>
</form>


<h3>Infos : </h3>
<p>Pour créer un compte, veuillez prendre contact avec l'un des administrateurs : </p>
{#await data.streamed.admins}
    Chargement des admins...
{:then admins} 
    {#each admins as {nom, prenom, email}}
        <li>
            {nom} {prenom} : 
            <button on:click={()=>alert(`email = ${email}`)}>email </button>
        </li>
    {/each}
{/await}

<style>
    .error{
        color: red;
    }
    .success{
        color: green;
    }
    .form{
        margin: auto;
        display: flex;
        flex-direction: wrap;
        flex-wrap: wrap;
        gap: 1em;
        

        width: 50rem;
    }
    .form > div{
        flex: 1 0 40%;


        display: flex;
        flex-direction: column;
        gap: 0.5em;
    }
</style>