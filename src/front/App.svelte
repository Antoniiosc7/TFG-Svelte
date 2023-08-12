<script>
	import Router from "svelte-spa-router";
	import Home from "./Home.svelte";

	import List from "./tennis/list.svelte";
	import Edit from "./tennis/edit.svelte";

	import listaProductos from "./productos/listaProductos.svelte"

	import Chart from "./tennis/chart.svelte";
	import Chart2 from "./tennis/chart2.svelte";
	import Twitch from "./tennis/twitch.svelte";
	import TwitchChart from "./tennis/twitchchart.svelte";
	import ApitennisList from "./tennis/apitennislist.svelte";
	import ApitennisChart from "./tennis/apitennislistchart.svelte";
	import apiext5list from "./tennis/apiext5list.svelte";
	import apiext5chart from "./tennis/apiext5chart.svelte";
	import apiext6chart from "./tennis/apiext6chart.svelte";
	import apiext7chart from "./tennis/apiext7chart.svelte";
	
	import Info from "./Info.svelte";
	import Footer from "./components/Footer.svelte";
	import Header from "./components/Header.svelte";
	import GroupGraph from "./GroupGraph.svelte";

	import Analytics from "./Analytics.svelte";
	import About from "./About.svelte";
	import Integrations from "./Integrations.svelte";

	import Premier from "./premier-league/premier.svelte";
	import PremierEdit from "./premier-league/premierEdit.svelte";
	import PremierChart from "./premier-league/premierCharts.svelte";
	import PremierChart2 from "./premier-league/premierCharts2.svelte";
	

	const routes = {

		"/": Home,

		"/groupgraph" : GroupGraph,
		"/info" : Info,
		"/about" : About,
		"/analytics" : Analytics,
		"/integrations" : Integrations,
		"/Productos": listaProductos,

		"/tennis" : List,
		"/tennis/:country/:year" : Edit,
		"/tennis/chart" : Chart,
		"/tennis/chart2" : Chart2,
		"/tennis/twitch" : Twitch,
		"/tennis/twitchchart" : TwitchChart,
		"/tennis/apitennislist": ApitennisList,
		"/tennis/apitennischart": ApitennisChart,
		"/tennis/apiext5list": apiext5list,
		"/tennis/apiext5chart": apiext5chart,
		"/tennis/apiext6chart": apiext6chart,
		"/tennis/apiext7chart": apiext7chart,
		
		"/premier-league" : Premier,
		"/premier-league/:country/:year": PremierEdit,
		"/premier-league/charts" : PremierChart,
		"/premier-league/charts2" : PremierChart2
	};
</script>

<Header />

<main>
	<Router {routes} />
</main>

<Footer />