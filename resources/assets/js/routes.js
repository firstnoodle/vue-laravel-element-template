import VueRouter from 'vue-router'

// import page components
import Page from './pages/Page.vue'
import Components from './pages/Components.vue'
import List from './pages/components/SortableList/List.vue'
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
		{
			path: '/components',
			component: Components,
			name: 'Components',
			children: [
				{
					path: 'list',
					component: List,
					name: 'List',
				},
			]
		},

		// CATCH ALL
		{ 
			path: "*", 
			component: NotFound
		}
	],
	linkActiveClass: 'is-active'
})
