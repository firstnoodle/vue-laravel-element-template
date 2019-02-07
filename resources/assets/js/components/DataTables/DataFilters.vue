<template>
	<div class="filters">
		<span class="filters__label">Filters</span>
		<DataFilter
			v-for="filter in $store.getters['DataTable/filters']"
			:key="uniqueKey(filter)"
			:id="filter.id"	
			:column="filter.column"	
			:operator="filter.operator"	
			:value="filter.value"	
			>
		</DataFilter>	
		<div 
			tabindex="0" 
			class="filters__new" 
			:class="{ 'is-active' : newActive }"
			@click="$store.dispatch('DataTable/newFilter')"
			@keydown.enter="newActive = true" 
			@keyup.enter="newActive = false"
			>
			<i class="el-icon-plus"></i>
		</div>
	</div>
</template>

<script>
	import DataFilter from './DataFilter.vue'	

	export default {
		name: 'DataFilters',
		components: { DataFilter },
		data() {
			return {
				newActive: false,
			}
		},
		watch: {
			newActive(newVal, oldVal) { if(!newVal && oldVal) this.$store.dispatch('DataTable/newFilter') },
		}	
	}
</script>
