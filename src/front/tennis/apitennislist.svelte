<script>

    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';

    let entries = [];
    onMount(getEntries);
	import { getBASEUrl } from '../../../config.js';
    const BASEUrl = getBASEUrl();
	
    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch(`${BASEUrl}/api/v1/tennisLiveRanking`); 
        if(res.ok){
            const data = await res.json();
            entries = data;
            console.log("Received entries: "+entries.length);
        }
    }
</script>



<main>

	<figure class="text-center">
		<blockquote class="blockquote">
		  <h1>Clasificación tennis masculina</h1>
		</blockquote>
		
	  </figure>
	  <td align="center">
		<Button color="success" on:click={function (){
			window.location.href = `https://sos2122-23.herokuapp.com/#/tennis/apitennischart`
		}}>
			Gráfica
		</Button>
	</td>
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