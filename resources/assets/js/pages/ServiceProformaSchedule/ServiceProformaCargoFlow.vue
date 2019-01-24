<template>
	<el-row class="cargo-flow-item" :gutter="10">
		<el-col :span="14">
			<el-select v-model="computedCargoFlow" filterable class="dropdown">
				<el-option
					v-for="item in cargoFlowOptions"
					:key="item.id"
					:label="item.label"
					:value="item">
				</el-option>
			</el-select>
		</el-col>
		<el-col :span="7">
			<el-input-number 
				v-model="computedPercentage" 
				controls-position="right" 
				size="medium"
				:min="1" 
				:max="100">
			</el-input-number>	
		</el-col>
		<el-col :span="3">
			<el-button 
				type="text" 
				icon="el-icon-delete"
				@click="$emit('delete', index)"	
			>
			</el-button>
		</el-col>
	</el-row>
</template>

<script>
	export default {
		name: 'CargoFlow',
		props: ['index', 'cargoFlowOptions', 'serviceProformaCargoFlow' ],
		computed: {
			computedCargoFlow: {
				get() { return this.serviceProformaCargoFlow.cargo_flow.name ? this.serviceProformaCargoFlow.cargo_flow.name : null },
				set(newCargoFlow) { 
					console.log(newCargoFlow);
					this.$emit('cargoFlowChanged', newCargoFlow.value, this.index) 
				}
			},
			computedPercentage: {
				get() { return this.serviceProformaCargoFlow.percentage },
				set(newPercentage) { this.$emit('cargoFlowPercentageChanged', newPercentage, this.index) }
			},
		}
	}
</script>

<style lang="scss">
	.cargo-flow-item {
		padding-bottom: 0px;
		padding-top: 0px;
		.el-input-number--medium {
			width: 100%;
		}
	}
</style>
