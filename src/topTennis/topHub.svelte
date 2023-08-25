<style>
    main {
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    h1 {
        color: #3498db;
    }
    .documentacion{
        float: right; 

        margin-right: 10px; 
    }
    p {
        margin-bottom: 20px;
    }

    ol {
        list-style-type: decimal;
        padding-left: 20px;
    }

    li {
        margin-bottom: 10px;
    }
    .container {
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
    }
    .cards-container {
        display: flex; 
        justify-content: space-between;
        flex-wrap: wrap; 
    }

    .card {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
        flex: 0 0 calc(50% - 20px); 
    }

    .card-title {
        font-size: 18px;
        margin-bottom: 10px;
    }

    .card-content {
        font-size: 14px;
        line-height: 1.6;
    }

    .card-image {
        max-width: 100%;
        height: auto;
        margin-bottom: 10px;
        border: 2px solid #000000; 
        border-radius: 4px; 
    }
    
</style>

<main>
    <div class="container">
        <h1>
            TOP Tennis
            <a class="documentacion" href="https://rapidapi.com/cantagalloedoardo/api/ultimate-tennis1/details"><button type="button" class="btn btn-success">Documentación</button></a>
        </h1>
        <br>
    <p>Esta Api pertenece a Rapidapi y proporciona toda la información sobre el mundo del tenis, incluyendo todos los detalles relacionados con jugadores y torneos (puntuaciones en vivo, partidos, estadísticas) de los circuitos ATP, tanto individuales como dobles.
    </div>
<br>
    <div class="cards-container">
        <div class="card">
            <h2 class="card-title">Lista ATP</h2>
            <img class="card-image" src="https://www.atptour.com/es/news/www.atptour.com/-/media/images/news/2019/11/25/02/05/year-end-top-10-2019-web.jpg" alt="Imagen de Clips">
            <p class="card-content">El Pepperstone ATP Rankings es el tradicional método ATP basado en méritos para determinar la entrada y el orden de cabezas de serie en todos los torneos.</p>
            <a href="http://antoniosaborido.es:8081/#/topTennis/list"><button type="button" class="btn btn-primary">Ver más</button></a>
        </div>

        <div class="card">
            <h2 class="card-title">Gráfica ATP</h2>
            <img class="card-image" src="https://i.ytimg.com/vi/uCyYSiueR2s/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB0YjbJ8BvLMmFHnLq4kY7QOSat9A" alt="TennisAPI Image">
            <p class="card-content">Muestra una gráfica de tipo radar con los tenistas con más puntos en el ranking ATP.</p>
            <a href="http://antoniosaborido.es:8081/#/topTennis/chart"><button type="button" class="btn btn-primary">Ver más</button></a>
        </div>
    </div>
</main>

<script>
    import 'bootstrap/dist/css/bootstrap.min.css';
    import Button from 'sveltestrap/src/Button.svelte';
</script>