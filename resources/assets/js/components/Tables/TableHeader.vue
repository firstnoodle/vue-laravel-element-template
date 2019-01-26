<template>
	<div class="table__header">
		<TableHeaderLabel 
			v-for="label in labels" 
			:label="label"
			:sort="selected === label ? direction : null"
			@click="labelClick"	
			>
		</TableHeaderLabel>
	</div>
</template>

<script>
import TableHeaderLabel from './TableHeaderLabel.vue'

export default {
	name: 'TableHeader',
	props: [ 'labels' ],
	components: { TableHeaderLabel },
	data() {
		return {
			selected: null,
			direction: 'descending'
		}
	},
	created() {
		this.selected = this.labels ? this.labels[0] : null
	},
	methods: {
		labelClick(label) {
			if(label === this.selected) {
				this.toggleDirection()
			} else { 
				this.selected = label
				this.direction = 'descending'
			}
			this.$emit('sortingChanged', this.selected, this.direction)
		},
		toggleDirection() {
			this.direction = this.direction === 'ascending' ? 'descending' : 'ascending'
		}
	}
}
</script>
