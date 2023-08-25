<script>
    import { getBASEUrl } from '../../config.js';
    const BASEUrl = getBASEUrl();
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';
	import {Alert} from 'sveltestrap';

	let redStyle = "redTable";
	let blueStyle = "blueTable";

	var BASE_API_PATH = `${BASEUrl}/api/v2/premier-league`

    let entries = [];
    let from = null;
	let to = null;

	let newEntry = {
		country: "",
		year: "",
		appearences: "",
        cleanSheets: "",
        goals: ""
	}

	let visible = false;
	let checkMSG="";
	let color="danger";
	let page = 1;
	let totaldata = 20;
    let offset = 0;
	let limit = 10;
    let maxPages =0;
    let numEntries;

	let sCountry = "";
	let sYear = "";
	let sAppearences = "";
	let sCleanSheets = "";
	let sGoals = "";

    onMount(getEntries);

	//GET
    async function getEntries(){
        console.log("Fetching entries....");
		let cadena = `${BASEUrl}/api/v2/premier-league?limit=${limit}&&offset=${offset*10}&&`;
		if (from != null) {
			cadena = cadena + `from=${from}&&`
		}
		if (to != null) {
			cadena = cadena + `to=${to}`
		}
        const res = await fetch(cadena); 
        if(res.ok){
			let cadenaPag = cadena.split(`limit=${limit}&&offset=${offset*10}`);
			maxPagesFunction(cadenaPag[0]+cadenaPag[1]);
            const data = await res.json();
            entries = data;
			numEntries = entries.length;
            console.log("Received entries: "+entries.length);
        }else{
			Errores(res.status);
		}
    }

	//GET INITIAL DATA

	
    async function loadStats() {
 
 		console.log("Fetching entry data...");
 		await fetch(BASE_API_PATH + "/loadInitialData");
		const res = await fetch(BASE_API_PATH + "?limit=10&offset=0");
 		if (res.ok) {
	 		console.log("Ok:");
	 		const json = await res.json();
	 		entries = json;
	 		visible = true;
	 		totaldata=20;
	 		console.log("Received " + entries.length + " entry data.");
	 		color = "success";
	 		checkMSG = "Datos cargados correctamente";
 		} else {
	 		color = "danger";
			checkMSG= res.status + ": " + "No se pudo cargar los datos";
	 		console.log("ERROR! ");
 		}
	}

	//INSERT DATA

	async function insertEntry(){
        console.log("Inserting entry....");
		if (newEntry.country == "" || newEntry.year == null ||
            newEntry.appearences == null || newEntry.cleanSheets == null || newEntry.goals == null) {
             alert("Los campos no pueden estar vacios");
		}
        else{
			const res = await fetch("BASE_API_PATH",
			{
				method: "POST",
				body: JSON.stringify({
					country: newEntry.country,
					year: parseInt(newEntry.year),
					appearences: parseInt(newEntry.appearences),
					cleanSheets: parseInt(newEntry.cleanSheets),
					goals: parseInt(newEntry.goals)	
				}),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
				visible=true;
                if (res.status == 201){
                     getEntries()
                     totaldata++;
                     console.log("Data introduced");
					 color="success";
					 checkMSG="Entrada introducida correctamente";
                }else if(res.status == 400){
                     console.log("ERROR Data was not correctly introduced");
                     color="success";
					 checkMSG="Entrada introducida incorrectamente";
                    
					 //window.alert("Entrada introducida incorrectamente");
                }else if(res.status == 409){
                     console.log("ERROR There is already a data with that country and year in the da tabase");
                     color="success";
					 checkMSG="Entrada introducida incorrectamente";
					 //window.alert("Ya existe dicha entrada");
				}
				
			});
		} 
    }

	//DELETE STAT

	async function deleteStat(countryD, yearD) {
        
        const res = await fetch(BASE_API_PATH+ "/" + countryD + "/" + yearD, {
            method: "DELETE"
        }).then(function (res) {
            visible = true;
            getEntries();      
            if (res.status==200) {
                totaldata--;
                color = "success";
                checkMSG = "Recurso "+countryD+" "+yearD+ " borrado correctamente";
                console.log("Deleted " + countryD);            
            } else if (res.status==404) {
                color = "danger";
                checkMSG = "No se ha encontrado el objeto " + countryD;
                console.log("Resource NOT FOUND");            
            } else {
                color = "danger";
                checkMSG= res.status + ": " + "No se pudo borrar el recurso";
                console.log("ERROR!");
            }      
        });
    }

	//DELETE ALL

	async function deleteALL() {
		console.log("Deleting entry data...");
		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")){
			console.log("Deleting all entry data...");
			const res = await fetch(BASE_API_PATH, {
				method: "DELETE"
			}).then(function (res) {
                visible=true;
				if (res.ok && totaldata>0){
                    totaldata = 0;
					getEntries();
                    color = "success";
					checkMSG="Datos eliminados correctamente";
					console.log("OK All data erased");
				} else if (totaldata == 0){
                    console.log("ERROR Data was not erased");
                    color = "danger";
					checkMSG= "¡No hay datos para borrar!";
                } else{
					console.log("ERROR Data was not erased");
                    color = "danger";
					checkMSG= "No se han podido eliminar los datos";
				}
			});
		}
	}

        //getNextPage (B)
        async function getNextPage() {
    
                console.log(totaldata);
                if (page+10 > totaldata) {
                    page = 1
                } else {
                    page+=10
                }
                
                visible = true;
                console.log("Charging page... Listing since: "+page);
                const res = await fetch(BASE_API_PATH + "?limit=10&offset="+(-1+page));
                //condicional imprime msg
                color = "success";
                checkMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+9);
                if (totaldata == 0){
                    console.log("ERROR Data was not erased");
                    color = "danger";
                    checkMSG= "¡No hay datos!";
                }else if (res.ok) {
                    console.log("Ok:");
                    const json = await res.json();
                    entries = json;
                    console.log("Received " + entries.length + " resources.");
                } else {
                    checkMSG= res.status + ": " + res.statusText;
                    console.log("ERROR!");
                }
            }
    //getPreviewPage (B)
        async function getPreviewPage() {
            
            console.log(totaldata);
            if (page-10 > 1) {
                page-=10; 
            } else page = 1
            visible = true;
            console.log("Charging page... Listing since: "+page);
            const res = await fetch(BASE_API_PATH + "?limit=10&offset="+(-1+page));
            color = "success";
            checkMSG = (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+9);
            if (totaldata == 0){
                console.log("ERROR Data was not erased");
                color = "danger";
                checkMSG = "¡No hay datos!";
            }else if (res.ok) {
                console.log("Ok:");
                const json = await res.json();
                entries = json;
                console.log("Received "+entries.length+" resources.");
            } else {
                checkMSG = res.status+": "+res.statusText;
                console.log("ERROR!");
            }
        }
	

        //Función auxiliar para obtener el número máximo de páginas que se pueden ver
	async function maxPagesFunction(cadena){
		let num;
        const res = await fetch(cadena,
			{
				method: "GET"
			});
			if(res.ok){
				const data = await res.json();
				maxPages = Math.floor(data.length/10);
				if(maxPages === data.length/10){
					maxPages = maxPages-1;
				}
        }
	}
	

</script>



<main>
    <br>

    <h1 style ="text-align: center;">Tabla de datos de estadísticas de los jugadores de la Premier League</h1>

        {#await entries}
            Loading entry stats data...
        {:then entries}
        
        <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
            {#if checkMSG}
                {checkMSG}
            {/if}
        </Alert>

        <br>
        <h4 style="text-align:center"><strong>Búsqueda general de parámetros</strong></h4>
        <br>
        
        <Table bordered>
            <thead>
                <tr>
                    <th>Fecha inicio</th>
                    <th>Fecha fin</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type="number" min="2000" bind:value="{from}"></td>
                    <td><input type="number" min="2000" bind:value="{to}"></td>
                    <td align="center"><Button outline color="dark" on:click="{()=>{
                        if (from == null || to == null) {
                            window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')
                        }else{
                            checkMSG = "Datos cargados correctamente en ese periodo";
                            getEntries();
                        }
                    }}">
                        Buscar
                        </Button>
                    </td>
                    <td align="center"><Button outline color="info" on:click="{()=>{
                        from = null;
                        to = null;
                        getEntries();
                        checkMSG = "Busqueda limpiada";
                        
                    }}">
                        Limpiar Búsqueda
                        
                        </Button>
                        
                    </td>
                </tr>
            </tbody>
        </Table>

        <br>

        <Table bordered responsive> 
            <thead id="titulitos">
                <tr>
                    <th>Pais</th>
                    <th>Año</th>
                    <th>Apariciones</th>
                    <th>Portería vacía</th>
                    <th>Goles</th>
                    <th colspan="2">Acciones</th>
                </tr>
        </thead>
        <tbody>
            <tr>
                <td><input type = "text" placeholder="Spain" bind:value="{newEntry.country}" ></td> 
                <td><input type = "text" placeholder="2017" bind:value="{newEntry.year}"></td> 
                <td><input type = "number" placeholder="13" bind:value="{newEntry.appearences}"></td>    
                <td><input type = "number" placeholder="18" bind:value="{newEntry.cleanSheets}"></td>  
                <td><input type = "number" placeholder="20" bind:value="{newEntry.goals}"></td>

                <td colspan="2" style="text-align: center;"><Button outline color="primary" on:click={insertEntry}>Insertar</Button></td>  
            </tr>

        {#each entries as entry}
            <tr>
                
                <td><a href="api/v2/premier-league/{entry.country}/{entry.year}">{entry.country}</a></td>
                <td>{entry.year}</td>
                <td>{entry.appearences}</td>
                <td>{entry.cleanSheets}</td>
                <td>{entry.goals}</td>
                
                <td><a href="#/premier-league/{entry.country}/{entry.year}"><Button outline color="warning">Editar</Button></a></td>
                <td><Button outline color="danger" on:click="{deleteStat(entry.country, entry.year)}">Borrar</Button></td>
            </tr>
                
        {/each}
        </tbody>
        <br>
        </Table>
        <Button color="success" on:click="{loadStats}">
            Cargar datos inciales
        </Button>
        <Button color="danger" on:click="{deleteALL}">
            Eliminar todo
        </Button>
        <Button color="info" on:click={function (){
            window.location.href = `/#/premier-league/charts`
        }}>
            Gráfica
        </Button>
        <Button color="info" on:click={function (){
            window.location.href = `/#/premier-league/charts2`
        }}>
            Gráfica2
        </Button>
		<br>
		<div style="text-align:center">
			<Button outline color="primary" on:click="{getPreviewPage}">
				Página Anterior
			</Button>
			<Button outline color="primary" on:click="{getNextPage}">
				Página Siguiente
			</Button>
		</div>

        {/await} 
</main>

