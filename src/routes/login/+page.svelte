<script>
  import { enhance } from '$app/forms';
  import { invalidate } from '$app/navigation';
  import { onMount } from 'svelte';

    /** @type {import('./$types').ActionData} */
    export let form;

    export let data;

    onMount(()=>{
        invalidate("user:update");
    })
</script>

<form method="POST" use:enhance>
    <fieldset>
        <legend>Connexion</legend>
        {#if form?.missing}<p class="error">Le login <u>et</u> mot de passe sont primordiaux!</p>{/if}
        {#if form?.incorrect}<p class="error">Mot de passe ou login incorrect!</p>{/if}
        {#if form?.success}<p class="success">Connexion réussie!</p>{/if}
        <table>
            <tr>
                <td><label for="user">Login:</label></td>
                <td><input type="text" id="user" name="login"/> <br/></td>
            </tr>
            <tr>
                <td><label for="pwd">Mot de passe:</label></td>
                <td><input type="password" id="pwd" name="password"/> <br/></td>
            </tr>
            <tr>
                <td></td>
                <td><input type="submit" id="submit" value="Connexion"/></td>
            </tr>
            <tr>
                <td></td>
                <td><input type="button" id="forgot" value="mdb ou identifiant oublié" disabled/></td>
            </tr>
        </table>
        <p>Veuillez noter qu'en vous connectant sur ce site, vous acceptez l'utilisation de cookies essentiels. En utilisant ce site et les services qui y sont proposés, vous acceptez la <a href="/reglementation">réglementation</a></p>
    </fieldset>
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
    table{
        border-spacing: 7px;
    }
    .error{
        color: red;
    }
    .success{
        color: green;
    }
</style>