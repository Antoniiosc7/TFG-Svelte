<script>
    import {onMount} from 'svelte';    
    import {Button} from 'sveltestrap';
    const delay = ms => new Promise(res => setTimeout(res,ms));
    let xLabel = [];
    //TENNIS
    let TennisStats = [];
    let stats_mostgrandslams = [];
    let stats_mastersfinals = [];
    let stats_olympicgoldmedals = []; 
    //PublicExpenditure
    let PublicExpenditure = [];
    let public_expenditure_stats = [];
    let pe_to_gdp_stats = [];
    let pe_on_defence_stats = []; 


    async function getData(){
        await fetch("https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats/loadinitialdata");
        await fetch("/api/v2/tennis/loadinitialdata");
        
        const PublicExpenditure2 = await fetch("https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats/");
        const tennis2 = await fetch("/api/v2/tennis");
        if (PublicExpenditure2.ok && tennis2.ok){
            
            TennisStats = await tennis2.json();
            PublicExpenditure = await PublicExpenditure2.json();
            
            //Tennis
            TennisStats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            TennisStats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            TennisStats.forEach(element=>{
                stats_mostgrandslams.push(parseFloat(element.most_grand_slam));
                stats_mastersfinals.push(parseFloat(element.masters_finals));
                stats_olympicgoldmedals.push(parseFloat(element.olympic_gold_medals));
            });
            //Premier
            PublicExpenditure.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            PublicExpenditure.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            PublicExpenditure.forEach(element=>{
                public_expenditure_stats.push(parseFloat(element.public_expenditure));
                pe_on_defence_stats.push(parseFloat(element.pe_on_defence));
                pe_to_gdp_stats.push(parseFloat(element.pe_to_gdp));
            });
            
            TennisStats.forEach(element =>{
                xLabel.push(element.country+","+parseInt(element.year));
            });
            PublicExpenditure.forEach(element =>{
                xLabel.push(element.country+","+parseInt(element.year));
            });
            xLabel=new Set(xLabel);
            xLabel=Array.from(xLabel);
            xLabel.sort();
            await delay(500);
            loadGraph();
        }   
    }
    async function loadGraph() {
        var ctx = document.getElementById("myChart").getContext("2d");
        var trace_olympic_gold_medals = new Chart(ctx, {
            type: "bar",
            data: {
                labels: xLabel,
                datasets: [
                    {
                        label: "Grand Slams Ganados",
                        backgroundColor: "rgba(104, 255, 51)",
                        borderColor: "rgb(255, 255, 255)",
                        data: stats_mostgrandslams,
                    },
                    {
                        label: "Medallas Olimpicas",
                        backgroundColor: "rgba(255, 51, 51)",
                        borderColor: "rgb(255, 255, 255)",
                        data: stats_olympicgoldmedals,
                    },
                    {
                        label: "Finales de masters",
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        borderColor: "rgb(255, 255, 255)",
                        data: stats_mastersfinals,
                    },
                    {
                        label: "Gasto Publico",
                        backgroundColor: "rgba(51, 125, 255)",
                        borderColor: "rgb(255, 255, 255)",
                        data: public_expenditure_stats,
                    },
                    {
                        label: "PE en Defensa",
                        backgroundColor: "rgba(243, 51, 255)",
                        borderColor: "rgb(255, 255, 255)",
                        data: pe_on_defence_stats,
                    },
                    {
                        label: "PE to GDP",
                        backgroundColor: "rgba(243, 255, 51)",
                        borderColor: "rgb(255, 255, 255)",
                        data: pe_to_gdp_stats,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }
    onMount(getData);
    
</script>

<svelte:head>
    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"
        on:load={loadGraph}></script>
</svelte:head>

<main>
    <h2>Más visitas</h2>
    <h4>Biblioteca: Chart.js</h4>
    <!--<button class="btn btn-primary hBack" type="button">Volver</button>
    <a href="/#/tennis" class="btn btn-primary hBack" role="button" >Volver</a> -->
    <a
        href="/#/integrations"
        class="btn btn-primary btn-lg active"
        role="button"
        aria-pressed="true">Volver</a
    >

    <canvas id="myChart" />
</main>