<template>
	<div class="filters">
		<DataFilter
			v-for="filter in $store.getters['SortableList/filters']"
			>
		</DataFilter>	
		<el-button type="text" size="mini">add filter</el-button>
	</div>
</template>

<script>
	import DataFilter from './DataFilter.vue'	

	export default {
		name: 'DataFilters',
		components: { DataFilter },
	}	
</script>

<style lang="scss">



</style>