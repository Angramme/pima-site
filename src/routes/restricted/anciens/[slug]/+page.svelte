<script>
  import { user_data_into_forms } from '$lib/transformers';

    /** @type {import('./$types').PageData} */
    export let data;

    export let form;

    $: sectioned = user_data_into_forms(data.user)
        .map(({n, l})=>({n, l: l
            .filter(({k})=>k!="description" && data.user && data.user.hasOwnProperty(k))}));

    /** @type {string | undefined}*/
    let user_input = "user login";
</script>

<h1>{data.user?.prenom} {data.user?.nom || "😎🤐"}</h1>

{#each sectioned as {n, l: list}}
<fieldset>
    <legend>{n}</legend>
    <table>
        {#each list as {k, l, v}}
        <tr>
            <th>{l}</th>
            <td>{v}</td>
        </tr>
        {/each}
    </table>
</fieldset>
{/each}

{#if data.me?.admin}
<h2>Admin</h2>
    <fieldset>
        {#if form?.error}<p class="error">Erreur serveur: "{form.error}"</p>{/if}
        {#if form?.success}<p class="success">Update successfull!!!! </p>{/if}        
        <legend>Admin actions</legend>
        <fieldset>
            <legend>admin privilages</legend>
            <form method="POST" action="?/user_status_change">
                <input name="user_id" type="text" value={data.user?.id} hidden/>
                <button name="admin_rights_on" disabled={data.user?.admin}>Give admin permissions</button>
                <button name="admin_rights_off" disabled={!data.user?.admin || data.user.id == data.me.id}>Remove admin permissions</button>
            </form>
        </fieldset>
        <fieldset>
            <legend>delete user</legend>
            <form method="POST" action="?/user_delete">
                <input name="user_id" type="text" value={data.user?.id} hidden/>
                <input bind:value={user_input} type="text">
                <button name="delete_user" disabled={user_input!=data.user?.login || data.user?.admin || data.user?.id == data.me.id}>Delete this user</button>
            </form>
        </fieldset>
    </fieldset>
{/if}

<h2>Description : </h2>
<p>{data.user?.description}</p>

<style>
    td{
        padding-left: 7px;
        border-bottom: dotted 1px gray;
    }
    tr > th{
        text-align: right;
        padding-right: 7px;
        border-right: solid 1px gray;
        width: 100px;
    }
    fieldset{
        margin-top: 20px;
    }
    .error{
        color: red;
    }
    .success{
        color: green;
    }
</style>