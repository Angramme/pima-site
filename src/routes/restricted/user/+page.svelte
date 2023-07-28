<script>
  import { browser } from '$app/environment';
  import { goto, invalidate } from '$app/navigation';

    /** @type {HTMLInputElement}*/
    let delete_account_btn;
    /** @type {any}*/
    let user_agreed;

    /** @type {import('./$types').PageData} */
    export let data;

    /** @type {import('./$types').ActionData} */
    export let form;


    $: user = data.user;
    $: sections = !user ? null : [
        {n:"Ecoles", l:[
            {k:"admis", l:"admis dans", v:user.admis, t:"textlist", ro:false},
            {k:"choisi", l:"choisi", v:user.choisi, t:"text", ro:false},
            {k:"grad_year", l:"année fin L3", v:user.grad_year, t:"number", ro:false},
        ]},
        {n:"Contact", l:[
            {k:"email", l:"email", v:user.email, t:"email", ro:false},
            {k:"contact", l:"autres moyens de contacter", v:user.contact, t:"textlist", ro:false},
        ]},
        {n:"Infos personelles", l:[
            {k:"nom", l:"nom de famille (facultatif)", v:user.nom, t:"text", ro:false},
            {k:"prenom", l:"prénom", v:user.prenom, t:"text", ro:false},
            {k:"nationalite", l:"nationalité/s", v:user.nationalite, t:"textlist", ro:false},
            {k:"description", l:"description et conseils", v:user.description, t:"longtext", ro:false},
        ]},
        {n:"Autres (Lecture seule)", l:[
            {k:"login", l:"login", v:user.login, t:"text", ro:true},
            {k:"admin", l:"admin privileges", v:user.admin, t:"text", ro:true},
            {k:"createdAt", l:"date création", v:user.createdAt, t:"date", ro:true},
            {k:"updatedAt", l:"derniere mise a jour", v:user.updatedAt, t:"date", ro:true},
        ]},
    ];

    // invalidate load dependent on locals.user when disconnected
    $: form?.disconnected, browser && invalidate("user:update")

    /** @type {boolean}*/
    let new_pwd_val;
    /** @type {boolean}*/
    let con_pwd_val;

    /** @type {HTMLFormElement}*/
    let delete_account_form;
    const delete_account_now = async ()=>{
        const yes = confirm("Veuillez vous vraiment supprimer votre compte? Attention cette opération n'est pas réversible.");
        if(!yes) return;
        delete_account_form.submit();
    }
    $: form?.delete_failure, browser && form?.delete_failure && alert("Erreur serveur: " + form?.delete_failure);
    $: form?.delete_success, browser && invalidate("user:update");

    /** @type {HTMLInputElement}*/
    let create_pwd;

    const generate_password = (
        length = 30,
        wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
    ) =>
        Array.from(crypto.getRandomValues(new Uint32Array(length)))
            .map((x) => wishlist[x % wishlist.length])
            .join('');
</script>

<h1>Donnes et parametres utilisateur</h1>

<!-- Server message sesction -->
{#if form?.pwd_rst_missing}<p class="error">Manque de mot de passe!</p>{/if}
{#if form?.pwd_rst_incorrect}<p class="error">Mot de passe incorrect!</p>{/if}
{#if form?.pwd_rst_success}<p class="success">Changement réussi!</p>{/if}
{#if form?.disconnected} <p class="success">Déconnexion réussie!</p> {/if}
{#if form?.update_success}<p class="success">Mise a jour réussie!</p>{/if}
{#if form?.update_failure}<p class="error">Erreur de mise à jour: "{form.update_failure}""</p>{/if}


<form method="POST" action="?/disconnect">
    <fieldset>
        {#if form?.disconnected} <p class="success">Déconnexion réussie!</p> {/if}
        <legend>Deconnexion</legend>
        <input type="submit" value="Deconnexion"/>
    </fieldset>
</form>

<form method="POST" action="?/update_data">
    <fieldset>
        <legend>Mes donnes</legend>
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
                                    {#if type=="textlist"} <span class="info">lister en séparant par des ","</span><br/> {/if}
                                    <textarea name={key} id={`input_${key}`} rows={type=="textlist" ? 3 : 5} cols="40">{value}</textarea>
                                </td>
                            {:else}
                                <td><input name={key} id={`input_${key}`} type={type} value={value} readonly={read_only}/></td>
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
            <input bind:checked={user_agreed} id="agreement" type="checkbox"/>
            <label for="agreement">J'ai pris conaissance de la reglementation <a href="/reglementation" target="_blank">ici</a> et je donne mon accord pour utilisation de mes donnees plus haut.</label><br/>
            <input type="submit" disabled={!user_agreed}/>
        </fieldset>
    </fieldset>
</form>

<form method="POST" action="?/pwd_chg">
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

<form bind:this={delete_account_form} method="POST" action="?/delete_account">
    <fieldset class="danger">
        <legend>Danger Zone</legend>
        {#if form?.delete_failure}<p class="error">Erreur serveur: "{form.delete_failure}"</p>{/if}
        {#if form?.delete_success}<p class="success">Compte supprimé!</p>{/if}
        <input type="button" value="Debloquer" on:click={()=>{delete_account_btn.disabled = false;}}/>
        <input bind:this={delete_account_btn} on:click={delete_account_now} type="button" value="Supprimer ce compte" disabled/>
    </fieldset>
</form>

{#if user?.admin}
    <form method="POST" action="?/create_account">
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
{/if}

<style>
    fieldset{
        margin-top: 20px;
    }
    input:read-only[type~="text"], input:read-only[type~="date"], textarea:read-only{
        background: rgb(196, 196, 196);
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
        background: beige;
    }
    .error{
        color: red;
    }
    .success{
        color: green;
    }
    .info{
        font-style: italic;
        color: blue;
    }
    table{
        border-spacing: 7px;
    }
    table tr td:first-child {
        width: 100px;
    }
</style>