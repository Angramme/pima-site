<script>
    import anciens_r from "$data/contact-anciens.json"

    let anciens_x = Object.entries(anciens_r)
        .map(([nom, data])=>Object.assign({nom}, data));
    /** @param {string} st*/
    let matches = (st)=>(v)=>{
        let x = st.toLowerCase();
        if(typeof v == "number" && !v.toString().toLowerCase().includes(x)) return false;
        else if(typeof v == "string" && !v.toLowerCase().includes(x)) return false;
        else if(Array.isArray(v) && !v.some(y=>y.toLowerCase().includes(x))) return false;
        return true;
    };
    let search_term = "";
    $: anciens = anciens_x
        .filter(d=>search_term
            .split(" ")
            .every(s=>Object.values(d)
                .some(matches(s))))
        .sort((a, b)=>a.nom > b.nom ? 1 : -1);
</script>

<h1>Repertoire des anciens :</h1>

<p>
    Les informations présentes ont ete donnes par les élèves eux mêmes avec leur accord. 
</p>

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