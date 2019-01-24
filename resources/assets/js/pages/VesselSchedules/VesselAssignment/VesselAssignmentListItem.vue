<template>
	<el-collapse-item :name="computedIndex" v-loading="loading">
		<template slot="title">
			<div class="vessel-assignment-list-item-title" :class="{ 'is-weak' : !computedVesselsAssigned }">
				<ServiceName :name="service.name"></ServiceName>
				<div class="vessel-assignment-list-item-title__vessels-assigned">{{ computedVesselsAssigned + ' of ' + service.service_round_trips.length + ' assigned' }}</div>
			</div>
		</template>
		<el-row
			v-for="(service_round_trip,index) in service.service_round_trips"
			:gutter="20" 
			:key="service_round_trip.id"
			class="round-trip-row"
			>
			<el-col :span="6">
				<div>{{ service_round_trip.current_service_schedule ? service_round_trip.current_service_schedule.port.name : 'no port' }}</div>
			</el-col>
			<el-col :span="6">
				<Date :date="getArrivalDate(service_round_trip)"></Date>
			</el-col>
			<el-col :span="6">
				<span :class="{ 'is-weak' : !service_round_trip.vessel }">
					{{ service_round_trip.vessel ? service_round_trip.vessel.name : 'no vessel' }}
				</span>
				<el-button 
					v-if="service_round_trip.vessel" 
					type="text" 
					icon="el-icon-close"
					@click="unassignVessel(index)"
					>
				</el-button>
			</el-col>
			<el-col :span="6">
				<a :href="'/administrator/vessel-schedules/vessel-assignment/' + service_round_trip.id">
					<el-button class="link" type="text" size="mini">ASSIGN VESSEL</el-button>
				</a>
			</el-col>
		</el-row>
	</el-collapse-item>
</template>

<script>
	import Date from 'root/components/Time/Date.vue'
	import ServiceName from 'root/components/ServiceName.vue'
	import FadedLine from 'root/components/Tables/FadedLine.vue'
	export default {
		name: 'VesselAssignmentListItem',
		components: { Date, ServiceName, FadedLine },
		props: [
			'service', 'index'
		],
		data() {
			return {
				loading: false,
			}
		},
		computed: {
			computedIndex() {
				return parseInt(this.index);
			},
			computedVesselsAssigned() {
				let vesselCount = 0;
				for(let i = 0; i < this.service.service_round_trips.length; i++) {
					if(this.service.service_round_trips[i].vessel) vesselCount++;
				}
				return vesselCount 
			}
		},
		methods: {
			getArrivalDate(service_round_trip) {
				return service_round_trip.current_service_schedule ? service_round_trip.current_service_schedule.arrival_date.date : null;
			},
			unassignVessel(index) {
				const data = { 'imo_number': null }
				this.loading = true
	            axios.post('/api/v1/vessel-schedules/vessel-assignment/' + this.service.service_round_trips[index].id, data)
					.then(response => {
						this.loading = false;
						this.$emit('assignmentRemoved', this.index, index)
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
	.vessel-assignment-list-item-title
		align-items: center	
		display: flex
		justify-content: space-between		
		&__vessels-assigned
			font-size: $g-txt-tiny
			margin-right: 20px
	.round-trip-row
		display: flex
		align-items: center
		background-color: #fafafa
		border-bottom: 1px solid #f3f3f3
		font-size: $g-txt-small 
		padding: 8px 30px
		&:last-child
			border: none
</style>
