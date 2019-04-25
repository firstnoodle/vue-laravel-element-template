<template>
	<div>
		<DataViewer :store_module_name="$options.name"></DataViewer>
	</div>
</template>

<script>
	import dataViewerStore from 'root/store/modules/DataViewer/index.js'
	import {sort} from 'root/utils.js'
	import {filterOperators} from 'root/components/datatables/constants.js'

	import DataViewer from 'root/components/DataViewer/DataViewer.vue'

	export default {
		name: 'DataViewerDemo',
		components: { DataViewer },
		data() {
			return {
				columns: [
					{
						label: 'Service',
						path: 'service.name',
						layout: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
						classes: ['is-highlighted'],
						filterOperators: [filterOperators.EQUAL, filterOperators.NOT_EQUAL],
						filterType: 'Select',
						filterValueOptions: null,
						sortingFunctions: {
							ascending: sort.stringAscending,
							descending: sort.stringDescending
						}
					},
					{
						label: 'Vessel',
						path: 'vessel.name',
						layout: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
						classes: [],
						filterOperators: [filterOperators.EQUAL, filterOperators.NOT_EQUAL],
						filterType: 'Select',
						filterValueOptions: null,
						sortingFunctions: {
							ascending: sort.stringAscending,
							descending: sort.stringDescending
						}
					},
					{
						label: 'Monitored port',
						path: 'user_service_proforma.port.name',
						layout: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
						classes: [],
						filterOperators: [filterOperators.EQUAL, filterOperators.NOT_EQUAL],
						filterType: 'Select',
						filterValueOptions: null,
						sortingFunctions: {
							ascending: sort.stringAscending,
							descending: sort.stringDescending
						}
					},
					{
						label: 'Next port',
						path: 'next_port.name',
						layout: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
						classes: [],
						filterOperators: [filterOperators.EQUAL, filterOperators.NOT_EQUAL],
						filterType: 'Select',
						filterValueOptions: null,
						sortingFunctions: {
							ascending: sort.stringAscending,
							descending: sort.stringDescending
						}
					},
					{
						label: 'Subscriber',
						path: 'user_service_proforma.user.name',
						layout: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
						classes: [],
						filterOperators: [filterOperators.EQUAL, filterOperators.NOT_EQUAL],
						filterType: 'Select',
						filterValueOptions: null,
						sortingFunctions: {
							ascending: sort.stringAscending,
							descending: sort.stringDescending
						}
					},
					{
						label: 'Responsible',
						path: 'responsible_user.name',
						layout: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
						classes: [],
						filterOperators: [filterOperators.EQUAL, filterOperators.NOT_EQUAL],
						filterType: 'Select',
						filterValueOptions: null,
						sortingFunctions: {
							ascending: sort.stringAscending,
							descending: sort.stringDescending
						}
					},
				]
			}
		},
		beforeCreate() {
			this.$store.registerModule(this.$options.name, dataViewerStore)
		},
		created() {
			this.$store.commit(`${this.$options.name}/SET_COLUMNS`, this.columns)
		},
		destroyed() {
			this.$store.unregisterModule(this.$options.name)
		}
	}
</script>