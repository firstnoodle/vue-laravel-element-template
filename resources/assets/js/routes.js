import VueRouter from 'vue-router'

// import page components
import Index from './pages/Index.vue'
import Page from './pages/Page.vue'
import NotFound from './pages/NotFound.vue'

export default new VueRouter({
	mode: 'history',
	base: '/',
	routes: [
		{
			path: '/',
			component: Page,
			name: 'Page',
			children: []
		},
		// CATCH ALL
		{ 
			path: "*", 
			component: NotFound
		}
	],
	linkActiveClass: 'is-active'
})
