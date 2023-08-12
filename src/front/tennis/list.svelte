<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';
	import { Alert } from 'sveltestrap';
	var BASE_API_PATH = "http://46.183.118.200:8082/api/v2/tennis";

	//var BASE_API_PATH = "/api/v2/tennis";
    let entries = [];
	let newEntry = {
		country: "",
		year: "",
		most_grand_slam: "",
        masters_finals: "",
        olympic_gold_medals: ""
	}

	let checkMSG = "";
    let visible = false;
    let color = "danger";
    let page = 1;
    let totaldata=6;
 
    let from = null;
	let to = null;
	let offset = 0;
	let limit = 10;

    let maxPages = 0;
	let numEntries;

    onMount(getEntries);
    //GET
    async function getEntries(){
        console.log("Fetching entries....");
		let cadena = `${BASE_API_PATH}?limit=${limit}&&offset=${offset*10}&&`;
		if (from != null) {
			cadena = cadena + `from=${from}&&`
		}
		if (to != null) {
			cadena = cadena + `to=${to}&&`
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
    /*
    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v1/tennis"); 
        if(res.ok){
            console.log("Ok:");
            const data = await res.json();
            entries = data;
            console.log("Received entries: "+entries.length);
        }else {
                checkMSG= res.status + ": Recursos no encontrados ";
                console.log("ERROR! no encontrado");
            }
    }*/
    //GET INITIALDATA
    async function LoadEntries() {
 
        console.log("Fetching entry data...");
        await fetch(BASE_API_PATH + "/loadInitialData");
        const res = await fetch(BASE_API_PATH + "?limit=10&offset=0");
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            entries = json;
            visible = true;
            totaldata=6;
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
		 
         console.log("Inserting resources...");
         if (newEntry.country == "" || newEntry.year == null ||
            newEntry.most_grand_slam == null || newEntry.masters_finals == null || newEntry.olympic_gold_medals == null ) {
             alert("Los campos no pueden estar vacios");
         } else{
             const res = await fetch(BASE_API_PATH,{
                 method:"POST",
                 body:JSON.stringify({
                        country: newEntry.country,
                        year: parseInt(newEntry.year),
                        most_grand_slam: parseFloat(newEntry.most_grand_slam),
                        masters_finals: parseFloat(newEntry.masters_finals),
                        olympic_gold_medals: parseFloat(newEntry.olympic_gold_medals) 
                    }),
                 headers:{
                     "Content-Type": "application/json"
                }
            }).then(function (res) {
                 visible=true;
                if (res.status == 201){
                     getEntries()
                     totaldata++;
                     console.log("Data introduced");
                     color = "success";
                     checkMSG="Entrada introducida correctamente a la base de datos";
                }else if(res.status == 400){
                     console.log("ERROR Data was not correctly introduced");
                     color = "danger";
                     checkMSG= "Los datos de la entrada no fueron introducidos correctamente";
                }else if(res.status == 409){
                     console.log("ERROR There is already a data with that country and year in the da tabase");
                     color = "danger";
                     checkMSG= "Ya existe una entrada en la base de datos con el pais y el año introducido";
                }
            });	
        }
    }
    //DELETE STAT
    async function BorrarEntry(countryD, yearD) {
        
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
    //DELETE ALL STATS
    async function BorrarEntries() {
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
	<figure class="text-center">
		<blockquote class="blockquote">
		  <h1>TENNIS API</h1>
		</blockquote>
		<p>
		 Los últimos campeones de los grandes torneos del tenis internacional.
		</p>
		<!-- <img src="images/Nadal_banner.jpg" alt="background image" /> -->
	</figure> 

	{#await entries}
		loading
	{:then entries}
	
	<Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
		{#if checkMSG}
			{checkMSG}
		{/if}
	</Alert>
    <Table bordered>
		<thead>
			<tr>
				<th>Fecha inicio</th>
				<th>Fecha fin</th>
				
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
				
				<td align="center">
					<Button color="success" on:click={function (){
						window.location.href = `/#/tennis/chart`
					}}>
						Gráfica 1
					</Button>
				</td>
				<td align="center">
					<Button color="success" on:click={function (){
						window.location.href = `/#/tennis/chart2`
					}}>
						Gráfica 2
					</Button>
				</td>
			</tr>
			
		</tbody>
	</Table>
	<Table bordered>
		
		
		<thead id="titulitos">
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
				<td><input bind:value="{newEntry.country}"></td>
				<td><input bind:value="{newEntry.year}"></td>
				<td><input bind:value="{newEntry.most_grand_slam}"></td>
                <td><input bind:value="{newEntry.masters_finals}"></td>
                <td><input bind:value="{newEntry.olympic_gold_medals}"></td>
				<td><Button outline color="primary" on:click="{insertEntry}">
					Añadir
					</Button>
				</td>
			</tr>
			{#each entries as entry}
				<tr>
					<td>{entry.country}</td>
					<td>{entry.year}</td>
					<td>{entry.most_grand_slam}</td>
                    <td>{entry.masters_finals}</td>
                    <td>{entry.olympic_gold_medals}</td>
					<td><Button outline color="warning" on:click={function (){
						window.location.href = `/#/tennis/${entry.country}/${entry.year}`
					}}>
						Editar
					</Button>
					<td><Button outline color="danger" on:click={BorrarEntry(entry.country,entry.year)}>
						Borrar
					</Button>
					</td>
				</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={LoadEntries}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={BorrarEntries}>
					Borrar todo
				</Button></td>
			</tr>
		</tbody>
	</Table>
 
{/await}
<div align="center">
    {#each Array(maxPages+1) as _,page}
    
        <Button outline color="secondary" on:click={()=>{
            offset = page;
            getEntries();
        }}>{page} </Button>&nbsp
        
    {/each}
    <Button outline color="secondary" on:click={()=>{
        getEntries();
    }}>Actualizar nº de página</Button>
</div>
</main>