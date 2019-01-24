<template>

	<el-dialog
		:title="windowTitle"
		:visible.sync="computedVisible"
		width="50%"
		@open="onOpen"
		@close="$emit('onCancel')"
		>	

		<!-- User -->
		<el-row :gutter="10" class="form-row">
			<el-col :span="24" class="form-label">
				Subscriber <span style="font-weight:regular">{{ selectedUser ? ' - ' + selectedUser.email : null }}</span>
			</el-col>
			<el-col :span="24">
				<el-select 
					v-model="computedSelectedUser"
					class="dropdown"
					filterable
					remote	
					:remote-method="userRemoteMethod"
					:loading="loadingUsers"
					placeholder="Subscriber"
					style="width:100%"
					@change="onUserSelect"
				>
					<el-option
						v-for="user in user_list"
						:key="user.id"
						:label="user.name"
						:value="user">
					</el-option>
				</el-select>
			</el-col>
		</el-row>

		<!-- Email -->
		<el-row :gutter="10" class="form-row">
			<el-col :span="24" class="form-label">
				Alternative email
			</el-col>
			<el-col :span="24">
				<el-input 
					placeholder="Alternative email (optional)" 
					v-model="alternativeEmail" 
					@blur="validateAlternativeEmail"
					:class="{ 'input-warning' : !alternativeEmailValid }"		
				>
				</el-input>
			</el-col>
		</el-row>

		<!-- Service -->
		<el-row :gutter="10" class="form-row">
			<el-col :span="24" class="form-label">
				Service	
			</el-col>
			<el-col :span="24">
				<el-select 
					v-model="computedSelectedService"
					class="dropdown"
					filterable
					remote	
					:remote-method="serviceRemoteMethod"
					:loading="loadingServices"
					placeholder="Service"
					style="width:100%"
					@change="onServiceSelect"
				>
					<el-option
						v-for="service in service_list"
						:key="service.id"
						:label="service.name"
						:value="service">
					</el-option>
				</el-select>
			</el-col>
		</el-row>

		<!-- Proforma (PORT) -->
		<el-row :gutter="10" class="form-row">
			<el-col :span="24" class="form-label">
				Port
			</el-col>
			<el-col :span="24">
				<el-select 
					v-model="computedSelectedProforma"
					class="dropdown"
					filterable
					:loading="loadingProformas"
					:placeholder="portPlaceholder"
					style="width:100%"
					@change="onProformaSelect"
				>
					<el-option
						v-for="proforma in proforma_list"
						:key="proforma.id"
						:label="proforma.port"
						:value="proforma">
					</el-option>
				</el-select>
			</el-col>
		</el-row>

		<!-- Vessel -->
		<el-row :gutter="10" class="form-row">
			<el-col :span="24" class="form-label">
				Vessel
			</el-col>
			<el-col :span="24">
				<el-select 
					v-model="computedSelectedVessel"
					class="dropdown"
					filterable
					:loading="loadingVessels"
					:placeholder="vesselPlaceholder"
					style="width:100%"
					@change="onVesselSelect"
				>
					<el-option
						v-for="vessel in vessel_list"
						:key="vessel.imo_number"
						:label="vessel.name"
						:value="vessel">
					</el-option>
				</el-select>
			</el-col>
		</el-row>

		<!-- Responsible User -->
		<el-row :gutter="10" class="form-row">
			<el-col :span="24" class="form-label">
				Responsible
			</el-col>
			<el-col :span="24">
				<el-select 
					v-model="computedSelectedResponsibleUser"
					class="dropdown"
					filterable
					placeholder="Responsible user (optional)"
					style="width:100%"
					@change="onResponsibleUserSelect"
				>
					<el-option
						v-for="user in responsible_user_list"
						:key="user.id"
						:label="user.name"
						:value="user">
					</el-option>
				</el-select>
			</el-col>
		</el-row>

		<!-- Reference -->
		<el-row :gutter="10" class="form-row">
			<el-col :span="24" class="form-label">
				Reference
			</el-col>
			<el-col :span="24">
				<el-input
  					placeholder="Add reference"
  					v-model="reference"
  					clearable
					>
				</el-input>
			</el-col>
		</el-row>
		<!-- DATES 
		<el-row :gutter="10">
			<el-col :span="24">
				<el-date-picker
					class="datepickr"
					prefix-icon="blank"
					v-model="computedStartDate"
					type="date"
					placeholder="YYYY-MM-DD"
					:picker-options="pickerOptions"
				>
				</el-date-picker>
			</el-col>
		</el-row>

		<el-row :gutter="10">
			<el-col :span="24">
				<el-date-picker
					class="datepickr"
					prefix-icon="blank"
					v-model="computedEndDate"
					type="date"
					placeholder="YYYY-MM-DD"
					:picker-options="pickerOptions"
				>
				</el-date-picker>
			</el-col>
		</el-row>
		DATES -->

		<!-- FOOTER -->
		<span slot="footer" class="dialog-footer">
			<el-button @click="$emit('onCancel')">Cancel</el-button>
			<el-button type="primary" @click="onSave" :disabled="computedSaveEnabled" :loading="saving">Save</el-button>
		</span>
	</el-dialog>
</template>

<script>
	export default {
		name: 'EditSubscription',
		props: [
			'windowTitle',
			'subscription',
			'visible'
		],
		data() {
			return {
				alternativeEmailValid: false,
				alternativeEmail: null,
				loadingProformas: false,
				loadingServices: false,
				loadingUsers: false,
				loadingVessels: false,
        		pickerOptions: { firstDayOfWeek: 1 },
				portPlaceholder: 'Choose service first',
				reference: '',
				saving: false,
				//selectedStartDate: null,
				//selectedEndDate: null,
				selectedProforma: null,
				selectedResponsibleUser: null,
				selectedService: null,
				selectedUser: null,
				selectedVessel: null,
				service_list: [],
				proforma_list: [],
				responsible_user_list: [],
				user_list: [],
				vessel_list: [],
				vesselPlaceholder: 'Choose service first',
			}
		},
		computed: {
			computedSelectedProforma: {
				get() { return this.selectedProforma ? this.selectedProforma.port : null },
				set(newProforma) { this.selectedProforma = newProforma }
			},
			computedSelectedResponsibleUser: {
				get() { return this.selectedResponsibleUser ? this.selectedResponsibleUser.name : null },
				set(newResponsibleUser) { this.selectedResponsibleUser = newResponsibleUser }
			},
			computedSaveEnabled() {
				return !(this.selectedUser && this.selectedService && this.selectedProforma && this.alternativeEmailValid)
			},
			computedSelectedService: {
				get() { return this.selectedService ? this.selectedService.name : null },
				set(newService) { this.selectedService = newService }
			},
			computedSelectedUser: {
				get() { return this.selectedUser ? this.selectedUser.name : null },
				set(newUser) { this.selectedUser = newUser }
			},
			computedSelectedVessel: {
				get() { return this.selectedVessel ? this.selectedVessel.name : null },
				set(newVessel) { this.selectedVessel = newVessel }
			},
			computedVisible: {
				get() {
					return this.visible
				},
				set(newVisible) {
					this.$emit('editDialogChanged', newVisible)
				}
			},
			/*
			computedStartDate: {
				get() { return this.selectedStartDate ? this.selectedStartDate.split(' ')[0] : null },
				set(newDate) { this.selectedStartDate = moment(newDate).format("YYYY-MM-DD") }
			},
			computedEndDate: {
				get() { return this.selectedEndDate ? this.selectedEndDate.split(' ')[0] : null },
				set(newDate) { this.selectedEndDate = moment(newDate).format("YYYY-MM-DD") }
			},
			*/
		},
		created() {
			axios.get('/api/v1/responsible-users')
				.then(response => {
					this.responsible_user_list = response.data.data.map(user => {
						return {
							id: user.id,
							name: user.name,
							email: user.email,
							company: user.company,
						}
					})
				})
		},
		methods: {
			validateAlternativeEmail() {
  				var re = /^(([^<>()[\]\\.,:\s@\"]+(\.[^<>()[\]\\.,:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  				this.alternativeEmailValid = this.alternativeEmail ? re.test(this.alternativeEmail) : true
			},
			onOpen() {
				this.proforma_list = []
				this.reference = ''
				this.vessel_list = []
				this.portPlaceholder = 'Choose service first'

				this.selectedUser = !this.subscription ? null : {
					id: this.subscription.user.id,
					name: this.subscription.user.name,
					company: this.subscription.user.company,
					email: this.subscription.user.email,
				}
				this.alternativeEmail = !this.subscription ? null : this.subscription.email
				this.selectedService = !this.subscription ? null : {
					id: this.subscription.service_version.id,
					name: this.subscription.service_version.name
				}
				this.selectedProforma = !this.subscription ? null : {
					id: this.subscription.service_proforma.id,
					port: '[' + this.subscription.service_proforma.order_no + '] ' + this.subscription.service_proforma.port.name + ' (' + this.subscription.service_proforma.port.code + ')',
					port_code: this.subscription.service_proforma.port.code
				}
				this.selectedVessel = !this.subscription || !this.subscription.vessel ? null : {
					imo_number: this.subscription.vessel.imo_number,
					name: this.subscription.vessel.name
				}
				this.selectedResponsibleUser = !this.subscription ? null : !this.subscription.responsible_user ? null : {
					id: this.subscription.responsible_user.id,
					name: this.subscription.responsible_user.name
				}
				this.reference = !this.subscription ? '' : this.subscription.reference

				if(this.subscription) { 
					this.loadProformas()
					this.loadVessels()
				}
				this.validateAlternativeEmail()
			},
			onUserSelect(user) { this.selectedUser = user },
			userRemoteMethod(query) {
				if(query && query.length) {
					this.loadingUsers = true
					axios.get('/api/v1/users?q=' + query)
						.then(response => {
							this.loadingUsers = false
							this.user_list = response.data.data.map(user => {
								return {
									id: user.id,
									name: user.name,
									email: user.email,
									company: user.company,
								}
							})
						})
				}
			},
			// when a service version has been selected - load the proformas for that service version
			onServiceSelect(service) {
				this.selectedProforma = null
				this.proforma_list = null
				this.selectedService = service
				this.loadProformas()
				this.loadVessels()
			},
			onProformaSelect(proforma) { this.selectedProforma = proforma },
			loadProformas() {
				// load service proformas - ie ports
				this.loadingProformas = true
				this.portPlaceholder = 'Loading ports...'
				axios.get('/api/v1/service-proformas?service_version_id=' + this.selectedService.id)
					.then(response => {
						this.loadingProformas = false
						this.portPlaceholder = 'Select a port.'
						this.proforma_list = response.data.data.map(proforma => {
							return {
								id: proforma.id,
								order_no: proforma.order_no,
								port: '[' + proforma.order_no + '] ' + proforma.port.name + ' (' + proforma.port.code + ')',
								port_code: proforma.port.code,
							}
						})
					})
			},
			onVesselSelect(vessel) { this.selectedVessel = vessel },
			loadVessels() {
				// load service proformas - ie ports
				this.loadingVessels = true
				this.vesselPlaceholder = 'Loading vessels...'
				axios.get('/api/v1/vessels?service_version_id=' + this.selectedService.id)
					.then(response => {
						this.loadingVessels = false
						this.vesselPlaceholder = 'Select a vessel.'
						this.vessel_list = response.data.data.map(vessel => {
							return {
								imo_number: vessel.imo_number,
								name: vessel.name,
							}
						})
					})
			},
			serviceRemoteMethod(query) {
				if(query && query.length) {
					this.loadingServices = true
					axios.get('/api/v1/service-versions?q=' + query)
						.then(response => {
							this.loadingServices = false
							this.service_list = response.data.data.map(service => {
								return {
									id: service.id,
									name: service.name
								}
							})
						})
				}
			},
			onResponsibleUserSelect(user) { this.selectedResponsibleUser = user },
			onSave() {
				let data = {
					email: this.alternativeEmail ? this.alternativeEmail : null,
					id: this.subscription ? this.subscription.id : null,
					reference: this.reference,
					responsible_user_id: this.selectedResponsibleUser ? this.selectedResponsibleUser.id : null,
					service_proforma_id: this.selectedProforma.id,
					user_id: this.selectedUser.id,
					imo_number: this.selectedVessel ? this.selectedVessel.imo_number : null,
				}
				let url_str = '/api/v1/vessel-schedules/subscription/'
				let url  = this.subscription ? url_str + this.subscription.id : url_str
				this.saving = true
				axios.post(url, data)
					.then(response => {
						this.saving = false
						this.$emit('subscriptionSaved', response.data.data, (!this.subscription))
					}).catch(error => {
						this.saving = false
						Raven.captureException(new Error(JSON.stringify(error.response)))
						this.$notify({
							title: 'Error',
							message: 'There was an error trying to save the subscription',
							position: 'bottom-right',
							type: 'error'
						});
					})
			}
		}
	}
</script>

<style lang="scss">
	.input-warning > input {
		border-color: red
	}
</style>
