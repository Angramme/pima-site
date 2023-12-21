<script>
    // import anciens_r from "$data/contact-anciens.json"

    export let data;

    /** @param {string} st*/
    let matches = (st)=>
        /** @param {*} v */
        (v)=>{
            let x = st.toLowerCase().trim();
            if(st[0] == '<') return Number(st.substring(1)) > Number(v);
            if(st[0] == '>') return Number(st.substring(1)) < Number(v);
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
        let simple = true;
        
        if(str[0] == '('){
            let down = false;
            let i=1;
            let c=1;
            while(c > 0 && i<str.length){
                if(str[i] == '('){
                    if(down) simple = false;
                    c++;
                }
                else if(str[i] == ')'){
                    down = true;
                    c--;
                }
                i++;
            }
            I = i;
            console.log(I, str[I-1], str);
        }

        /** @param {string} str @returns {[string, boolean]}*/
        const redu = (str, rex=false)=>{
            str = str.trim();
            const r = str[0]=='(' && str[str.length-1]==')';
            str = str.substring(
                r ? 1 : 0, 
                r ? str.length-1 : str.length);
            
            return [r && rex ? redu(str, rex)[0] : str, r];
        }

        if(I == str.length){
            const [s, r] = redu(str);
            return r ? ast(s) : s;
        }

        let i = /[&\|:]/g.exec(str.substring(I))?.index;
        i = i==null ? Infinity : i+I;

        if(i==Infinity && (!simple || (I && I != str.length))){
            console.error("bad expression", i, I, str);
            return null;
        }

        if(i == Infinity) return redu(str.trim(), true)[0];

        const left = ast(redu(str.substring(0, i), true)[0]);
        const right = ast(str.substring(i+1));
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
            case ":": {
                if(typeof ast.left == 'string') return ast_match(ast.right, [obj[ast.left]], obj);
                switch(ast.left.op){
                    case "&": return ast_match({op:":", left: ast.left.left, right:ast.right}, vals, obj) && ast_match({op:":", left: ast.left.right, right:ast.right}, vals, obj);
                    case "|": return ast_match({op:":", left: ast.left.left, right:ast.right}, vals, obj) || ast_match({op:":", left: ast.left.right, right:ast.right}, vals, obj);
                }
            }
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
    <li>Trouver des Telecom admis en 2023: taper "(admis:tele) & (grad_year:2023)".</li>
    <li>Trouver des Telecom admis strictement apres 2022: taper "(admis:tele) & (grad_year:>2022)".</li>
    <li>Trouver des gens de nationalié Polonaise: taper "nationalite:(pl | polo)"</li>
    <li>Trouver tout le monde avec 18 de moyenne en L2 OU en L3: taper "(moyenneL2|moyenneL3):18" </li>
    <li>Trouver tout le monde avec au moins 15 de moyenne en L2 ET en L3: taper "(moyenneL2&moyenneL3):>14" </li>
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