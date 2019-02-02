<template>
	<div class="app-container">
		<h3>Fist</h3>
		<!-- Filters -->
		<!-- Header labels -->
		<TableHeader :headers="headers" @sortingChanged="sortList"></TableHeader>
		<fltr @delete="onFilterDelete"></fltr>
		<!-- Rows -->
	</div>
</template>

<script>
import TableHeader from 'root/components/Tables/TableHeader.vue'
import fltr from 'root/components/Filters/Filter.vue'
import {stringAscending, stringDescending, numberAscending, numberDescending, dateAscending, dateDescending} from 'root/utils.js'

import {summary} from 'root/data/forecastSummaries.js'

export default {
	name: 'List',
	props: [],
	components: { fltr, TableHeader },
	data() {
		return {
			headers: [ 
				{ label: 'Service', span: 4 }, 
				{ label: 'Vessel', span: 4 },
				{ label: 'Monitored port', span: 4 }, 
				{ label: 'Proforma ETA', span: 4 }, 
				{ label: 'eeSea ETA', span: 4 },
				{ label: 'Subscriber', span: 4 } 
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
		console.log(this.summaries)	
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
