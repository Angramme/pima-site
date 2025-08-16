<script lang='ts'>
    import { enhance } from '$app/forms';
    import Markdown from '$lib/components/Markdown.svelte';
    import { user_data_into_forms } from '$lib/transformers';

    // /** @type {import('./$types').PageData} */
    // export let data;
    // export let form;
    
    let { data, form } = $props();


    // $: sectioned = user_data_into_forms(data.subject)
    //     .map(({n, l})=>({n, l: l
    //         .filter(({k})=>k!="description" && data.subject && data.subject.hasOwnProperty(k))}));

    let sectioned: ReturnType<typeof user_data_into_forms> | undefined = $state();

    $effect(()=>{
        data.subject.then(subject=>{
            if(!data) return;
            sectioned = user_data_into_forms(subject)
                .map(({n, l})=>({n, l: l
                    .filter(({k})=>k!="description" && subject && subject.hasOwnProperty(k))}));

        })
    });

    let user_input: string | undefined = $state("user login");
</script>


{#await data.subject}
    <p>Loading...</p>
{:then subject} 

    <h1>{subject?.prenom} {subject?.nom || "😎🤐"}</h1>

    {#each sectioned as {n, l: list}}
    <fieldset>
        <legend>{n}</legend>
        <table>
            <tbody>
                {#each list as {k, l, v}}
                <tr>
                    <th>{l}</th>
                    <td>{v}</td>
                </tr>
                {/each}
            </tbody>
        </table>
    </fieldset>
    {/each}

    {#if data.user?.admin}
    <h2>Admin</h2>
        <fieldset>
            {#if form?.error}<p class="error">Erreur serveur: "{form.error}"</p>{/if}
            {#if form?.success}<p class="success">Update successfull!!!! </p>{/if}        
            <legend>Admin actions</legend>
            <fieldset>
                <legend>admin privilages</legend>
                <form method="POST" action="?/user_status_change" use:enhance>
                    <input name="user_id" type="text" value={subject?.id} hidden/>
                    <button name="admin_rights_on" disabled={subject?.admin}>Give admin permissions</button>
                    <button name="admin_rights_off" disabled={!subject?.admin || subject.id == data.user.id}>Remove admin permissions</button>
                </form>
            </fieldset>
            <fieldset>
                <legend>delete user</legend>
                <form method="POST" action="?/user_delete" use:enhance>
                    <input name="user_id" type="text" value={subject?.id} hidden/>
                    <input bind:value={user_input} type="text">
                    <button name="delete_user" disabled={user_input!=subject?.login || subject?.admin || subject?.id == data.user.id}>Delete this user</button>
                </form>
            </fieldset>
        </fieldset>
    {/if}

    <h2>Conseils / description : </h2>
    <Markdown markdown={subject?.description || ""}/>
{/await}


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
