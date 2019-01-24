<template>
	<div>
		<h1>{{ item.name }}</h1>
		<el-button @click="$emit('back')">Back</el-button>
	</div>
</template>

<script>
export default {
	name: 'PermissionItem',
	props: [ 'item' ],
	data() {
		return {

		}
	},
	mounted() {
		console.log(this.item)
	},
	methods: {
	
	}
}
</script>
