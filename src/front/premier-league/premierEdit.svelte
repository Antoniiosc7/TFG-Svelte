<script>

    import {pop} from "svelte-spa-router";
    import { onMount } from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import Table from 'sveltestrap/src/Table.svelte';
    import { getTransitionDuration } from "sveltestrap/src/utils";
    import { Alert } from "sveltestrap";
    import { getBASEUrl } from '../../../config.js';
    const BASEUrl = getBASEUrl();
    export let params = {};

    var BASE_API_PATH = `${BASEUrl}/api/v2/premier-league`;
    let visible = false;
    let color = "danger";
    let entry = {};
    let colorMsg = "danger";

    let updatedCountry = {};
    let updatedYear = "";
    let updatedappearences = "";
    let updatedcleanSheets = "";
    let updatedgoals = "";
    let errorMsg = "";

    onMount(getEntries);

    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch(BASE_API_PATH+"/" +params.country+"/"+params.year); 
        if(res.ok){
            const data = await res.json();
            updatedappearences = entry.appearences;
            updatedcleanSheets = entry.cleanSheets;
            updatedgoals = entry.goals;

            console.log("Recived data");
        }else{
            visible = true;
            color = "danger";
            colorMsg = "Error " + res.status + " : " + " Ningun recurso con los parametros " + params.country + " " + params.year;
            console.log("ERROR" + errorMsg);           
        }
    }

    async function EditEntry(){
        console.log("Updating entry...."+updatedCountry);
        const res = await fetch(BASE_API_PATH+"/"+params.country+"/"+params.year,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: params.country,
                    year: parseInt(params.year),
                    appearences: updatedappearences,
                    cleanSheets: updatedcleanSheets,
                    goals: updatedgoals
                }),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function(res){
                visible=true;
                if(res.status==200){
                    getEntries();
                    console.log("Data introduced");
                    color="success";
                    errorMsg = "Recurso actualizado correctamente";
                }else{
                    console.log("Data not edited");
                    errorMsg="Rellene todos los campos";
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

    <h1>Recurso '{params.country} , {params.year} ' listo para editar</h1>
    <Table bordered>
        <thead>
            <tr>
                <th>País</th>
                <th>Año</th>
                <th>Apariciones</th>
                <th>Portería Vacía</th>
                <th>goles</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{params.country}</td>
                <td>{params.year}</td>
                <td><input bind:value="{updatedappearences}"></td>
                <td><input bind:value="{updatedcleanSheets}"></td>
                <td><input bind:value="{updatedgoals}"></td>
                <td><Button outline color="primary" on:click={EditEntry}>Actualizar</Button></td>
            </tr>
        </tbody>
    </Table>

    <Button outline color="secondary" on:click="{pop}">Atrás</Button>
</main>