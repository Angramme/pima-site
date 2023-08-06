<script>
    // import anciens_r from "$data/contact-anciens.json"

    export let data;

    // TODO: fix search engine not updating
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
    let search_term = "";
    $: anciens_P = data.streamed.users
        .then(v=>
            v.map(d=>{
                // @ts-ignore
                if(d.admin) d._admin = "admin";
                return d;
            })
            .filter(d=>search_term
                .split(" ")
                .every(s=>Object
                    .values(d)
                    .some(matches(s)))));
</script>

<h1>Repertoire des anciens :</h1>

<p>
    Les informations présentes ont ete donnes par les élèves eux mêmes avec leur accord. 
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
                <td class={data.sleeping ? "sleeper" : ""}>{data.nom || "🤐"} {data.prenom}</td> 
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
    .sleeper{
        font-style: italic;
        color: blueviolet;
    }
    .sleeper::after{
        content: " 😴";
    }
</style>