<template>
	<div>
		<span>{{ value.lat }}</span>
		<span>{{ value.lng }}</span>
		<el-button type="text" icon="el-icon-delete" @click="$emit('delete', value)"></el-button>
	</div>
</template>

<script>
export default {
	name: 'VertexListItem',
	props: [ 'value' ],
	data() {
		return {

		}
	},

}
</script>
