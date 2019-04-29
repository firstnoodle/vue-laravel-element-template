<template>
	<el-row 
		:gutter="gutter"
		class="table-header"
		>
		<el-col
			v-for="column in columns"
			:key="uniqueKey(column)"
			v-bind="column.layout"
			>	
			<div
				v-for="field in $store.getters['DataTable/getColumnFields'](column.name)"
				class="table-header__label"
				:class="{ 'is-active' : sortBy === field }"
				@click="setSortingColumn(field)"
				>
				{{ field.label }}
				<i v-if="sortBy === field" :class="computedSortDirectionIconClass"></i>
			</div>
		</el-col>
	</el-row>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
	name: 'TableHeader',
	props: [ 'columns', 'gutter' ],
	computed: {
		...mapGetters('DataTable', ['sortBy', 'sortDirection']),
		computedSortDirectionIconClass() {
			if(!this.sortDirection) return null
			const prefix = 'el-icon-arrow-'
			const direction = this.sortDirection === 'ascending' ? 'up' : 'down'
			return prefix + direction
		}
	},
	methods: { ...mapActions('DataTable', ['setSortingColumn', 'updateSortingDirection']), }
}
</script>
