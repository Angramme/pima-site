<script>
    /** @type {import('./$types').PageData} */
    export let data;
</script>

<h1>{data.nom}</h1>

<table>
    {#each Object.entries(data)
        .filter(([v, _])=>!["nom", "description"].includes(v)) 
        as [k, v]}
        <tr>
            <th>{k}</th>
            <td>{v}</td>
        </tr>
    {/each}
</table>

<h2>Description : </h2>
<p>{data.description}</p>

<style>
    th{
        text-align: right;
        padding-right: 10px;
    }
</style>