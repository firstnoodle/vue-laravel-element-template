<template>
	<div>
		<header height="50px" class="sub-header">
			<template v-for="item in subMenu">
				<router-link :to="item.path" tag="a" class="is-active">
					<div class="menu-item">
						<span class="menu-item__label">{{ item.label }}</span>
						<div class="menu-item__bar"></div>
					</div>
				</router-link>
			</template>
		</header>
		<main>
			<router-view></router-view>
		</main>
	</div>
</template>

<script>
export default {
	name: 'Users',
	data() {
		return {
			subMenu: [],
		}
	},
	created() {
		console.log('Users created')
		this.$router.options.routes.map(route => {
			if(route.path === this.$router.history.current.path) {
				if(route.children) {
					this.subMenu = route.children.map(child => {
						return {
							label: child.name,
							path: child.path
						}
					})
				} else {
					this.subMenu = []
				}
			}
		})
		console.log(this.subMenu)
	}
}
</script>
