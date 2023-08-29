<script>


    let apis = [
        { name: "API Tennis Documentaciñón", link: "https://sos2122-23.herokuapp.com/api/v1/tennis/docs" },
        { name: "API Premier-League Documentación", link: "https://sos2122-23.herokuapp.com/api/v2/tennis/docs" }
    ];

    let apiEndpoints = [
        { name: "API Premier League", link: "http://antoniosaborido.es/api/v2/premier-league" },
        { name: "API Tennis", link: "http://antoniosaborido.es/api/v2/tennis" }
    ];

    let frontEndLinks = [
        { name: "Tennis Frontend", link: "http://antoniosaborido.es:8081/#/Tennis" },
        { name: "Premier-League Frontend", link: "http://antoniosaborido.es:8081/#/Premier-League" }
    ];
</script>

<main>
    <br>
    <div class="container">
        <div id="titulo">
            <h3>TFG-Svelte</h3>
        </div>

        <h4>Descripción:</h4>
        <li>Relación de deportes entre fútbol (Premier League), tenis y baloncesto (NBA)</li>
        <li>Visualizaciones de graficas conjuntas a APIs propias editables en las paginas front-ends</li>
        <li>Integraciones de APIs externas junto a sus respectivas visualizaciones</li>
        <br>
        <h4>Repositorio github:</h4>
        <li><a href="https://github.com/Antoniiosc7/TFG-Svelte">https://github.com/Antoniiosc7/TFG-Svelte</a></li>
        <br>
        <h4>Desplegado en:</h4>
        <li><a href="http://antoniosaborido.es:8081">http://antoniosaborido.es:8081</a></li>

        <hr>

        <h4>Documentación APIs propias</h4>
        <ul>
            {#each apis as api}
                <li><a href={api.link}>{api.name}</a></li>
            {/each}
        </ul>

        <h4>APIs</h4>
        <ul>
            {#each apiEndpoints as endpoint}
                <li><a href={endpoint.link}>{endpoint.name}</a></li>
            {/each}
        </ul>

        <h4>Front-Ends propios</h4>
        <ul>
            {#each frontEndLinks as link}
                <li><a href={link.link}>{link.name}</a></li>
            {/each}
        </ul>
        <hr>
        <h4> APIs externas:</h4>
        <h5> API Twitch</h5>
        <li>Documentación: <a href="https://dev.twitch.tv/docs/api/">https://dev.twitch.tv/docs/api/</a></li>
        <li><a href="/#/twitchHub">Implementación</a></li>
        <br>
        <h5> API Clasificacion ATP Actualizada</h5>
        <li>Documentación: <a href="https://rapidapi.com/cantagalloedoardo/api/ultimate-tennis1/details">https://rapidapi.com/cantagalloedoardo/api/ultimate-tennis1/details</a></li>
        <li><a href="/#/topTennis">Implementación</a></li>
        <br>
        <h5> API Top Tennis Femenino</h5>
        <li>Documentación: <a href="https://rapidapi.com/tipsters/api/sportscore1">https://rapidapi.com/tipsters/api/sportscore1</a></li>
        <li><a href="/#/tennisFem">Implementación</a></li>
        <br>   
        <h5> API Productos</h5>
        <li>Documentación: <a href="https://api.escuelajs.co/docs/">https://api.escuelajs.co/docs/</a></li>
        <li><a href="/#/Productos">Implementación</a></li>


    </div>
</main>

<style>

    .container {
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
    }


</style>
