<template>
	<div class="service-schedule-row" :class="{ 'current' : schedule.current | schedule.monitored_port }">
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
				<span v-if="schedule.distance">{{ 'next port: ' + schedule.distance + 'nm ' + schedule.speed_required + 'kn required' }}</span>
				<span v-else>-</span>
			</el-col>
			<el-col	:span="14" class="time-row">
				<div class="date-type">Dep</div>	
				<Date :date="schedule.departure_date.date"></Date>
				<Duration :duration="schedule.hours_at_sea"></Duration>
			</el-col>
		</el-row>
	</div>
</template>

<script>
    import Date from 'root/components/Time/Date.vue'
    import Duration from 'root/components/Time/Duration.vue'

	export default {
		name: 'ServiceScheduleRow',
		components: { Date, Duration },
		props: [ 'schedule' ]
	}
</script>

<style lang="sass">
	@import '~variables'

	.date-type
		display: inline-block
		width: 30px
		text-align: right
		margin-right: 6px
		font-size: $g-txt-small
		font-weight: bold
</style>
