<script>
  import { enhance } from '$app/forms';
  import { invalidate } from '$app/navigation';
    import Banner from '$lib/components/Banner.svelte';
    import Markdown from '$lib/components/Markdown.svelte';
  import { user_data_into_forms } from '$lib/transformers';
  import { generate_password } from '$lib/utils';

    /** @type {HTMLInputElement}*/
    let delete_account_btn;
    /** @type {any}*/
    let user_agreed;

    /** @type {import('./$types').PageData} */
    export let data;

    /** @type {import('./$types').ActionData} */
    export let form;


    $: user = data.user;
    $: sections = !user ? null :
        user_data_into_forms(user);

    /** @type {boolean}*/
    let new_pwd_val;
    /** @type {boolean}*/
    let con_pwd_val;

    let desc_markdown = data.user?.description || "";

    /** @type {HTMLFormElement}*/
    let delete_account_form;
    const delete_account_now = async ()=>{
        const yes = confirm("Veuillez vous vraiment supprimer votre compte? Attention cette opération n'est pas réversible.");
        if(!yes) return;
        delete_account_form.submit();
    }

    /** @type {HTMLInputElement}*/
    let create_pwd;
</script>

<Banner/>

<h1>Donnes et parametres utilisateur</h1>

<!-- Server message sesction -->
{#if form?.pwd_rst_missing}<p class="error">Manque de mot de passe!</p>{/if}
{#if form?.pwd_rst_incorrect}<p class="error">Mot de passe incorrect!</p>{/if}
{#if form?.pwd_rst_success}<p class="success">Changement réussi!</p>{/if}
{#if form?.disconnected} <p class="success">Déconnexion réussie!</p> {/if}
{#if form?.update_success}<p class="success">Mise a jour réussie!</p>{/if}
{#if form?.update_failure}<p class="error">Erreur de mise à jour: "{form.update_failure}""</p>{/if}


<form method="POST" action="?/disconnect" use:enhance={()=>{
    return async ({update})=>{
        await invalidate("user:update");
        return update();
    }
}}>
    <fieldset>
        <legend>Deconnexion</legend>
        <div>
            {#if form?.disconnected} <p class="success">Déconnexion réussie!</p> {/if}
            <input type="submit" value="Deconnexion"/>
        </div>
    </fieldset>
</form>

<hr/>

<form method="POST" action="?/update_data" use:enhance={() => {
    return async ({ update }) => {
      update({ reset: false });
    };
  }}>
    <fieldset>
        <legend>Mes donnes</legend>
        <p class="info"> Attention, pour faire des changement il faut imperativement soumettre les données avec le bouton "Mettre a jour" en bas. </p>
        {#if !sections}
            <p class="error">Erreur interne! Donnes indisponibles!</p>
        {:else}
            {#each sections as {n, l: list}}
                <fieldset>
                    <legend>{n}</legend>
                    <table>
                        {#each list as {k: key, l: label, v: value, t: type, ro: read_only}}
                        <tr>
                            <td><label for={`input_${key}`}>{label}</label></td>
                            {#if type=="textlist" || type=="longtext"}
                                <td>
                                    {#if type=="textlist"} <div class="info">lister en séparant par des ","</div> {/if}
                                    <textarea name={key} id={`input_${key}`} rows={type=="textlist" ? 3 : 12} cols="40">{""+value}</textarea>
                                </td>
                            {:else if type == "markdown"}
                                <h4>Markdown : </h4>
                                <textarea bind:value={desc_markdown} name={key} id={`input_${key}`} rows={12} cols="40"></textarea>
                                <h4>Preview : </h4>
                                <div class="markdown-preview">
                                    <Markdown markdown={desc_markdown}/>
                                </div>
                            {:else if type=="date"}
                                <td>{value}</td>
                            {:else}
                                <td><input name={key} id={`input_${key}`} type={type} value={""+value} readonly={read_only}/></td>
                            {/if}
                        </tr>
                        {/each}
                    </table>
                </fieldset>
            {/each}
        {/if}
        <fieldset>
            <legend>Soumettre</legend>
            {#if form?.update_success}<p class="success">Mise a jour réussie!</p>{/if}
            {#if form?.update_failure}<p class="error">Erreur de mise à jour: "{form.update_failure}""</p>{/if}
            <table>
                <tr>
                    <input bind:checked={user_agreed} id="agreement" type="checkbox"/>
                    <label for="agreement"><u>J'ai pris conaissance</u> de la réglementation <a href="/reglementation" target="_blank">ici</a> et <u>je donne mon accord</u> pour utilisation de mes donnees plus haut.</label>
                </tr>
                <tr>
                    <input type="submit" disabled={!user_agreed} id="mettre_a_jour" value="Mettre a jour"/>
                </tr>
            </table>
        </fieldset>
    </fieldset>
</form>

<hr/>

<form method="POST" action="?/pwd_chg" use:enhance>
    <fieldset id="pwd_chg">
        <legend>Reinitialisation mot de passe</legend>
        {#if form?.pwd_rst_missing}<p class="error">Manque de mot de passe!</p>{/if}
        {#if form?.pwd_rst_incorrect}<p class="error">Mot de passe incorrect!</p>{/if}
        {#if form?.pwd_rst_success}<p class="success">Changement réussi!</p>{/if}
        <table>
            <tr>
                <td><label for="old_pwd">Ancien mot de passe</label></td>
                <td><input name="old_pwd" id="old_pwd" type="password"></td>
            </tr>
            <tr>
                <td><label for="new_pwd">Nouveau mot de passe</label></td>
                <td><input bind:value={new_pwd_val} name="new_pwd" id="new_pwd" type="password"></td>
            </tr>
            <tr>
                <td><label for="rep_pwd">Confirmer nouveau mot de passe</label></td>
                <td><input bind:value={con_pwd_val} id="rep_pwd" type="password"></td>
            </tr>
            <tr>
                <td></td>
                <td><input type="submit" value="Changer" disabled={new_pwd_val != con_pwd_val}></td>
            </tr>
        </table>
    </fieldset>
</form>

<hr/>

<form bind:this={delete_account_form} method="POST" action="?/delete_account" use:enhance>
    <fieldset class="danger">
        <legend>Supprimer ce compte</legend>
        {#if form?.delete_failure}<p class="error">Erreur serveur: "{form.delete_failure}"</p>{/if}
        {#if form?.delete_success}<p class="success">Compte supprimé!</p>{/if}
        <p class="info">Pour supprimer votre compte, debloquez d'abbord le bouton "Supprimer ce compte" avec le bouton "Debloquer". Ensuite appuyez sur "Supprimer ce compte". Enfin confirmez que vous voulez supprimer votre compte.</p>
        <input type="button" value="Debloquer" on:click={()=>{delete_account_btn.disabled = false;}}/>
        <input bind:this={delete_account_btn} on:click={delete_account_now} type="button" value="Supprimer ce compte" disabled/>
    </fieldset>
</form>

<hr/>

{#if user?.admin}
    <form method="POST" action="?/create_account" use:enhance>
        <fieldset class="admin">
            <legend>Admin</legend>
            <fieldset>
                <legend>Créer un compte</legend>
                {#if form?.creation_failure}<p class="error">Erreur serveur: "{form.creation_failure}"</p>{/if}
                {#if form?.creation_success}<p class="success">Creation réussie! login: {form.new_account_login} </p>{/if}        
                <table>
                    <tr>
                        <td><label for="create_prenom">prenom</label></td>
                        <td><input name="prenom" id="create_prenom" type="text"></td>
                    </tr>
                    <tr>
                        <td><label for="create_nom">nom</label></td>
                        <td><input name="nom" id="create_nom" type="text"></td>
                    </tr>
                    <tr>
                        <td><label for="create_grad_year">année fin L3</label></td>
                        <td><input name="grad_year" id="create_grad_year" type="number"></td>
                    </tr>
                    <tr>
                        <td><label for="create_pwd">password</label></td>
                        <td><input bind:this={create_pwd} name="password" id="create_pwd" type="string" value={generate_password()}></td>
                        <td><input type="button" on:click={()=>navigator.clipboard.writeText(create_pwd.value)} value="copy"/></td>
                        <td><input type="button" on:click={()=>create_pwd.value=generate_password()} value="regenerate"/></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><input type="submit" value="Créer"></td>
                    </tr>
                </table>
                <p class="info">Copiez le mot de passe, cliquez sur creer puis copiez le login.</p>
            </fieldset>
        </fieldset>
    </form>
    <form method="POST" action="?/mass_create_accounts" use:enhance>
        <fieldset class="admin">
            <legend>Admin</legend>
            <fieldset>
                <legend>Créer des comptes à partir des emails</legend>
                {#if form?.creation_failure}<p class="error">Erreur serveur: "{form.creation_failure}"</p>{/if}
                {#if form?.creation_success}<p class="success">Creation réussie! logins: {form.new_account_login} </p>{/if}        
                <table>
                    <tr>
                        <td><label for="create_emails">emails (separate with ";")</label></td>
                        <td><textarea name="emails" id="create_emails" rows={3} cols="40"></textarea></td>
                    </tr>
                    <tr>
                        <td><label for="create_grad_year2">année fin L3</label></td>
                        <td><input name="grad_year" id="create_grad_year2" type="number"></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><input type="submit" value="Créer"></td>
                    </tr>
                </table>
                <p class="info">Entrez des emails des personnes et l'année de leur L3</p>
            </fieldset>
        </fieldset>
    </form>
{/if}

<style>
    fieldset{
        margin-top: 20px;
    }
    form > fieldset{
        margin-top: 50px;
        margin-bottom: 50px;
        border: none;
    }
    form > fieldset > fieldset {
        border: none;
        background: linear-gradient(40deg, var(--behind-color), var(--background-color) 50% 100%);
    }
    form > fieldset > *{
        background-color: var(--background-color);
    }
    form > fieldset > legend{
        font-size: xx-large;
        font-weight: bold;
        text-decoration: underline wavy var(--behind-color);
    }
    form > fieldset >fieldset > legend {
        font-weight: bold;
    }
    input, textarea{
        width: 95%;
    }
    input:read-only[type~="text"], input:read-only[type~="date"], textarea:read-only{
        background: rgb(196, 196, 196);
    }
    input[type="checkbox"] {
        width: auto;
    }
    .admin{
        background-color: aquamarine;
    }
    .danger{
        background-color: rgb(255, 95, 95);
    }
    .danger legend{
        color: red;
        font-weight: bold;
    }
    .error{
        color: red;
    }
    .success{
        color: green;
    }
    .info{
        font-size: medium;
        width: 94%;
        background-color: var(--background-color);
        padding: 5px;
        border: solid 1px gray;
    }
    .info::before{
        content: "💡 ";
    }
    table{
        border-spacing: 7px;
        width: 100%;
    }
    table tr td:first-child {
        width: 100px;
        overflow: hidden;
        border-bottom: solid 1px var(--font-color);
    }
    table tr:last-child td:first-child {
        border: none;
    }

    #mettre_a_jour:enabled {
        background-color: rgb(196, 255, 196);
    }
    #mettre_a_jour:disabled {
        background-color: rgb(255, 147, 147);
    }
    #mettre_a_jour:enabled:hover {
        background-color: rgb(86, 255, 86);
    }
    .markdown-preview{
        max-height: 50vh;
        overflow-y: scroll;
    }
</style>