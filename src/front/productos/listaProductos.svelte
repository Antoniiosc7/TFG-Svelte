<script>
    import { onMount } from 'svelte';
    import Table from 'sveltestrap/src/Table.svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import { Alert } from 'sveltestrap';

    let entries = [];
    let checkMSG = "";
    let visible = false;
    let color = "danger";
	let currentPage = 1;
	const entriesPerPage = 10;

    let from = null;
    let to = null;

    onMount(getEntries);

    async function getEntries() {
        const response = await fetch("https://api.escuelajs.co/api/v1/products");
		const data = await response.json();

		if (Array.isArray(data)) {
			entries = data;
		} else if (data.hasOwnProperty("entries")) {
			entries = data.entries;
		}

		if (from !== null && to !== null) {
			entries = entries.filter(entry => entry.price >= from && entry.price <= to);
		}

			const startIndex = (currentPage - 1) * entriesPerPage;
			entries = entries.slice(startIndex, startIndex + entriesPerPage);
		}
</script>

<main>
    <figure class="text-center">
        <blockquote class="blockquote">
            <h1>Productos</h1>
        </blockquote>
        <p>
            Productos que se encuentran a la venta
        </p>
    </figure> 

    {#await entries}
        loading
    {:then entries}

    <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
        {#if checkMSG}
            {checkMSG}
        {/if}
    </Alert>
    <Table bordered>
        <thead>
            <tr>
                <th>Precio mínimo</th>
                <th>Precio máximo</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><input type="number" min="2000" bind:value={from}></td>
                <td><input type="number" min="2000" bind:value={to}></td>
                <td align="center"><Button outline color="dark" on:click={() => {
                    if (from === null || to === null) {
                        window.alert('Los campos precio mínimo y máximo no pueden estar vacíos');
                    } else {
                        checkMSG = "Datos cargados correctamente en ese rango de precios";
                        getEntries();
                    }
                }}>
                    Buscar
                </Button></td>
                <td align="center"><Button outline color="info" on:click={() => {
                	from = null;
					to = null;
					checkMSG = "Búsqueda limpiada";
					currentPage = 1; // Agrega esta línea para restablecer la página actual
					getEntries();
				}}>
					Limpiar Búsqueda
                </Button>
			</td>
            </tr>
        </tbody>
    </Table>
    <Table bordered>
        <thead id="titulitos">
            <tr>
                <th>Id</th>
                <th>Título</th>
                <th>Precio</th>
                <th>Descripción</th>
                <th>Foto</th>
            </tr>
        </thead>
        <tbody>
            {#each entries as entry}
                <tr>
                    <td>{entry.id}</td>
                    <td>{entry.title}</td>
                    <td>{entry.price}€</td>
                    <td>{entry.description}</td>
                    <td><img src={entry.images} alt={entry.description} style="width: 300px; height: auto;"/></td>
                </tr>
            {/each}
        </tbody>
    </Table>
{/await}
<div class="pagination">
    <button
        disabled={currentPage === 1}
        on:click={() => {
            currentPage -= 1;
            getEntries();
        }}
    >
        Anterior
    </button>
    {#each Array(Math.ceil(entries.length / entriesPerPage)).fill() as _, index}
        <button class:disabled={currentPage === index }>
		{currentPage}
        </button>
    {/each}
    <button

        on:click={() => {
            currentPage += 1;
            getEntries();
        }}
    >
        Siguiente
    </button>
	<!-- 
		{#each Array(Math.ceil(entries.length / entriesPerPage)).fill() as _, index}
        <button
            class:disabled={currentPage === index }
			
            on:click={() => {
                currentPage = index + 1;
                getEntries();
            }}
        >
		{currentPage}
        </button>
    {/each}

	-->
</div>



</main>

<style>
	.pagination {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}

.pagination button {
    border: 1px solid #ccc;
    padding: 0.25rem 0.5rem;
    margin: 0 0.25rem;
    cursor: pointer;
}

.pagination button.active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
}
</style>