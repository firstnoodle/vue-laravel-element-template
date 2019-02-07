<template>
	<div class="filter">
		<div 
			class="filter__property"
			:style="{ width: propertyWidth }"
			>
			<el-select 
				placeholder="Select field"
				ref="property"
				size="mini"
				v-model="columnLabel" 
				@change="onColumnChange"
				>
				<el-option
					v-for="column in columns"
					:key="column.path"
					:label="column.label"
					:value="column.label">
				</el-option>
			</el-select>	
		</div>
		<div 
			v-if="computedOperatorVisible"
			class="filter__operator"
			>
			<el-select 
				ref="operator"
				size="mini"
				v-model="computedOperator" 
				>
				<el-option
					v-for="operator in computedFilterOperators"
					:key="operator"
					:label="operator"
					:value="operator">
				</el-option>
			</el-select>	
		</div>
		<div class="filter__value">
			<el-date-picker
				v-if="computedColumnType === 'Date'"
				v-model="computedValue"
				class="filter__value--date"
				type="datetime"
				placeholder="Select date and time"
				size="mini"
				format="yyyy-MM-dd HH:mm"
				:clearable="false"
				>
			</el-date-picker>	
			<el-input-number 
				v-else-if="computedColumnType === 'Number'"
				v-model="computedValue" 
				class="filter__value--number"
				controls-position="right" 
				size="mini"
				>
			</el-input-number>
			<el-input 
				v-else-if="computedColumnType === 'String'"
				v-model="computedValue" 
				size="mini"
				>
			</el-input>
			<el-select
				v-else-if="computedColumnType === 'Select'"
				v-model="computedValue"
				size="mini"
				placeholder="Select column"
				:filterable="true"
				>
				<el-option
					v-for="option in computedOptions"
					:key="option"
					:label="option"
					:value="option"
					>
				</el-option>
			</el-select>
		</div>
		<div 
			class="filter__controls"
			v-if="computedControlsVisible"
			>
			<span 
				tabindex="0" 
				class="filter__controls-increment" 
				:class="{ 'is-active' : incrementActive }"
				ref="increment"
				@keydown.enter="incrementActive = true" 
				@keyup.enter="incrementActive = false"
				@keydown.down="onDecrement(true)"
				@keyup.down="onDecrement(false)"
				@keydown.up="onIncrement(true)"
				@keyup.up="onIncrement(false)"
				>
				<i class="el-icon-arrow-up"></i>
			</span>
			<span 
				tabindex="0" 
				class="filter__controls-decrement" 
				:class="{ 'is-active' : decrementActive }"
				ref="decrement"
				@keydown.enter="decrementActive = true" 
				@keyup.enter="decrementActive = false"
				@keydown.down="onDecrement(true)"
				@keyup.down="onDecrement(false)"
				@keydown.up="onIncrement(true)"
				@keyup.up="onIncrement(false)"
				>
				<i class="el-icon-arrow-down"></i>
			</span>	
		</div>
		<div 
			tabindex="0" 
			class="filter__delete" 
			:class="{ 'is-active' : deleteActive }"
			@click="$store.dispatch('DataTable/deleteFilter', id)"
			@keydown.enter="deleteActive = true" 
			@keyup.enter="deleteActive = false"
			>
			<i class="el-icon-close"></i>
		</div>
	</div>
</template>

<script>
import {mapGetters,mapState} from 'vuex'

export default {
	name: 'DataFilter',	
	props: ['id', 'operator', 'column', 'value'],
	data() {
		return {
			columnLabel: null,
			decrementActive: false,
			deleteActive: false,
			deleteIcon: 'el-icon-close',
			incrementActive: false,
			propertyWidth: '140px',
		}
	},
	computed: {
		...mapGetters('DataTable', ['columns']),
		computedControlsVisible() {
			let column = this.column ? this.$store.getters['DataTable/columnByLabel'](this.column) : null
			return column ? (column.filterType === 'Date' || column.filterType === 'Number') : false
		},
		computedOperatorVisible() {
			return this.column ? this.column.filterOperators.length : false
		}, 
		computedOptions() {
			return this.column ? this.column.filterValueOptions : []			
		},
		computedFilterOperators() {
			return this.column ? this.column.filterOperators : []
		},
		computedOperator: {
			get() { return this.operator },
			set(newValue) { this.$store.dispatch('DataTable/setFilterAttribute', {id: this.id, attribute: 'operator', value: newValue}) }
		},
		computedColumnType() { return this.column ? this.column.filterType : null },
		computedValue: {
			get() { return this.value },
			set(newValue) { this.$store.dispatch('DataTable/setFilterAttribute', {id: this.id, attribute: 'value', value: newValue}) }
		}
	},
	watch: {
		deleteActive(newVal, oldVal) { if(!newVal && oldVal) this.$store.dispatch('DataTable/deleteFilter', this.id) },
		decrementActive(newVal, oldVal) { if(newVal && !oldVal) console.log('DEC!') },
		incrementActive(newVal, oldVal) { if(newVal && !oldVal) console.log('INC!') },
	},
	created() {
		this.columnLabel = this.column ? this.column.label : null
	},
	mounted() { 
		this.$refs.property.focus() 
	},
	methods: {
		onColumnChange() {
			for(const column of this.columns) {
				if(column.label === this.columnLabel) {
					this.$store.dispatch('DataTable/setFilterAttribute', {id: this.id, attribute: 'value', value: null}) 
					this.$store.dispatch('DataTable/setFilterAttribute', {id: this.id, attribute: 'column', value: column}) 
				}
			}
		},
		onDecrement(state) {
			this.$refs.decrement.focus()
			this.decrementActive = state
		},
		onIncrement(state) {
			this.$refs.increment.focus()
			this.incrementActive = state
		},
		propertyChange() {
			this.value = null
			/*
			const letterCount = this.property.length
			const factor = this.propertyFontSize - ((letterCount/10)*-1)
			// font-size - (1-(letterCount/30))

			this.propertyWidth = (letterCount * factor) + 'px'
			console.log(`letters:${letterCount}, width:${this.propertyWidth}`)
			*/
		},
	}
}
</script>
