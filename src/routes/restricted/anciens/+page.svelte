<script>
    // import anciens_r from "$data/contact-anciens.json"

    export let data;

    /** @param {string} st*/
    let matches = (st)=>
        /** @param {*} v */
        (v)=>{
            let x = st.toLowerCase();
            if(typeof v == "number") return v.toString().toLowerCase().includes(x);
            else if(typeof v == "string") return v.toLowerCase().includes(x);
            else if(Array.isArray(v)) return v.some(y=>y.toLowerCase().includes(x));
            else return false;
        };

    /**
    *    @typedef {{
    *        op: string,
    *        left: AST,
    *        right: AST,
    *    } | string} AST
    */

    /** @param {string} str 
     * @returns {AST | null}
    */
    const ast = (str)=>{
        str = str.trim();
        if(str.length == 0) return null;

        let I = 0;

        if(str[0] == '('){
            let i=1;
            let c=1;
            while(c > 0 && i<str.length){
                if(str[i] == '(') c++;
                else if(str[i] == ')') c--;
                i++;
            }
            I = i;
            console.log(I, str[I], str);
        }

        let andi = str.indexOf("&", I); andi = andi!=-1?andi:Infinity;
        let ori = str.indexOf("|", I); ori = ori!=-1?ori:Infinity;
        let coni = str.indexOf(":", I); coni = coni!=-1?coni:Infinity;

        const i = Math.min(andi, ori, coni);

        if(i == Infinity) return str.trim();

        /** @param {string} str*/
        const redu = (str)=>{
            str = str.trim();
            if(str[0] == '(') return str.substring(1, str.length-1);
            else return str;
        }

        const left = ast(redu(str.substring(0, i)));
        const right = ast(redu(str.substring(i+1)));
        if(!left || !right) return null;

        return {
            op: str[i],
            left: left,
            right: right,
        }
    };

    const ast_match =
    /** @param {AST} ast 
        @param {Object[]} vals
        @param {Object.<string, *>} obj
        @return {boolean}
        */
    (ast, vals, obj)=>{
        if(typeof ast == "string") return vals.some(matches(ast));
        switch(ast.op){
            case "&": return ast_match(ast.left, vals, obj) && ast_match(ast.right, vals, obj);
            case "|": return ast_match(ast.left, vals, obj) || ast_match(ast.right, vals, obj);
            case ":": return typeof ast.left != 'string' ? true : 
                ast_match(ast.right, [obj[ast.left]], obj);
        }
        console.error("bad");
        return false;
    }

    let search_term = "";
    $: ast_term = ast(search_term);
    $: ast_term && console.log(ast_term);

    $: anciens_P = data.streamed.users
        .then(v=>
            v.map(d=>{
                // @ts-ignore
                if(d.admin) d._admin = "admin";
                return d;
            })
            // @ts-ignore
            .filter(o=>!ast_term ? true : ast_match(ast_term, Object.values(o), o)));

    let show_hint = false;
</script>

<h1>Repertoire des anciens :</h1>

<p>
    Exemples d'utilisation <button on:click={()=>show_hint=!show_hint}>{show_hint ? "cacher" : "afficher"}</button>: 
</p>
{#if show_hint}
<ul>
    <li>Trouver une personne: taper son nom ou prenom, par exemple "fred"</li>
    <li>Recherche par mot clef: taper le mot clef, par exemple "ingé", cela cherche dans toutes les proprietes</li>
    <li>Sinon il y a 3 operateurs
        <ul>
            <li>| ou logique</li>
            <li>& et logique</li>
            <li>: inclusion</li>
        </ul>
    </li>
    <li>Trouver tout le monde admis a l'X: taper "admis : (poly | X)" (i.e le champ "admis" contient "poly" ou "X")</li>
    <li>Trouver des Telecom admis en 2023: taper "(admis:tele) & (grad_year:23)".</li>
    <li>Trouver des gens de nationalié Polonaise: taper "nationalite:(pl | polo)"</li>
    <li>Trouver tout le monde avec 18 de moyenne en L2 OU en L3: taper "(moyenneL2:18)|(moyenneL3:18)" </li>
    <li>En general vous pouvez cherchez toutes les données :)</li>
</ul>
Voici les proprietes possibles:
<ul>
{#await data.streamed.users}
    <li>Chargement...</li>
{:then dat} 
    {#each Object.keys(dat[0]) as k}
        <li>{k}</li>
    {/each}
{/await}
</ul>
{/if}
<p>
    Les informations présentes ont été fournies par les élèves eux-mêmes avec leur consentement.
</p>

Rechercher : <input type="text" bind:value={search_term}/> - 
{#await anciens_P}
? résultat
{:then anciens} 
{anciens.length} résultat{anciens.length==1 ? "" : "s"}
{/await}
<hr/>
<table>
    <tr>
        <th>Nom</th>
        <th>PIMA</th>
        <th>Suite</th>
        <th></th>
    </tr>
    {#await anciens_P}
    <tr>
        <td>Chargement...</td>
    </tr>
    {:then anciens} 
        {#each anciens as data}
            <tr>
                <td class={(data.sleeping ? "sleeper " : "") + (data.admin ? "admin " : "")}>{data.nom || "🤐"} {data.prenom}</td> 
                <td>{data.grad_year-3}-{data.grad_year}</td>
                <td>{data.choisi}</td>
                <td><a href="/restricted/anciens/{data.id}">plus d'infos</a></td>
            </tr>
        {/each}
    {/await}
</table>


<style>
    table{
        width: 100%;
    }
    table td, table th{
        text-align: left;
    }
    table tr:nth-child(even) {
        background: var(--behind-color);
    }
    .sleeper{
        font-style: italic;
        color: blueviolet;
    }
    .sleeper::after{
        content: " 😴";
    }
    .admin{
        font-style: italic;
        color: green;
    }
</style>