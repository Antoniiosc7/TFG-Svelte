<script>

    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';

    let entries = [];
    onMount(getEntries);

	import { getBASEUrl } from '../../config.js';
    const BASEUrl = getBASEUrl();

	var BASE_API_PATH = `${BASEUrl}/api/v1/tennisLiveRanking`;
    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch(BASE_API_PATH); 
        if(res.ok){
            const data = await res.json();
            entries = data;
            console.log("Received entries: "+entries.length);
        }
    }
</script>



<main>
	<br>
	<div class="button-container">
        <Button outline color="btn btn-outline-primary" href="/#/topTennis"
            >Volver</Button
        >
    </div>
	<figure class="text-center">
		<blockquote class="blockquote">
		  <h1>Clasificación tennis masculina</h1>
		</blockquote>
		
	  </figure>

{#await entries}
loading
	{:then entries}
	<Table bordered>
		
		
		<thead id="titulitos">
			<tr>
				
				<th>Ranking</th>
				<th>Nombre</th>
				<th>Edad</th>
                <th>Puntos</th>
               		
		</tr>
		</thead>
		<tbody>
			<tr>		
			</tr>
			{#each entries as entry}
				<tr>
					<td>{entry.Rank}</td>
					<td>{entry.Name}</td>
                    <td>{entry.Age}</td>
					<td>{entry.Points}</td>
                   

                  				
				</tr>
			{/each}
			
		</tbody>
	</Table>
{/await}

</main>

<style>
	    .button-container {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        padding-left: 7%;
        padding-right: 7%;
    }
</style>