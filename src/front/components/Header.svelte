<script>
    import 'bootstrap/dist/css/bootstrap.min.css';

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
</script>

<header>
    <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #3498db;">
        <div class="container">
            <a class="navbar-brand" href="http://tfg.antoniosaborido.es">INICIO</a>
            <button class="navbar-toggler" type="button" on:click={toggleDropdown}>
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" style={{ ...isDropdownOpen ? 'display: block;' : 'display: none; ' }}>
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/#/" style="color: white;">Info</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/#/TwitchHub" style="color: white;">Twitch</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/#/TwitchHub" style="color: white;">Top Tennis FEM</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/#/Productos" style="color: white;">Productos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/#/Visualizaciones" style="color: white;">Live Tennis Ranking</a>
                    </li>
                    <li class="nav-item">
                        <div class="nav-link">|</div>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" style="color: white;" id="dropdownMenuButton" data-toggle="dropdown" on:click={toggleDropdown} on:keydown={handleDropdownKey} tabindex="0">
                            Front-Ends
                        </a>
                        <div class={"dropdown-menu " + (isDropdownOpen ? 'show' : '')} aria-labelledby="dropdownMenuButton">
                            <a class="dropdown-item" href="/#/Tennis" style="color: #2980b9;">Tennis</a>
                            <a class="dropdown-item" href="/#/Premier-League" style="color: #2980b9;">Premier-League</a>
                        </div>
                        
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/#/Visualizaciones" style="color: white;" >Visualizaciones</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>

<style>
    a {
        color: white;
        text-decoration: none;
    }
    li{
        text-emphasis-color: white;
    }
    a:hover {
        color: #141414;
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

    .col.dropdown .dropdown-item {
        color: rgb(0, 0, 0);
    }

    .col.dropdown .dropdown-item:hover {
        background-color: #1d67a8;
    }

    .dropdownMenuButton {
        background-color: #2980b9;
    }
</style>