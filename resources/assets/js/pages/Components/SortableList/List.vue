<template>
	<div class="app-container">
		<h3>Fist</h3>
		<!-- Filters -->
		<!-- Header labels -->
		<TableHeader :headers="headers" @sortingChanged="sortList"></TableHeader>
		<DataFilters></DataFilters>
		<el-row 
			v-for="forecast in $store.getters['SortableList/forecasts']"
			:key="uniqueKey(forecast)"
			style="font-size:12px"
			>
			<el-col :span="6">{{ forecast.service.name }}</el-col>
			<el-col :span="3">{{ forecast.vessel ? forecast.vessel.name : 'no vessel' }}</el-col>
			<el-col :span="3">{{ forecast.user_service_proforma.port.name }}</el-col>
			<el-col :span="3">{{ forecast.next_port.name }}</el-col>
			<el-col :span="3">{{ forecast.user_service_proforma.user.name }}</el-col>
			<el-col :span="3">{{ forecast.responsible_user ? forecast.responsible_user.name : 'No responsible user' }}</el-col>
		</el-row>
	</div>
</template>

<script>
import TableHeader from 'root/components/Tables/TableHeader.vue'
import DataFilters from 'root/components/DataFilters/DataFilters.vue'
import {stringAscending, stringDescending, numberAscending, numberDescending, dateAscending, dateDescending} from 'root/utils.js'

import {summary} from 'root/data/forecastSummaries.js'

export default {
	name: 'List',
	props: [],
	components: { DataFilters, TableHeader },
	data() {
		return {
			headers: [ 
				{ label: 'Service', span: 6 }, 
				{ label: 'Vessel', span: 3 },
				{ label: 'Monitored port', span: 3 }, 
				{ label: 'Next port', span: 3 }, 
				{ label: 'Subscriber', span: 3 }, 
				{ label: 'Responsible', span: 3 },
			],
			fields: [
				{
					label: 'Service',
					path: 'service.name',
					span: 4,
					ascending: stringAscending,
					descending: stringDescending,
				},
				{
					label: 'Vessel',
					path: 'vessel.name',
					span: 4,
					ascending: stringAscending,
					descending: stringDescending
				},
				{
					label: 'Terminal',
					path: 'terminal.name',
					span: 4,
					ascending: stringAscending,
					descending: stringDescending
				},
				{
					label: 'Proforma ETA',
					path: 'original_eta.date',
					span: 4,
					ascending: dateAscending,
					descending: dateDescending
				},
				{
					label: 'eeSea ETA',
					path: 'eesea_eta.date',
					span: 4,
					ascending: dateAscending,
					descending: dateDescending
				},
				{
					label: 'Deviation',
					path: 'deviation',
					span: 4,
					ascending: numberAscending,
					descending: numberDescending
				}
			],
			summaries: summary,
		}
	},
	created() {
		this.$store.dispatch('SortableList/loadData')
	},
	methods: {
		onFilterDelete() {
			console.log('delete filta')
		},
		sortList(selected, direction) {
			console.log(`${selected} -> ${direction}`)
		}
	},
}
</script>
