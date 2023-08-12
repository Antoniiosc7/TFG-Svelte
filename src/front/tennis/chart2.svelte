<script>
    import { getBASEUrl } from '../../../config.js';
    const BASEUrl = getBASEUrl();

    import {onMount} from 'svelte';
    const delay = ms => new Promise(res => setTimeout(res,ms));
    let stats = [];
    let stats_country_date = [];
    let stats_most_grand_slam = [];
    let stats_olympic_gold_medals = [];
    let stats_masters_finals = []; 
    async function getPEStats(){
        console.log("Fetching stats....");
        const res = await fetch(`${BASEUrl}/api/v2/tennis`);
        if(res.ok){
            const data = await res.json();
            stats = data;
            console.log("Estadísticas recibidas: "+stats.length);
            //inicializamos los arrays para mostrar los datos
            stats.forEach(stat => {
                stats_country_date.push(stat.country+"-"+stat.year);
                stats_most_grand_slam.push(stat["most_grand_slam"]);
                stats_masters_finals.push(stat["masters_finals"]);
                stats_olympic_gold_medals.push(stat["olympic_gold_medals"]);            
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
                type: 'area'
            },
            title: {
                text: 'Más torneos ganados'
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
                name: 'Más grand slams',
                data: stats_most_grand_slam
                },
                {
                name: 'Finales de masters',
                data: stats_masters_finals
                },
                {
                name: 'Medallas olimpicas',
                data: stats_olympic_gold_medals
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
    <figure class="highcharts-figure">
        <div id="container"></div>
    </figure>
</main>