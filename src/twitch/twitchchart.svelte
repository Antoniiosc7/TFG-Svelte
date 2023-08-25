<script>
    import { onMount } from "svelte";
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let data = [];
    let stats_title = [];
    let stats_views = [];
    import { getBASEUrl } from '../../config.js';
    const BASEUrl = getBASEUrl();
    async function getStats() {
        console.log("Fetching stats....");
        const res = await fetch(`${BASEUrl}/api/v1/tennis-twitch`);
        if (res.ok) {
            const data = await res.json();
            console.log("Estadísticas recibidas: " + data.length);
            data.forEach((stat) => {
                stats_title.push(stat.title);
                stats_views.push(stat["view_count"]);
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
                labels: stats_title,
                datasets: [
                    {
                        label: "Visitas",
                        backgroundColor: "rgba(0, 145, 255, 0.2)",
                        borderColor: "rgb(255, 255, 255)",
                        data: stats_views,
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
    onMount(getStats);
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
        href="/#/TwitchHub"
        class="btn btn-primary btn-lg active"
        role="button"
        aria-pressed="true">Volver</a
    >
        <br>
    <canvas id="myChart" />
</main>

<style>
    h2 {
        text-align: center;
    }
    h4 {
        text-align: center;
    }
</style>
