<template>
	<el-container class="VesselAssignment paper" direction="vertical" v-loading="loading">
		<!-- HEADERS -->
		<el-row :gutter="0">	
			<!-- HEADER 1 -->
			<el-row :gutter="0" class="table-header">
				<el-col :span="12" class="table-header__flex-col table-border-left">
					<ServiceName :name="service_version.name"></ServiceName>
				</el-col> 
				<el-col :span="12" class="table-header__flex-col">
					<el-row :gutter="0" class="selected-vessel">
						<div class="selected-vessel__left">
							<span class="is-strong" :class="{ 'is-active' : computedAssignButton }">{{ computedSelectedVesselName }}</span> 
							<span class="is-tiny is-weak">{{ computedSelectedVesselIMO }}</span> 
						</div>
						<div class="selected-vessel__right">
							<div class="selection-position">
								{{ (selected_vessel+1) + ' of ' + vessels.length}} 
							</div>
							<el-button-group class="prev-next">
								<el-button type="default" size="mini" icon="el-icon-arrow-left" @click="onVesselChange('dec')"></el-button>
								<el-button type="default" size="mini" icon="el-icon-arrow-right" @click="onVesselChange('inc')"></el-button>
							</el-button-group>
							<el-button class="link" type="primary" size="mini" @click="onLink" :disabled="computedAssignButton">ASSIGN</el-button>
						</div>
					</el-row>
				</el-col> 
			</el-row>
			<!-- HEADER 2 -->
			<el-row :gutter="0" class="table-header">
				<el-col :span="12" class="table-header__flex-col table-border-left">
					<strong>L3 </strong> Service Schedule	
				</el-col> 
				<el-col :span="12" class="table-header__flex-col">
					<el-select 
						v-model="computedCarrier"
						class="table-header-dropdown">
						<el-option
							v-for="(carrier, index) in carriers"
							:key="carrier.id"
							:label="carrier.name"
							:value="index">
						</el-option>
					</el-select>

					<a :href="computedCarrierUrl" class="icon-button icon-button--grey">
						<IconOpenLink></IconOpenLink>
					</a>
				</el-col> 
			</el-row>
		</el-row>

		<!-- DATA -->
		<el-row :gutter="0">	
			<!-- L3 Service Schedule -->
			<el-col :span="12" class="table-border-left">
				<ServiceScheduleRow 
					v-for="service_schedule in service_schedules" 
					:key="service_schedule.id" 
					:schedule="service_schedule">
				</ServiceScheduleRow>
			</el-col>
			<!-- L2 Carrier Schedules -->
			<el-col :span="12">
				<div 
					v-for="schedule in computedSelectedServiceCarrierSchedules" 
					:key="schedule.id" 
					:schedule="schedule" 
					:class="{ 'current' : schedule.current }"
					class="service-schedule-row" >
					<!-- Line 1 -->
					<el-row :gutter="0" class="line">
						<el-col :span="10">
							<strong>{{ schedule.port.name }}</strong>
							<span v-if="schedule.port.type" class="is-tiny is-weak">{{ '[' +  schedule.port.type + ']' }}</span>
						</el-col>
						<el-col	:span="14" class="time-row">
							<div class="date-type">Arr</div>	
							<Date :date="schedule.arrival_date.date"></Date>
							<Duration :duration="schedule.hours_in_port"></Duration>
						</el-col>
					</el-row>
					<!-- Line 2 -->
					<el-row :gutter="0" class="line">
						<el-col :span="10" class="is-tiny hide-line">
							<span>{{ schedule.voyage_no }}</span>
						</el-col>
						<el-col	:span="14" class="time-row">
							<div class="date-type">Dep</div>	
							<Date :date="schedule.departure_date.date"></Date>
							<Duration :duration="schedule.hours_at_sea"></Duration>
						</el-col>
					</el-row>
				</div>
			</el-col>
		</el-row>
	</el-container>
</template>

<script>
    import Date from 'root/components/Time/Date.vue'
    import Duration from 'root/components/Time/Duration.vue'
    import IconOpenLink from 'root/elements/Icons/IconOpenLink.vue'
    import ServiceName from 'root/components/ServiceName.vue'
    import ServiceScheduleRow from 'root/components/Tables/ServiceScheduleRow.vue'
    
	export default {
		name: 'VesselAssignment',
		components: { Date, Duration, IconOpenLink, ServiceName, ServiceScheduleRow  },
		data() {
			return {
				assigned_vessel: null,
				loading: false,
				carrier_schedules: [],
				round_trip_id: null,
				carriers: [],
				selected_carrier: 0,
				selected_vessel: 0,
				service_schedules: [],
				service_carrier_schedules: [],
				service_version: '',
				vessels: [],
			}
		},
		computed: {
			computedCarrier: {
				get() { return this.carriers.length > 0 ? this.carriers[this.selected_carrier].name : null },
				set(newCarrier) { 
					this.selected_carrier = newCarrier;
				}
			},
			computedCarrierUrl() {
				return this.carriers.length > 0 ? this.carriers[this.selected_carrier].website : null
			},
			computedSelectedServiceCarrierSchedules() {
				return this.carriers.length > 0 ? this.carriers[this.selected_carrier].service_carrier_schedules : {};
			},
			computedSelectedVesselName() {
				return this.vessels.length > 0 ? this.vessels[this.selected_vessel].name : null; 
			},
			computedSelectedVesselIMO() {
				return this.vessels.length > 0 ? ' [' + this.vessels[this.selected_vessel].imo_number + ']' : null; 
			},
			computedAssignButton() {
				return this.vessels.length > 0 && this.assigned_vessel ? (this.vessels[this.selected_vessel].imo_number === this.assigned_vessel.imo_number) : false
			},
		},
		mounted() {
			// change to round_trip_id	
            this.round_trip_id = window.location.pathname.split('/')[4]
            this.loading = true
            axios.get('/api/v1/vessel-schedules/vessel-assignment/' + this.round_trip_id)
				.then(response => {
					this.service_schedules = response.data.data.service_schedules
					this.service_version = response.data.data.service_version
					this.vessels = response.data.data.vessels
					this.assigned_vessel = response.data.data.vessel
					// set selected_vessel if one is already assigned
					if(this.assigned_vessel) {
						this.vessels.map((vessel,index) => {
							if(vessel.imo_number === this.assigned_vessel.imo_number) this.selected_vessel = index
						})
					}
					this.selectVessel()
		            this.loading = false
				})
				.catch(error => {
		            this.loading = false
				});
		},
		methods: {
			onVesselChange(direction) {
				let currSelectedVessel = this.selected_vessel;
				currSelectedVessel = direction === 'inc' ? ++currSelectedVessel : --currSelectedVessel;
				this.selected_vessel = utils.wrapRange(currSelectedVessel, this.vessels.length);
				this.selectVessel();
			},
			selectVessel() {
				// check if there are any carriers on the new selected_vessel
				if(this.vessels[this.selected_vessel].carriers.length) {
					this.carriers = this.vessels[this.selected_vessel].carriers;
				} else {
					this.carriers = [];
				}

				// this.selected_carrier = this.vessels[this.selected_vessel].carriers[this.computedCarrierAcronym];
			},
			onLink() {
				const data = { 'imo_number': this.vessels[this.selected_vessel].imo_number };
				this.loading = true;
	            axios.post('/api/v1/vessel-schedules/vessel-assignment/' + this.round_trip_id, data)
					.then(response => {
						window.location.href = '/administrator/vessel-schedules/vessel-assignments';
						this.loading = false;
					})
					.catch(error => {
						this.loading = false;
					});
			}
		}
	}
</script>
<style lang="sass">
	@import '~variables'

	$row-spacing: 8px
	$line-spacing: 2px
	$side-padding: 10px

	.VesselAssignment 
		font-size: $g-txt-small
		
		.cell
			padding: $row-spacing $side-padding
		
		.selected-vessel
			width: 100%
			.is-active
				color: $g-action-blue
		.selected-vessel__left
			display: inline-block
			width: 50%
		.selected-vessel__right
			align-items: center
			display: inline-flex
			flex-direction: row
			justify-content: flex-end
			width: 49%
			.selection-position
				display: inline-block
				text-align: right
				margin-right: 10px
				font-weight: bold
			.prev-next
				margin-right: 10px
			.link
				float: right

		.header 
			padding: $row-spacing $side-padding 
			font-weight: bold
		
		.is-tiny
			font-size: $g-txt-tiny
		.port 
			font-size: $g-txt-small
			font-weight: bold

</style>
