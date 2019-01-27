<template>
	<el-row class="table__header">
		<TableHeaderLabel 
			v-for="header in headers" 
			:label="header.label"
			:sort="selected === header.label ? direction : null"
			:span="header.span"
			@click="labelClick"	
			>
		</TableHeaderLabel>
	</el-row>
</template>

<script>
import TableHeaderLabel from './TableHeaderLabel.vue'

export default {
	name: 'TableHeader',
	props: [ 'headers' ],
	components: { TableHeaderLabel },
	data() {
		return {
			selected: null,
			direction: 'descending'
		}
	},
	created() {
		this.selected = this.headers ? this.headers[0].label : null
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
