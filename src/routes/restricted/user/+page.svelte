<script>
    /** @type {HTMLInputElement}*/
    let delete_account_btn;
    /** @type {any}*/
    let user_agreed;

    export let data;

    /** @param {string} type*/
    const type_to_input = (type)=>{
        switch(type){
            case "number": return "number"
            case "string": return "text"
        }
    }
</script>

<h1>Donnes et parametres utilisateur</h1>

<form>
    <fieldset>
        <legend>Deconnexion</legend>
        <input type="submit" value="Deconnexion"/>
    </fieldset>
</form>

<form>
    <fieldset>
        <legend>Mes donnes</legend>
        <table>
            {#each Object.entries(data.user) as [k, v]}
                <tr>
                    <td><label for={`input_${k}`}>{k}</label></td>
                    <td><input id={`input_${k}`} type={type_to_input(typeof v)}/></td>
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
        <table>
            <tr>
                <td><label for="old_pwd">Ancien mot de passe</label></td>
                <td><input id="old_pwd" type="password"></td>
            </tr>
            <tr>
                <td><label for="new_pwd">Nouveau mot de passe</label></td>
                <td><input id="new_pwd" type="password"></td>
            </tr>
            <tr>
                <td><label for="rep_pwd">Confirmer nouveau mot de passe</label></td>
                <td><input id="rep_pwd" type="password"></td>
            </tr>
            <tr>
                <td></td>
                <td><input type="submit" value="Changer"></td>
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