<script>

    import { getBASEUrl } from '../../config.js';
    const BASEUrl = getBASEUrl();
    import Button from 'sveltestrap/src/Button.svelte';
    import { onMount } from "svelte";
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let data = [];
    let stats_country_date = [];
    let stats_most_grand_slam = [];
    let stats_masters_finals = [];
    let stats_olympic_gold_medals = [];
    async function getStats() {
        console.log("Fetching stats....");
        const res = await fetch(`${BASEUrl}/api/v2/tennis`);
        if (res.ok) {
            const data = await res.json();
            console.log("Estadísticas recibidas: " + data.length);
            data.forEach((stat) => {
                stats_country_date.push(stat.country + "-" + stat.year);
                stats_most_grand_slam.push(stat["most_grand_slam"]);
                stats_masters_finals.push(stat["masters_finals"]);
                stats_olympic_gold_medals.push(stat["olympic_gold_medals"]);             
            });
            loadGraph();
        } else {
            console.log("Error cargando los datos");
        }
    }
    async function loadGraph() {
        var ctx = document.getElementById("myChart").getContext("2d");
        var trace_olympic_gold_medals = new Chart(ctx, {
            type: "bar",
            data: {
                labels: stats_country_date,
                datasets: [
                    {
                        label: "Grandslams ganados",
                        backgroundColor: "rgb(0, 128, 128)",
                        borderColor: "rgb(255, 255, 255)",
                        data: stats_most_grand_slam,
                    },
                    {
                        label: "Masters ganados",
                        backgroundColor: "rgb(255, 0 ,0)",
                        borderColor: "rgb(255, 255, 255)",
                        data: stats_masters_finals,
                    },
                    {
                        label: "Medallas olimpicas",
                        backgroundColor: "rgb(255, 255, 0)",
                        borderColor: "rgb(255, 255, 255)",
                        data: stats_olympic_gold_medals,
                    },
                ],
            },
            options: {},
        });
       
       
    }
    onMount(getStats);
</script>

<svelte:head>
    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"
        on:load={loadGraph}></script>
</svelte:head>

<main>
    <br>
    <div class="button-container">
        <Button outline color="btn btn-outline-primary" href="/#/Visualizaciones"
            >Pagina de visualizaciones</Button
        >
        <Button outline color="btn btn-outline-primary" href="/#/Tennis"
            >Front-end Tennis</Button
        >
    </div>
    <h2>Más torneos ganados</h2>
    <h4>Biblioteca: Chart.js</h4>
    <!--<button class="btn btn-primary hBack" type="button">Volver</button>
    <a href="/#/tennis" class="btn btn-primary hBack" role="button" >Volver</a> -->

    <canvas id="myChart" />

</main>

<style>
    h2 {
        text-align: center;
    }
    h4 {
        text-align: center;
    }
    .button-container {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        padding-left: 7%;
        padding-right: 7%;
    }
</style>
