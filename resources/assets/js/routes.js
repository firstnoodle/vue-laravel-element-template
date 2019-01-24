import VueRouter from 'vue-router'

// import page components
import DummyPage from './pages/DummyPage.vue'

import Admin from './pages/Admin.vue'
import Accounts from './pages/Admin/Accounts.vue'
import Users from './pages/Admin/Accounts/Users.vue'
import Roles from './pages/Admin/Accounts/Roles.vue'
import Permissions from './pages/Admin/Accounts/Permissions.vue'

import Locations from './pages/Admin/Locations.vue'
import Companies from './pages/Admin/Companies.vue'
import Services from './pages/Admin/Services.vue'
import Vessels from './pages/Admin/Vessels.vue'
import Geography from './pages/Admin/Geography.vue'

import VesselForecasts from './pages/Admin/VesselForecasts.vue'
import Subscriptions from './pages/VesselSchedules/Subscriptions/Subscriptions.vue'
import VesselAssignments from './pages/Admin/VesselForecasts/VesselAssignments.vue'
import Forecasts from './pages/Admin/VesselForecasts/Forecasts.vue'

import Scraper from './pages/Admin/Scraper.vue'
import Sketchpad from './pages/Admin/Sketchpad.vue'

export default new VueRouter({
	mode: 'history',
	base: '/',
	routes: [
		{
			path: '/admin/accounts',
			component: Accounts,
			name: 'Accounts',
			children: [
				{
					path: 'users/:id?',
					component: Users,
					name: 'Users',
				},
				{
					path: 'roles/:id?',
					component: Roles,
					name: 'Roles',
				},
				{
					path: 'permissions/:id?',
					component: Permissions,
					name: 'Permissions',
				}
			]
		},
		{
			path: '/admin/locations',
			component: Locations,
			name: 'Locations',
			beforeEnter: (to, from, next) => {
				console.warn('routes.js @beforeEnter -> /admin/locations')
				next()
			},
		},
		{
			path: '/admin/companies',
			component: Companies,
			name: 'Companies'
		},
		{
			path: '/admin/services',
			component: Services,
			name: 'Services'
		},
		{
			path: '/admin/vessels',
			component: Vessels,
			name: 'Vessels'
		},
		{
			path: '/admin/geography',
			component: Geography,
			name: 'Geography'
		},
		{
			path: '/admin/vessel-forecasts',
			component: VesselForecasts,
			name: 'Vessel Forecasts',
			children: [
				{
					path: 'subscriptions',
					component: Subscriptions,
					name: 'Subscriptions'
				},
				{
					path: 'vessel-assignments',
					component: VesselAssignments,
					name: 'Vessel Assignments'
				},
				{
					path: 'forecasts',
					component: Forecasts,
					name: 'Forecasts'
				},
			]
		},
		{
			path: '/admin/scraper',
			component: Scraper,
			name: 'Scraper'
		},
		{
			path: '/admin/sketchpad',
			component: Sketchpad,
			name: 'Sketchpad'
		},

		// CATCH ALL
		{ 
			path: "*", 
			component: DummyPage 
		}
	],
	linkActiveClass: 'is-active'
})

/*
const getLazyWelcomeRoute = () => {
    // IMPORTANT for lazy loading
    const LazyWelcomeComponent = () => import('views/WelcomeComponent.vue')
    return {
        name: ROUTE_WELCOME,
        path: '',
        component: LazyWelcomeComponent
    }
}
*/
