<template>
	<el-container class="VesselScheduleReport paper" direction="vertical" v-loading="loading">
		<el-row :gutter="0" class="table-header" style="border-bottom: none">
			<el-col :span="20" class="table-header__flex-col">
				<div class="icon-label">
					<IconVessel></IconVessel>
					<span class="icon-label__label">{{ assigned_vessel ? assigned_vessel.name : '' }}</span>
				</div>
				<div class="icon-label">
					<IconAnchor></IconAnchor>
					<span class="icon-label__label">{{ monitored_port ? monitored_port.name : '' }}</span>
				</div>
				<div class="icon-label">
					<IconService></IconService>
					<span class="icon-label__label">
						<ServiceName :name="service" :showVersion="false"></ServiceName>
					</span>
				</div>
			</el-col> 
			<el-col :span="4" class="table-header__flex-col">
				<!-- SELECT PREVIOUS FORECASTS -->
			</el-col>
		</el-row>
		<el-row 
			style="font-size: 10px; font-weight: bold; color: #333; border-bottom: 1px solid #e6e6e6; margin-top: 8px; padding-bottom: 8px;"
			:gutter="0"
		>
			<el-col :span="7" style="padding-left: 10px">Port</el-col>
			<el-col :span="8">
				<el-row 
					:gutter="0" 
					style="width:100%;">
					<el-col :span="10" style="padding-left: 10px">
						Arr / Dep
					</el-col>
					<el-col :span="14">
						Deviation
					</el-col>
				</el-row>
			</el-col>
			<el-col :span="9">
				<el-row 
					:gutter="0" 
					style="width:100%;">
					<el-col :span="12" style="padding-left: 10px">
						Port / Sea hours
					</el-col>
					<el-col :span="12">
						Deviation
					</el-col>
				</el-row>
			</el-col>
		</el-row>
		<VesselForecastDetailsRow 
			v-for="leg,index in schedule" 
			:index="index"
			:leg="leg"
			:key="genUniqueKey(leg)"
		></VesselForecastDetailsRow>
	</el-container>
		
	</el-container>
</template>

<script>
	import IconAnchor from 'root/elements/Icons/IconAnchor.vue'
	import IconService from 'root/elements/Icons/IconService.vue'
	import IconVessel from 'root/elements/Icons/IconVessel.vue'
	import ServiceName from 'root/components/ServiceName.vue'
	import VesselForecastDetailsRow from './VesselForecastDetailsRow.vue'

	export default {
		name: 'VesselForecastDetails',
		components: { IconAnchor, IconService, IconVessel, ServiceName, VesselForecastDetailsRow },
		props: [],
		data() {
			return {
				assigned_vessel: null,
				id: null,
				loading: false,
				monitored_port: null,
				service: null,
				schedule: null,
				schedule_complete: false,
				service_round_trip_id: null,
				service_proforma_id: null,
			}
		},
		computed: {

		},
		mounted() {
			const path = window.location.pathname.split('/')
			this.service_round_trip_id = path[3]
			this.service_proforma_id = path[4]
			this.loadSchedule()	
		},
		methods: {
			loadSchedule() {
				this.assigned_vessel = null
				this.id = null
				this.monitored_port = null
				this.service = null
				this.schedule = null

				this.loading = true
				axios.get('/api/v1/vessel-schedules/forecast/' + this.service_round_trip_id + '/' + this.service_proforma_id).then(response => {
					const packet = response.data.data
					this.assigned_vessel = packet.vessel
					this.id = packet.id
					this.monitored_port = packet.port
					this.service = packet.service_version.name
					this.schedule = packet.vessel_forecast_legs.map(port => {
						// temp hack due to inconsistent datastructure on front and backend
						port.arrival.result = {
							date: null,
							duration: null
						}
						port.departure.result = {
							date: null,
							duration: null
						}
						return port
					})
					this.loading = false
					this.validateSchedule()
				}).catch(error => {
					this.$alert('Message: ' + error.response.data.message, 'Error: ' + error.response.status + ' ' + error.response.statusText, {
						confirmButtonText: 'OK',
						type: 'error'
					});
					this.loading = false
				})
			},
			validateSchedule() {
				let incomplete = 0
				this.schedule.map((port,index) => {
					if(port.arrival.source) {
						if(port.arrival.source.type === 'DATE' || port.arrival.source.type === 'AIS_ETA' || port.arrival.source.type === 'CALCULATED_ETA') {
							port.arrival.result.date = port.arrival.source.value.date
							port.arrival.result.duration = null
						} else if(port.arrival.source.type === 'DURATION') {
							if(index > 0) this.schedule[index-1].departure.result.duration = port.arrival.source.value
							else console.error('DURATION should not be available as source for arrival on the first port')
							port.arrival.result.date = null
						}
					}
					if(port.departure.source) {
						if(port.departure.source.type === 'DATE') {
							port.departure.result.date = port.departure.source.value.date	
							port.departure.result.duration = null
						} else if(port.departure.source.type === 'DURATION') {
							port.arrival.result.duration = port.departure.source.value
							port.departure.result.date = null
						}
					}

					// calculate values if they exist
					// arrival date 	-> (prev_dep_date + prev_dep_duration) 
					// port_hours 		-> (dep_date - arr_date)
					// departure date 	-> (arr_date + arr_duration)
					// sea_hours 		-> (next_arr_date - dep_date) 

					// arrival date
					if(!port.arrival.result.date && index > 0) {
						if(this.schedule[index-1].departure.result.date && this.schedule[index-1].departure.result.duration) {
							let prev_date = moment(this.schedule[index-1].departure.result.date)
							let prev_duration = this.schedule[index-1].departure.result.duration
							port.arrival.result.date = prev_date.add(prev_duration, 'hours')
						}
					}
					// port_hours
					if(!port.arrival.result.duration) {
						if(port.arrival.result.date && port.departure.result.date) {
							let arrival = moment(port.arrival.result.date)
							let departure = moment(port.departure.result.date)
							port.arrival.result.duration = moment.duration(departure.diff(arrival)).asHours()
						}
					}
					
					// departure stuff: only if we are not at last index
					if(index != this.schedule.length-1) {
						// departure date
						if(!port.departure.result.date) {
							if(port.arrival.result.date && port.arrival.result.duration) {
								let arrival = moment(port.arrival.result.date)
								port.departure.result.date = arrival.add(port.arrival.result.duration, 'hours')
							}
						}
						// sea hours
						if(!port.departure.result.duration) {
							if(this.schedule[index+1].arrival.source) {
								const type = this.schedule[index+1].arrival.source.type
								if((type === 'DATE' || type === 'AIS_ETA' || type === 'CALCULATED_ETA') && port.departure.result.date) {
									let departure = moment(port.departure.result.date)
									let next_arrival = moment(this.schedule[index+1].arrival.source.value.date)
									port.departure.result.duration = moment.duration(next_arrival.diff(departure)).asHours()
								} else if(this.schedule[index+1].arrival.source.type === 'DURATION') {
									port.departure.result.duration = this.schedule[index+1].arrival.source.value
								}
								// req_speed
								if(port.departure.result.duration && port.distance) {
									port.speed_required = port.distance / port.departure.result.duration
								}
							}
						}
					}
					
					// validate port
					let valid = 0
					if(index !== this.schedule.length-1) {
						if(!port.arrival.result.date) valid++;
						if(!port.arrival.result.duration || port.arrival.result.duration <= 0) valid++;
						if(!port.departure.result.date) valid++;
						if(!port.departure.result.duration || port.departure.result.duration <= 0) valid++;
					} else {
						if(!port.arrival.result.date) valid++;
					}
					if(valid) incomplete++
				})
				this.schedule_complete = (incomplete == 0)
				//console.log('Schedule complete: ' + this.schedule_complete + ' [' + incomplete + ' incomplete]')
			},
		}
	}
</script>

<style lang="sass">

</style>
