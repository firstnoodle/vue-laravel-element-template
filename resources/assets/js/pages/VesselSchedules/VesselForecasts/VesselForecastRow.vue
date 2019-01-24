<template>
	<el-row :gutter="0" class="vessel-forecast-row">
		<el-row :gutter="0" class="vessel-forecast-subrow vessel-forecast-subrow--top">
			<el-col 
				class="vessel-forecast-subrow__cell"
				:span="7">
					<span class="port-name">{{ leg.port.name }} <span class="port-name__timezone">{{leg.port.time_zone }}</span></span>
					<span class="type">Arr</span>
			</el-col>
			<el-col 
				:span="8" 
				class="vessel-forecast-subrow__cell vessel-forecast-subrow__cell--dropdown"
				style="position: relative;">
				<el-select 
					v-model="computedArrival"
					class="forecast-select"
					ref="arrivals"
					placeholder=""
					popper-class="forecast-popper"
					>
					<el-option
						v-for="option in leg.sources.arrival"
						:key="genUniqueKey(option)"
						:label="option.company"
						:value="option"
						>
						<VesselForecastOption :option="option" optionType="Arrival"></VesselForecastOption>
					</el-option>
				</el-select>
				<div class="testingly">
					<VesselForecastOption v-if="computedArrival" :option="computedArrival" optionType="Arrival" @click.native="showArrivalsDropdown"></VesselForecastOption>
					<div v-else @click.native="showArrivalsDropdown" class="value-type__placeholder">Choose source</div>
					<el-popover
						placement="top"
						width="240"
						v-model="customArrivalVisible">
					  	<p class="value-type__header">Add custom value</p>
						<el-switch
					  		v-model="customArrivalType"
					 		active-color="#409EFF"
					  		inactive-color="#409EFF"
					  		active-text="Port hours"
					  		inactive-text="Date"
							class="value-type__switch"
							@change="arrivalTypeChange"
							>
						</el-switch>
						<el-input
							size="small"
							:placeholder="computedArrivalFormat"
							v-model="customArrivalInput"
							@input="validateArrivalInput"
							class="value-type__input"
							>
							<!--<el-button slot="append" type="success" icon="el-icon-check" :disabled="customArrivalValid" @click="addCustomArrival"></el-button>-->
						</el-input>
						<el-button
							size="mini"
							type="success"
							:disabled="!customArrivalValid"
							class="value-type__button"
							@click="addCustomArrival" 
							>
							{{ customArrivalStatus }}
						</el-button>
						<el-button type="text" icon="el-icon-edit" slot="reference"></el-button>
					</el-popover>
				</div>
			</el-col>
			<el-col 
				class="vessel-forecast-subrow__cell"
				:span="9">
				<el-row :gutter="0" style="width:100%">
					<el-col :span="10">
						<Date :date="leg.arrival.result.date"></Date>
					</el-col>
					<el-col :span="14">
						<Duration :duration="leg.arrival.result.duration"></Duration>
					</el-col>
				</el-row>
			</el-col>
			
		</el-row>

		<el-row :gutter="0" class="vessel-forecast-subrow vessel-forecast-subrow--bottom">
			<el-col 
				class="vessel-forecast-subrow__cell"
				:span="7">
					<span class="port-meta">
						<div><span class="port-meta__label">next port</span> <span class="port-meta__value">{{ leg.distance }}</span> nm</div>
						<div><span class="port-meta__label" :class="{'is-error' : !computedAcceptedSpeed }">req speed</span> <span class="port-meta__value">{{ leg.speed_required ? leg.speed_required.toFixed(1) : 'no data' }}</span> kn</div>
					</span>
					<span class="type">Dep</span>
			</el-col>
			<el-col 
				:span="8" 
				class="vessel-forecast-subrow__cell vessel-forecast-subrow__cell--dropdown"
				style="position: relative;">
				<el-select 
					v-model="computedDeparture"
					class="forecast-select"
					ref="departures"
					placeholder=""
					popper-class="forecast-popper"
					>
					<el-option
						v-for="option in leg.sources.departure"
						:key="genUniqueKey(option)"
						:label="option.company"
						:value="option"
						>
						<VesselForecastOption :option="option" optionType="Departure"></VesselForecastOption>
					</el-option>
				</el-select>
				<div class="testingly">
					<VesselForecastOption v-if="computedDeparture" :option="computedDeparture" optionType="Departure" @click.native="showDeparturesDropdown"></VesselForecastOption>
					<div v-else @click="showDeparturesDropdown" class="value-type__placeholder">Choose source</div>
					<el-popover
						placement="top"
						width="240"
						v-model="customDepartureVisible">
					  	<p class="value-type__header">Add custom value</p>
						<el-switch
					  		v-model="customDepartureType"
					 		active-color="#409EFF"
					  		inactive-color="#409EFF"
					  		active-text="Sea hours"
					  		inactive-text="Date"
							class="value-type__switch"
							@change="departureTypeChange"
							>
						</el-switch>
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
							@click="addCustomDeparture" 
							>
							{{ customDepartureStatus }}
						</el-button>
						<el-button type="text" icon="el-icon-edit" slot="reference"></el-button>
					</el-popover>
				</div>
			</el-col>
			<el-col 
				class="vessel-forecast-subrow__cell"
				:span="9">
				<el-row :gutter="0" style="width:100%">
					<el-col :span="10">
						<Date :date="leg.departure.result.date"></Date>
					</el-col>
					<el-col :span="14">
						<Duration :duration="leg.departure.result.duration"></Duration>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
	</el-row>
</template>

<script>
	import Date from 'root/components/Time/Date.vue'
	import Duration from 'root/components/Time/Duration.vue'
	import VesselForecastOption from './VesselForecastOption.vue'

	export default {
		name: 'VesselForecastRow',
		components: { Date, Duration, VesselForecastOption },
		props: [ 'index', 'leg' ],
		data() {
			return {
				customArrivalStatus: 'Use custom format',
				customArrivalValid: false,
				customArrivalVisible: false,
				customArrivalInput: '',
				customArrivalType: false,
				customDepartureStatus: 'Use custom format',
				customDepartureValid: false,
				customDepartureVisible: false,
				customDepartureInput: '',
				customDepartureType: false,
				dateTimeRegex: /^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[01]) ([01]\d|2[0-3]):([0-5]\d|2[0-9])$/,
				durationRegex: /^[0-9]{2}:([01]\d|2[0-3]):([0-5]\d|2[0-9])$/, 
				selectedArrival: null,
				selectedDeparture: null,
			}
		},
		computed: {
			computedArrivalFormat() { return this.customArrivalType ? 'DD:HH:MM' : 'YYYY-MM-DD HH:MM' },
			computedDepartureFormat() { return this.customDepartureType ? 'DD:HH:MM' : 'YYYY-MM-DD HH:MM' },
			computedAcceptedSpeed() { return (this.leg.speed_required < 20 && this.leg.speed_required >= 0) },
			computedArrival: {
				get() { return this.leg.arrival.source ? this.leg.arrival.source : null },
				set(newArrivalSource) { this.$emit('arrivalSourceChange', this.index, newArrivalSource) }
			},
			computedDeparture: {
				get() { return this.leg.departure.source ? this.leg.departure.source : null },
				set(newDepartureSource) { this.$emit('departureSourceChange', this.index, newDepartureSource) }
			},
		},
		methods: {
			showArrivalsDropdown() { this.$refs.arrivals.visible = true },
			showDeparturesDropdown() { this.$refs.departures.visible = true },
			addCustomArrival() {
				let customSource = {
					id: null,
					level: 'LX',
					company: 'eeSea',
				}
				customSource.type = this.customArrivalType ? 'DURATION' : 'DATE'
				if(customSource.type === 'DURATION') { 
					let time = moment.duration({
						minutes: parseInt(this.customArrivalInput.split(':')[2]),
						hours: parseInt(this.customArrivalInput.split(':')[1]),
						days: parseInt(this.customArrivalInput.split(':')[0]),
					})
					customSource.value = time.asHours()
				} else {
					customSource.value = {
						date: moment(this.customArrivalInput).format('YYYY-MM-DD HH:mm:ss') + '.000000',
					}
				}
				let customSourceExists = false
				this.leg.sources.arrival.map(source => {
					if(source.company === 'eeSea') {
						source = customSource
						customSourceExists = true
					}
				})
				if(!customSourceExists) this.leg.sources.arrival.push(customSource)
				this.$emit('arrivalSourceChange', this.index, customSource)
				this.customArrivalVisible = false
			},
			arrivalTypeChange() {
				this.customArrivalInput = ''
				this.validateArrivalInput()
			},
			validateArrivalInput() {
				if(!this.customArrivalType) { // DATE
					this.customArrivalValid = this.dateTimeRegex.test(this.customArrivalInput)
				} else { // DURATION
					this.customArrivalValid = this.durationRegex.test(this.customArrivalInput)
				}
				this.customArrivalStatus = this.customArrivalValid ? 'Use custom value' : 'not matching format'
			},
			addCustomDeparture() {
				let customSource = {
					id: null,
					level: 'LX',
					company: 'eeSea',
				}
				customSource.type = this.customDepartureType ? 'DURATION' : 'DATE'
				if(customSource.type === 'DURATION') { 
					let time = moment.duration({
						minutes: parseInt(this.customDepartureInput.split(':')[2]),
						hours: parseInt(this.customDepartureInput.split(':')[1]),
						days: parseInt(this.customDepartureInput.split(':')[0]),
					})
					customSource.value = time.asHours()
				} else {
					customSource.value = {
						date: moment(this.customDepartureInput).format('YYYY-MM-DD HH:mm:ss') + '.000000',
					}
				}
				let customSourceExists = false
				this.leg.sources.departure.map(source => {
					if(source.company === 'eeSea') {
						source = customSource
						customSourceExists = true
					}
				})
				if(!customSourceExists) this.leg.sources.departure.push(customSource)
				this.$emit('departureSourceChange', this.index, customSource)
				this.customDepartureVisible = false
			},
			departureTypeChange() {
				this.customDepartureInput = ''
				this.validateDepartureInput()
			},
			validateDepartureInput() {
				if(!this.customDepartureType) { // DATE
					this.customDepartureValid = this.dateTimeRegex.test(this.customDepartureInput)
				} else { // DURATION
					this.customDepartureValid = this.durationRegex.test(this.customDepartureInput)
				}
				this.customDepartureStatus = this.customDepartureValid ? 'Use custom value' : 'not matching format'
			}
		}
	}
</script>

<style lang="sass">
	@import '~variables'
	.port-name
		color: #333
		font-weight: bold
	.port-name__timezone
		color: $g-txt-weak
		font-size: $g-txt-tiny
		font-weight: normal
	.port-meta
		align-self: flex-start
		font-size: $g-txt-tiny
	.port-meta__label
		color: $g-txt-weak
	.port-meta__value
		color: $g-txt-dark

	.vessel-forecast-row
		height: 72px
		&:nth-child(odd)
			background-color: #FAFAFA
	.vessel-forecast-subrow
		height: 36px
		// border: 1px solid red
		& > .vessel-forecast-subrow__cell
			align-items: center
			border-right: 1px solid $g-border-grey
			display: flex
			height: 36px
			justify-content: space-between
			padding: 0px 10px
			.vessel-forecast-subrow__cell--dropdown
				padding: none
			> .type
				font-weight: bold
				font-size: $g-txt-tiny
				color: $g-txt-weak
		& > .vessel-forecast-subrow__cell:last-child
			border-right: none 
	.vessel-forecast-subrow--top > .vessel-forecast-subrow__cell
		border-bottom: 1px solid $g-border-grey
		&:first-child
			border-bottom: none
	.vessel-forecast-subrow--bottom > .vessel-forecast-subrow__cell
		border-bottom: 1px solid $g-border-grey

	.forecast-select
		visibility: hidden		
		width: 100%
	.forecast-popper li
		padding: 0 10px
	.testingly
		// border: 1px solid red
		align-items: center
		cursor: pointer
		display: flex
		height: 100%
		left: 0px
		padding: 0 10px
		position: absolute
		top: 0px
		width: 100%

	.value-type__placeholder
		align-items: center
		display: flex
		height: 100%
		width: 100%

	.value-type__header
		color: $g-dark-blue
		font-size: $g-txt-small
		font-weight: bold
		text-align: center

	.value-type__switch 
		display: flex
		justify-content: center
		margin-bottom: 10px
		& > .el-switch__label *
			font-size: $g-txt-tiny

	.value-type__help-text
		color: lighten($g-meta-grey, 10%)
		font-size: $g-txt-tiny

	.value-type__input
		margin-bottom: 10px

	.value-type__button
		width: 100%

</style>
