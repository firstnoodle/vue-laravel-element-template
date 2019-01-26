<template>
	<div class="app-container">
		<h1>LIST</h1>
		<!-- Filters -->
		<!-- Header labels -->
		<TableHeader :labels="labels" @sortingChanged="sortList"></TableHeader>
		<!-- Rows -->
	</div>
</template>

<script>
import TableHeader from 'root/components/Tables/TableHeader.vue'
export default {
	name: 'List',
	props: [],
	components: { TableHeader },
	data() {
		return {
			labels: [ 'Service', 'Vessel', 'Monitored port', 'Proforma ETA', 'eeSea ETA', 'Subscriber' ]
		}
	},
	methods: {
		sortList(selected, direction) {
			console.log(`${selected} -> ${direction}`)
		}
	}
}
</script>
