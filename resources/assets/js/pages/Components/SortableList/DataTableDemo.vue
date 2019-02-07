<template>
	<div class="app-container">
		<DataFilters></DataFilters>
		<TableHeader :columns="columns" :gutter="gutter"></TableHeader>
		<div class="table__body">
			<el-row 
				v-for="row in rows"
				:key="uniqueKey(row)"
				:gutter="gutter"
				class="table__row"
				>
				<TableColumn 
					:layout="$store.getters['DataTable/getColumnLayout']('Service')"
					:classes="$store.getters['DataTable/getColumnClasses']('Service')"
					>
					<template v-bind:default="row" class="is-hidden">
						{{ row.service ? row.service.name : 'no data' }}
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
	</div>
</template>

<script>
import {mapGetters} from 'vuex'
import TableHeader from 'root/components/DataTables/TableHeader.vue'
import TableColumn from 'root/components/DataTables/TableColumn.vue'
import DataFilters from 'root/components/DataTables/DataFilters.vue'

export default {
	name: 'List',
	props: [],
	components: { DataFilters, TableHeader, TableColumn },
	data() {
		return {
			gutter: 20,
		}
	},
	computed: {
		...mapGetters('DataTable', ['columns', 'rows']),
	},
	created() { this.$store.dispatch('DataTable/loadData') },
}
</script>
