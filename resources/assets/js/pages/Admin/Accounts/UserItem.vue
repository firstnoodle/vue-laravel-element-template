<template>
	<div>
		<h1>{{ item ? item.name : '···' }}</h1>
		<el-button @click="$emit('back')">Back</el-button>
	</div>
</template>

<script>
export default {
	name: 'UserItem',
	props: [ 'item' ],
	data() {
		return {

		}
	},
	methods: {
	
	}
}
</script>
