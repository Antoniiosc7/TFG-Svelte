import App from './App.svelte';
import 'tennisv3.js';

const app = new App({
	target: document.body,
	props: {
		name: 'Grupo 23'
	}
});

export default app;