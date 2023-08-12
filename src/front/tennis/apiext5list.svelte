<script>

    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';
	import { getBASEUrl } from '../../../config.js';
    const BASEUrl = getBASEUrl();
    let entries = [];
    onMount(getEntries);

    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch(`${BASEUrl}/api/v1/tennisWomen`); 
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
		  <h1>Clasifición Femenina</h1>
		</blockquote>
		
	  </figure>
	  <td align="center">
		<Button color="success" on:click={function (){
			window.location.href = `/#/tennis/apiext5chart`
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
				<th>Foto</th>
				<th>País</th>
                
				<th>Puntos</th>
               		
		</tr>
		</thead>
		<tbody>
			<tr>		
			</tr>
			{#each entries as entry}
				<tr>
					<td>{entry.ranking}</td>
					<td>{entry.team.name}</td>
                    <td><img src="{entry.team.logo}" alt="WTA" width="100" height="100"></td>
					<td>{entry.team.country}</td>
					<td>{entry.points}</td>

                  				
				</tr>
			{/each}
			
		</tbody>
	</Table>
{/await}

</main>