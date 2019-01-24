<template>
	<el-container class="VesselScheduleReport paper" direction="vertical" v-loading="loading">
		<!-- HEADER 1 -->
		<el-row :gutter="0" class="table-header">
			<el-col :span="24" class="table-header__flex-col">
				<div class="icon-label">
					<IconVessel></IconVessel>
					<span class="icon-label__label">{{ vessel ? vessel.name : '' }}</span>
				</div>
				<div class="icon-label">
					<IconService></IconService>
					<span class="icon-label__label">
						<ServiceName :name="service_version ? service_version.name : null" :showVersion="false"></ServiceName>
					</span>
				</div>
			</el-col> 
		</el-row>
		<!-- HEADER 2 -->
		<el-row :gutter="0" class="table-header">
			<!-- HEADER L3 service_schedules -->
			<el-col :span="12" class="table-header__flex-col table-border-left">
				Service Schedule	
			</el-col> 
			<!-- HEADER L2 service_carrier_schedules -->
			<el-col :span="7" class="table-header table-border-left">
				<el-select 
					v-model="computedServiceCarrierSchedule"
					class="table-header-dropdown"
					>
					<el-option
						v-for="schedule in service_carrier_schedules"
						:key="schedule.name"
						:label="schedule.name"
						:value="schedule">
					</el-option>
				</el-select>
			</el-col> 
			<!-- HEADER L1 vessel_position -->
			<el-col :span="5" class="table-header">
				<el-select 
					v-model="computedVesselPosition"
					class="table-header-dropdown">
					<el-option
						v-for="vessel_position in vessel_position_providers"
						:key="vessel_position.name"
						:label="vessel_position.name"
						:value="vessel_position">
					</el-option>
				</el-select>
			</el-col> 
		</el-row>

		<!-- DATA -->
		<el-row :gutter="0">	
			<!-- DATA L3 service_schedules -->
			<el-col :span="12" class="table-border-left">
				<ServiceScheduleRow v-for="service_schedule in service_schedules" :key="service_schedule.id" :schedule="service_schedule"></ServiceScheduleRow>
			</el-col>
			<!-- DATA L2 selected_service_carrier_schedule -->
			<el-col :span="7" v-if="selected_service_carrier_schedule">
				<div class="service-schedule-row table-border-left" v-for="schedule in selected_service_carrier_schedule.schedules" :key="schedule.id">
					<!-- Line 1 -->
					<el-row :gutter="10" class="line">
						<el-col :span="13" class="hide-line">
							<strong>{{ schedule.port ? schedule.port.name : '' }}</strong>
						</el-col>
						<el-col	:span="11" class="time-row">
							<Date :date="schedule.arrival_date.date"></Date>
						</el-col>
					</el-row>
					<!-- Line 2 -->
					<el-row :gutter="10" class="line">
						<el-col	:span="13" class="time-row">
							<span class="is-weak">voyage </span>{{ schedule.voyage_no }}		
						</el-col>
						<el-col	:span="11" class="time-row">
							<Date :date="schedule.departure_date.date"></Date>
						</el-col>
					</el-row>
				</div>
			</el-col>
			<el-col v-else :span="7">
				No data availbable
			</el-col>
			<!-- DATA L1 selected_vessel_position_provider -->
			<el-col :span="5" :class="{ 'center-center' : !selected_vessel_position_provider }">
				<div v-if="selected_vessel_position_provider">
					<div class="vessel-position-nav">
						<el-button type="text" icon="el-icon-arrow-left" @click="onVesselPositionChange('inc')" :disabled="computedLeftArrow"></el-button>
							<div><Date :date="computedTimeStamp"></Date></div>
						<el-button type="text" icon="el-icon-arrow-right" @click="onVesselPositionChange('dec')" :disabled="computedRightArrow"></el-button>
					</div>
					<!-- Line 1 -->
					<el-row :gutter="10" class="key-value-column">
						<el-col	:span="10" class="key-value-column__keys">
							<div>Last port</div>
						</el-col>
						<el-col	:span="14" class="key-value-column__values">
							<!-- <div>{{ this.selected_vessel_position_provider ? this.selected_vessel_position_provider.positions[this.selected_vessel_position].last_port.name : null }}</div> -->
							<div>{{ computedSelectedVesselPositionProviderLastPort }}</div>
						</el-col>
					</el-row>
					<el-row :gutter="10" class="key-value-column">
						<el-col	:span="10" class="key-value-column__keys">
							<div>Next port</div>
						</el-col>
						<el-col	:span="14" class="key-value-column__values">
							<div>{{ computedSelectedVesselPositionProviderNextPort }}</div>	
						</el-col>
					</el-row>
					<el-row :gutter="10" class="key-value-column">
						<el-col	:span="10" class="key-value-column__keys">
							<div>AIS ETA</div>
						</el-col>
						<el-col	:span="14" class="key-value-column__values">
							<div><Date :date="computedAisETA"></Date></div>
						</el-col>
					</el-row>
					<el-row :gutter="10" class="key-value-column">
						<el-col	:span="10" class="key-value-column__keys">
							<div>Calc ETA</div>
						</el-col>
						<el-col	:span="14" class="key-value-column__values">
							<div><Date :date="computedCalculatedETA"></Date></div>
						</el-col>
					</el-row>
					<el-row :gutter="10" class="key-value-column">
						<el-col	:span="10" class="key-value-column__keys">
							<div>Dist</div>
						</el-col>
						<el-col	:span="14" class="key-value-column__values">
							<div>{{ computedSelectedVesselPositionProviderDistance }}</div>
						</el-col>
					</el-row>
					<el-row :gutter="10" class="key-value-column">
						<el-col	:span="10" class="key-value-column__keys">
							<div>Lat</div>
						</el-col>
						<el-col	:span="14" class="key-value-column__values">
							<div>{{ this.selected_vessel_position_provider ? this.selected_vessel_position_provider.positions[this.selected_vessel_position].latitude : null }}</div>
						</el-col>
					</el-row>
					<el-row :gutter="10" class="key-value-column">
						<el-col	:span="10" class="key-value-column__keys">
							<div>Long</div>
						</el-col>
						<el-col	:span="14" class="key-value-column__values">
							<div>{{ this.selected_vessel_position_provider ? this.selected_vessel_position_provider.positions[this.selected_vessel_position].longitude : null }}</div>
						</el-col>
					</el-row>
					<el-row :gutter="10" class="key-value-column">
						<el-col	:span="10" class="key-value-column__keys">
							<div>Speed</div>
						</el-col>
						<el-col	:span="14" class="key-value-column__values">
							<div>{{ this.selected_vessel_position_provider ? this.selected_vessel_position_provider.positions[this.selected_vessel_position].ais.speed : null }}</div>
						</el-col>
					</el-row>
					<el-row :gutter="10" class="key-value-column">
						<el-col	:span="10" class="key-value-column__keys">
							<div>Course</div>
						</el-col>
						<el-col	:span="14" class="key-value-column__values">
							<div>{{ this.selected_vessel_position_provider ? this.selected_vessel_position_provider.positions[this.selected_vessel_position].ais.course : null }}</div>
						</el-col>
					</el-row>
					<el-row :gutter="10" class="key-value-column">
						<el-col	:span="10" class="key-value-column__keys">
							<div>Heading</div>
						</el-col>
						<el-col	:span="14" class="key-value-column__values">
							<div>{{ this.selected_vessel_position_provider ? this.selected_vessel_position_provider.positions[this.selected_vessel_position].ais.heading : null }}</div>
						</el-col>
					</el-row>
				</div>
				<div v-else>
					No AIS data availbable
				</div>
			</el-col>
		</el-row>
	</el-container>
</template>

<script>
    import Date from 'root/components/Time/Date.vue'
    import Duration from 'root/components/Time/Duration.vue'
    import IconOpenLink from 'root/elements/Icons/IconOpenLink.vue'
    import IconService from 'root/elements/Icons/IconService.vue'
    import IconVessel from 'root/elements/Icons/IconVessel.vue'
    import ServiceName from 'root/components/ServiceName.vue'
    import ServiceScheduleRow from 'root/components/Tables/ServiceScheduleRow.vue'

	export default {
		name: 'VesselScheduleReport',
		components: { Date, Duration, IconOpenLink, IconService, IconVessel, ServiceName, ServiceScheduleRow},
		data() {
			return {
				loading: false,
				round_trip_id: null,
				service_version: null,
				service_schedules: [],
				service_carrier_schedules: [],
				selected_service_carrier_schedule: [],
				vessel: null,
				vessel_position_providers: [],
				selected_vessel_position_provider: null,
				selected_vessel_position: 0,
			}
		},
		computed: {
			computedLeftArrow() {
				return this.selected_vessel_position_provider ? this.selected_vessel_position == this.selected_vessel_position_provider.positions.length - 1 : true;
			},
			computedRightArrow() {
				return (this.selected_vessel_position === 0);
			},
			computedServiceCarrierSchedule: {
				get() {
					return this.selected_service_carrier_schedule ? this.selected_service_carrier_schedule.name : '';
				},
				set(newServiceCarrierSchedule) {
					this.selected_service_carrier_schedule = newServiceCarrierSchedule;	
				}
			},
			computedVesselPosition: {
				get() {
					return this.selected_vessel_position_provider ? this.selected_vessel_position_provider.name : '';
				}, 
				set(newVesselPosition) {
					this.selected_vessel_position = 0;
					this.selected_vessel_position_provider = newVesselPosition;
				}
			},
			computedAisETA() { 
				return this.selected_vessel_position_provider ? this.selected_vessel_position_provider.positions[this.selected_vessel_position].ais.eta_at.date : null;
			},
			computedCalculatedETA() { 
				if(this.selected_vessel_position_provider) {
					if(this.selected_vessel_position_provider.positions[this.selected_vessel_position].calculated.eta_at) {
						return this.selected_vessel_position_provider.positions[this.selected_vessel_position].calculated.eta_at.date;
					} 
				}
				return null;
			},
			computedTimeStamp() { 
				return this.selected_vessel_position_provider ? this.selected_vessel_position_provider.positions[this.selected_vessel_position].updated_at.date : null;
			},
			computedSelectedVesselPositionProviderLastPort() {
				if(this.selected_vessel_position_provider) {
					if(this.selected_vessel_position_provider.positions[this.selected_vessel_position].last_port) {
						return this.selected_vessel_position_provider.positions[this.selected_vessel_position].last_port.name;
					}
				}
				return 'none';
			},
			computedSelectedVesselPositionProviderNextPort() {
				if(this.selected_vessel_position_provider) {
					if(this.selected_vessel_position_provider.positions[this.selected_vessel_position].next_port) {
						return this.selected_vessel_position_provider.positions[this.selected_vessel_position].next_port.name;
					}
				}
				return 'none';
			},
			computedSelectedVesselPositionProviderDistance() {
				if(this.selected_vessel_position_provider) {
					if(this.selected_vessel_position_provider.positions[this.selected_vessel_position].calculated.distance_remaining) {
						return this.selected_vessel_position_provider.positions[this.selected_vessel_position].calculated.distance_remaining;
					}
				}
				return 'none';
			}
		},
		mounted() {
			// temp to just fetch some L3 data
			this.loading = true;
            this.round_trip_id = window.location.pathname.split('/')[4];
            axios.get('/api/v1/vessel-schedules/forecast/' + this.round_trip_id)
				.then(response => {
					console.log(response.data.data);
					this.service_schedules = response.data.data.service_schedules;
					this.service_version = response.data.data.service_version;
					this.vessel = response.data.data.vessel;

					// service_carriers comes as an object w key/value pairs
					// we need to change that into an array
					for(let schedule_name in response.data.data.service_carriers) {
						this.service_carrier_schedules.push({
							name: schedule_name,
							schedules: response.data.data.service_carriers[schedule_name].schedules
						});
					}
					this.selected_service_carrier_schedule = this.service_carrier_schedules[0];
					for(let provider in response.data.data.vessel_positions) {
						this.vessel_position_providers.push({
							name: provider,
							positions: response.data.data.vessel_positions[provider]
						});
					}
					this.selected_vessel_position_provider = this.vessel_position_providers.length ? this.vessel_position_providers[this.selected_vessel_position] : null;
					this.loading = false;
				})
				.catch(error => {
					console.log(error.response);
					this.loading = false;
				});
		},
		methods: {
			onVesselPositionChange(direction) {
				let curr_selected_vessel_position = this.selected_vessel_position;
				curr_selected_vessel_position = direction === 'inc' ? ++curr_selected_vessel_position : --curr_selected_vessel_position;
				this.selected_vessel_position = utils.wrapRange(curr_selected_vessel_position, this.selected_vessel_position_provider.positions.length);
			}
		}
	}
</script>

<style lang="sass">
@import '~variables'

.key-value-column
	margin-bottom: 12px

.key-value-column__keys
	font-size: $g-txt-tiny
	font-weight: bold
	text-align: right

.vessel-position-nav
	display: flex
	flex-direction: row
	align-items: center
	justify-content: center
	margin: 16px 0px
	.table-date
		padding: 0px 8px
		color: $g-action-blue

.vessel-schedule-service
	margin-right: 12px
.vessel-schedule-vessel
	font-weight: bold

</style>
