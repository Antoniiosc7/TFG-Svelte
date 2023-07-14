<script>
    import { onMount } from "svelte";
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let stats = [];
    let stats_country_date = [];
    let stats_public_expenditure = [];
    let stats_pe_on_defence = [];
    let stats_pe_to_gdp = [];
    async function getPEStats() {
        console.log("Fetching stats....");
        const res1 = await fetch(
            "https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats/loadinitialdata"
        );
        if (res1.ok) {
            const res = await fetch(
                "https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats"
            );
            if (res.ok) {
                const data = await res.json();
                stats = data;
                console.log("Estadísticas recibidas: " + stats.length);
                //inicializamos los arrays para mostrar los datos
                stats.forEach((stat) => {
                    stats_country_date.push(stat.country + "-" + stat.year);
                    stats_public_expenditure.push(stat["public_expenditure"]);
                    stats_pe_to_gdp.push(stat["pe_to_gdp"]);
                    stats_pe_on_defence.push(stat["pe_on_defence"]);
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
                type: "column",
            },
            title: {
                text: "Estadísticas de gasto público",
            },
            subtitle: {
                text: "API Integrada 3",
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
            legend: {
                layout: "vertical",
                align: "right",
                verticalAlign: "middle",
            },

            series: [
                {
                    name: "Gasto público",
                    data: stats_public_expenditure,
                },
                {
                    name: "% de gasto público respecto a PIB",
                    data: stats_pe_to_gdp,
                },
                {
                    name: "% destinado a defensa en GP",
                    data: stats_pe_on_defence,
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
    onMount(getPEStats);
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
