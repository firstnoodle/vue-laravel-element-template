<template>
	<el-col class="table-column" :class="classes" v-bind="layout"><slot></slot></el-col>	
</template>

<script>
	export default {
		name: 'TableColumn',
		props: ['classes', 'layout', 'row']	
	}	
</script>