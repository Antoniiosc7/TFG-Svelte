<script>
    import 'bootstrap/dist/css/bootstrap.min.css'; // Importar estilos de Bootstrap
    let isDropdownOpen = false;

    function toggleDropdown() {
        isDropdownOpen = !isDropdownOpen;
    }


    function handleDropdownKey(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleDropdown();
        }
    }
/*

 <div class="col">
                <a href="/#/about"><h5>About</h5></a>
            </div>
 
            <div class="col">
                <a href="/#/integrations"><h5>Integrations</h5></a>
            </div>
            <div class="col">
                <a href="/#/info"><h5>Info</h5></a>
            </div>
             <div class="col">
                <a href="/#/Productos"><h5>Productos</h5></a>
            </div>

*/
</script>

<header>
    <div class="container">
        <div id="titulo" class="mb-4">
            <a href="http://tfg.antoniosaborido.es"><h2 class="text-white">INICIO</h2></a>
        </div>

        <div class="row">
            <!--
           <div class="col">
                <a href="/#/Visualizaciones"><h5>Visualizaciones</h5></a>
            </div>
            <div class="col">
                <a href="/#/Visualizaciones"><h5>Visualizaciones</h5></a>
            </div>
              -->
            <div class="col">
                <a href="/#/Visualizaciones"><h5>Visualizaciones</h5></a>
            </div>
      
            <div class="col" id="negro"><h5>|</h5></div>

            


            <div class="col dropdown">
                <a
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    on:click={toggleDropdown}
                    on:keydown={handleDropdownKey}
                    tabindex="0">
                    <h5>Front-Ends</h5>
                </a>
                <div class={"dropdown-menu " + (isDropdownOpen ? 'show' : '')} aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="/#/Tennis">Tennis</a>
                    <a class="dropdown-item" href="/#/Premier-League">Premier-League</a>
                </div>
            </div>

            <div class="col">
                <a href="/#/Visualizaciones"><h5>Visualizaciones</h5></a>
            </div>
        </div>
    </div>
</header>

<style>
    a {
        
        text-decoration: none;
    }
    a:hover {
        color: blue;
    }

    .row {
        padding: 10px;
        color: white;
    }

    .container {
        padding: 2px 8px;
        text-align: center;
    }
    header {
        background: #3498db;
        padding: 10px;
    }

    h2, h5 {
        margin: 0;
        text-align: center;
        color: black;
    }

    /* Estilos para el dropdown */
    .col.dropdown .dropdown-menu {
        background-color: #2980b9;
    }

    .col.dropdown .dropdown-item {
        color: rgb(0, 0, 0);
    }

    .col.dropdown .dropdown-item:hover {
        background-color: #1d67a8;
    }
</style>
