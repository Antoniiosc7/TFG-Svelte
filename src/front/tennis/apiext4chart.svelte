<script>
    import { onMount } from "svelte";
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let stats = [];
    let stats_country_date = [];
    let stats_productions = [];
    let stats_consumption = [];
    let stats_exports = [];
    async function getCoalStats() {
        console.log("Fetching stats....");
        const res1 = await fetch(
            "https://sos2122-22.herokuapp.com/api/v2/coal-stats/loadinitialdata"
        );
        if (res1.ok) {  
            const res = await fetch(
                "https://sos2122-22.herokuapp.com/api/v2/coal-stats/"
            );
            if (res.ok) {
                const data = await res.json();
                stats = data;
                console.log("Estadísticas recibidas: " + stats.length);
                //inicializamos los arrays para mostrar los datos
                stats.forEach((stat) => {
                    stats_country_date.push(stat.country + "-" + stat.year);
                    stats_productions.push(stat["productions"]);
                    stats_exports.push(stat["exports"]);
                    stats_consumption.push(stat["consumption"]);
                });
                //esperamos para que se carrguen los datos
                await delay(500);
                loadGraph();
            } else {
                console.log("Error cargando los datos");
            }
        }
    }
    async function loadGraph() {
        Highcharts.chart("container", {
            chart: {
                type: "pie",
            },
            title: {
                text: "Estadísticas de coal stats",
            },
            subtitle: {
                text: "API Integrada 4",
            },
            yAxis: {
                title: {
                    text: "Valor",
                },
            },
            xAxis: {
                title: {
                    text: "País-Año",
                },
                categories: stats_country_date,
            },
            plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: ' {point.percentage:.1f} %'
            }
        }
    },
            legend: {
                layout: "vertical",
                align: "right",
                verticalAlign: "middle",
            },

            series: [
                {
                    name: "Producion",
                    data: stats_productions,
                    sliced: true,
                },
                {
                    name: "Exportaciones",
                    data: stats_exports,
                },
                {
                    name: "Consumo",
                    data: stats_consumption,
                },
            ],
            responsive: {
                rules: [
                    {
                        condition: {
                            maxWidth: 500,
                        },
                        chartOptions: {
                            legend: {
                                layout: "horizontal",
                                align: "center",
                                verticalAlign: "bottom",
                            },
                        },
                    },
                ],
            },
        });
    }
    onMount(getCoalStats);
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<main>
    <figure class="highcharts-figure">
        <div id="container" />
    </figure>
</main>
