
<template>
	<div class="row m-b-xxs company margin-4">
		<div class="col-md-3" :class="{ highlight : deleteHover }">
			<v-select label="name" :value="company" :options="companyOptions" placeholder="Select company" @input="onCompanyChange"></v-select>
		</div>
		<div class="col-md-2" :class="{ highlight : deleteHover }">
			<v-select :value="partner_role" :options="partnerRoleOptions" placeholder="Select partner role" @input="onPartnerRoleChange"></v-select>
		</div>
		<div class="col-md-1" :class="{ highlight : deleteHover }">
			<input type="text" name="code" placeholder="Service Code" class="form-control" :value="code" @input="onPropChange('code', $event.target.value)">
		</div>
		<div class="col-md-4" :class="{ highlight : deleteHover }">
			<input type="text" name="name" placeholder="Service Name" class="form-control" :value="name" @input="onPropChange('name', $event.target.value)">
		</div>
		<div class="col-md-2">
			<div class="row">
				<div class="col-md-9" :class="{ highlight : deleteHover }">
					<input type="number" name="percentage" placeholder="%" class="form-control" :value="percentage" @change="onPropChange('percentage', $event.target.value)">
				</div>
				<div class="col-md-3">
					<div class="close-container">
						<a class="btn-close" @click="onDelete" @mouseover="deleteHover = true" @mouseout="deleteHover = false">x</a>	
					</div>
				</div>
			</div>
		</div>
	</div>
</template>



<script>
	import vSelect from 'root/components/vue-select/components/Select.vue'
	
	export default {
  		name: 'ServiceVersionCompany',
		components: {vSelect},
		props: {
			'id': Number, 
			'index': Number,
			'company': Object, 
			'companyOptions': Array, 
			'partner_role': String, 
			'partnerRoleOptions': Array, 
			'code': String, 
			'name': String, 
			'percentage': Number
		},
		data() {
			return {
				initialized: false,
				deleteHover: false
			}
		},
		methods: {
			onPropChange(key, value) {
				this.$emit('propChange', { key, value, id: this.id, index: this.index});
			},
			onCompanyChange(val) {
				this.onPropChange('company', val);
			},
			onPartnerRoleChange(val) {
				this.onPropChange('partner_role', val);
			},
			onPercentageChanged(val) {
				this.$emit('percentageChanged');
			},
			onDelete() {
				this.$emit('deleteServiceVersionCompany', this.id);
			}
		}
	}
</script>

<style lang="sass">
		
	$colSpacing: 4px	
	$text-color: #49BCF5
	
	// id is on parent (ServiceVersionCompanies)
	#service-version-companies
		> .company
			input[type="text"], input[type="number"]
				background-color: #F3F3F3
				border: none
				&:hover
					background-color: #EEE
				&:focus
					background-color: #F5FBFF
					border: 1px solid $text-color
					color: darken($text-color, 20%)
			> div 
				padding: 0 4px
				>.row
					margin: 0 -4px
					>div
						height: 36px
						padding: 0 4px
			.close-container
				height: 100%
				display: flex
				align-items: center
				justify-content: center
	
	.highlight 
		opacity: 0.5


</style>
