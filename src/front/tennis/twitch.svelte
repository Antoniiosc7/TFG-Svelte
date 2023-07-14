<script>

    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';

    let entries = [];
    onMount(getEntries);

    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v1/tennis-twitch"); 
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
		  <h1>Clips: Twitch</h1>
		</blockquote>
		
	  </figure>
	  <td align="center">
		<Button color="success" on:click={function (){
			window.location.href = `/#/tennis/twitchchart`
		}}>
			Gráfica visitas
		</Button>
	</td>
{#await entries}
loading
	{:then entries}
	<Table bordered>
		
		
		<thead id="titulitos">
			<tr>
				
				<th>Titulo</th>
				<th>Numero de visitas</th>
				<th>Clip</th>			
		</tr>
		</thead>
		<tbody>
			<tr>		
			</tr>
			{#each entries as entry}
				<tr>
					<td>{entry.title}</td>
					<td>{entry.view_count}</td>
                    <td>
						<iframe
   src="https://clips.twitch.tv/embed?clip={entry.id}&parent=localhost"
   height="360"
   width="640"
   allowfullscreen>
</iframe>
						</td>
                  				
				</tr>
			{/each}
			
		</tbody>
	</Table>
{/await}

</main>