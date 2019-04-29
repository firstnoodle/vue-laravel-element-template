<template>
	<div class="app-body-content">
		<DataFilters></DataFilters>
			
		<TableHeader :columns="columns" :gutter="gutter"></TableHeader>
		<div class="table-body">

			<el-row 
				v-for="row in rows"
				:key="uniqueKey(row)"
				:gutter="gutter"
				class="table-row"
				>
				<TableColumn 
					:layout="$store.getters['DataTable/getColumnLayout']('Service')"
					:classes="$store.getters['DataTable/getColumnClasses']('Service')"
					>
					<template v-bind:default="row">
						<!--
						<span v-for="field in $store.getters['DataTable/getColumnFields']('Service')"> 
							{{ getValueFromPath(row, field.path)}}
						</span>
						-->
						<div>{{ row.service ? row.service.name : 'no data' }}</div>
						<div>{{ row.vessel ? row.vessel.name : 'no data' }}</div>
					</template>
				</TableColumn>
				<TableColumn 
					:layout="$store.getters['DataTable/getColumnLayout']('Vessel')"
					:classes="$store.getters['DataTable/getColumnClasses']('Vessel')"
					>
					<template v-bind:default="row">
						{{ row.vessel ? row.vessel.name : 'no data' }}
					</template>
				</TableColumn>
				<TableColumn 
					:layout="$store.getters['DataTable/getColumnLayout']('Monitored port')"
					:classes="$store.getters['DataTable/getColumnClasses']('Monitored port')"
					>
					<template v-bind:default="row">
						<el-tag>{{ row.user_service_proforma.port ? row.user_service_proforma.port.name : 'no data' }}</el-tag>
					</template>
				</TableColumn>
				<TableColumn 
					:layout="$store.getters['DataTable/getColumnLayout']('Next port')"
					:classes="$store.getters['DataTable/getColumnClasses']('Next port')"
					>
					<template v-bind:default="row">
						{{ row.next_port.name ? row.next_port.name : 'no data' }}
					</template>
				</TableColumn>
				<TableColumn 
					:layout="$store.getters['DataTable/getColumnLayout']('Subscriber')"
					:classes="$store.getters['DataTable/getColumnClasses']('Subscriber')"
					>
					<template v-bind:default="row">
						{{ row.user_service_proforma.user ? row.user_service_proforma.user.name : 'no data' }}
					</template>
				</TableColumn>
				<TableColumn 
					:layout="$store.getters['DataTable/getColumnLayout']('Responsible')"
					:classes="$store.getters['DataTable/getColumnClasses']('Responsible')"
					>
					<template v-bind:default="row">
						{{ row.responsible_user ? row.responsible_user.name : 'no data' }}
					</template>
				</TableColumn>
			</el-row>
		</div>
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
import {mapGetters} from 'vuex'
import {getValueFromPath, wrapRange} from 'root/utils.js'
import TableHeader from 'root/components/DataTables/TableHeader.vue'
import TableColumn from 'root/components/DataTables/TableColumn.vue'
import DataFilters from 'root/components/DataTables/DataFilters.vue'
import DataPaginator from 'root/components/DataTables/DataPaginator.vue'

export default {
	name: 'List',
	props: [],
	components: { DataFilters, DataPaginator, TableHeader, TableColumn },
	data() {
		return {
			gutter: 20,
			pagination: {
				current_page: 1,
				total: 467,
				last_page: 10,
				per_page: 50,
			}
		}
	},
	computed: {
		...mapGetters('DataTable', ['columns', 'rows']),
		serviceFields() {
			return this.$store.getters['DataTable/getColumnFields']('Service')	
		}
	},
	watch: {
		'$route' (to, from) {
			// API calls
			console.log('Fetch data')
		}
	},
	created() { 
		this.$store.dispatch('DataTable/loadData') 
	},
	methods: {
		getValueFromPath,
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
