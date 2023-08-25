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
            Twitch API
            <a class="documentacion" href="https://dev.twitch.tv/docs/api/"><button type="button" class="btn btn-success">Documentación</button></a>
        </h1>
        <br>
    <p>La interacción en vivo y la transmisión de contenido han adquirido una importancia sin precedentes. Plataformas como Twitch han revolucionado la manera en que las personas se conectan, comparten y consumen contenido en tiempo real.</p>

    <p>Esta API ofrece un acceso estructurado a diversos datos y funciones clave dentro de Twitch, lo que permite aprovechar al máximo las posibilidades de la plataforma y brindar a los usuarios experiencias más personalizadas y enriquecedoras.</p>

    <p>Entre las capacidades que ofrece la Twitch API se encuentran:</p>
    <ol>
            <li><b>Obtención de Datos en Tiempo Real:</b>Permite acceder a datos en tiempo real sobre transmisiones en vivo, espectadores, seguidores y chats.</li>
            <li><b>Interacción con la Audiencia:</b> La API permite construir herramientas para interactuar con la audiencia de una manera única. </li>
            <li><b>Creación de Extensiones: </b>Las extensiones de Twitch son módulos interactivos que los streamers pueden incorporar en sus transmisiones para enriquecer la experiencia de sus espectadores. La Twitch API permite crear y personalizar estas extensiones, ofreciendo desde sorteos y encuestas hasta minijuegos y listas de reproducción de videos."</li>
            <li> <b>Análisis y Monitoreo: </b>La API también proporciona acceso a datos analíticos que permiten entender mejor cómo los usuarios interactúan con el contenido. </li>
            <li> <b> Oauth: </b> La api cuenta con Open Authorization, que es un estándar abierto que permite flujos simples de autorización para sitios web o aplicaciones informáticas.</li>
    </ol>

    </div>
<br>
    <div class="cards-container">
        <div class="card">
            <h2 class="card-title">Lista de Clips</h2>
            <img class="card-image" src="https://editors.dexerto.com/wp-content/uploads/2021/01/TwitchClipGuide.jpg" alt="Imagen de Clips">
            <p class="card-content">Muestra en formato tabla y ordenados por número de visitas los clips de la categoria 'Tennis'.</p>
            <a href="http://antoniosaborido.es:8081/#/Twitch"><button type="button" class="btn btn-primary">Ver más</button></a>
        </div>

        <div class="card">
            <h2 class="card-title">Gráfica de Clips</h2>
            <img class="card-image" src="https://i.ibb.co/mBzsRjy/Captura-de-pantalla-2023-08-25-064518.png" alt="TennisAPI Image">
            <p class="card-content">Muestra una gráfica de tipo barra los clips de la categoria tennis con más visitas.</p>
            <a href="http://antoniosaborido.es:8081/#/twitchchart"><button type="button" class="btn btn-primary">Ver más</button></a>
        </div>
    </div>
</main>
