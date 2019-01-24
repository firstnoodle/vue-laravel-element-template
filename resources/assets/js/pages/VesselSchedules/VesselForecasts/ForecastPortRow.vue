<template>
	<div class="forecast-port"> 
		<div class="forecast-row">
			
			<div class="forecast-column forecast-column--port">
				<div class="forecast-table__cell is-height-4">
					<div class="port-main">
						<span class="name">{{ leg.port.name }}</span>
						<span class="timezone">{{ leg.port.time_zone }}</span>
					</div>
					<div class="port-meta">
						<span class="code">{{ leg.port.code }}</span>
						<span :class="computedFlagClass"></span> 
					</div>
					<div class="port-terminal">
						{{ leg.terminal ? leg.terminal.name : 'No terminal name' }}
					</div>
				</div>
			</div>
			
			<div class="forecast-column forecast-column--source">

				<!-- Arrival Dropdown -->
				<div class="forecast-table__cell is-height-2 forecast-table__cell--no-padding">
					<div class="ee-select">
						<eePopper 
							ref="arrivalPopper"
							@show="arrivalPopperActive = true"
							@hide="arrivalPopperActive = false"
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
							<div slot="reference" class="ee-select__button" :class="{ 'is-active' : arrivalPopperActive }">
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
											v-if="computedSelectedArrivalValueType === 'DATE'"	
											:date="selectedArrival.value.date"
											class="ee-source-option__value"
											>
										</eeDate>
										<eeDuration 
											v-else-if="computedSelectedArrivalValueType === 'DURATION'" 
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

				<!-- Departure Dropdown -->
				<div class="forecast-table__cell is-height-2 forecast-table__cell--no-padding">
					<div class="ee-select">
						<eePopper 
							ref="departurePopper"
							@show="departurePopperActive = true"
							@hide="departurePopperActive = false"
							>
							<div class="popper ee-select__dropdown">
								<div 
									v-for="option,index in leg.sources.departure"
									:key="genUniqueKey(option)"
									class="dropdown-item"
									@click="onDepartureSourceChange(index)"
									>
									<SourceOption 
										v-if="option.level !== 'LX'"
										:option="option" 
										optionType="Departure"
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
												v-model="customDepartureType"
												active-color="#409EFF"
												inactive-color="#409EFF"
												active-text="duration"
												inactive-text="date"
												class="value-type__switch"
												@change="customDepartureTypeChange"
												>
											</el-switch>
										</div>
										<div class="ee-source-option__bottom">
											<el-input
												size="small"
												:placeholder="computedDepartureFormat"
												v-model="customDepartureInput"
												@input="validateDepartureInput"
												class="value-type__input"
												>
											</el-input>
											<el-button
												size="mini"
												type="success"
												:disabled="!customDepartureValid"
												class="value-type__button"
												@click="useCustomDeparture" 
												>
												use
											</el-button>
										</div>
									</div>
								</div>
							</div>

							<!-- DROPDOWN BUTTON -->
							<div slot="reference" class="ee-select__button" :class="{ 'is-active' : departurePopperActive }">
								<div class="ee-source-option">
									<div class="ee-source-option__top">
										<div class="ee-pill ee-pill--bordered" :class="computedDepartureLevelStyle">{{ selectedDeparture ? selectedDeparture.level : '-' }}</div>
										<span class="ee-source-option__carrier">{{ selectedDeparture ? selectedDeparture.company : '-' }}</span>
										<div class="arrow-button ee-source-option__source-count">
											<span class="arrow-button__count">{{ leg.sources.departure.length }}</span>
											<span class="arrow-button__arrow"></span>
										</div>
									</div>
									<div class="ee-source-option__bottom">
										<span class="ee-source-option__type">{{ computedSelectedDepartureType }}</span>
										
										<eeDate 
											v-if="computedSelectedDepartureValueType === 'DATE'"	
											:date="selectedDeparture.value.date"
											class="ee-source-option__value"
											>
										</eeDate>
										<eeDuration 
											v-else-if="computedSelectedDepartureValueType === 'DURATION'" 
											:duration="selectedDeparture.value"
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
					<span v-if="index > 0" class="forecast-table__label">Sea hours</span>
					<div v-if="leg.arrival.result.duration > 0" class="ee-pill" :class="computedResultSeaHoursClass">
						<eeDuration :duration="leg.arrival.result.duration"></eeDuration>
					</div>
					<div v-else-if="index === 0"></div>
					<div v-else class="is-error">error</div>
				</div> 
				<div class="forecast-table__cell is-height-1">
					<span class="forecast-table__label">Arrival</span>
					<div class="ee-pill" :class="computedResultArrivalClass">
						<eeDate :date="leg.arrival.result.date"></eeDate>
					</div>
				</div> 
				<div class="forecast-table__cell is-height-1">
					<span class="forecast-table__label">Port hours</span>
					<div v-if="leg.departure.result.duration > 0" class="ee-pill" :class="computedResultPortHoursClass">
						<eeDuration :duration="leg.departure.result.duration"></eeDuration>
					</div>
					<div v-else class="is-error">error</div>
				</div> 
				<div class="forecast-table__cell is-height-1">
					<span class="forecast-table__label">Departure</span>
					<div class="ee-pill" :class="computedResultDepartureClass">
						<eeDate :date="leg.departure.result.date"></eeDate>
					</div>
				</div> 
			</div>
			
			<!-- PROFORMA -->
			<div class="forecast-column forecast-column--proforma">
				<div class="forecast-table__cell is-height-1">
					<!-- leg.sources.arrival Level === L3 && Type === DURATION -->
					<eeDuration v-if="index > 0" :duration="proformaSeaHours"></eeDuration>
					<eeDuration v-if="index > 0" :duration="computedProformaSeaHoursDeviation" :class="computedProformaSeaHoursDeviationClass"></eeDuration>
				</div> 
				<div class="forecast-table__cell is-height-1">
					<eeDate :date="proformaArrival"></eeDate>
					<eeDuration :duration="computedProformaArrivalDeviation" :class="computedProformaArrivalDeviationClass"></eeDuration>
				</div> 
				<div class="forecast-table__cell is-height-1">
					<eeDuration :duration="proformaPortHours"></eeDuration>
					<eeDuration :duration="computedProformaPortHoursDeviation" :class="computedProformaPortHoursDeviationClass"></eeDuration>
				</div> 
				<div class="forecast-table__cell is-height-1">
					<eeDate :date="proformaDeparture"></eeDate>
					<eeDuration :duration="computedProformaDepartureDeviation" :class="computedProformaDepartureDeviationClass"></eeDuration>
				</div> 
			</div>
			
			<!-- PREVIOUS -->
			<div class="forecast-column forecast-column--previous">
				<div class="forecast-table__cell is-height-1">
					<eeDuration v-if="index > 0" :duration="computedPreviousSeaHours"></eeDuration>
					<eeDuration v-if="index > 0" :duration="computedPreviousSeaHoursDeviation" :class="computedPreviousSeaHoursDeviationClass"></eeDuration>
				</div> 
				<div class="forecast-table__cell is-height-1">
					<eeDate :date="computedPreviousArrival"></eeDate>
					<eeDuration :duration="computedPreviousArrivalDeviation" :class="computedPreviousArrivalDeviationClass"></eeDuration>
				</div> 
				<div class="forecast-table__cell is-height-1">
					<eeDuration :duration="computedPreviousPortHours"></eeDuration>
					<eeDuration :duration="computedPreviousPortHoursDeviation" :class="computedPreviousPortHoursDeviationClass"></eeDuration>
				</div> 
				<div class="forecast-table__cell is-height-1">
					<eeDate :date="computedPreviousDeparture"></eeDate>
					<eeDuration :duration="computedPreviousDepartureDeviation" :class="computedPreviousDepartureDeviationClass"></eeDuration>
				</div> 
			</div>
		</div>
		
	   <!-- REQ SPEED -->
		<div class="forecast-row required-speed">
			<div class="forecast-column forecast-column--next-port">
				<div class="forecast-table__cell is-height-1">
					<div>Distance to next port <span>{{ leg.distance }} nm</span></div>
				</div>
			</div>
			<div class="forecast-column forecast-column--result">
				<div class="forecast-table__cell is-height-1">
					<span class="forecast-table__label">Req speed</span>
					<div class="ee-pill">
						<span>{{ leg.speed_required ? leg.speed_required.toFixed(1) + ' kn' : 'no data' }}</span>
					</div>
				</div>
			</div>
			<div class="forecast-column forecast-column--proforma">
				<div class="forecast-table__cell is-height-1">
					<span>{{ leg.proforma_req_speed.toFixed(1) }} kn</span>
					<span>{{ leg.proforma_req_speed_deviation ? leg.proforma_req_speed_deviation.toFixed(1) : 'no data' }} kn</span>
				</div>
			</div>
			<div class="forecast-column forecast-column--previous">
				<div class="forecast-table__cell is-height-1">
					<span>{{ leg.previous_req_speed ? leg.previous_req_speed.toFixed(1) + ' kn' : 'no value' }}</span>
					<span>{{ leg.previous_req_speed_deviation ? leg.previous_req_speed_deviation.toFixed(1) + ' kn' : 'no value' }}</span>
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

		name: 'ForecastPortRow',

		components: { eePopper, eeDate, eeDuration, SourceOption },

		props: [ 'index', 'leg' ],

		data () {
			return {
				arrivalPopperActive: false,
				departurePopperActive: false,
				customArrivalStatus: 'add',
				customArrivalValid: false,
				customArrivalInput: '',
				customArrivalType: false,
				customDepartureStatus: 'Use custom format',
				customDepartureValid: false,
				customDepartureInput: '',
				customDepartureType: false,
				dateTimeRegex: /^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[01]) ([01]\d|2[0-3]):([0-5]\d|2[0-9])$/,
				durationRegex: /^[0-9]{2}:([01]\d|2[0-3]):([0-5]\d|2[0-9])$/, 
				proformaSeaHours: null,
				proformaArrival: null,
				proformaPortHours: null,
				proformaDeparture: null,
				selectedArrival: null,
				selectedDeparture: null,
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
			computedSelectedArrivalValueType() {
				if(this.selectedArrival) {
					return this.selectedArrival.type === 'DURATION' ? 'DURATION' : 'DATE'
				}
				return null
			},
			computedArrivalLevelStyle() {
				return this.selectedArrival ? 'is-' + this.selectedArrival.level : ''
			},
			computedDeparture: {
				get() { return this.leg.departure.source ? this.leg.departure.source : null },
				set(newDepartureSource) { this.$emit('departureSourceChange', this.index, newDepartureSource) }
			},
			computedSelectedDepartureType() {
				if(this.selectedDeparture) {
					if(this.selectedDeparture.type == 'DATE') {
						return 'Departure'
					} else if(this.selectedDeparture.type == 'DURATION') {
						return 'Port hours'
					} else if(this.selectedDeparture.type == 'CALCULATED_ETA') {
						return 'CALC_ETA'	
					} else { // AIS_ETA
						return this.selectedDeparture.type		
					}
				}
				return '-'
			},
			computedSelectedDepartureValueType() {
				if(this.selectedDeparture) {
					return this.selectedDeparture.type === 'DURATION' ? 'DURATION' : 'DATE'
				}
				return null
			},
			computedDepartureLevelStyle() {
				return this.selectedDeparture ? 'is-' + this.selectedDeparture.level : ''
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
			computedProformaPortHours() {
				for(let source in this.leg.sources.departure) {
					if(source.level === 'L3' && source.type === 'DURATION') return source.value
					else return null
				}
			},
			computedProformaPortHoursDeviation() {
				if(this.leg.departure.result.duration && this.proformaPortHours) return this.proformaPortHours - this.leg.departure.result.duration
				return null
			},
			computedProformaPortHoursDeviationClass() {
				if(this.computedProformaPortHoursDeviation !== null) {
					if(this.computedProformaPortHoursDeviation >= -1 && this.computedProformaPortHoursDeviation <= 1) return 'is-success'
					if(this.computedProformaPortHoursDeviation <= -5 || this.computedProformaPortHoursDeviation >= 5) return 'is-error'
					return 'is-warning'
				}
				return null
			},
			computedProformaDeparture() {
				for(let source in this.leg.sources.departure) {
					if(source.level === 'L3' && source.type === 'DURATION') return source.value.date
					else return null
				}
			},
			computedProformaDepartureDeviation() {
				if(this.leg.departure.result.date && this.proformaDeparture) { 
					let departure = moment(this.leg.departure.result.date)
					let proforma_departure = moment(this.proformaDeparture)
					return moment.duration(proforma_departure.diff(departure)).asHours()
				}
				return null
			},
			computedProformaDepartureDeviationClass() {
				if(this.computedProformaDepartureDeviation !== null) {
					if(this.computedProformaDepartureDeviation >= -1 && this.computedProformaDepartureDeviation <= 1) return 'is-success'
					if(this.computedProformaDepartureDeviation <= -5 || this.computedProformaDepartureDeviation >= 5) return 'is-error'
					return 'is-warning'
				}
				return null
			},

			computedPreviousSeaHours() {
				return this.leg.previous_forecast_leg ? this.leg.previous_forecast_leg.arrival.duration : null
			},
			computedPreviousSeaHoursDeviation() {
				return this.computedPreviousSeaHours && this.leg.arrival.result.duration ? this.computedPreviousSeaHours - parseFloat(this.leg.arrival.result.duration) : null
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
				return this.computedPreviousArrival && this.leg.arrival.result.date ? moment.duration(moment(this.computedPreviousArrival).diff(moment(this.leg.arrival.result.date))).asHours() : null
			},
			computedPreviousArrivalDeviationClass() {
				if(this.computedPreviousArrivalDeviation !== null) {
					if(this.computedPreviousArrivalDeviation >= -1 && this.computedPreviousArrivalDeviation <= 1) return 'is-success'
					if(this.computedPreviousArrivalDeviation <= -5 || this.computedPreviousArrivalDeviation >= 5) return 'is-error'
					return 'is-warning'
				}
				return null
			},
			computedPreviousPortHours() {
				return this.leg.previous_forecast_leg ? this.leg.previous_forecast_leg.departure.duration : null
			},
			computedPreviousPortHoursDeviation() {
				return this.computedPreviousPortHours && this.leg.departure.result.duration ? this.computedPreviousPortHours - parseFloat(this.leg.departure.result.duration) : null
			},
			computedPreviousPortHoursDeviationClass() {
				if(this.computedPreviousPortHoursDeviation !== null) {
					if(this.computedPreviousPortHoursDeviation >= -1 && this.computedPreviousPortHoursDeviation <= 1) return 'is-success'
					if(this.computedPreviousPortHoursDeviation <= -5 || this.computedPreviousPortHoursDeviation >= 5) return 'is-error'
					return 'is-warning'
				}
				return null
			},
			computedPreviousDeparture() {
				return this.leg.previous_forecast_leg ? this.leg.previous_forecast_leg.departure.date : null
			},
			computedPreviousDepartureDeviation() {
				return this.computedPreviousDeparture && this.leg.departure.result.date ? moment.duration(moment(this.computedPreviousDeparture).diff(moment(this.leg.departure.result.date))).asHours() : null
			},
			computedPreviousDepartureDeviationClass() {
				if(this.computedPreviousDepartureDeviation !== null) {
					if(this.computedPreviousDepartureDeviation >= -1 && this.computedPreviousDepartureDeviation <= 1) return 'is-success'
					if(this.computedPreviousDepartureDeviation <= -5 || this.computedPreviousDepartureDeviation >= 5) return 'is-error'
					return 'is-warning'
				}
				return null
			},

			computedArrivalFormat() { return this.customArrivalType ? 'DD:HH:MM' : 'YYYY-MM-DD HH:MM' },
			computedDepartureFormat() { return this.customDepartureType ? 'DD:HH:MM' : 'YYYY-MM-DD HH:MM' },
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
			computedResultPortHoursClass() {
				if(this.selectedDeparture) {
					if(this.selectedDeparture.type === 'DURATION') return 'ee-pill--bold is-' + this.selectedDeparture.level
				}
				return null
			},
			computedResultDepartureClass() {
				if(this.selectedDeparture) {
					if(this.selectedDeparture.type === 'DATE' || this.selectedDeparture.type === 'AIS_ETA' || this.selectedDeparture.type === 'CALC_ETA') {
						return 'ee-pill--bold is-' + this.selectedDeparture.level
					}
				}
				return null
			},
		},

		mounted() {
			// get proforma Sea Hours and Arrival date	
			for(let source of this.leg.sources.arrival) {
				if(source.level === 'L3' && source.type === 'DURATION') this.proformaSeaHours = source.value
				if(source.level === 'L3' && source.type === 'DATE') this.proformaArrival = source.value.date
			}
			// get proforma Sea Hours and Departure date	
			for(let source of this.leg.sources.departure) {
				if(source.level === 'L3' && source.type === 'DURATION') this.proformaPortHours = source.value
				if(source.level === 'L3' && source.type === 'DATE') this.proformaDeparture = source.value.date
			}

			// set selected arrival and departure if available
			if(this.leg.arrival.source) this.selectedArrival = this.leg.arrival.source
			if(this.leg.departure.source) this.selectedDeparture = this.leg.departure.source

			this.customArrivalTypeChange()
			this.leg.sources.arrival.push({
				company: 'Custom',
				id: null,
				level: 'LX',
				type: this.customArrivalType ? 'DURATION' : 'DATE',
				value: this.customArrivalType ? this.customArrivalInput : { date: this.customArrivalInput }
			})

			// 'init' and then inject custom departure object 
			this.customDepartureTypeChange()
			this.leg.sources.departure.push({
				company: 'Custom',
				id: null,
				level: 'LX',
				type: this.customArrivalType ? 'DURATION' : 'DATE',
				value: this.customDepartureType ? this.customDepartureInput : { date: this.customDepartureInput }
			})
		},

		methods: {
			onArrivalSourceChange(index) {
				if(this.leg.sources.arrival[index].level !== 'LX') {
					this.selectedArrival = this.leg.sources.arrival[index]
					this.$refs.arrivalPopper.showPopper = false
					this.$emit('arrivalSourceChange', this.index, this.selectedArrival)
				}
			},
			onDepartureSourceChange(index) {
				if(this.leg.sources.departure[index].level !== 'LX') {
					this.selectedDeparture = this.leg.sources.departure[index]
					this.$refs.departurePopper.showPopper = false
					this.$emit('departureSourceChange', this.index, this.selectedDeparture)
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
			useCustomDeparture() {
				// set type and value-format on source option
				for(let source of this.leg.sources.departure) {
					if(source.level === 'LX') {
						source.type = this.customDepartureType ? 'DURATION' : 'DATE'
						source.value = !this.customDepartureType ? { date: this.customDepartureInput } :
						(parseInt(this.customDepartureInput.split(':')[0])*24)+parseInt(this.customDepartureInput.split(':')[1])+(parseInt(this.customDepartureInput.split(':')[2])/60)
					}
					this.selectedDeparture = source
				}
				this.$refs.departurePopper.showPopper = false
				this.$emit('departureSourceChange', this.index, this.selectedDeparture)
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
			customDepartureTypeChange() {
				this.customDepartureInput = ''
				const departureType = this.customDepartureType ? 'DURATION' : 'DATE'

				// grab L3 value and set as text in input
				this.leg.sources.departure.map(source => {
					if(source.level === 'L3' && source.type === departureType) {
						if(this.customDepartureType) {
							const parsed = parseFloat(source.value)
							const days = Math.floor(parsed/24)
							const hours = Math.floor(parsed%24)
							const minutes = Math.round((parsed - Math.floor(parsed))*60)
							this.customDepartureInput = this.prependZero(days) + ':' + this.prependZero(hours) + ':' + this.prependZero(minutes)
						} else {
							this.customDepartureInput = moment(source.value.date).format('YYYY-MM-DD HH:mm')
						}
					}
				})
				this.validateDepartureInput()
			},
			validateArrivalInput() {
				if(!this.customArrivalType) { // DATE
					this.customArrivalValid = this.dateTimeRegex.test(this.customArrivalInput)
				} else { // DURATION
					this.customArrivalValid = this.durationRegex.test(this.customArrivalInput)
				}
			},
			validateDepartureInput() {
				if(!this.customDepartureType) { // DATE
					this.customDepartureValid = this.dateTimeRegex.test(this.customDepartureInput)
				} else { // DURATION
					this.customDepartureValid = this.durationRegex.test(this.customDepartureInput)
				}
			},
			onArrivalPopperHide() {
				// set input elemets value to value of LX source (this might have been changed, without the user clicking 'use')
			},
			onDeparturePopperHide() {
				// set input elemets value to value of LX source (this might have been changed, without the user clicking 'use')
			},
            prependZero(value, prependSig) { 
				const unsignedValue = Math.abs(value).toString()
				return unsignedValue.split('')[1] ? unsignedValue : '0' + unsignedValue
			},
		}
	}
</script>
