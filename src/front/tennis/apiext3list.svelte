<script>
    import { onMount } from "svelte";
    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    let entries = [];
    onMount(getEntries);

    async function getEntries() {
        const res1 = await fetch(
            "https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats/loadinitialdata"
        );
        if (res1.ok) {
            console.log("Fetching entries....");
            const res = await fetch(
                "https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats"
            );
            if (res.ok) {
                const data = await res.json();
                entries = data;
                console.log("Received entries: " + entries.length);
            }
        }
    }
</script>

<main>
    <figure class="text-center">
        <blockquote class="blockquote">
            <h1>API: public-expenditure-stats</h1>
        </blockquote>
    </figure>
    <td align="center">
        <Button
            color="success"
            on:click={function () {
                window.location.href = `https://sos2122-23.herokuapp.com/#/tennis/apiext3chart`;
            }}
        >
            Gráfica
        </Button>
    </td>
    {#await entries}
        loading
    {:then entries}
        <Table bordered>
            <thead id="titulitos">
                <tr>
                    <th>Country</th>
                    <th>Year</th>
                    <th>Public Expenditure</th>
                    <th>PE to GDP</th>
                    <th>PE on Defence</th>
                </tr>
            </thead>
            <tbody>
                <tr />
                {#each entries as entry}
                    <tr>
                        <td>{entry.country}</td>
                        <td>{entry.year}</td>
                        <td>{entry.public_expenditure}</td>
                        <td>{entry.pe_to_gdp}</td>
                        <td>{entry.pe_on_defence}</td>
                    </tr>
                {/each}
            </tbody>
        </Table>
    {/await}
</main>
