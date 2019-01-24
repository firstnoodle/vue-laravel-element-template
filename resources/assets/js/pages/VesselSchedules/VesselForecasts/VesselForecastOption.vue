<template>
	<div class="vessel-forecast-option">
		<div class="vessel-forecast-option__level">{{ option.level }}</div>
		<div class="vessel-forecast-option__company hide-line">{{ option.company ? option.company : 'eeSea' }}</div>

		<div v-if="option.company" class="vessel-forecast-option__label">{{ computedLabel }}</div>
		<div v-else class="vessel-forecast-option__label">{{ computedLabel }}</div>
		
		<div v-if="option.type === 'DATE' || option.type === 'AIS_ETA' || option.type === 'CALCULATED_ETA'" :span="10" class="vessel-forecast-option__value">
			<Date :date="option.value.date"></Date>
		</div>
		<div v-else class="vessel-forecast-option__value">
			<Duration :duration="option.value"></Duration>
		</div>
	</div>	
</template>

<script>
	import Date from 'root/components/Time/Date.vue'
	import Duration from 'root/components/Time/Duration.vue'
	export default {
		name: 'VesselForecastOption',
		components: { Date, Duration },
		props: [ 'option', 'optionType' ],
		computed: {
			computedLabel() {
				if(this.option.type == 'DATE') {
					return this.optionType
				} else if(this.option.type == 'DURATION') {
					return this.optionType == 'Arrival' ? 'Sea hours' : 'Port hours'
				} else if(this.option.type == 'CALCULATED_ETA') {
					return 'CALC_ETA'	
				} else { // AIS_ETA
					return this.option.type		
				}
				return '-'
			},
		},
		mounted() {
		}
	}
</script>

<style lang="sass">
	@import '~variables'

	.vessel-forecast-option
		align-items: center
		display: flex
		font-size: $g-txt-tiny
		height: 100%
		width: 100%

	.vessel-forecast-option__level
		flex-basis: 10%

	.vessel-forecast-option__company
		flex-basis: 25%
		font-weight: bold

	.vessel-forecast-option__label
		flex-basis: 25%
		white-space: nowrap

	.vessel-forecast-option__value
		color: $g-action-blue
		flex-basis: 40%

		& > .table-duration
			color: $g-action-blue

</style>
