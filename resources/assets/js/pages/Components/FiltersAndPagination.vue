<template>
	<div class="app-body-content">
		<!--
		<DataFilters></DataFilters>
		-->
		<DataPaginator 
			:current_page="pagination.current_page" 
			:per_page="pagination.per_page" 
			:total="pagination.total" 
			:last_page="pagination.last_page"
			@currentPageChange="onCurrentPageChange" 
			@perPageChange="onPerPageChange"
			>
		</DataPaginator>
	</div>
</template>

<script>
import DataFilters from 'root/components/DataFilters/DataFilters.vue'
import DataPaginator from 'root/components/DataTables/DataPaginator.vue'

export default {
	name: 'FiltersAndPagination',
	props: [],
	components: { DataFilters, DataPaginator },
	data() {
		return {
			pagination: {
				current_page: 1,
				total: 467,
				last_page: 10,
				per_page: 50,
			}
		}
	},
	computed: {
	},
	watch: {
		'$route' (to, from) {
			// API calls
			console.log('Fetch data')
		}
	},
	beforeRouteEnter (to, from, next) {
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
    	console.log('Register Module')
    	next()
  	},
	methods: {
		updateRoute() {
			this.$router.push({
				path: this.$router.history.current.fullPath,
				query: {
					current_page: this.pagination.current_page, 
					per_page: this.pagination.per_page
				}
			})
		},
		onCurrentPageChange(page) {
			this.pagination.current_page = page
			this.updateRoute()
		},
		onPerPageChange({label, value}) {
			this.pagination.last_page = label
			this.pagination.per_page = value
			this.pagination.current_page = 1
			this.updateRoute()
		},
	}
}
</script>
