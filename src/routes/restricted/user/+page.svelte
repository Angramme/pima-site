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

    let login_to_modify = "";

    let current_tab = "donnes";
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

<div class="tabs">
    <button class:active={current_tab === 'donnes'} on:click={() => current_tab = 'donnes'}>Mes données</button>
    <button class:active={current_tab === 'pwd'} on:click={() => current_tab = 'pwd'}>Mot de passe</button>
    <button class:active={current_tab === 'danger'} on:click={() => current_tab = 'danger'}>Danger Zone</button>
    {#if user?.admin}
        <button class:active={current_tab === 'admin'} on:click={() => current_tab = 'admin'}>Admin</button>
    {/if}
</div>

<div class="tab-content">
    {#if current_tab === 'donnes'}
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
                        <fieldset class="data-section">
                            <legend>{n}</legend>
                            <div class="data-grid">
                                {#each list as {k: key, l: label, v: value, t: type, ro: read_only}}
                                    <div class="form-field" class:full-width={key === 'description'}>
                                        <label for={`input_${key}`}>{label}</label>
                                        {#if type=="textlist" || type=="longtext"}
                                            {#if type=="textlist"} <div class="info">lister en séparant par des ","</div> {/if}
                                            <textarea name={key} id={`input_${key}`} rows={type=="textlist" ? 3 : 12}>{""+value}</textarea>
                                        {:else if type == "markdown"}
                                            <div class="markdown-editor">
                                                <h4>Markdown : </h4>
                                                <textarea bind:value={desc_markdown} name={key} id={`input_${key}`} rows={12}></textarea>
                                                <h4>Preview : </h4>
                                                <div class="markdown-preview">
                                                    <Markdown markdown={desc_markdown}/>
                                                </div>
                                            </div>
                                        {:else if type=="date"}
                                            <p>{value}</p>
                                        {:else if type=="checkbox"}
                                            <input name={key} id={`input_${key}`} type={type} checked={value} readonly={read_only}/>
                                        {:else}
                                            <input name={key} id={`input_${key}`} type={type} value={""+value} readonly={read_only}/>
                                        {/if}
                                    </div>
                                {/each}
                            </div>
                        </fieldset>
                    {/each}
                {/if}
                <fieldset>
                    <legend>Soumettre</legend>
                    {#if form?.update_success}<p class="success">Mise a jour réussie!</p>{/if}
                    {#if form?.update_failure}<p class="error">Erreur de mise à jour: "{form.update_failure}""</p>{/if}
                    <div class="form-field">
                        <input bind:checked={user_agreed} id="agreement" type="checkbox"/>
                        <label for="agreement"><u>J'ai pris conaissance</u> de la réglementation <a href="/reglementation" target="_blank">ici</a> et <u>je donne mon accord</u> pour utilisation de mes donnees plus haut.</label>
                    </div>
                    <div class="form-field">
                        <input type="submit" disabled={!user_agreed} id="mettre_a_jour" value="Mettre a jour"/>
                    </div>
                </fieldset>
            </fieldset>
        </form>
    {/if}

    {#if current_tab === 'pwd'}
        <form method="POST" action="?/pwd_chg" use:enhance>
            <fieldset id="pwd_chg">
                <legend>Reinitialisation mot de passe</legend>
                {#if form?.pwd_rst_missing}<p class="error">Manque de mot de passe!</p>{/if}
                {#if form?.pwd_rst_incorrect}<p class="error">Mot de passe incorrect!</p>{/if}
                {#if form?.pwd_rst_success}<p class="success">Changement réussi!</p>{/if}
                <div class="form-field">
                    <label for="old_pwd">Ancien mot de passe</label>
                    <input name="old_pwd" id="old_pwd" type="password">
                </div>
                <div class="form-field">
                    <label for="new_pwd">Nouveau mot de passe</label>
                    <input bind:value={new_pwd_val} name="new_pwd" id="new_pwd" type="password">
                </div>
                <div class="form-field">
                    <label for="rep_pwd">Confirmer nouveau mot de passe</label>
                    <input bind:value={con_pwd_val} id="rep_pwd" type="password">
                </div>
                <div class="form-field">
                    <input type="submit" value="Changer" disabled={new_pwd_val != con_pwd_val}>
                </div>
            </fieldset>
        </form>
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
    {/if}

    {#if current_tab === 'danger'}
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
    {/if}

    {#if current_tab === 'admin' && user?.admin}
        <fieldset class="admin">
            <legend>Admin</legend>
            <form method="POST" action="?/create_account" use:enhance>
                <fieldset>
                    <legend>Créer un compte</legend>
                    {#if form?.creation_failure}<p class="error">Erreur serveur: "{form.creation_failure}"</p>{/if}
                    {#if form?.creation_success}<p class="success">Creation réussie! login: {form.new_account_login} </p>{/if}
                    <div class="form-field">
                        <label for="create_prenom">prenom</label>
                        <input name="prenom" id="create_prenom" type="text">
                    </div>
                    <div class="form-field">
                        <label for="create_nom">nom</label>
                        <input name="nom" id="create_nom" type="text">
                    </div>
                    <div class="form-field">
                        <label for="create_grad_year">année fin L3</label>
                        <input name="grad_year" id="create_grad_year" type="number">
                    </div>
                    <div class="form-field">
                        <label for="create_pwd">password</label>
                        <input bind:this={create_pwd} name="password" id="create_pwd" type="string" value={generate_password()}>
                        <input type="button" on:click={()=>navigator.clipboard.writeText(create_pwd.value)} value="copy"/>
                        <input type="button" on:click={()=>create_pwd.value=generate_password()} value="regenerate"/>
                    </div>
                    <div class="form-field">
                        <input type="submit" value="Créer">
                    </div>
                    <p class="info">Copiez le mot de passe, cliquez sur creer puis copiez le login.</p>
                </fieldset>
            </form>
            <form method="POST" action="?/mass_create_accounts" use:enhance>
                <fieldset>
                    <legend>Créer des comptes à partir des emails</legend>
                    {#if form?.creation_failure}<p class="error">Erreur serveur: "{form.creation_failure}"</p>{/if}
                    {#if form?.creation_success}<p class="success">Creation réussie! logins: {form.new_account_login} </p>{/if}
                    <div class="form-field">
                        <label for="create_emails">emails (separate with ";")</label>
                        <textarea name="emails" id="create_emails" rows={3}></textarea>
                    </div>
                    <div class="form-field">
                        <label for="create_grad_year2">année fin L3</label>
                        <input name="grad_year" id="create_grad_year2" type="number">
                    </div>
                    <div class="form-field">
                        <input type="submit" value="Créer">
                    </div>
                    <p class="info">Entrez des emails des personnes et l'année de leur L3</p>
                </fieldset>
            </form>
            <form method="POST" action="?/search" use:enhance>
                <fieldset>
                    <legend>Chercher un utilisateur</legend>
                    <input name="query" type="text" placeholder="login, nom, prenom">
                    <input type="submit" value="Chercher">
                    {#if form?.search_results}
                        <ul>
                            {#each form.search_results as user}
                                <li>
                                    {user.prenom} {user.nom} ({user.login})
                                    <button on:click={() => login_to_modify = user.login}>Sélectionner</button>
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </fieldset>
            </form>
            <fieldset>
                <legend>Actions sur l'utilisateur</legend>
                <input type="text" placeholder="login" bind:value={login_to_modify}>
                <form method="POST" action="?/set_admin" use:enhance>
                    <input type="hidden" name="login" value={login_to_modify} />
                    <input type="submit" value="Donner les droits admin">
                </form>
                <form method="POST" action="?/unset_admin" use:enhance>
                    <input type="hidden" name="login" value={login_to_modify} />
                    <input type="submit" value="Enlever les droits admin">
                </form>
                <form method="POST" action="?/delete_user" use:enhance>
                    <input type="hidden" name="login" value={login_to_modify} />
                    <input type="submit" value="Supprimer l'utilisateur">
                </form>
            </fieldset>
        </fieldset>
    {/if}
</div>

<style>
    .tabs {
        display: flex;
        margin-bottom: 20px;
    }
    .tabs button {
        background: none;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 1.1rem;
        border-bottom: 2px solid transparent;
    }
    .tabs button.active {
        border-bottom: 2px solid var(--accent-color);
    }
    .tab-content {
        border: 1px solid var(--behind-color);
        padding: 20px;
        border-radius: 5px;
    }
    fieldset{
        margin-top: 20px;
        border: 1px solid var(--behind-color);
        border-radius: 5px;
        padding: 20px;
    }
    legend {
        font-size: 1.5rem;
        font-weight: bold;
        padding: 0 10px;
    }
    .data-section {
        margin-bottom: 20px;
    }
    .data-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }
    .form-field {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .form-field label {
        font-weight: bold;
        white-space: pre-line;
    }
    .form-field.full-width {
        grid-column: 1 / -1;
    }
    input, textarea {
        width: 100%;
        padding: 10px;
    }
    input[type="checkbox"] {
        width: auto;
    }
    .markdown-editor {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
    .markdown-preview{
        max-height: 50vh;
        overflow-y: scroll;
        border: 1px solid var(--behind-color);
        padding: 10px;
        border-radius: 5px;
    }
    .danger{
        border-color: red;
    }
    .danger legend{
        color: red;
    }
    .error{
        color: red;
    }
    .success{
        color: green;
    }
    .info{
        font-size: medium;
        background-color: color-mix(in srgb, var(--accent-color) 10%, transparent);
        padding: 10px;
        border: solid 1px var(--accent-color);
        border-radius: 5px;
    }
    .info::before{
        content: "💡 ";
    }
</style>