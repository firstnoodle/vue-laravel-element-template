<template>
	<div class="filters">
		<span class="filters__label">Filters</span>
		<DataFilter
			v-for="filter in filters"
			:key="uniqueKey(filter)"
			:id="filter.id"	
			:column="filter.column"	
			:operator="filter.operator"	
			:store_module_name="store_module_name"
			:value="filter.value"	
			>
		</DataFilter>	
		<div 
			tabindex="0" 
			class="filters__new" 
			:class="{ 'is-active' : newActive }"
			@click="newFilter"
			@keydown.enter="newActive = true" 
			@keyup.enter="newActive = false"
			>
			<i class="el-icon-plus"></i>
		</div>
		<div class="filters__count">rows {{ rows.length }}</div>
		<!--
		<DataPaginator></DataPaginator>
		-->
	</div>
</template>

<script>
	import {mapActions, mapGetters} from 'vuex'
	import DataFilter from 	'./DataFilter.vue'
	import DataPaginator from './DataPaginator.vue'

	export default {
		name: 'DataViewer',
		components: { DataFilter, DataPaginator },
		props: {
			store_module_name: {
				type: String,
				required: true	
			},
		},
		data() {
			return {
				newActive: false,
				te: 91
			}
		},
		computed: {
			// ...mapGetters doesn't work with dynamic prop value...
			filters() {
				return this.store_module_name ? this.$store.getters[`${this.store_module_name}/filters`] : null
			},
			rows() {
				return this.store_module_name ? this.$store.getters[`${this.store_module_name}/rows`] : null
			},
		},
		methods: {
			// ...mapActions doesn't work with dynamic prop value...
			newFilter() {
				if(this.store_module_name) this.$store.dispatch(`${this.store_module_name}/newFilter`)
			}
		}
	}
</script>