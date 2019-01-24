<template>
	<div class="app-container">
		<header class="app-header" ref="header">
			<el-select 
				class="app-header__nav"
				v-model="selectedRoute"
				popper-class="app-header__nav-popper"
				ref="pageSelect"
				>
				<el-option
					v-for="page in pages"
					:key="page.label"
					:label="page.label"
					:value="page.value"
					>
					<router-link :to="page.value">{{ page.label }}</router-link>
				</el-option>
			</el-select>
		</header>
		<div class="app-content" ref="main" :style="{ height: mainHeight }">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Admin',
	data() {
		return {
			mainHeight: null,
			pages: null,
			selectedRoute: null,
			subMenu: []
		}
	},
	created() {
		//console.clear()
	},
	mounted() {
		let currentPathBase = ''
		let currentSegments = this.$router.history.current.path.split('/')
		if(currentSegments.length >= 3) {
			currentPathBase = '/' + currentSegments[1] + '/' + currentSegments[2]
		}

		// add top level routes to select - and set selected if there is a match
		this.pages = this.$router.options.routes.map(route => {
			if(currentPathBase === route.path) this.selectedRoute = route.path
			return {
				value: route.path,
				label: route.name
			}
		})
		window.addEventListener('resize', this.reflow)
		this.reflow()
	},
	watch:{
		// update dropdown if user clicks on fx browser back button
		// fix also update when there are subroutes...
    	$route (to, from){
			this.$router.options.routes.map(route => {
				if(this.$router.history.current.path === route.path) this.selectedRoute = route.path
			})
    	}
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.reflow)
	},
	methods: {
		reflow(e) { 
			this.mainHeight = (window.innerHeight - this.$refs.header.offsetHeight) + 'px' 
		},
	}
}
</script>
