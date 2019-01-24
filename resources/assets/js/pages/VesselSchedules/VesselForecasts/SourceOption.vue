<template>
	<div class="ee-source-option">
		<div class="ee-source-option__top">
			<div class="ee-pill ee-pill--bordered" :class="computedLevel">{{ option.level }}</div>
			<span class="ee-source-option__carrier">{{ option.company ? option.company : 'eeSea' }}</span>

			<div class="ee-source-option__scrape-date">
				<eeDate :date="computedScrapeDate" class="ee-source-option__value"></eeDate>
			</div>
		</div>

		<div class="ee-source-option__bottom">
			<span class="ee-source-option__type">{{ computedLabel }}</span>
			<eeDate 
				v-if="option.type === 'DATE' || option.type === 'AIS_ETA' || option.type === 'CALCULATED_ETA'" 
				:date="option.value.date"
				class="ee-source-option__value"
				>
			</eeDate>
			<eeDuration 
				v-else 
				:duration="option.value"
				class="ee-source-option__value"
				>
			</eeDuration>
		</div>
	</div>
</template>

<script>
	import eeDate from 'root/components/Time/eeDate.vue'
	import eeDuration from 'root/components/Time/eeDuration.vue'

	export default {
		name: 'SourceOption',
		components: { eeDate, eeDuration },
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
			computedLevel() {
				return this.option.level ? 'is-' + this.option.level : ''
			},
			computedScrapeDate() {
				return this.option.created_at !== undefined ? this.option.created_at.date : null
			}
		}
	}
</script>
