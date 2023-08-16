<script>
    import {onMount} from 'svelte';
    import { getBASEUrl } from '../../../config.js';
    const BASEUrl = getBASEUrl();
    const delay = ms => new Promise(res => setTimeout(res,ms));
    let stats = [];
    import Button from 'sveltestrap/src/Button.svelte';
    let stats_country_date = [];
    let appearences = [];
    let cleanSheets = [];
    let goals = []; 
    async function getPEStats(){
        console.log("Fetching stats....");
        const res = await fetch(`${BASEUrl}/api/v2/premier-league`);
        if(res.ok){
            const data = await res.json();
            stats = data;
            console.log("Estadísticas recibidas: "+stats.length);
            //inicializamos los arrays para mostrar los datos
            stats.forEach(stat => {
                stats_country_date.push(stat.country+"-"+stat.year);
                appearences.push(stat["appearences"]);
                cleanSheets.push(stat["cleanSheets"]);
                goals.push(stat["goals"]);            
            });
            //esperamos para que se carrguen los datos 
            await delay(500);
            loadGraph();
        }else{
            console.log("Error cargando los datos");
		}
    }
    async function loadGraph(){
        Highcharts.chart('container', {
            chart: {
                type: 'scatter'
            },
            title: {
                text: 'Datos Premier League'
            },
            subtitle: {
                text: 'Biblioteca: Highcharts'
            },
            yAxis: {
                title: {
                    text: 'Valor'
                }
            },
            xAxis: {
                title: {
                    text: "País-Año",
                },
                categories: stats_country_date,
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            
            series: [
                {
                name: 'Más Apariencias',
                data: appearences
                },
                {
                name: 'Portería Vacía',
                data: cleanSheets
                },
                {
                name: 'Goles',
                data: goals
                },
            ],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        });
    }
    onMount(getPEStats);
    
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js" ></script>
    <script src="https://code.highcharts.com/modules/series-label.js" ></script>
    <script src="https://code.highcharts.com/modules/exporting.js" ></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>

    
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
    <figure class="highcharts-figure">
        <div id="container"></div>
    </figure>
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