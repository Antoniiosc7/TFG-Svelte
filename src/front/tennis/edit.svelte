<script>
    export let params = {};
    import {pop} from "svelte-spa-router";
    import { onMount } from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import Table from 'sveltestrap/src/Table.svelte';
    import { Alert } from 'sveltestrap';

    let visible = false;
    let color = "danger";


    let entry = {};
    let updatedCountry;
    let updatedYear;
    let updatedmost_grand_slam;
    let updatedmasters_finals;
    let updatedolympic_gold_medals;
    let errorMsg = "";

    onMount(getEntries);
    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v2/tennis/"+params.country+"/"+params.year); 
        if(res.ok){
            const data = await res.json();
            entry = data;
            updatedCountry = entry.country;
            updatedYear = entry.year;
            updatedmost_grand_slam = entry.most_grand_slam;
            updatedmasters_finals = entry.masters_finals;
            updatedolympic_gold_medals = entry.olympic_gold_medals;
        }else{
            visible = true;
            color = "danger"
            errorMsg = "Error " + res.status + " : " + "Ningún recurso con los parametros " + params.country +" " + params.year;
            console.log("ERROR" + errorMsg);
        }
    }
    async function EditEntry(){
        console.log("Updating entry...."+updatedCountry);
        const res = await fetch("/api/v2/tennis/"+params.country+"/"+params.year,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: updatedCountry,
                    year: parseInt(updatedYear),
                    most_grand_slam: parseFloat(updatedmost_grand_slam),
                    masters_finals: parseFloat(updatedmasters_finals),
                    olympic_gold_medals: parseFloat(updatedolympic_gold_medals)
                }),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res) {
                    visible = true;
                    if(res.status == 200){
                        getEntries(); 
                        console.log("Data introduced");
                        color = "success";
                        errorMsg="Recurso actualizado correctamente";
                    }else{
                        console.log("Data not edited");
                        color = "danger";
                        errorMsg= "Compruebe los campos";
                    }
                });	
    }
</script>

<main>
    <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
        {#if errorMsg}
		    {errorMsg}
	    {/if}
    </Alert>

    <h1>Editar entrada "{params.country}","{params.year}"</h1>
    {#await entry}
    loading
        {:then entry}
        
    
        <Table bordered>
            <thead>
                <tr>
				
                    <th>País</th>
                    <th>Año</th>
                    <th>Grand Slams Ganados</th>
                    <th>Masters 1000 Ganados</th>
                    <th>Medallas Olimpicas</th>
                    <th></th>
                    <th> </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input bind:value="{updatedCountry}"></td>
                    <td><input bind:value = "{updatedYear}"></td>
                    <td><input bind:value="{updatedmost_grand_slam}"></td>
                    <td><input bind:value="{updatedmasters_finals}"></td>
                    <td><input bind:value="{updatedolympic_gold_medals}"></td>
                    <td><Button outline color="primary" on:click="{EditEntry}">
                        Editar
                        </Button>
                    </td>
                </tr>
            </tbody>
        </Table>
    {/await}
    
    <Button outline color="secondary" on:click="{pop}">Volver</Button>

    </main>