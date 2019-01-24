<template>
	<el-container v-loading="loading">	

		<!-- HEADER -->
		<el-header style="background-color:white; display: flex; align-items: center; justify-content: space-between;">
			<div>
				<strong>{{ user ? user.name : '' }}</strong> 
				<div>{{ user ? user.company : '' }}</div>
			</div>
			<div>
				<el-date-picker
      				v-model="forecast_date"
					:clearable="false"
					size="small"
      				type="date"
					@change="onDateChange"
      				>
    			</el-date-picker>
			</div>
		</el-header>

		<!-- MAIN -->
		<el-main style="background-color:white; padding-top: 0px;">
			<el-table
				:data="summary_data"
				:row-style="rowStyle"
				style="width: 100%; line-height: 1.2;"
				@row-click="showDetails"
				>

				<el-table-column
					prop="service"
					label="Service"
					width="260"
					sortable
					>
					<template slot-scope="scope">
						<span>{{ scope.row.service }}</span>
					</template>
				</el-table-column>

				<el-table-column
					prop="vessel"
					label="Vessel"
					width="120"
					sortable
					>
					<template slot-scope="scope">
						<span style="word-break:keep-all;">{{ capitalize(scope.row.vessel) }}</span>
					</template>
				</el-table-column>

				<el-table-column
					prop="port"
					label="Port"
					width="120"
					sortable
					>
					<template slot-scope="scope">
						<div>{{ scope.row.port.name }}</div>
						<div style="font-size:10px;font-weight:bold;color:#aaa;">{{ scope.row.port.code }}</div>
					</template>
				</el-table-column>

				<el-table-column
					prop="reference"
					label="Reference"
					width="180"
					sortable
					>
					<template slot-scope="scope">
						<div v-if="scope.row.reference">
							{{ scope.row.reference }}
						</div>
						<div v-else class="is-weak is-unbreakable">
							no ref
						</div>
					</template>
				</el-table-column>

				<el-table-column
					prop="eeSeaETA"
					label="eeSea ETA"
					width="140"
					sortable
					>
					<template slot-scope="scope">
						<Date :date="scope.row.eeSeaETA"></Date>
					</template>
				</el-table-column>

				<el-table-column
					prop="proformaETA"
					label="Proforma ETA"
					width="140"
					sortable
					>
					<template slot-scope="scope">
						<Date :date="scope.row.proformaETA"></Date>
					</template>
				</el-table-column>

				<el-table-column
					prop="deviation"
					label="Deviation"
					fixed="right"
					sortable
					>
					<template slot-scope="scope">
						<eeDuration :duration="scope.row.deviation" :class="getDeviationClass(scope.row.deviation)"></eeDuration>
					</template>
				</el-table-column>

			</el-table>
		</el-main>
	</el-container>
</template>

<script>
	import ServiceCarrierNames from 'root/components/ServiceCarrierNames.vue'
	import Date from 'root/components/Time/Date.vue'
	import eeDuration from 'root/components/Time/eeDuration.vue'

	export default {
		name: 'ForecastSummary',
		components: { Date, eeDuration, ServiceCarrierNames },
		props: [],
		data() {
			return {
				email: null,
				forecast_date: null,
				loading: false,
				rowStyle: {
					//cursor: "pointer"
				},
				today: false,
				summaries: [],
				summary_data: [],
				user: null,
			}
		},
		mounted() {
			const path = window.location.pathname.split('/')
			if(path[3] !== undefined) this.forecast_date = path[3]
			if(path[4] !== undefined) this.email = path[4]
			
			const today = moment()
			if(!this.forecast_date) this.forecast_date = today.format('YYYY-MM-DD')

			const diff = moment.duration(today.diff(this.forecast_date)).asHours()
			this.today = diff < 24
			this.loading = true
			let params = this.email ? this.forecast_date + '/' + this.email : this.forecast_date
			axios.get('/api/v1/vessel-schedules/forecasts/summary/' + params).then(response => {
				this.summary_data = response.data.data.map(summary => {
					let deviation = null
					if(summary.eesea_eta && summary.original_eta) {
						let _eta = moment(summary.eesea_eta.date)
						let _proforma_eta = moment(summary.original_eta.date)
						deviation = moment.duration(_proforma_eta.diff(_eta)).asHours()
					}
					return {
						service: summary.service_version.name,
						vessel: summary.vessel ? summary.vessel.name : '',
						port: {
							name: summary.port.name,
							code: summary.port.code,
						},
						reference: summary.user_service_proforma.reference,
						eeSeaETA: summary.eesea_eta.date,
						//proformaETA: summary.user_service_proforma.service_proforma.arrival_date.date,
						proformaETA: summary.original_eta.date,
						deviation: deviation
					}	
				})
				this.user = response.data.user
				this.loading = false
			}).catch(error => {
				this.$alert('Message: ' + error.response.data.message, 'Error: ' + error.response.status + ' ' + error.response.statusText, {
          			confirmButtonText: 'OK',
					type: 'error'
        		});
				this.loading = false
			})
		},
		methods: {
			getDeviationClass(deviation) {
				if(deviation >= -1 && deviation <= 1) return 'is-success'
				if(deviation <= -5 || deviation >= 5) return 'is-error'
				return 'is-warning'
			},
			navigate(direction) {
				//console.log(direction)
			},
			onDateChange(date) {
				let parsedDate = moment(this.forecast_date).format('YYYY-MM-DD')
				let params = this.email ? parsedDate + '/' + this.email : parsedDate
				window.location.href = '/evs/summary/' + params
			},
			capitalize(vessel) {
				return _.startCase(vessel)
			},
			getDate(dateObj) {
				if(dateObj) return dateObj.date
				return null
			},
			showDetails(row, event, column) {
				//console.log(row)
			}
		}
	}
</script>

<style lang="sass">
	@import '~variables'
	
	.forecast-summary 
		display: block

	.forecast-summary__service
		display: flex
		align-items: center

	.forecast-summary__data
		display: flex
		align-items: center
		border-bottom: 1px solid $g-border-grey
		padding: 20px 0px

	.eesea-eta
		display: flex
		align-items: center

</style>
