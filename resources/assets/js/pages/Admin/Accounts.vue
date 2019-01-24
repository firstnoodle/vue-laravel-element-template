<template>
	<div>
		<header height="50px" class="sub-header">
			<template v-for="item in subNav">
				<router-link :to="item.path" tag="a" class="menu-item">
					<span class="menu-item__label">{{ item.label }}</span>
				</router-link>
			</template>
		</header>
		<main style="padding:20px">
			<router-view></router-view>
		</main>
	</div>
</template>

<script>
export default {
	name: 'Accounts',
	data() {
		return {
			path: '',
			subNav: [],
		}
	},
	created() {
		this.locateSelf(this.$router.options.routes, [], this.$options.name)

		// attempt to dynamically build subNav - don't know if it actually makes sense
		this.$router.options.routes.map(route => {
			// populate subNav - if this route record has any children
			if(route.path === this.$router.history.current.matched[0].path) {
				if(route.children) {
					this.subNav = route.children.map(child => {
						// remove param from path-definition (currently only works if there is one param)
						let path = child.path.split(':')[0]
						return {
							label: child.name,
							path: [this.path, path].join('/')
						}
					})
				} else {
					this.subNav = []
				}
			}
		})
	},
	watch: {
		$route(to, from) {
			//console.log(this.$route.matched)
		}
	},
	methods: {
		// recursive method to map out all route records hierarchically	
		locateSelf(entry, path, name) {
			let currentPath = path
			for(const route of entry) {
				currentPath.push(route.path)
				if(route.component.name === name) this.path = currentPath.join('/')
				else if(route.children) this.locateSelf(route.children, currentPath, name)
				else if(currentPath.length) currentPath.pop()
			}
			currentPath.pop()
		}
	},
	beforeRouteEnter (to, from, next) {
		// called before the route that renders this component is confirmed.
		// does NOT have access to `this` component instance,
		// because it has not been created yet when this guard is called!
		//console.warn('Account.vue @beforeRouteEnter')
		next()
	},
	beforeRouteUpdate (to, from, next) {
		// called when the route that renders this component has changed,
		// but this component is reused in the new route.
		// For example, for a route with dynamic params `/foo/:id`, when we
		// navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
		// will be reused, and this hook will be called when that happens.
		// has access to `this` component instance.
		//console.warn('Account.vue @beforeRouteUpdate')
		next()
	},
	beforeRouteLeave (to, from, next) {
		// called when the route that renders this component is about to
		// be navigated away from.
		// has access to `this` component instance.
		//console.warn('Account.vue @beforeRouteLeave')
		next()
	}
}
</script>
