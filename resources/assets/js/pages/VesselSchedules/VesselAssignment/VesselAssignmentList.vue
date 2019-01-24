<template>
	<el-container class="SubscriptionList paper" v-loading="loadingVesselSchedules">
		<el-main>
			<el-collapse accordion 
				v-model="activeNames" 
				>
				<VesselAssignmentListItem 
					v-for="(service,index) in subscribed_services" 
					:index="index"
					:key="index"
					:service="service"
					@assignmentRemoved="onAssignmentRemoved"
				>
				</VesselAssignmentListItem>
			</el-collapse>
		</el-main>
	</el-container>
</template>

<script>
	import VesselAssignmentListItem from './VesselAssignmentListItem'
	export default {
		name: 'VesselAssignmentList',
		components: { VesselAssignmentListItem },
		data() {
			return {
				loadingVesselSchedules: false,
				subscribed_services: [],
				showUnassigned: true,
				activeNames: ['1']
			}
		},
		computed: {
		},
		mounted() {
			this.loadingVesselSchedules = true;
			axios.get('/api/v1/vessel-schedules/vessel-assignments')
				.then(response => {
					this.loadingVesselSchedules = false;
					this.subscribed_services = response.data.data;
				})
				.catch(error => {
					this.loadingVesselSchedules = false;
				});
		},
		methods: {
			showItem(item) {
				return (this.showUnassigned || item.vessel);
			},
			onAssignmentRemoved(serviceIndex, roundTripIndex) {
				this.subscribed_services[serviceIndex].service_round_trips[roundTripIndex].vessel = null
			}
		}
	}
</script>
