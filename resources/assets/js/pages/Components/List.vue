<template>
	<div class="app-container">
		<h3>List</h3>
		<!-- Filters -->
		<!-- Header labels -->
		<TableHeader :headers="headers" @sortingChanged="sortList"></TableHeader>
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
			headers: [ 
				{ label: 'Service', span: 4 }, 
				{ label: 'Vessel', span: 4 },
				{ label: 'Monitored port', span: 4 }, 
				{ label: 'Proforma ETA', span: 4 }, 
				{ label: 'eeSea ETA', span: 4 },
				{ label: 'Subscriber', span: 4 } 
			]
		}
	},
	methods: {
		sortList(selected, direction) {
			console.log(`${selected} -> ${direction}`)
		}
	}
}
</script>
