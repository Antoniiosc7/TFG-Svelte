<script>
    import { onMount } from "svelte";
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let data = [];
    let stats_name = [];
    let stats_points = [];

    async function getStats() {
        console.log("Fetching stats....");
        const res = await fetch("api/v1/tennis-apiext");
        if (res.ok) {
            const data = await res.json();
            console.log("Estadísticas recibidas: " + data.length);
            data.forEach((stat) => {
                stats_name.push(stat.Name);
                stats_points.push(stat["Rank"]);
            });
            loadGraph();
        } else {
            console.log("Error cargando los datos");
        }
    }
    async function loadGraph() {
        var ctx = document.getElementById("myChart").getContext("2d");
        var trace_olympic_gold_medals = new Chart(ctx, {
            type: "radar",
            
            data: {
                labels: stats_name.slice(0, 10),
                datasets: [
                    {
                        label: "Ranking",
                        backgroundColor: "rgba(255, 51, 79)",
                        borderColor: "rgb(255, 255, 255)",
                        data: stats_points.slice(0, 10),
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
    <h2>Ranking ATP</h2>
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

<style>
    h2 {
        text-align: center;
    }
    h4 {
        text-align: center;
    }
</style>
