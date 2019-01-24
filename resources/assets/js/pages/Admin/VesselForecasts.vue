<template>
	<el-main>
		<router-view></router-view>
	</el-main>
</template>

<script>
export default {
	name: 'VesselForecasts',
	data() {
		return {
			routes: null
		}
	},
	created() {
		this.$router.options.routes.map(route => {
			if(route.path === this.$router.history.current.path) {
				this.routes = route.children.map(subroute => {
					return {
						name: subroute.name,
						path: subroute.path
					}
				})
			}
		})
		console.log(this.routes)
	},
	mounted() {
		this.$router.push(this.routes[0])
	}
}
</script>
