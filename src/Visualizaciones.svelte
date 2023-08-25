<script>
    import { getBASEUrl } from '../config.js';
    const BASEUrl = getBASEUrl();
</script>

<main>
    <div class="container">
        <div class="titulo">
            <h1>Visualizaciones</h1>
        </div>
        <div class="row">
            <div class="col"></div>
            <div class="col-8">
                <div class="card">
                    <div class="card-header">
                        <h4>Visualizaciones Tennis</h4>
                    </div>
                    <div class="card-body">
                        <ul class="list-group">
                            <li class="list-group-item">
                                Gráfica 1: Biblioteca Chartjs
                                <button type="button" class="btn btn-primary"><a href="/#/tennis/chart" class="btn-link">Visualizar</a></button>
                            </li>
                            <li class="list-group-item">
                                Gráfica 2: Biblioteca Highchart
                                <button type="button" class="btn btn-primary"><a href="/#/tennis/chart2" class="btn-link">Visualizar</a></button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h4>Visualizaciones Premier-League</h4>
                    </div>
                    <div class="card-body">
                        <ul class="list-group">
                            <li class="list-group-item">
                                Gráfica 1: Biblioteca Plotly
                                <button type="button" class="btn btn-primary"><a href="/#/premier-league/charts" class="btn-link">Visualizar</a></button>
                            </li>
                            <li class="list-group-item">
                                Gráfica 2: Biblioteca Highchart
                                <button type="button" class="btn btn-primary"><a href="#/premier-league/charts2" class="btn-link">Visualizar</a></button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h4>Visualizaciones Comunes</h4>
                    </div>
                    <div class="card-body">
                        <ul class="list-group">
                            <li class="list-group-item">
                                Gráfica 1: Biblioteca Highchart Tipo-Line
                                <button type="button" class="btn btn-primary"><a href="/#/Grupal1" class="btn-link">Visualizar</a></button>
                            </li>
                            <li class="list-group-item">
                                Gráfica 2: Biblioteca Highchart Tipo-Bar
                                <button type="button" class="btn btn-primary"><a href="#/Grupal2" class="btn-link">Visualizar</a></button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col"></div>
        </div>
    </div>
</main>

<style>
    .container {
        padding: 20px;
    }
    .btn-link {
        color: rgb(247, 245, 245);
        font-weight: 500;
    }
    .titulo {
        text-align: center;
        margin-bottom: 20px;
    }

    .card {
        margin-bottom: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .card-header {
        background-color: #f9f9f9;
        padding: 10px 20px;
        border-bottom: 1px solid #ddd;
    }

    .list-group-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    a {
        color: #3498db;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }
</style>
