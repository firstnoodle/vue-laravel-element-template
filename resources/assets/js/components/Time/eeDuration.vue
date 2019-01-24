<template>
	<div v-if="duration != null" class="ee-duration" :class="{ 'is-negative' : computedIsNegative }">
		<div class="ee-duration__days">{{ computedIsNegative ? '-' : '' }}{{ computedDays }}d</div>
		<div class="ee-duration__hours">{{ computedHours }}h</div>
		<div class="ee-duration__minutes">{{ computedMinutes }}m</div>
	</div>
	<div v-else class="ee-duration is-weak is-unbreakable">
		no duration
	</div>
</template>

<script>
	export default { 
		name: 'eeDuration', 
		props: [ 'duration' ],
		computed: {
			computedDays() { return this.duration != null ? this.getDays() : null },
			computedHours() { return this.duration != null ? this.getHours() : null },
			computedMinutes() { return this.duration != null ? this.getMinutes() : null },
			computedIsNegative() { return this.duration < 0 }
		},
		methods: {
			getDays() { 
				const duration = parseFloat(this.duration)
				const days = moment.duration(duration, 'hours').asDays()
				const roundToZero = days > 0 ? Math.floor(days) : Math.ceil(days)
				return this.prependZero(roundToZero, true) 
			},
			getHours() { return this.prependZero(moment.duration(parseFloat(this.duration), 'hours').hours(), false) },
			getMinutes() { return this.prependZero(moment.duration(parseFloat(this.duration), 'hours').minutes(), false) },
            prependZero(value, prependSig) { 
				const unsignedValue = Math.abs(value).toString()
				return unsignedValue.split('')[1] ? unsignedValue : '0' + unsignedValue
			},
		}
	}
</script>
