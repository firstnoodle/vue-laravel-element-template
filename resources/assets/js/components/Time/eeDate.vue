<template>
	<div v-if="parsed._isValid" class="ee-date">
		<div class="ee-date__day">{{ formatDate('ddd') }}</div>
		<div class="ee-date__date">{{ formatDate('DD') }}</div>
		<div class="ee-date__month">{{ formatDate('MMM') }}</div>
		<div class="ee-date__time">{{ formatDate('HH:mm') }}</div>
	</div>
	<div v-else class="ee-date is-weak is-unbreakable">
		{{ computedErrorMessage }}		
	</div>
</template>
<script>
	export default { 
		name: 'eeDate', 
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
