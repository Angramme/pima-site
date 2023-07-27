<script>
    /** @type {import('./$types').PageData} */
    export let data;
</script>

<h1>{data.user?.prenom} {data.user?.nom || "___"}</h1>

<table>
    {#each Object.entries(data.user || {})
        .filter(([v, _])=>!["description"].includes(v)) 
        as [k, v]}
        <tr>
            <th>{k}</th>
            <td>{v}</td>
        </tr>
    {/each}
</table>

<h2>Description : </h2>
<p>{data.user?.description}</p>

<style>
    th{
        text-align: right;
        padding-right: 7px;
        border-right: solid 1px gray;
    }
    td{
        padding-left: 7px;
        border-bottom: dotted 1px gray;
    }
</style>