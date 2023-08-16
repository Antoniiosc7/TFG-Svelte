<script>
    import { getBASEUrl } from "../../config.js";
    const BASEUrl = getBASEUrl();
    import { onMount } from "svelte";
    import { Button } from "sveltestrap";
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let xLabel = [];
    //TENNIS
    let TennisStats = [];
    let stats_mostgrandslams = [];
    let stats_mastersfinals = [];
    let stats_olympicgoldmedals = [];
    //PREMIER
    let PremierStats = [];
    let appearences_stats = [];
    let goals_stats = [];
    let cleansheets_stats = [];
    //NBA STATS
    let NBAStats = [];
    let mostpoints_stats = [];
    let fieldgoals_stats = [];
    let efficiency_stats = [];

    async function cargarDatosIniciales() {
        const nba3 = await fetch(`${BASEUrl}/api/v2/nba-stats/loadInitialData`);
        const premier3 = await fetch(
            `${BASEUrl}/api/v2/premier-league/loadInitialData`
        );
        const tennis3 = await fetch(`${BASEUrl}/api/v2/tennis/loadInitialData`);
        const nba2 = await fetch(`${BASEUrl}/api/v2/nba-stats`);
        const premier2 = await fetch(`${BASEUrl}/api/v2/premier-league`);
        const tennis2 = await fetch(`${BASEUrl}/api/v2/tennis`);
        if (nba3.ok && premier3.ok && tennis3.ok) {
            if (nba2.ok && premier2.ok && tennis2.ok) {
                NBAStats = await nba2.json();
                TennisStats = await tennis2.json();
                PremierStats = await premier2.json();
                //Nba
                NBAStats.sort((a, b) =>
                    a.year > b.year ? 1 : b.year > a.year ? -1 : 0
                );
                NBAStats.sort((a, b) =>
                    a.country > b.country ? 1 : b.country > a.country ? -1 : 0
                );
                NBAStats.forEach((element) => {
                    mostpoints_stats.push(parseFloat(element.mostpoints));
                    fieldgoals_stats.push(parseFloat(element.fieldgoals));
                    efficiency_stats.push(parseFloat(element.efficiency));
                });
                //Tennis
                TennisStats.sort((a, b) =>
                    a.year > b.year ? 1 : b.year > a.year ? -1 : 0
                );
                TennisStats.sort((a, b) =>
                    a.country > b.country ? 1 : b.country > a.country ? -1 : 0
                );
                TennisStats.forEach((element) => {
                    stats_mostgrandslams.push(
                        parseFloat(element.most_grand_slam)
                    );
                    stats_mastersfinals.push(
                        parseFloat(element.masters_finals)
                    );
                    stats_olympicgoldmedals.push(
                        parseFloat(element.olympic_gold_medals)
                    );
                });
                //Premier
                PremierStats.sort((a, b) =>
                    a.year > b.year ? 1 : b.year > a.year ? -1 : 0
                );
                PremierStats.sort((a, b) =>
                    a.country > b.country ? 1 : b.country > a.country ? -1 : 0
                );
                PremierStats.forEach((element) => {
                    appearences_stats.push(parseFloat(element.appearences));
                    cleansheets_stats.push(parseFloat(element.cleanSheets));
                    goals_stats.push(parseFloat(element.goals));
                });
                NBAStats.forEach((element) => {
                    xLabel.push(element.country + "," + parseInt(element.year));
                });
                TennisStats.forEach((element) => {
                    xLabel.push(element.country + "," + parseInt(element.year));
                });
                PremierStats.forEach((element) => {
                    xLabel.push(element.country + "," + parseInt(element.year));
                });
                xLabel = new Set(xLabel);
                xLabel = Array.from(xLabel);
                xLabel.sort();
                await delay(500);
                loadGraph();
            }
        }
    }
    async function getData() {
        const nba2 = await fetch(`${BASEUrl}/api/v2/nba-stats`);
        const premier2 = await fetch(`${BASEUrl}/api/v2/premier-league`);
        const tennis2 = await fetch(`${BASEUrl}/api/v2/tennis`);

        if (nba2.ok && premier2.ok && tennis2.ok) {
            NBAStats = await nba2.json();
            TennisStats = await tennis2.json();
            PremierStats = await premier2.json();
            //Nba
            NBAStats.sort((a, b) =>
                a.year > b.year ? 1 : b.year > a.year ? -1 : 0
            );
            NBAStats.sort((a, b) =>
                a.country > b.country ? 1 : b.country > a.country ? -1 : 0
            );
            NBAStats.forEach((element) => {
                mostpoints_stats.push(parseFloat(element.mostpoints));
                fieldgoals_stats.push(parseFloat(element.fieldgoals));
                efficiency_stats.push(parseFloat(element.efficiency));
            });
            //Tennis
            TennisStats.sort((a, b) =>
                a.year > b.year ? 1 : b.year > a.year ? -1 : 0
            );
            TennisStats.sort((a, b) =>
                a.country > b.country ? 1 : b.country > a.country ? -1 : 0
            );
            TennisStats.forEach((element) => {
                stats_mostgrandslams.push(parseFloat(element.most_grand_slam));
                stats_mastersfinals.push(parseFloat(element.masters_finals));
                stats_olympicgoldmedals.push(
                    parseFloat(element.olympic_gold_medals)
                );
            });
            //Premier
            PremierStats.sort((a, b) =>
                a.year > b.year ? 1 : b.year > a.year ? -1 : 0
            );
            PremierStats.sort((a, b) =>
                a.country > b.country ? 1 : b.country > a.country ? -1 : 0
            );
            PremierStats.forEach((element) => {
                appearences_stats.push(parseFloat(element.appearences));
                cleansheets_stats.push(parseFloat(element.cleanSheets));
                goals_stats.push(parseFloat(element.goals));
            });
            NBAStats.forEach((element) => {
                xLabel.push(element.country + "," + parseInt(element.year));
            });
            TennisStats.forEach((element) => {
                xLabel.push(element.country + "," + parseInt(element.year));
            });
            PremierStats.forEach((element) => {
                xLabel.push(element.country + "," + parseInt(element.year));
            });
            xLabel = new Set(xLabel);
            xLabel = Array.from(xLabel);
            xLabel.sort();
            await delay(500);
            loadGraph();
        }
    }
    async function loadGraph() {
        Highcharts.chart("container", {
            chart: {
                type: "area",
            },
            title: {
                text: "Gráficas conjuntas",
            },
            subtitle: {
                text: "APIs: NBA, Premier-League & Tennis | Tipo: Line",
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
                // categories: stats_country_date,
                categories: xLabel,
            },
            legend: {
                layout: "vertical",
                align: "right",
                verticalAlign: "middle",
            },
            series: [
                //Tennis
                {
                    name: "Grand Slams Ganados",
                    data: stats_mostgrandslams,
                },
                {
                    name: "Medallas Olimpicas",
                    data: stats_olympicgoldmedals,
                },
                {
                    name: "Finales de masters",
                    data: stats_mastersfinals,
                },
                //PremierLeauge
                {
                    name: "Partidos jugados",
                    data: appearences_stats,
                },
                {
                    name: "Goles",
                    data: goals_stats,
                },
                {
                    name: "Porterias a cero",
                    data: cleansheets_stats,
                },
                //NBA
                {
                    name: "Más puntos",
                    data: mostpoints_stats,
                },
                {
                    name: "Tiros de campo",
                    data: fieldgoals_stats,
                },
                {
                    name: "Eficiencia",
                    data: efficiency_stats,
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

    onMount(getData);

    async function BorrarEntries() {
        if (confirm("¿Está seguro de que desea eliminar todas las entradas?")) {
            try {
                const nbaDeleteResponse = await fetch(
                    `${BASEUrl}/api/v2/nba-stats`,
                    {
                        method: "DELETE",
                    }
                );

                const premierDeleteResponse = await fetch(
                    `${BASEUrl}/api/v2/premier-league`,
                    {
                        method: "DELETE",
                    }
                );

                const tennisDeleteResponse = await fetch(
                    `${BASEUrl}/api/v2/tennis`,
                    {
                        method: "DELETE",
                    }
                );

                if (
                    nbaDeleteResponse.ok &&
                    premierDeleteResponse.ok &&
                    tennisDeleteResponse.ok
                ) {
                    console.log("Data deleted and graph updated successfully.");
                    window.location.reload();
                    console.error("Error deleting data.");
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        }
    }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<main>
    <br />
    <Button outline color="btn btn-outline-primary" href="/#/Visualizaciones"
        >Volver</Button
    >
    <Button outline color="success" on:click={cargarDatosIniciales}
        >Cargar datos iniciales</Button
    >
    <Button outline color="danger" on:click={BorrarEntries}>Borrar todo</Button>
    <figure class="highcharts-figure">
        <div id="container" />
        <p class="highcharts-description" />
    </figure>

</main>
