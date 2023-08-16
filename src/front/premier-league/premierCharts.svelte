<script>
    import {onMount} from 'svelte';
    import { getBASEUrl } from '../../../config.js';
    const BASEUrl = getBASEUrl();
    const delay = ms => new Promise(res => setTimeout(res,ms));
    let data = [];
    let stats_country_date = [];
    import Button from 'sveltestrap/src/Button.svelte';
    let appearences = [];
    let cleanSheets = [];
    let goals = []; 

    async function getPEStats(){
        console.log("Fetching stats....");
        const res = await fetch(`${BASEUrl}/api/v2/premier-league`);
        if(res.ok){
            const data = await res.json();
            console.log("Estadísticas recibidas: "+data.length);
            //inicializamos los arrays para mostrar los datos
            data.forEach(stat => {
                stats_country_date.push(stat.country+"-"+stat.year);
                appearences.push(stat["appearences"]);
                cleanSheets.push(stat["cleanSheets"]);
                goals.push(stat["goals"]);            
            });
            //esperamos a que se carguen 
            await delay(500);
            loadGraph();
        }else{
            console.log("Error cargando los datos");
		}
    }

    async function loadGraph(){
        var trace_appearences = {
            x: stats_country_date,
            y: appearences,
            type: 'bar',
            name: 'Apariciones'
        };
        var trace_cleanSheets = {
            x: stats_country_date,
            y: cleanSheets,
            type: 'bar',
            name: 'Portería vacía'
        };
        var trace_goals = {
            x: stats_country_date,
            y: goals,
            type: 'bar',
            name: 'Goles'
        };
        var dataPlot = [trace_appearences, trace_cleanSheets, trace_goals];
        Plotly.newPlot('myDiv', dataPlot);
        
 
    }
    onMount(getPEStats);
    
</script>

<svelte:head>
    <script src='https://cdn.plot.ly/plotly-2.11.1.min.js'></script>
</svelte:head>

<main>
    <br />
    <div class="button-container">
        <Button outline color="btn btn-outline-primary" href="/#/Visualizaciones"
            >Pagina de visualizaciones</Button
        >
        <Button outline color="btn btn-outline-primary" href="/#/Premier-League"
            >Front-end Premier-League</Button
        >
    </div>
    <h2>Gráfica de datos sobre la Premier-League</h2>
    <h4>Biblioteca: Plotly</h4>
    <div id='myDiv'></div>
</main>

<style>
    .button-container {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        padding-left: 7%;
        padding-right: 7%;
    }
    
    h2 {
        text-align: center;
    }
    
    h4 {
        text-align: center;
    }
 
</style>
