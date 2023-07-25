<script>
    import anciens_r from "$data/contact-anciens.json"

    let anciens_x = Object.entries(anciens_r)
        .map(([nom, data])=>Object.assign({nom}, data));
    /** @param {string} st*/
    let matches = (st)=>(v)=>{
        if(typeof v == "number") return v.toString().toLowerCase().includes(st.toLowerCase());
        else if(typeof v == "string") return v.toLowerCase().includes(st.toLowerCase());
        else if(Array.isArray(v)) return v.some(x=>x.toLowerCase().includes(st.toLowerCase()))
    };
    let search_term = "";
    $: anciens = anciens_x
        .filter(d=>Object.values(d)
            .some(matches(search_term)))
        .sort((a, b)=>a.nom > b.nom ? 1 : -1);
</script>

<h1>Repertoire des anciens :</h1>

Rechercher : <input type="text" bind:value={search_term}/> - {anciens.length} résultat{anciens.length==1 ? "" : "s"}
<hr/>
<table>
    <tr>
        <th>Nom</th>
        <th>PIMA</th>
        <th>Suite</th>
        <th></th>
    </tr>
    {#each anciens as data}
        <tr>
            <td>{data.nom}</td> 
            <td>{data.grad_year-3}-{data.grad_year}</td>
            <td>{data.choisi}</td>
            <td><a href="/restricted/anciens/{data.nom}">plus d'infos</a></td>
        </tr>
    {/each}
</table>


<style>
    table{
        width: 100%;
    }
    table td, table th{
        text-align: left;
    }
</style>