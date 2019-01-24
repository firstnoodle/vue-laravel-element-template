<template>
	<div>
		<h1>Select a permission</h1>
		<span v-for="(value, key, index) in queries">{{ key + '=' + value.value + ' ' }}</span>
		<ul>
			<li v-for="item in items">
				<router-link :to="path + item.id.toString()">{{ item.name }}</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'PermissionList',
	props: [ 'items', 'path', 'queries' ],
	data() {
		return {
			
		}
	},
	mounted() {
		console.log(this.items)
	},
	methods: {
	
	}
}
</script>
