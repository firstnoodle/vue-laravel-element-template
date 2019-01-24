<template>
	<el-container 
		direction="vertical" 
		v-loading="loading"
		class="forecast-table"
		>
		
		<div class="forecast-table">
			 <!-- HEADER --> 
			<div class="forecast-table__header forecast-row">
				<h4>{{ assigned_vessel.name + ' &rarr; ' + monitored_port.name + ' &rarr; ' + service }}</h4>
			</div>
			<div class="forecast-table__header forecast-row">
				<div class="forecast-column forecast-column--port">Port</div>
				<div class="forecast-column forecast-column--source">Source</div>
				<div class="forecast-column forecast-column--result">Result</div>
				<div class="forecast-column forecast-column--proforma">
					<span>Proforma</span>
					<span style="float:right">Deviation</span>
				</div>
				<div class="forecast-column forecast-column--previous">
					<span>Previous forecast</span>
					<span style="float:right">Deviation</span>
				</div>
			</div>

			 <!-- CONTENT --> 
			<div class="forecast-table__content">
				<ForecastPortRow
					v-for="leg,index in legs" 
					v-if="index !== legs.length-1"
					:index="index"
					:leg="leg"
					:key="genUniqueKey(leg)"
					@arrivalSourceChange="onArrivalSourceChange"
					@departureSourceChange="onDepartureSourceChange"
				></ForecastPortRow>	
				<ForecastMonitoredPortRow
					v-if="legs"
					:index="legs.length-1"
					:leg="legs[legs.length-1]"
					@arrivalSourceChange="onArrivalSourceChange"
				></ForecastMonitoredPortRow>
			</div>
		</div>
		<div style="width: 1080px; margin-top: 20px; display: flex; justify-content:center;">
			<el-button 
				type="primary" 
				size="medium" 
				:disabled="!schedule_complete" 
				:loading="approving"
				@click="onApprove"
				>
				APPROVE
				</el-button>
		</div>
	</el-container>
</template>

<script>
	import ForecastPortRow from './ForecastPortRow.vue'
	import ForecastMonitoredPortRow from './ForecastMonitoredPortRow.vue'

	export default {
		name: 'VesselForecastEditor',
		components: { ForecastPortRow, ForecastMonitoredPortRow },
		props: [
			'windowTitle',
			'forecast_ids',
			'visible'
		],
		data() {
			return {
				approving: false,
				assigned_vessel: null,
				id: null,
				loading: false,
				monitored_port: null,
				service: null,
				legs: null,
				previousSchedule: true, // will be set to false if any of the legs has no previous_vessel_leg @onOpen
				schedule_complete: false,
				service_round_trip_id: null,
				service_proforma_id: null,
			}
		},
		computed: {},
		mounted() {
			const path = window.location.pathname.split('/')
			this.service_round_trip_id = path[4]
			this.service_proforma_id = path[5]
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
					let previousSchedule = []
					// we add an initial ZERO as the first leg doesnt' have arrival duration, but we want the arrays to match up lengthwise
					let proformaSeaHours = [0]
					let previousSeaHours = []

					this.legs = packet.vessel_forecast_legs.map(port => {
						// inject result objects
						port.arrival.result = {
							date: null,
							duration: null
						}
						port.departure.result = {
							date: null,
							duration: null
						}

						// temporarily store proformaSeaHours for proforma req_speed
						for(let i = 0; i < port.sources.arrival.length; i++) {
							if(port.sources.arrival[i].level === 'L3' && port.sources.arrival[i].type === 'DURATION' && i > 0) {
								proformaSeaHours.push(parseFloat(port.sources.arrival[i].value))
							}
						}

						// temporarily store previous schedule sources for calculating full previous schedule further down
						if(port.previous_vessel_leg) {
							let previousLeg = {
								arrival: { duration: null, date: null },
								departure: { duration: null, date: null }
							}
							if(port.previous_vessel_leg.arrival.source.type === 'DURATION') {
								previousLeg.arrival.duration = parseFloat(port.previous_vessel_leg.arrival.source.value)
							} else { 
								// experienced a case where value was null
								if(port.previous_vessel_leg.arrival.source.value) previousLeg.arrival.date = moment(port.previous_vessel_leg.arrival.source.value.date).format('YYYY-MM-DD HH:mm:ss')
							}
							if(port.previous_vessel_leg.departure.source.type === 'DURATION') { 
								previousLeg.departure.duration = parseFloat(port.previous_vessel_leg.departure.source.value)
							} else { 
								if(port.previous_vessel_leg.departure.source.value.date) previousLeg.departure.date = moment(port.previous_vessel_leg.departure.source.value.date).format('YYYY-MM-DD HH:mm:ss')
							}
							previousSchedule.push(previousLeg)
						}
						return port
					})

					if(previousSchedule.length) {
						this.previousSchedule = false	
						// calculate full previous schedule
						previousSchedule.map((port,index) => {
							// sea_hours -> (arr_date - prev_dep_date) 
							if(!port.arrival.duration && index > 0) {
								// check if we have both values needed to make the calculation
								if(port.arrival.date && previousSchedule[index-1].departure.date) {
									let prev_departure_date = moment(previousSchedule[index-1].departure.date)
									let arrival_date = moment(port.arrival.date)
									port.arrival.duration = moment.duration(arrival_date.diff(prev_departure_date)).asHours()
								}
							}
							// arrival date -> (prev_dep_date + sea_hours) 
							if(!port.arrival.date && index > 0) {
								// check if we have both values needed to make the calculation
								if(previousSchedule[index-1].departure.date && port.arrival.duration) {
									let prev_departure_date = moment(previousSchedule[index-1].departure.date)
									let sea_hours = port.arrival.duration
									port.arrival.date = prev_departure_date.add(sea_hours, 'hours').format('YYYY-MM-DD HH:mm:ss')
								}
							}
							// port_hours -> (dep_date - arr_date)
							if(!port.departure.duration && index !== previousSchedule.length-1) {
								// check if we have both values needed to make the calculation
								if(port.arrival.date && port.departure.date) {
									let arrival = moment(port.arrival.date)
									let departure = moment(port.departure.date)
									port.departure.duration = moment.duration(departure.diff(arrival)).asHours()
								}
							}
							// departure date -> (arr_date + port_hours)
							if(!port.departure.date && index !== previousSchedule.length-1) {
								// check if we have both values needed to make the calculation
								if(port.arrival.date && port.departure.duration) {
									let arrival_date = moment(port.arrival.date)
									let port_hours = port.departure.duration
									port.departure.date = arrival_date.add(port_hours, 'hours').format('YYYY-MM-DD HH:mm:ss')
								}
							}
							// temporarily store previousSeaHours for previous req_speed
							previousSeaHours.push(port.departure.duration)

							this.legs[index].previous_forecast_leg = port
						})
					}

					// calculate and assign proforma req_speed and previous req_speed
				 	for(let i = 0; i < this.legs.length; i++) { 
						if(i > 0) {
							this.legs[i-1].proforma_req_speed = this.legs[i-1].distance / proformaSeaHours[i]
							this.legs[i-1].proforma_req_speed_deviation = null
							if(this.previousSchedule) this.legs[i-1].previous_req_speed = this.legs[i-1].distance / previousSeaHours[i]
							else this.legs[i-1].previous_req_speed = null
							this.legs[i-1].previous_req_speed_deviation = null
						}
					}
					
					this.loading = false
					this.validateSchedule()
				}).catch(error => {
					console.log(error)
					this.loading = false
				})
			},
			onArrivalSourceChange(index, newArrivalSource) {
				this.legs[index].arrival.source = newArrivalSource
				this.validateSchedule()
			},
			onDepartureSourceChange(index, newDepartureSource) {
				this.legs[index].departure.source = newDepartureSource
				this.validateSchedule()
			},
			validateSchedule() {
				let incomplete = 0
				this.legs.map((port,index) => {
					// check if arrival has a source
					// assign source to result (date or duration) and set the other to null
					if(port.arrival.source) {
						if(port.arrival.source.type === 'DATE' || port.arrival.source.type === 'AIS_ETA' || port.arrival.source.type === 'CALCULATED_ETA') {
							port.arrival.result.date = port.arrival.source.value.date
							port.arrival.result.duration = null
						} else if(port.arrival.source.type === 'DURATION') {
							if(index > 0) port.arrival.result.duration = port.arrival.source.value
							else console.error('DURATION should not be available as source for arrival on the first port')
							port.arrival.result.date = null
						}
					}

					// check if departure has a source
					// assign source to result (date or duration) and set the other to null
					if(port.departure.source) {
						if(port.departure.source.type === 'DATE') {
							port.departure.result.date = port.departure.source.value.date	
							port.departure.result.duration = null
						} else if(port.departure.source.type === 'DURATION') {
							port.departure.result.duration = port.departure.source.value
							port.departure.result.date = null
						}
					}

					// calculate values if they exist
					// sea_hours 		-> (arr_date - prev_dep_date) 
					// arrival date 	-> (prev_dep_date + sea_hours) 
					// port_hours 		-> (dep_date - arr_date)
					// departure date 	-> (arr_date + port_hours)

					// sea_hours -> (arr_date - prev_dep_date) 
					if(!port.arrival.result.duration && index > 0) {
						// check if we have both values needed to make the calculation
						if(port.arrival.result.date && this.legs[index-1].departure.result.date) {
							let prev_departure_date = moment(this.legs[index-1].departure.result.date)
							let arrival_date = moment(port.arrival.result.date)
							port.arrival.result.duration = moment.duration(arrival_date.diff(prev_departure_date)).asHours()
						}
					}

					// arrival date -> (prev_dep_date + sea_hours) 
					if(!port.arrival.result.date && index > 0) {
						// check if we have both values needed to make the calculation
						if(this.legs[index-1].departure.result.date && port.arrival.result.duration) {
							let prev_departure_date = moment(this.legs[index-1].departure.result.date)
							let sea_hours = port.arrival.result.duration
							port.arrival.result.date = prev_departure_date.add(sea_hours, 'hours').format('YYYY-MM-DD HH:mm:ss')
						}
					}

					// port_hours -> (dep_date - arr_date)
					if(!port.departure.result.duration && index !== this.legs.length-1) {
						// check if we have both values needed to make the calculation
						if(port.arrival.result.date && port.departure.result.date) {
							let arrival = moment(port.arrival.result.date)
							let departure = moment(port.departure.result.date)
							port.departure.result.duration = moment.duration(departure.diff(arrival)).asHours()
						}
					}
					
					// departure date -> (arr_date + port_hours)
					if(!port.departure.result.date && index !== this.legs.length-1) {
						// check if we have both values needed to make the calculation
						if(port.arrival.result.date && port.departure.result.duration) {
							let arrival_date = moment(port.arrival.result.date)
							let port_hours = port.departure.result.duration
							port.departure.result.date = arrival_date.add(port_hours, 'hours').format('YYYY-MM-DD HH:mm:ss')
						}
					}

					// req speed
					if(index > 0) {
						if(port.arrival.result.duration && this.legs[index-1].distance) {
							this.legs[index-1].speed_required = this.legs[index-1].distance / port.arrival.result.duration
							this.legs[index-1].proforma_req_speed_deviation = this.legs[index-1].speed_required - this.legs[index-1].proforma_req_speed
							if(this.previousSchedule) this.legs[index-1].previous_req_speed_deviation = this.legs[index-1].speed_required - this.legs[index-1].previous_req_speed
						}
					}
					
					// validate port
					let valid = 0
					if(index !== this.legs.length-1) {
						if(index !== 0 && (!port.arrival.result.duration || port.arrival.result.duration <= 0)) valid++;
						if(!port.arrival.result.date) valid++;
						if(!port.departure.result.duration || port.departure.result.duration <= 0) valid++;
						if(!port.departure.result.date) valid++;
					} else {
						if(!port.arrival.result.duration || port.arrival.result.duration <= 0) valid++;
						if(!port.arrival.result.date) valid++;
					}
					if(valid) incomplete++
				})
				this.schedule_complete = (incomplete === 0)
				console.log('Schedule complete: ' + this.schedule_complete + ' [' + incomplete + ' incomplete]')
			},
			onApprove() {
				this.approving = true
				let data = {}
				data.id = this.id
				data.vessel_forecast_legs = this.legs.map(port => {
					let arr = {
						company: port.arrival.source.company,
						id: port.arrival.source.id,
						type: port.arrival.source.type,
						level: port.arrival.source.level,
						value: {
							date: port.arrival.source.type === 'DURATION' ? port.arrival.result.date : port.arrival.source.value.date,
							timezone: port.port.time_zone
						}
					}
					let dep = {
						company: port.departure.source.company,
						id: port.departure.source.id,
						type: port.departure.source.type,
						level: port.departure.source.level,
						value: {
							date: port.departure.source.type === 'DURATION' ? port.departure.result.date : port.departure.source.value.date,
							timezone: port.port.time_zone
						}
					}
					return {
						arrival: arr,
						departure: dep,
						id: port.id,
						port: port.port,
						service_schedule_id: port.service_schedule_id
					}
				})
				data.service_round_trip_id = this.service_round_trip_id
				data.service_proforma_id = this.service_proforma_id
				axios.post('/api/v1/vessel-schedules/forecast/' + this.service_round_trip_id + '/' + this.service_proforma_id, data).then(response => {
					window.location.href = '/administrator/vessel-schedules/forecasts';
				}).catch(error => {
					this.$alert('Message: ' + error.response.data.message, 'Error: ' + error.response.status + ' ' + error.response.statusText, {
						confirmButtonText: 'OK',
						type: 'error'
					});
					this.approving = false
				})
			}
		}
	}
</script>
