import VueRouter from 'vue-router'

// import page components
import Page from './pages/Page.vue'
import Components from './pages/Components.vue'

import DataTableDemo from './pages/components/SortableList/DataTableDemo.vue'
import FiltersAndPagination from './pages/components/FiltersAndPagination.vue'
import DataViewerDemo from './pages/components/DataViewerDemo.vue'

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
					path: 'data-table-demo',
					component: DataTableDemo,
					name: 'DataTableDemo',
				},
				{
					path: 'data-viewer-demo',
					component: DataViewerDemo,
					name: 'DataViewerDemo',
				},
				{
					path: 'filters-and-pagination',
					component: FiltersAndPagination,
					name: 'FiltersAndPagination',
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
