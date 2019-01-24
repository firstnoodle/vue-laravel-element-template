<template>
	<div class="forecast-port forecast-port--monitored"> 
		<div class="forecast-row">
			
			<div class="forecast-column forecast-column--port">
				<div class="forecast-table__cell is-height-2">
					<div class="port-main">
						<span class="name">{{ leg.port.name }}</span>
						<span class="timezone">{{ leg.port.time_zone }}</span>
					</div>
					<div class="port-meta">
						<span class="code">{{ leg.port.code }}</span>
						<span :class="computedFlagClass"></span> 
					</div>
					<!-- Currently not space for this... will overflow parent container...
					<div class="port-terminal">
						Auckland - Fergusson Container Terminal 
					</div>
					-->
				</div>
			</div>
			
			<div class="forecast-column forecast-column--source">

				<!-- Arrival Dropdown -->
				<div class="forecast-table__cell is-height-2 forecast-table__cell--no-padding">
					<div class="ee-select">
						<eePopper 
							ref="arrivalPopper"
							@hide="onArrivalPopperHide"
							>
							<div class="popper ee-select__dropdown">
								<div 
									v-for="option,index in leg.sources.arrival"
									:key="genUniqueKey(option)"
									class="dropdown-item"
									@click="onArrivalSourceChange(index)"
									>
									<SourceOption 
										v-if="option.level !== 'LX'"
										:option="option" 
										optionType="Arrival"
										>
									</SourceOption>
									<!-- Custom Input -->
									<div 
										v-else
										class="ee-source-option ee-source-option--custom"
										>
										<div class="ee-source-option__top">
											<div class="ee-pill ee-pill--bordered is-LX">LX</div>
											<span class="ee-source-option__carrier">Custom</span>
											<el-switch
												v-model="customArrivalType"
												active-color="#409EFF"
												inactive-color="#409EFF"
												active-text="duration"
												inactive-text="date"
												class="value-type__switch"
												@change="customArrivalTypeChange"
												>
											</el-switch>
										</div>
										<div class="ee-source-option__bottom">
											<el-input
												size="small"
												:placeholder="computedArrivalFormat"
												v-model="customArrivalInput"
												@input="validateArrivalInput"
												class="value-type__input"
												>
											</el-input>
											<el-button
												size="mini"
												type="success"
												:disabled="!customArrivalValid"
												class="value-type__button"
												@click="useCustomArrival" 
												>
												use
											</el-button>
										</div>
									</div>
								</div>
							</div>
							<div slot="reference" class="ee-select__button">
								<div class="ee-source-option">
									<div class="ee-source-option__top">
										<div class="ee-pill ee-pill--bordered" :class="computedArrivalLevelStyle">{{ selectedArrival ? selectedArrival.level : '-' }}</div>
										<span class="ee-source-option__carrier">{{ selectedArrival ? selectedArrival.company : '-' }}</span>
										<div class="arrow-button ee-source-option__source-count">
											<span class="arrow-button__count">{{ leg.sources.arrival.length }}</span>
											<span class="arrow-button__arrow"></span>
										</div>
									</div>
									<div class="ee-source-option__bottom">
										<span class="ee-source-option__type">{{ computedSelectedArrivalType }}</span>
										
										<eeDate 
											v-if="computedSelectedArrivalValue === 'DATE'"	
											:date="selectedArrival.value.date"
											class="ee-source-option__value"
											>
										</eeDate>
										<eeDuration 
											v-else-if="computedSelectedArrivalValue === 'DURATION'" 
											:duration="selectedArrival.value"
											class="ee-source-option__value"
											>
										</eeDuration>
									</div>
								</div>
							</div>
						</eePopper>
					</div><!-- ee-select -->
				</div>
			</div>
			
			<!-- RESULT -->
			<div class="forecast-column forecast-column--result">
				<div class="forecast-table__cell is-height-1">
					<span class="forecast-table__label">Sea hours</span>
					<div v-if="leg.arrival.result.duration > 0" class="ee-pill" :class="computedResultSeaHoursClass">
						<eeDuration :duration="leg.arrival.result.duration"></eeDuration>
					</div>
					<div v-else class="is-error">error</div>
				</div> 
				<div class="forecast-table__cell is-height-1">
					<span class="forecast-table__label">Arrival</span>
					<div class="ee-pill" :class="computedResultArrivalClass">
						<eeDate :date="leg.arrival.result.date"></eeDate>
					</div>
				</div> 
			</div>
			
			<!-- PROFORMA -->
			<div class="forecast-column forecast-column--proforma">
				<div class="forecast-table__cell is-height-1">
					<!-- leg.sources.arrival Level === L3 && Type === DURATION -->
					<eeDuration :duration="proformaSeaHours"></eeDuration>
					<eeDuration :duration="computedProformaSeaHoursDeviation" :class="computedProformaSeaHoursDeviationClass"></eeDuration>
				</div> 
				<div class="forecast-table__cell is-height-1">
					<eeDate :date="proformaArrival"></eeDate>
					<eeDuration :duration="computedProformaArrivalDeviation" :class="computedProformaArrivalDeviationClass"></eeDuration>
				</div> 
			</div>
			
			<!-- PREVIOUS -->
			<div class="forecast-column forecast-column--previous">
				<div class="forecast-table__cell is-height-1">
					<eeDuration :duration="computedPreviousSeaHours"></eeDuration>
					<eeDuration :duration="computedPreviousSeaHoursDeviation" :class="computedPreviousSeaHoursDeviationClass"></eeDuration>
				</div> 
				<div class="forecast-table__cell is-height-1">
					<eeDate :date="computedPreviousArrival"></eeDate>
					<eeDuration :duration="computedPreviousArrivalDeviation" :class="computedPreviousArrivalDeviationClass"></eeDuration>
				</div> 
			</div>
		</div>
	</div>
</template>

<script>
	import eePopper from 'root/components/eePopper.vue'
	import eeDate from 'root/components/Time/eeDate.vue'
	import eeDuration from 'root/components/Time/eeDuration.vue'
	import SourceOption from './SourceOption'

	export default {

		name: 'ForecastMonitoredPortRow',

		components: { eePopper, eeDate, eeDuration, SourceOption },

		props: [ 'index', 'leg' ],

		data () {
			return {
				customArrivalStatus: 'add',
				customArrivalValid: false,
				customArrivalInput: '',
				customArrivalType: false,
				dateTimeRegex: /^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[01]) ([01]\d|2[0-3]):([0-5]\d|2[0-9])$/,
				durationRegex: /^[0-9]{2}:([01]\d|2[0-3]):([0-5]\d|2[0-9])$/, 
				proformaSeaHours: null,
				proformaArrival: null,
				selectedArrival: null,
			}
		},

		computed: {
			computedArrival: {
				get() { return this.leg.arrival.source ? this.leg.arrival.source : null },
				set(newArrivalSource) { this.$emit('arrivalSourceChange', this.index, newArrivalSource) }
			},
			computedSelectedArrivalType() {
				if(this.selectedArrival) {
					if(this.selectedArrival.type == 'DATE') {
						return 'Arrival'
					} else if(this.selectedArrival.type == 'DURATION') {
						return 'Sea hours'
					} else if(this.selectedArrival.type == 'CALCULATED_ETA') {
						return 'CALC_ETA'	
					} else { // AIS_ETA
						return this.selectedArrival.type		
					}
				}
				return '-'
			},
			computedSelectedArrivalValue() {
				if(this.selectedArrival) {
					return this.selectedArrival.type === 'DURATION' ? 'DURATION' : 'DATE'
				}
				return null
			},
			computedArrivalLevelStyle() {
				return this.selectedArrival ? 'is-' + this.selectedArrival.level : ''
			},
			computedProformaSeaHours() {
				for(let source in this.leg.sources.arrival) {
					if(source.level === 'L3' && source.type === 'DURATION') return source.value
					else return null
				}
			},
			computedProformaSeaHoursDeviation() {
				if(this.leg.arrival.result.duration && this.proformaSeaHours) return this.proformaSeaHours - this.leg.arrival.result.duration
				return null
			},
			computedProformaSeaHoursDeviationClass() {
				if(this.computedProformaSeaHoursDeviation !== null) {
					if(this.computedProformaSeaHoursDeviation >= -1 && this.computedProformaSeaHoursDeviation <= 1) return 'is-success'
					if(this.computedProformaSeaHoursDeviation <= -5 || this.computedProformaSeaHoursDeviation >= 5) return 'is-error'
					return 'is-warning'
				}
				return null
			},
			computedProformaArrival() {
				for(let source of this.leg.sources.arrival) {
					if(source.level === 'L3' && source.type === 'DATE') return source.value.date
					else return null
				}
			},
			computedProformaArrivalDeviation() {
				if(this.leg.arrival.result.date && this.proformaArrival) { 
					let arrival = moment(this.leg.arrival.result.date)
					let proforma_arrival = moment(this.proformaArrival)
					return moment.duration(proforma_arrival.diff(arrival)).asHours()
				}
				return null
			},
			computedProformaArrivalDeviationClass() {
				if(this.computedProformaArrivalDeviation !== null) {
					if(this.computedProformaArrivalDeviation >= -1 && this.computedProformaArrivalDeviation <= 1) return 'is-success'
					if(this.computedProformaArrivalDeviation <= -5 || this.computedProformaArrivalDeviation >= 5) return 'is-error'
					return 'is-warning'
				}
				return null
			},
			computedPreviousSeaHours() {
				return this.leg.previous_forecast_leg ? this.leg.previous_forecast_leg.arrival.duration : null
			},
			computedPreviousSeaHoursDeviation() {
				return this.computedPreviousSeaHours && this.leg.arrival.result.duration ? parseFloat(this.leg.arrival.result.duration) - this.computedPreviousSeaHours : null
			},
			computedPreviousSeaHoursDeviationClass() {
				if(this.computedPreviousSeaHoursDeviation !== null) {
					if(this.computedPreviousSeaHoursDeviation >= -1 && this.computedPreviousSeaHoursDeviation <= 1) return 'is-success'
					if(this.computedPreviousSeaHoursDeviation <= -5 || this.computedPreviousSeaHoursDeviation >= 5) return 'is-error'
					return 'is-warning'
				}
				return null
			},
			computedPreviousArrival() {
				return this.leg.previous_forecast_leg ? this.leg.previous_forecast_leg.arrival.date : null
			},
			computedPreviousArrivalDeviation() {
				return this.computedPreviousArrival && this.leg.arrival.result.date ? moment.duration(moment(this.leg.arrival.result.date).diff(moment(this.computedPreviousArrival))).asHours() : null
			},
			computedPreviousArrivalDeviationClass() {
				if(this.computedPreviousArrivalDeviation !== null) {
					if(this.computedPreviousArrivalDeviation >= -1 && this.computedPreviousArrivalDeviation <= 1) return 'is-success'
					if(this.computedPreviousArrivalDeviation <= -5 || this.computedPreviousArrivalDeviation >= 5) return 'is-error'
					return 'is-warning'
				}
				return null
			},
			computedArrivalFormat() { return this.customArrivalType ? 'DD:HH:MM' : 'YYYY-MM-DD HH:MM' },
			computedFlagClass() {
				return this.leg.country ? 'flag-icon flag-icon-' + this.leg.country.code.toLowerCase() : ''
			},
			computedResultSeaHoursClass() {
				if(this.selectedArrival) {
					if(this.selectedArrival.type === 'DURATION') return 'ee-pill--bold is-' + this.selectedArrival.level
				}
				return null
			},
			computedResultArrivalClass() {
				if(this.selectedArrival) {
					if(this.selectedArrival.type === 'DATE' || this.selectedArrival.type === 'AIS_ETA' || this.selectedArrival.type === 'CALC_ETA') {
						return 'ee-pill--bold is-' + this.selectedArrival.level
					}
				}
				return null
			},
		},

		mounted() {
			for(let source of this.leg.sources.arrival) {
				if(source.level === 'L3' && source.type === 'DURATION') this.proformaSeaHours = source.value
				if(source.level === 'L3' && source.type === 'DATE') this.proformaArrival = source.value.date
			}

			// 'init' and then inject custom arrival object 
			this.customArrivalTypeChange()
			this.leg.sources.arrival.push({
				company: 'Custom',
				id: null,
				level: 'LX',
				type: this.customArrivalType ? 'DURATION' : 'DATE',
				value: this.customArrivalType ? this.customArrivalInput : { date: this.customArrivalInput }
			})
			if(this.leg.arrival.source) this.selectedArrival = this.leg.arrival.source
		},

		methods: {
			onArrivalSourceChange(index) {
				if(this.leg.sources.arrival[index].level !== 'LX') {
					this.selectedArrival = this.leg.sources.arrival[index]
					this.$refs.arrivalPopper.showPopper = false
					this.$emit('arrivalSourceChange', this.index, this.selectedArrival)
				}
			},
			useCustomArrival() {
				// set type and value-format on source option
				for(let source of this.leg.sources.arrival) {
					if(source.level === 'LX') {
						source.type = this.customArrivalType ? 'DURATION' : 'DATE'
						source.value = !this.customArrivalType ? { date: this.customArrivalInput } :
						(parseInt(this.customArrivalInput.split(':')[0])*24)+parseInt(this.customArrivalInput.split(':')[1])+(parseInt(this.customArrivalInput.split(':')[2])/60)
					}
					this.selectedArrival = source
				}
				this.$refs.arrivalPopper.showPopper = false
				this.$emit('arrivalSourceChange', this.index, this.selectedArrival)
			},
			customArrivalTypeChange() {
				this.customArrivalInput = ''
				const arrivalType = this.customArrivalType ? 'DURATION' : 'DATE'

				// grab L3 value and set as text in input
				this.leg.sources.arrival.map(source => {
					if(source.level === 'L3' && source.type === arrivalType) {
						if(this.customArrivalType) {
							const parsed = parseFloat(source.value)
							const days = Math.floor(parsed/24)
							const hours = Math.floor(parsed%24)
							const minutes = Math.round((parsed - Math.floor(parsed))*60)
							this.customArrivalInput = this.prependZero(days) + ':' + this.prependZero(hours) + ':' + this.prependZero(minutes)
						} else {
							this.customArrivalInput = moment(source.value.date).format('YYYY-MM-DD HH:mm')
						}
					}
				})
				this.validateArrivalInput()
			},
			validateArrivalInput() {
				if(!this.customArrivalType) { // DATE
					this.customArrivalValid = this.dateTimeRegex.test(this.customArrivalInput)
				} else { // DURATION
					this.customArrivalValid = this.durationRegex.test(this.customArrivalInput)
				}
			},
			onArrivalPopperHide() {
				// set input elemets value to value of LX source (this might have been changed, without the user clicking 'use')
				console.log('hide')
			},
            prependZero(value, prependSig) { 
				const unsignedValue = Math.abs(value).toString()
				return unsignedValue.split('')[1] ? unsignedValue : '0' + unsignedValue
			},
		}
	}
</script>
