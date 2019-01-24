
<template>
  	<div id="service-version-companies">
		<ServiceVersionCompany v-if="serviceVersionCompanies != null" v-for="(serviceVersionCompany, index) in serviceVersionCompanies" 
			:key="serviceVersionCompany.id"
			:id="serviceVersionCompany.id"
			:index="index"
			:companyOptions="companyOptions" 
			:company="serviceVersionCompany.company" 
			:partnerRoleOptions="partnerRoleOptions"
			:partner_role="serviceVersionCompany.partner_role"
   			:code="serviceVersionCompany.code"
	  		:name="serviceVersionCompany.name"
	 		:percentage="serviceVersionCompany.percentage"
		    @propChange="updateProp"
			@deleteServiceVersionCompany="deleteItem">
		</ServiceVersionCompany>
		<div class="row">
			<div class="col-md-10 percentage-label">
				Percentage total	
			</div>
			<div class="col-md-2">
				<div class="row">
					<div class="col-md-9">
						<div class="percentage-total" :class="{ success : total == 100 }">{{ total }} %</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row margin-4">
			<div class="col-md-10">
				<button class="btn-plus" @click="newServiceVersionCompany"></button>
			</div>
		</div>
		<div class="row margin-4">
			<div class="col-md-10">
				<div class="console" :class="{ warning : errors.errors }">
					<p>{{ errors.messages }}</p>
				</div>
			</div>
			<div class="col-md-2">
				<div class="row margin-4">
					<div class="col-md-9">
						<button class="btn btn-primary btn-block" :disabled="!(total == 100 && !companyDuplicates && !emptyFields)" @click="save">SAVE</button>
					</div>
				</div>
			</div>
		</div>
  	</div>
</template>

<script>
	import ServiceVersionCompany from './ServiceVersionCompany.vue'

	export default {
  		name: 'ServiceVersionCompanies',
		components: {ServiceVersionCompany},
		props: [],
  		data () {
    		return {
				serviceVersion: null,
				companyError: false ,
				percentageError: true ,
				emptyFieldError: true,
				ajaxMessage: null,
				serviceVersionCompanies: [],
				companyOptions: [],
				partnerRoleOptions: [
					"Vessel Provider",
					"Alliance Partner",
					"Slot Charterer",
					"N/A"
				]
    		}
  		},
		mounted() {
			// Get Companies
			this.ajaxMessage = "Fetching data...";
			axios.get('/api/v1/companies')
				.then(response => {
					for(var company in response.data) {
						if(response.data.hasOwnProperty(company)) {
							this.companyOptions.push({code: company, name: response.data[company]});
						}
					}
				});
			
			// Get ServiceVersionCompanies
			this.serviceVersion = window.location.pathname.split('/').slice(-1)[0];
			axios.get('/api/v1/service/version/' + this.serviceVersion + '/companies')
				.then(response =>  {
					this.importServiceVersionCompanies(response.data.data);
					this.ajaxMessage = null;
				});
		},
		computed: {
			allGood() {
				(total == 100 && !companyDuplicates && !emptyFields);
			},
			total() {
				let total = 0;
				for(var i = 0; i < this.serviceVersionCompanies.length; i++) {
					if(this.serviceVersionCompanies[i].percentage) total += parseInt(this.serviceVersionCompanies[i].percentage);	
				}
				return total;
			},
			total100() {
				return total == 100;
			},
			companyDuplicates() {
				// check if there are any duplicate companies
				let duplicates = [];
				for(var i = 0; i < this.serviceVersionCompanies.length; i++) {
					let test = this.serviceVersionCompanies[i].id;
					for(var j = 0; j < this.serviceVersionCompanies.length; j++) {
						if(i != j && this.serviceVersionCompanies[j].id != null && test == this.serviceVersionCompanies[j].id) {
							if(!this.arrayContains(duplicates, j)) duplicates.push(j);
						}
					}
				}
				
				// check if any fields are empty
				// check if percentage is 100
				return (duplicates.length > 0);
			},
			emptyFields() {
				for(var i = 0; i <  this.serviceVersionCompanies.length; i++) {
					for(var key in this.serviceVersionCompanies[i]) {
						if(key != 'partner_role' && key != 'id') {
							if(this.serviceVersionCompanies[i][key] == null || this.serviceVersionCompanies[i][key] == "") {
								return true;
							}
						}
					}
				}
				return false;
			},
			errors() {
				let errorMessages = [];
				let str = '';
				let error = { errors: false, messages: '' };
				if(this.companyDuplicates) errorMessages.push('Same company appears in multiple places');
				if(this.total != 100) errorMessages.push('Total percentage doesn\'t equal 100');
				if(this.emptyFields) errorMessages.push('One or several fields are empty');

				if(errorMessages.length) {
					for(var i = 0; i < errorMessages.length; i++) {
						str += errorMessages[i];
						if(errorMessages.length > 1 && i != (errorMessages.length-1)) str += ' & ';
					}
					error.errors = true;
				} else if(this.ajaxMessage != null) {
					str = this.ajaxMessage;
				} else {
					str = 'Everything is good. Go ahead and save →'
				}

				error.messages = str;
				return error;
			}
		},
		methods: {
			importServiceVersionCompanies(serviceVersionCompanies) {
				for(var i = 0; i < serviceVersionCompanies.length; i++) {

					// temp fix... database values are CAPITALIZED_AND_WTH_UNDERSCORE. We want no underscores and only first letter cap.
					if(this.partnerRoleOptions.indexOf(serviceVersionCompanies[i].partner_role) === -1) {
						if(serviceVersionCompanies[i].partner_role === null) {
							serviceVersionCompanies[i].partner_role = 'N/A';
						} else {
							let parsed = _.startCase(serviceVersionCompanies[i].partner_role.replace('_', ' ').toLowerCase());
							if(this.partnerRoleOptions.indexOf(parsed) !== -1) {
								serviceVersionCompanies[i].partner_role = parsed;
							}
						}
					}				
					// parse percentage to a number
					serviceVersionCompanies[i].percentage = parseInt(serviceVersionCompanies[i].percentage);
					this.serviceVersionCompanies.push(serviceVersionCompanies[i]);
				}
			},
			updateProp(prop) {
				// let index = this.serviceVersionCompanies.findIndex(x => x.id==prop.id);
				// if percentage make sure we pass on a number (not a string)
				if(prop.key == 'percentage') prop.value = parseInt(prop.value);
				this.serviceVersionCompanies[prop.index][prop.key] = prop.value;
			},
			arrayContains(arr, item) {
				for(var i = 0; i < arr.length; i++) {
					if(arr[i] == item) return true;
				}
				return false;
			},
			deleteItem(id) {
				let index = this.serviceVersionCompanies.findIndex(x => x.id==id);
				Vue.delete(this.serviceVersionCompanies, index);
			},
			newServiceVersionCompany() {
				this.serviceVersionCompanies.push({ 
					id: null, 
					code: '', 
					name: '', 
					partner_role: null, 
					percentage: 0,
					company: null 
				});
			},
			save() {
				let entries = [];
				for(var i = 0; i < this.serviceVersionCompanies.length; i++) {
					let companyData = {};
					companyData.id = this.serviceVersionCompanies[i].id;
					companyData.code = this.serviceVersionCompanies[i].code;
					companyData.name = this.serviceVersionCompanies[i].name;

					// temp fix (associated with importServiceVersionCompanies) to send correct format to DB
					if(this.serviceVersionCompanies[i].partner_role === 'N/A') {
						companyData.partner_role = null;
					} else {
						companyData.partner_role = this.serviceVersionCompanies[i].partner_role.replace(' ', '_').toUpperCase();
					}

					companyData.percentage = '' + this.serviceVersionCompanies[i].percentage;
					companyData.company = this.serviceVersionCompanies[i].company;
					entries.push(companyData);
				}
				// console.Saving...
				this.ajaxMessage = 'Saving...';
				axios.post('/api/v1/service/version/' + this.serviceVersion + '/companies', entries)
					.then(response =>  {
						// console.Success!
						this.ajaxMessage = 'Saved!';
						setTimeout(() => {
							this.ajaxMessage = null;
           				 }, 2000);
					}).catch((error) => {
						if(error.response) {
							// console.error.request
							this.ajaxMessage = error.request;
						} else if(error.request) {
							// console.error.status		
							this.ajaxMessage = error.status;
						} else {
							// console.error.message
							this.ajaxMessage = error.message;
						}
					});
			}
		}
	}
</script>

<style lang="sass">

$text-color: #49BCF5

.new-company
	width: 100%
	height: 34px
	margin-bottom: 16px
	border: none
	border-top: 1px solid #eee
	color: $text-color 
	&:hover
		color: darken($text-color, 20%) 
		background-color: #F5FBFF
		border-top: 1px solid $text-color
	&:focus
		outline: none

.console
	height: 36px
	padding: 8px 12px
	margin-bottom: 16px
	background-color: #DDF5DF
	border: none
	border-radius: 3px
	> p 
		text-align: center
	&.warning
		background-color: #F5F2C4

.percentage-label
	text-align: right

.percentage-total
	padding-right: 9px
	font-weight: bold
	color: red
	text-align: right
	&.success
		color: green

.is-green
	color: green

</style>
