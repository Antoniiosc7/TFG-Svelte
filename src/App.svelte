<script>
	import Router from "svelte-spa-router";
	import Home from "./Home.svelte";

	import List from "./tennis/list.svelte";
	import Edit from "./tennis/edit.svelte";

	import listaProductos from "./productos/listaProductos.svelte"

	import Chart from "./tennis/chart.svelte";
	import Chart2 from "./tennis/chart2.svelte";
	
	import TwitchHub from "./twitch/twitchHub.svelte"
	import Twitch from "./twitch/twitch.svelte";
	import TwitchChart from "./twitch/twitchchart.svelte";

	import TopTennis from "./topTennis/topHub.svelte";
	import ApitennisList from "./topTennis/topList.svelte";
	import ApitennisChart from "./topTennis/topChart.svelte";

	import topHubFem from './tennisFem/topHub.svelte';
	import topListFem from './tennisFem/topList.svelte';
	import topChartFem from './tennisFem/topChart.svelte';

	import Info from "./Info.svelte";
	import Footer from "./components/Footer.svelte";
	import Header from "./components/Header.svelte";
	import Grupal1 from "./Grupal1.svelte";

	import Analytics from "./Analytics.svelte";
	import About from "./About.svelte";
	import Grupal2 from "./Grupal2.svelte";

	import Premier from "./premier-league/premier.svelte";
	import PremierEdit from "./premier-league/premierEdit.svelte";
	import PremierChart from "./premier-league/premierCharts.svelte";
	import PremierChart2 from "./premier-league/premierCharts2.svelte";
	import Visualizaciones from "./Visualizaciones.svelte";
	

	const routes = {

		"/": Home,

		"/Grupal1" : Grupal1,
		"/Grupal2" : Grupal2,
	

		"/info" : Info,
		"/about" : About,
		"/analytics" : Analytics,

		"/Productos": listaProductos,
		"/Visualizaciones" : Visualizaciones,
		"/tennis" : List,
		"/tennis/:country/:year" : Edit,
		"/tennis/chart" : Chart,
		"/tennis/chart2" : Chart2,
		
		"/twitch" : Twitch,
		"/twitchchart" : TwitchChart,
		"/twitchhub" : TwitchHub,
	
		"/topTennis": TopTennis,
		"/topTennis/list": ApitennisList,
		"/topTennis/chart": ApitennisChart,

		"/tennisFem": topHubFem,
		"/tennisFem/list": topListFem,
		"/tennisFem/chart": topChartFem,

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