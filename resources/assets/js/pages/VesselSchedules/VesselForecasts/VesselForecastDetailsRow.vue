<template>
	<el-row :gutter="0" class="vessel-forecast-row" :class="{ 'vessel-forecast-row--monitored' : leg.monitored_port }">
		<el-row :gutter="0" class="vessel-forecast-subrow vessel-forecast-subrow--top">
			<!-- PORT NAME and timezone offset -->
			<el-col 
				class="vessel-forecast-subrow__cell"
				:span="7">
					<span class="port-name" :class="{ 'is-active' : leg.monitored_port }">{{ leg.port.name }} <span class="port-name__timezone" :class="{ 'is-active' : leg.monitored_port }">{{leg.port.time_zone }}</span></span>
					<span class="type" :class="{ 'is-active' : leg.monitored_port }">Arr</span>
			</el-col>

			<!-- ARRIVAL DATE -->
			<el-col 
				:span="8" 
				class="vessel-forecast-subrow__cell"
				style="position: relative;">
				<el-row :gutter="0" style="width:100%;">
					<el-col :span="10">
						<Date :date="leg.arrival.result.date" :class="{ 'is-active' : leg.monitored_port }"></Date>
					</el-col>
					<el-col :span="14">
						<Duration :duration="arrivalDeviation" :class="{ 'is-active' : leg.monitored_port }"></Duration>
					</el-col>
				</el-row>
			</el-col>
			<!-- Port Hours -->
			<el-col 
				class="vessel-forecast-subrow__cell"
				:span="9">
				<el-row 
					v-if="!leg.monitored_port"
					:gutter="0" 
					style="width:100%;">
					<el-col :span="8">
						<Duration :duration="leg.arrival.result.duration" :class="{ 'is-active' : leg.monitored_port }" class="is-active"></Duration>
					</el-col>
					<el-col :span="4">
						<span class="is-weak">In port</span>
					</el-col>
					<el-col :span="12">
						<Duration :duration="portHoursDeviation" :class="{ 'is-active' : leg.monitored_port }"></Duration>
					</el-col>
				</el-row>
			</el-col>
		</el-row>

		<el-row v-if="!leg.monitored_port" :gutter="0" class="vessel-forecast-subrow vessel-forecast-subrow--bottom">
			<!-- NEXT PORT & REQ SPEED -->
			<el-col 
				class="vessel-forecast-subrow__cell"
				:span="7">
					<span class="port-meta">
						<div><span class="port-meta__label">next port</span> <span class="port-meta__value">{{ leg.distance }}</span> nm</div>
						<div><span class="port-meta__label" :class="{'is-error' : !computedAcceptedSpeed }">req speed</span> <span class="port-meta__value">{{ leg.speed_required ? leg.speed_required.toFixed(1) : 'no data' }}</span> kn</div>
					</span>
					<span class="type">Dep</span>
			</el-col>

			<!-- DEPARTURE DATE -->
			<el-col 
				:span="8" 
				class="vessel-forecast-subrow__cell"
				style="position: relative;">
				<el-row :gutter="0" style="width:100%;">
					<el-col :span="10">
						<Date :date="leg.departure.result.date"></Date>
					</el-col>
					<el-col :span="14">
						<Duration :duration="departureDeviation"></Duration>
					</el-col>
				</el-row>
			</el-col>
			<!-- Sea Hours -->
			<el-col 
				class="vessel-forecast-subrow__cell"
				:span="9">
				<el-row :gutter="0" style="width:100%;">
					<el-col :span="8">
						<Duration :duration="leg.departure.result.duration" class="is-active"></Duration> 
					</el-col>
					<el-col :span="4">
						<span class="is-weak">At sea</span>
					</el-col>
					<el-col :span="12">
						<Duration :duration="seaHoursDeviation"></Duration>
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
		name: 'VesselForecastDetailsRow',
		components: { Date, Duration, VesselForecastOption },
		props: [ 'index', 'leg' ],
		data() {
			return {
				arrivalDeviation: null,
				portHoursDeviation: null,
				departureDeviation: null,
				seaHoursDeviation: null,
			}
		},
		computed: {
			computedAcceptedSpeed() {
				return (this.leg.speed_required < 20 && this.leg.speed_required >= 0)
			},
		},
		mounted() {
			this.calculateArrivalDeviation()
			this.calculatePortHoursDeviation()
			this.calculateDepartureDeviation()
			this.calculateSeaHoursDeviation()
		},
		methods: {
			calculateArrivalDeviation() {
				let l3 = null
				this.leg.sources.arrival.map(source => { if(source.level === 'L3' && source.type === 'DATE') l3 = source })
				const l3Date = l3 ? moment(l3.value.date) : null
				const forecastDate = moment(this.leg.arrival.result.date)
				this.arrivalDeviation = moment.duration(l3Date.diff(forecastDate)).asHours()
			},
			calculateDepartureDeviation() {
				let l3 = null
				this.leg.sources.departure.map(source => { if(source.level === 'L3' && source.type === 'DATE') l3 = source })
				const l3Date = l3 ? moment(l3.value.date) : null
				const forecastDate = moment(this.leg.departure.result.date)
				this.departureDeviation = moment.duration(l3Date.diff(forecastDate)).asHours()
			},
			calculatePortHoursDeviation() {
				let l3 = null
				this.leg.sources.departure.map(source => { if(source.level === 'L3' && source.type === 'DURATION') l3 = source })
				this.portHoursDeviation = parseFloat(l3.value) - parseFloat(this.leg.arrival.result.duration)
			},
			calculateSeaHoursDeviation() {
				let l3 = null
				this.leg.sources.departure.map(source => { if(source.level === 'L3' && source.type === 'DURATION') l3 = source })
				this.seaHoursDeviation = parseFloat(l3.value) - parseFloat(this.leg.departure.result.duration)
			},
		}
	}
</script>

<style lang="sass">
	@import '~variables'
	.port-name
		color: #333
		font-weight: bold
		&.is-active
			color: $g-dark-blue
	.port-name__timezone
		color: $g-txt-weak
		font-size: $g-txt-tiny
		font-weight: normal
		&.is-active
			color: $g-dark-blue
			opacity: 0.6
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

	.vessel-forecast-row--monitored
		height: 36px
		& > .vessel-forecast-subrow
			background-color: $g-pale-blue
		& > .vessel-forecast-subrow--top > .vessel-forecast-subrow__cell
			border-bottom: 1px solid $g-border-grey
			&:first-child
				border-bottom: 1px solid $g-border-grey

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
</style>
