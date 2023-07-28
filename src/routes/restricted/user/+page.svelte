<script>
  import { invalidate } from '$app/navigation';

    /** @type {HTMLInputElement}*/
    let delete_account_btn;
    /** @type {any}*/
    let user_agreed;

    export let data;

    /** @type {import('./$types').ActionData} */
    export let form;


    const big_box = ["admis", "contact", "description"];

    /** @param {string} type */
    const type_to_input = (type)=>{
        switch(type){
            case "number": return "number"
            case "string": return "text"
        }
    }

    $: data_entries = Object.entries(data.user || {})
        .filter(([k, _])=>!["admin", "createdAt", "updatedAt"].includes(k));

    /** @type {boolean}*/
    let new_pwd_val;
    /** @type {boolean}*/
    let con_pwd_val;
</script>

<h1>Donnes et parametres utilisateur</h1>

<form method="POST" action="?/disconnect">
    <fieldset>
        <legend>Deconnexion</legend>
        <input type="submit" value="Deconnexion" on:click={()=>invalidate("user:update")}/>
    </fieldset>
</form>

<form method="POST" action="?/update_data">
    <fieldset>
        <legend>Mes donnes</legend>
        {#if !data.user}
            <p class="error">Erreur interne! Donnes indisponibles!</p>
        {/if}
        <table>
            {#each data_entries as [k, v]}
                <tr>
                    <td><label for={`input_${k}`}>{k}</label></td>
                    {#if big_box.includes(k)}
                    <td><textarea name={k} id={`input_${k}`} rows="3" cols="40">{v}</textarea></td>
                    {:else}
                    <td><input name={k} id={`input_${k}`} type={type_to_input(typeof v)} value={v}/></td>
                    {/if}
                </tr>
            {/each}
        </table>
        <fieldset>
            <legend>Soumettre</legend>
            <input bind:checked={user_agreed} id="agreement" type="checkbox"/>
            <label for="agreement">J'ai pris conaissance de la reglementation <a href="/reglementation" target="_blank">ici</a> et je donne mon accord pour utilisation de mes donnees plus haut.</label><br/>
            <input type="submit" disabled={!user_agreed}/>
        </fieldset>
    </fieldset>
</form>

<form>
    <fieldset id="pwd_chg">
        <legend>Reinitialisation mot de passe</legend>
        {#if form?.reset_pwd}
            {#if form?.missing}<p class="error">Manque de mot de passe!</p>{/if}
            {#if form?.incorrect}<p class="error">Mot de passe incorrect!</p>{/if}
            {#if form?.success}<p class="success">Changement réussi!</p>{/if}
        {/if}
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

<form>
    <fieldset id="danger">
        <legend>Danger Zone</legend>
        <input type="button" value="Debloquer" on:click={()=>{delete_account_btn.disabled = false;}}/>
        <input bind:this={delete_account_btn} type="button" value="Supprimer ce compte" disabled/>
    </fieldset>
</form>

<style>
    fieldset{
        margin-top: 20px;
    }
    #danger{
        background-color: rgb(255, 95, 95);
    }
    #danger legend{
        color: red;
        font-weight: bold;
        background: beige;
    }
    table{
        border-spacing: 7px;
    }
</style>