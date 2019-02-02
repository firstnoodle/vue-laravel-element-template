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
				v-model="computedProperty" 
				@change="propertyChange"
				>
				<el-option
					v-for="field in fields"
					:key="field.value"
					:label="field.value"
					:value="field">
				</el-option>
			</el-select>	
		</div>
		<div 
			v-if="computedControlsVisible"
			class="filter__operator"
			>
			<el-select 
				ref="operator"
				size="mini"
				v-model="selectedOperator" 
				@change="operatorChange"
				>
				<el-option
					v-for="operator in operators"
					:key="operator.value"
					:label="operator.label"
					:value="operator.value">
				</el-option>
			</el-select>	
		</div>
		<div class="filter__value">
			<el-date-picker
				v-if="computedPropertyType === 'Date'"
				v-model="selectedValue"
				class="filter__value--date"
				type="datetime"
				placeholder="Select date and time"
				size="mini"
				format="yyyy-MM-dd HH:mm"
				:clearable="false"
				@change="valueChange"
				>
			</el-date-picker>	
			<el-input-number 
				v-else-if="computedPropertyType === 'Number'"
				v-model="selectedValue" 
				class="filter__value--number"
				controls-position="right" 
				size="mini"
				@change="valueChange"
				>
			</el-input-number>
			<el-input 
				v-else-if="computedPropertyType === 'String'"
				v-model="selectedValue" 
				size="mini"
				@change="valueChange"
				>
			</el-input>
			<el-select
				v-else-if="computedPropertyType === 'Select'"
				v-model="selectedValue"
				size="mini"
				placeholder=""
				@change="valueChange"
				>
				<el-option
					v-for="option in computedOptions"
					:key="option.value"
					:label="option.label"
					:value="option.value"
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
			@click="$emit('delete')"
			@keydown.enter="deleteActive = true" 
			@keyup.enter="deleteActive = false"
			>
			<i class="el-icon-close"></i>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Filter',	
	data() {
		return {
			decrementActive: false,
			deleteActive: false,
			deleteIcon: 'el-icon-close',
			fields: [
				{
					value: 'ETA',
					type: 'Date'
				},
				{
					value: 'Port',
					type: 'Select'
				},
				{
					value: 'Service',
					type: 'Select'
				},
				{
					value: 'Reference',
					type: 'String'
				},
				{
					value: 'TEUs',
					type: 'Number'
				},
			],
			incrementActive: false,
			operators: [
				{value: '<='},
				{value: '>='},
				{value: '=='},
				{value: '!='},
			],
			propertyWidth: '140px',
			selectedOperator: '>=',
			property: null,
			selectedValue: null,
		}
	},
	computed: {
		computedControlsVisible() {
			return this.property ? (this.property.type === 'Date' || this.property.type === 'Number') : false
		},
		computedOptions() {
			// if(this.property.options === undefined) console.error(`this property [${this.property}] should have options as a child array`)
			return [{value: 'Nothing yet'}]
		},
		computedProperty: {
			get() { return this.property ? this.property.value : null },
			set(newProperty) { this.property = newProperty }
		},
		computedPropertyType() {
			return this.property ? this.property.type : null
		}
	},
	watch: {
		deleteActive(newVal, oldVal) {
			if(!newVal && oldVal) this.$emit('delete')
		},
		decrementActive(newVal, oldVal) {
			if(newVal && !oldVal) console.log('DEC!')
		},
		incrementActive(newVal, oldVal) {
			if(newVal && !oldVal) console.log('INC!')
		},
	},
	mounted() {
		this.$refs.property.focus()
	},
	methods: {
		dec() {
			console.log('DEC')
		},
		inc() {
			console.log('INC')
		},
		onDecrement(state) {
			this.$refs.decrement.focus()
			this.decrementActive = state
		},
		onIncrement(state) {
			this.$refs.increment.focus()
			this.incrementActive = state
		},
		operatorChange() {
			console.log(this.$refs.operator.$el.querySelector('.el-input__inner'))
		},
		propertyChange() {
			console.log(this.property)
			this.selectedValue = null
			/*
			const letterCount = this.property.length
			const factor = this.propertyFontSize - ((letterCount/10)*-1)
			// font-size - (1-(letterCount/30))

			this.propertyWidth = (letterCount * factor) + 'px'
			console.log(`letters:${letterCount}, width:${this.propertyWidth}`)
			*/
		},
		valueChange() {
			console.log(this.selectedValue)
		}
	}
}
</script>

<style lang="scss">
	@import '~variables';

	$border-color: $--color-grey-5;

	$hover-border-color: darken($--color-grey-5, 10%);
	$hover-text-color: #000;

	$height: 28px;

	.filter > *:not(:first-child) {
		margin-left: -1px;
	}

	.filter {
		height: $height;

		> * { 
			display: inline-block; 
			float: left;
			position: relative;
			z-index: 0;

			&:hover, &:focus, &:active {
				z-index: 1;
			}
		}

		&__property {
			.el-input__inner {
				background-color: $--color-grey-1;
				border-color: $border-color;
				border-radius: $--border-radius-base 0px 0px $--border-radius-base;
				padding: 0px 8px;

				// override element-ui :focus
				&:focus {
					border-color: $border-color;
					box-shadow: inset 0 0 0 1px $--color-action-blue;
				}
			}
			// override element-ui .border-image: s-focus
			.el-input.is-focus > .el-input__inner {
				border-color: $border-color;
				box-shadow: inset 0 0 0 1px $--color-action-blue;
			}
			&:hover {
				.el-input__inner {
					background-color: $--color-grey-2;
					border-color: $hover-border-color;
				}	
			}

			// hide icon
			.el-input__suffix {
				display: none;
			}
		}
		&__operator {
			width: 26px;

			.el-input__inner {
				background-color: $--color-super-pale-blue;
				border-color: $border-color;
				border-radius: 0px;
				color: $--color-text-secondary;
				padding: 0px 0px;
				text-align: center;
				// override element-ui :focus
				&:focus {
					border-color: $border-color;
					box-shadow: inset 0 0 0 1px $--color-action-blue;
				}
			}
			// override element-ui .border-image: s-focus
			.el-input.is-focus > .el-input__inner {
				border-color: $border-color;
				box-shadow: inset 0 0 0 1px $--color-action-blue;
			}
			&:hover {
				.el-input__inner {
					border-color: $hover-border-color;
				}	
			}

			.el-input__suffix {
				display: none;
			}
		}
		&__value {
			.el-input {
				width: auto;
			}
			.el-input__inner {
				border-color: $border-color;
				border-radius: 0px;
				padding: 0px 8px;
				text-align: center;

				// override element-ui :focus
				&:focus {
					border-color: $border-color;
					box-shadow: inset 0 0 0 1px $--color-action-blue;
				}
			}
			// override element-ui .border-image: s-focus
			.el-input.is-focus > .el-input__inner {
				border-color: $border-color;
				box-shadow: inset 0 0 0 1px $--color-action-blue;
			}
			&:hover {
				.el-input__inner {
					border-color: $hover-border-color;
				}	
			}

			.el-input__prefix {
				display: none;
			}
		}
		&__controls {
			height: 100%;
			display: inline-flex;
			flex-direction: column;

			> * {
				background-color: $--color-super-pale-blue;
				border: 1px solid ;
				border-color: $border-color;
				color: $--color-text-secondary;
				cursor: pointer;
				font-size: 11px;
				line-height: 11px;
				position: relative;
				text-align: center;
				width: 28px;
				z-index: 0;

				&:hover {
					border-color: $hover-border-color;
					color: $hover-text-color;
					z-index: 1;
				}
				&:focus {
					border-color: $border-color;
					box-shadow: inset 0 0 0 1px $--color-action-blue;
					outline: none;
				}
				&:active, &.is-active {
					background-color: $--color-action-blue;
					color: $--color-white;	
				}
			}

			&-increment {
				height: 50%;
			}
			&-decrement {
				margin-top: -1px;
				height: 50%;
			}
		}
		&__delete {
			align-items: center;
			background-color: $--color-grey-1;
			border: 1px solid $border-color;
			border-radius: 0px $--border-radius-base $--border-radius-base 0px;
			box-sizing: border-box;
			color: $border-color;
			display: inline-flex;
			//padding: 7px;
			height: 100%;
			justify-content: center;
			width: 24px;

			&:hover {
				background-color: $--color-grey-2;
				border-color: $hover-border-color;
				color: $hover-text-color;
				cursor: pointer;
			}
			&:focus {
				border-color: $border-color;
				box-shadow: inset 0 0 0 1px $--color-action-blue;
				outline: none;
			}
			&:active, &.is-active {
				background-color: $--color-action-blue;
				color: $--color-white;	
			}
		}
	}
</style>

