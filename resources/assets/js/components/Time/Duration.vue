<template>
	<div v-if="duration != null" class="duration" :class="{ 'is-negative' : computedIsNegative }">
		<div class="duration__days">{{ computedIsNegative ? '-' : '' }}{{ computedDays }}d</div>
		<div class="duration__hours">{{ computedHours }}h</div>
		<div class="duration__minutes">{{ computedMinutes }}m</div>
	</div>
	<div v-else class="duration is-weak is-unbreakable">
		no duration
	</div>
</template>

<script>
	export default { 
		name: 'Duration', 
		props: [ 'duration' ],
		computed: {
			computedDays() { return this.duration != null ? this.getDays() : null },
			computedHours() { return this.duration != null ? this.getHours() : null },
			computedMinutes() { return this.duration != null ? this.getMinutes() : null },
			computedIsNegative() { return this.duration < 0 }
		},
		methods: {
			getDays() { return this.prependZero(moment.duration(parseFloat(this.duration), 'hours').days(), true) },
			getHours() { return this.prependZero(moment.duration(parseFloat(this.duration), 'hours').hours(), false) },
			getMinutes() { return this.prependZero(moment.duration(parseFloat(this.duration), 'hours').minutes(), false) },
            prependZero(value, prependSig) { 
				const unsignedValue = Math.abs(value).toString()
				return unsignedValue.split('')[1] ? unsignedValue : '0' + unsignedValue
			},
		}
	}
</script>

<style lang="sass">
	@import '~variables'

	.duration
		color: $g-txt-weak
		display: inline-block
		white-space: nowrap
		&.is-active
			color: $g-dark-blue
		&.is-negative, &.is-negative .is-active
			color: red

	.duration__days
		display: inherit
		width: 24px
		text-align: right

	.duration__hours
		display: inherit
		width: 24px
		text-align: right

	.duration__minutes
		display: inherit
		width: 28px
		text-align: right
</style>
