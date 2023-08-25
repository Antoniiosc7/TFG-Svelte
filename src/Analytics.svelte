<script>
    import { getBASEUrl } from "../config";
    const BASEUrl = getBASEUrl();
</script>

<main>
    <div class="container">
        <div id="titulo">
            <h1>Integraciones</h1>
        </div>
        <div class="row">
            <div class="col-4">
                
            </div>
            <div class="col-4">
                <h5 id="titulo">Antonio Saborido Campos</h5>
                <hr />
                <h6>Integración Externa 1 (Twitch API)</h6>
                    <ul>
                        <a href="{BASEUrl}/api/v1/tennis-twitch"><li type="circle"> Archivo JSON</li></a>
                        <a href="/#/tennis/twitch"><li type="circle"> Vista tabla con reproductor</li></a>
                        <a href="/#/tennis/twitchchart"><li type="circle"> Grafica visitas</li></a>
                    </ul>
                <h6>Integración Externa 2 (Ultimate Tennis)</h6>
                    <ul>
                        <a href="{BASEUrl}/api/v1/tennisLiveRanking"><li type="circle"> Archivo JSON</li></a>
                        <a href="/#/tennis/apitennislist"><li type="circle"> Vista en tabla</li></a>
                        <a href="/#/tennis/apitennischart"><li type="circle"> Grafica</li></a>
                    </ul>
                <h6>Integración Externa 5 (SportScore: Clasifición tennis feminino)</h6>
                    <ul>
                        <a href="{BASEUrl}/api/v1/tennisWomen"><li type="circle"> Archivo JSON</li></a>
                        <a href="/#/tennis/apiext5list"><li type="circle"> Vista en tabla</li></a>
                        <a href="/#/tennis/apiext5chart"><li type="circle"> Gráfica </li></a>
                    </ul>        
            </div>
            <div class="col-4">
            </div>
        </div>
    </div>
</main>

<style>
    .container {
        padding: 2px 16px;
    }
    #titulo {
        text-align: center;
    }
</style>
