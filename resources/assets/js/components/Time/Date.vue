<template>
	<div v-if="parsed._isValid" class="table-date">
		<div class="table-date__day">{{ formatDate('ddd') }}</div>
		<div class="table-date__date">{{ formatDate('DD') }}</div>
		<div class="table-date__month">{{ formatDate('MMM') }}</div>
		<div class="table-date__time">{{ formatDate('HH:mm') }}</div>
	</div>
	<div v-else class="table-date is-weak is-unbreakable">
		{{ computedErrorMessage }}		
	</div>
</template>
<script>
	export default { 
		name: 'Date', 
		props: [ 'date' ],

		computed: {
			parsed() {
				return moment(this.date)
			},
			computedErrorMessage() {
				return this.date ? 'date is invalid' : 'no date'
			}
		},

		methods: { 
			formatDate(format) { return this.parsed.format(format) } 
		}
	}
</script>

<style lang="sass">
	@import '~variables'
	.table-date
		display: inline-block
		white-space: nowrap
		&.is-active
			color: $g-dark-blue 

	.table-date__day
		display: inherit
		width: 1.83em  // 22px
		text-align: left

	.table-date__date
		display: inherit
		width: 1.67em // 20px
		text-align: right
		margin-right: 4px

	.table-date__month
		display: inherit
		width: 2.08em // 25px
		text-align: left

	.table-date__time
		display: inherit
		width: 2.67em // 32px
		text-align: right
</style>
