<style>
    main {
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    h2 {
        color: #3498db;
    }
    .documentacion{
        float: right; 

        margin-right: 10px; 
    }
    p {
        margin-bottom: 20px;
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
        <h2>
            Clasificación Tenis Femenino (WTA)
            <a class="documentacion" href="https://rapidapi.com/tipsters/api/sportscore1"><button type="button" class="btn btn-success">Documentación</button></a>
        </h2>
        <br>
    <p>Esta Api pertenece a Rapidapi y proporciona toda la información sobre el mundo del deporte, incluyendo todos los detalles relacionados con jugadores y torneos (puntuaciones en vivo, partidos, estadísticas). Pero en este caso nos centramos en la información de los circuitos WTA.
    </div>
<br>
    <div class="cards-container">
        <div class="card">
            <h2 class="card-title">Lista WTA</h2>
            <img class="card-image" src="https://opencourt.ca/wordpress/wp-content/uploads/2022/06/Canadian-rankings-800x615.jpg" alt="Imagen de Clips">
            <p class="card-content">La Clasificación de la WTA es una clasificación mundial de tenistas profesionales femeninas que publica la Women's Tennis Association desde 1975. Se actualiza cada semana y abarca los resultados de las últimas 52 semanas. Se utiliza para seleccionar a los habilitados en cada torneo y a los cabezas de serie.</p>
            <a href="http://antoniosaborido.es:8081/#/tennisFem/list"><button type="button" class="btn btn-primary">Ver más</button></a>
        </div>

        <div class="card">
            <h2 class="card-title">Gráfica ATP Femenina</h2>
            <img class="card-image" src="https://cdn.statcdn.com/Statistic/805000/807652-blank-355.png" alt="TennisAPI Image">
            <p class="card-content">Muestra una gráfica de tipo Spline con las diez tenistas con más puntos en el ranking WTA del circuito así con sus correspondientes puentos en la gráfica.</p>
            <a href="http://antoniosaborido.es:8081/#/tennisFem/chart"><button type="button" class="btn btn-primary">Ver más</button></a>
        </div>
    </div>
</main>

<script>
    import 'bootstrap/dist/css/bootstrap.min.css';
    import Button from 'sveltestrap/src/Button.svelte';
</script>