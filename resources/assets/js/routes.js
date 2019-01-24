import VueRouter from 'vue-router'

// import page components
import Admin from './pages/Admin.vue'
import DummyPage from './pages/DummyPage.vue'

export default new VueRouter({
	mode: 'history',
	base: '/',
	routes: [
		/*
		{
			path: '/admin/accounts',
			component: Accounts,
			name: 'Accounts',
			children: []
		},
		*/
		// CATCH ALL
		{ 
			path: "*", 
			component: DummyPage 
		}
	],
	linkActiveClass: 'is-active'
})
