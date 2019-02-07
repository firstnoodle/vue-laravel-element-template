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
				class="table-header__label"
				:class="{ 'is-active' : sortBy === column }"
				@click="setSortingColumn(column)"
				>
				{{ column.label }}
				<i v-if="sortBy === column" :class="computedSortDirectionIconClass"></i>
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
