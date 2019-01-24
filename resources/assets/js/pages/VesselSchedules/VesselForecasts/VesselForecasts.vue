<template>
	<div class="data-rows" v-loading="loading">
		<el-row :gutter="10">
			<el-col :span="4">
				<el-select 
					v-model="computedPastDays"
					class="solid-dropdown">
					<el-option
						v-for="days in daysSelect"
						:key="genUniqueKey(days)"
						:label="days"
						:value="days">
					</el-option>
				</el-select>
			</el-col>
			<el-col :span="4">
				<el-select 
					v-model="computedFutureDays"
					class="solid-dropdown">
					<el-option
						v-for="days in daysSelect"
						:key="genUniqueKey(days)"
						:label="days"
						:value="days">
					</el-option>
				</el-select>
			</el-col>
			<el-col :span="1">
				<button 
					class="icon-button icon-button--grey" 
					:class="{ 'is-disabled' : refreshDisabled }" 
					:disabled="refreshDisabled"
					@click="fetchForecasts">
		        	<IconRefresh></IconRefresh>
            	</button>
			</el-col>
			<el-col :span="4" :offset="11">
				<el-select 
					v-model="selectedUser"
					class="solid-dropdown">
					<el-option
						v-for="user in users"
						:key="user.name"
						:label="user.name + '  (' + user.count + ')'"
						:value="user.name">
					</el-option>
				</el-select>
			</el-col>
		</el-row>
		<el-row 
			class="data-rows__header"
			:gutter="0"
		>
			<el-col :span="6">Service</el-col>
			<el-col :span="3">Monitored Port</el-col>
			<el-col :span="3">Next Port</el-col>
			<el-col :span="4">Assigned Vessel</el-col>
			<el-col :span="3">Subscriber</el-col>
			<el-col :span="2">Responsible</el-col>
			<el-col :span="1"></el-col>
			<el-col :span="1"></el-col>
			<el-col :span="1"></el-col>
		</el-row>

		<el-row
			v-for="task in tasks" 
			v-if="showTask(task)"
			:gutter="0"
			:key="genUniqueKey(task)"
			class="data-rows__row"
			>
			<el-col :span="6">
				<FadedLine :fadeWidth="80">
					<ServiceName :name="task.service.name"></ServiceName>
				</FadedLine>
			</el-col>
			<el-col :span="3">
				<div>
					<div>{{ task.user_service_proforma.port.name }}</div>
					<Date :date="task.user_service_proforma.port.arrival_date.date"></Date>
				</div>
			</el-col>
			<el-col :span="3">
				<div>
					<div>{{ getNextPort(task) }}</div>
					<Date :date="task.next_port.eta_at.date"></Date>
				</div>
			</el-col>
			<el-col :span="4">
				<div class="icon-label" v-if="task.vessel">
					<IconVessel></IconVessel>
					<span class="icon-label__label">{{ task.vessel.name }}</span>
				</div>
				<a v-else 
					:href="'/administrator/vessel-schedules/vessel-assignment/' + task.service_round_trip.id">
					assign vessel
				</a>
			</el-col>
			<el-col :span="3">
				{{ task.user_service_proforma.user.name }}<br>
				{{ task.user_service_proforma.user.company }}
			</el-col>
			<el-col :span="2">
				{{ task.responsible_user ? task.responsible_user.name : 'none' }}
			</el-col>
			<el-col :offset="1" :span="1" v-if="task.vessel">
				<a :href="'/administrator/vessel-schedules/vessel-schedule/' + task.service_round_trip.id +'/'+ task.user_service_proforma.service_proforma.id">
					<el-button type="text" icon="el-icon-date" :class="{ 'approved' : forecastStatus(task.vessel_forecast) }"></el-button>
				</a>
			</el-col>
			<el-col :span="1" v-if="task.vessel">
				<a :href="'/evs/forecast/' + task.service_round_trip.id +'/'+ task.user_service_proforma.service_proforma.id">
					<el-button type="text" icon="el-icon-tickets"></el-button>
				</a>
			</el-col>
		</el-row>

		<VesselForecastEditor 
			:visible="vesselForecastEditorVisible"
			:forecast_ids="forecast_ids"
			windowTitle="Forecast Editor"
			@onClose="vesselForecastEditorVisible = false"
			@forecastSaved="onForecastSaved"
		>
		</VesselForecastEditor>
	</div>
</template>

<script>
	import Date from 'root/components/Time/Date.vue'
	import FadedLine from 'root/components/Tables/FadedLine.vue'
	import IconRefresh from 'root/elements/Icons/IconRefresh.vue'
	import IconVessel from 'root/elements/Icons/IconVessel.vue'
	import ServiceName from 'root/components/ServiceName.vue'
	import VesselForecastEditor from './VesselForecastEditor.vue'

	export default { 
		name: 'VesselForecasts', 
		components: { Date, FadedLine, IconRefresh, IconVessel, ServiceName, VesselForecastEditor },
		props: [],

		data() {
			return {
				daysSelect: [5,10,15,20,25,30,35,40,45,50,60,70,80,90,100],
				forecast_ids: {
					service_round_trip_id: null,
					service_proforma_id: null
				},
				futureDays: 30,
				vesselForecastEditorVisible: false,
				loading: false,
				pastDays: 15,
				refreshDisabled: true,
				selectedUser: 'All',
				tasks: [],
				users: [ {
						name: 'All',
						count: 0
					},{ 
						name: 'none',
						count: 0
					}],
			}
		},

		computed: {
			computedPastDays: {
				get() {
					return this.pastDays + ' days before';
				},
				set(newDays) {
					this.pastDays = newDays;
					this.refreshDisabled = false;
				}
			},
			computedFutureDays: {
				get() {
					return this.futureDays + ' days after';
				},
				set(newDays) {
					this.futureDays = newDays;
					this.refreshDisabled = false;
				}
			},
		},

		mounted() {
			this.fetchForecasts();
		},

		methods: {
			fetchForecasts() {
				/*
				this.loading = true;
				this.tasks = [];
				axios.get('/api/v1/vessel-schedules/forecasts?past_days=' + this.pastDays + '&future_days=' + this.futureDays).then(response => {
					this.tasks = response.data.data;
					this.updateUserTaskCount();
					this.refreshDisabled = true;
					this.loading = false;
				}).catch(error => {
					this.$alert('Message: ' + error.response.data.message, 'Error: ' + error.response.status + ' ' + error.response.statusText, {
						confirmButtonText: 'OK',
						type: 'error'
					});
					this.loading = false
				})
				*/
			},
			initUsers() {
				this.tasks.map(task => {	
					if(task.responsible_user) { 
						if(!this.userExists(task.responsible_user.name)) { 
							this.users.push({
								name: task.responsible_user.name,
								count: 0
							});
							// set selectedUser if.. -> default is 'All'
							if(task.responsible_user.current) this.selectedUser = task.responsible_user.name;
						}
					}
				});
			},
			updateUserTaskCount() {
				// there are initially two users in this.users
				if(this.users.length === 2) this.initUsers();
				this.users.map(user => {
					user.count = 0;
					this.tasks.map(task => {
						if(!task.responsible_user) {
							if(user.name === 'none') user.count++
						} else {
							if(task.responsible_user.name == user.name) user.count++;
						}
					});
				});
				// set count for 'All'
				this.users[0].count = this.tasks.length;
			},
			showTask(task) {
				let userName = !task.responsible_user ? 'none' : task.responsible_user.name;
				if(this.selectedUser === userName || this.selectedUser === 'All') return true;
				return false;
			},
			userExists(name) {
				for(let i = 0; i < this.users.length; i++) {
					if(this.users[i].name === name) return true;
				}
				return false;
			},
			getNextPort(task) {
				let port = 'No port'
				if(task.next_port) port = task.next_port.name ? task.next_port.name : port 
				return port + ' (' + task.next_port.type + ')' 
			},
			onOpenForecastEditor(service_round_trip_id, service_proforma_id) {
				this.forecast_ids.service_round_trip_id = service_round_trip_id
				this.forecast_ids.service_proforma_id = service_proforma_id
				this.vesselForecastEditorVisible = true
			},
			onForecastSaved() {
				console.log('saved!')
			},
			forecastStatus(vesselForecast) {
				if(vesselForecast) {
					if(vesselForecast.approved_at) {
						const today = moment()
						const diff = moment.duration(today.diff(vesselForecast.approved_at.date)).asHours()
						return diff < 24
					}
				}
				return false
			}
		}
	}
</script>

<style lang="sass">
	@import '~variables'
	.data-rows
		background-color: white
		padding: 20px
	.data-rows__header
		border-bottom: 1px solid #E6E6E6
		font-size: $g-txt-tiny 
		font-weight: bold
		padding: 0 0 10px 0
		&>*:first-child
			padding-left: 10px
	.data-rows__row			
		background-color: white
		border-bottom: 1px solid #E6E6E6
		font-size: $g-txt-tiny
		height: 50px
		// padding: 14px 10px
		&>*
			align-items: center
			display: flex
			height: 100%
		&:last-child
			border: none
		& .el-button.approved 
			color: #1BB56D
	.solid-dropdown
		height: 36px
		width: 100%
		background-color: #FAFAFA 
		border: none
		font-size: $g-txt-tiny
		margin-bottom: 16px
		& > .el-input 
			height: 100%
			> input 
				background-color: #FAFAFA 
				border: none
				border-radius: 0px
				color: $g-action-blue
				font-size: $g-txt-small
				height: 100%
				padding-left: 6px
				text-align: center
		


</style>
