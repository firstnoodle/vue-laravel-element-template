<template>
	<div 
		class="proforma-item" 
		v-loading="loading"
		element-loading-text="Fetching route..."
    	element-loading-spinner="el-icon-loading"
		>
		<el-row class="proforma-item-wrapper" :gutter="0">
			<div class="handle">
				<DragHandle></DragHandle>
			</div>
			<div class="data-fields">
				<el-row :gutter="10">

					<!-- Port  -->	
					<el-col :span="3">
						<el-select 
							ref="portSelect"
							v-model="computedPort"
							class="dropdown"
							filterable
							remote	
							:remote-method="portRemoteMethod"
						>
							<el-option
								v-for="item in portOptions"
								:key="item.id"
								:label="item.label"
								:value="item">
							</el-option>
						</el-select>
					</el-col>

					<!-- Terminal  -->	
					<el-col :span="5">
						<el-select 
							v-model="computedTerminal" 
							filterable 
							class="dropdown"
						>
							<el-option
								v-for="item in terminalOptions"
								:key="item.id"
								:label="item.label"
								:value="item">
							</el-option>
						</el-select>
					</el-col>

					<!-- Arrival -->	
					<el-col class="date" :span="7">
						<div class="weekday">{{ computedArrivalWeekday }}</div>
						<!-- Arrival Date  -->	
						<el-date-picker
		   					:disabled="!detail_service"
							class="datepickr"
							prefix-icon="blank"
							v-model="computedArrivalDate"
							type="date"
							placeholder="YYYY-MM-DD"
							:picker-options="pickerOptions"
						>
						</el-date-picker>
						<!-- Arrival Time  -->	
						<el-time-select
		   					:disabled="!detail_service"
							class="timepickr"
							prefix-icon="blank"
							placeholder="HH:MM"
							v-model="computedArrivalTime"
							:picker-options="{
								start: '00:00',
								step: '00:15',
								end: '23:45'
							}"
							format="HH:mm"
						>
						</el-time-select>
					</el-col>

					<!-- Departure -->	
					<el-col class="date" :span="7">
						<!-- Departure Date  -->	
						<div class="weekday">{{ computedDepartureWeekday }}</div>
						<el-date-picker
		   					:disabled="!detail_service"
							class="datepickr"
							prefix-icon="blank"
							v-model="computedDepartureDate"
							type="date"
							placeholder="YYYY-MM-DD"
							:picker-options="pickerOptions"
						>
						</el-date-picker>
						<!-- Departure Time  -->	
						<el-time-select
		   					:disabled="!detail_service"
							class="timepickr"
							prefix-icon="blank"
							placeholder="HH:MM"
							v-model="computedDepartureTime"
							:picker-options="{
								start: '00:00',
								step: '00:15',
								end: '23:45'
							}"
							format="HH:mm"
						>
						</el-time-select>
					</el-col>

					<!-- Delete  -->	
					<el-popover
						ref="confirmDelete"
						placement="top"
						width="80"
						v-model="confirmDeleteVisible">
							<el-button type="text" size="mini" @click="confirmDeleteVisible = false">cancel</el-button>
							<el-button type="text" size="mini" @click="onDelete">confirm</el-button>
					</el-popover>	
					<el-col :span="1">
						<el-button v-popover:confirmDelete class="delete" type="text" icon="el-icon-delete"></el-button>
					</el-col>

					<!-- Options  -->	
					<el-col :span="1">
						<el-dropdown class="options" trigger="click" @command="handleCommand">
							<el-button type="text" icon="el-icon-more"></el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="new-above">
									<i class="el-icon-arrow-up"></i> Add new above
								</el-dropdown-item>
								<el-dropdown-item command="new-below">
									<i class="el-icon-arrow-down"></i> Add new below
								</el-dropdown-item>
								<el-dropdown-item command="cargo-flow">
									<i class="el-icon-tickets"></i> Add cargo flow
								</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</el-col>
				</el-row>
			</div>
		</el-row>

		<el-row>
			<el-col class="status-bar" :span="6">
				<span>{{ route ? 'distance' : null }} <strong :class="{ warning : !route }">{{ route ? route.distance.toFixed(1) : 'No route' }}</strong></span>
			</el-col>
			<el-col v-if="detail_service" class="status-bar" :span="6">
				<span>hours in port <strong :class="{ warning : hours_in_port <= 0 }">{{ hours_in_port ? hours_in_port.toFixed(1) : 'null' }}</strong></span>
			</el-col>
			<el-col v-if="detail_service" class="status-bar" :span="6">
				<span>hours at sea <strong :class="{ warning : hours_at_sea <= 0 }">{{ hours_at_sea ? hours_at_sea.toFixed(1) : 'null' }}</strong></span>
			</el-col>
			<el-col v-if="detail_service && route" class="status-bar" :span="6">
				<span>req. speed <strong :class="{ warning : speed_required <= 0 || speed_required > 50 }">{{ speed_required ? speed_required.toFixed(1) : 'null' }}</strong></span>
			</el-col>
		</el-row>

		<!-- Cargo Flows  -->	
		<div v-if="serviceProformaCargoFlows.length">
			<el-row :gutter="20">
				<el-col :span="12" class="cargo-flow">
					<ServiceProformaCargoFlow 
						v-for="(item, index) in serviceProformaCargoFlows"
						:index="index"
	  					:key="item.id"
	  					:serviceProformaCargoFlow="item"
						:cargoFlowOptions="cargoFlowOptions"
						@cargoFlowChanged="handleCargoFlowChange"
						@cargoFlowPercentageChanged="handleCargoFlowPercentageChange"
	  					@delete="onCargoFlowDelete"
					>
					</ServiceProformaCargoFlow>
					<el-row type="flex" justify="center">
						<button class="inline-button" @click="handleCommand('cargo-flow')">Add row</button>
					</el-row>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	import ServiceProformaCargoFlow from './ServiceProformaCargoFlow.vue'
	import DragHandle from 'root/elements/DragHandle.vue'

  	export default {
		name: 'ProformaItem',
		components: { ServiceProformaCargoFlow, DragHandle },

		props: [
			'index', 
			'loading',
			'arrival_date', 
			'departure_date', 
			'detail_service', 
			'distance',
			'hours_at_sea',
			'hours_in_port',
			'order_no', 
			'port', 
			'primary_cargo_flow',
			'route',
			'speed_required',
			'terminal', 
			'serviceProformaCargoFlows', 
			'cargoFlowOptions',
			'initial_terminal_options'
		],

    	data() {
      		return {
				confirmDeleteVisible: false,
				ports_loading: false,
				terminals_loading: false,
				portOptions: [],
				terminalOptions: [],
        		pickerOptions: { firstDayOfWeek: 1 },
				weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      		}
    	},

		computed: {
			computedArrivalWeekday() {
				if(this.computedArrivalDate) {
					let d = new Date(this.computedArrivalDate);
					return this.weekdays[d.getDay()];	
				}
				return '';
			},
			computedArrivalDate: {
				get() { return this.arrival_date ? this.arrival_date.split(' ')[0] : null },
				set(newDate) { this.$emit('arrival_dateChanged', newDate, this.index) }
			},
			computedArrivalTime: {
				get() { 
					if(this.arrival_date) return this.arrival_date.split(' ')[1] == 'null' ? '' : this.arrival_date.split(' ')[1];
					else return null;
				},
				set(newTime) { this.$emit('arrivalTimeChanged', newTime, this.index) }
			},
			computedArrivalStatus() {
				if(this.computedArrivalTime && this.computedArrivalDate) return this.checkDate(this.computedArrivalDate + ' ' + this.computedArrivalTime);;
				return false;
			},
			computedDepartureWeekday() {
				if(this.computedDepartureDate) {
					let d = new Date(this.computedDepartureDate);
					return this.weekdays[d.getDay()];	
				}
				return '';
			},
			computedDepartureDate: {
				get() { return this.departure_date ? this.departure_date.split(' ')[0] : null },
				set(newDate) { this.$emit('departure_dateChanged', newDate, this.index) }
			},
			computedDepartureTime: {
				get() { 
					if(this.departure_date) return this.departure_date.split(' ')[1] == 'null' ? '' : this.departure_date.split(' ')[1];
					else return null;
				},
				set(newTime) { this.$emit('departureTimeChanged', newTime, this.index)}
			},
			computedDepartureStatus() {
				if(this.computedDepartureTime && this.computedDepartureDate) return this.checkDate(this.computedDepartureDate + ' ' + this.computedDepartureTime);;
				return false;
			},
			computedHoursInPort() {
				if(this.computedArrivalStatus && this.computedDepartureStatus) {
					let arrival = new Date(this.computedArrivalDate + ' ' + this.computedArrivalTime);
					let departure = new Date(this.computedDepartureDate + ' ' + this.computedDepartureTime);
					return (departure.getTime() - arrival.getTime())/(1000*60*60);
				}
				return null;
			},
			computedPort: {
				get() { return this.port ? this.port.label : null },
				set(newPort) { this.$emit('portChanged', newPort, this.index) }
			},
			computedTerminal: {
				get() { return this.terminal ? this.terminal.label : null },
				set(newTerminal) { this.$emit('terminalChanged', newTerminal, this.index) }
			},
		},

		watch: {
			// fetch terminals for selected port
			port: function(newPort, oldPort) {
				if(newPort) {
					this.$emit('terminalChanged', null, this.index)
					for(let i = 0; i < this.portOptions.length; i++) {
						if(this.portOptions[i].id == newPort.id) {
							this.terminals_loading = true;
							axios.get('/api/v1/terminals?port_id=' + newPort.id)
								.then(response => {
									this.terminals_loading = false;
									if(response.data.data.length) {
										this.terminalOptions = response.data.data.map(terminal => {
											return {
												id: terminal.id,
												label: terminal.name,
												value: terminal.code
											}
										})
									} else {
										this.terminalOptions = null;
									}
								})
								.catch(error => {
									Raven.captureException(error.response);
								});
						}
					}
				}
			},
		},

		mounted() {
			if(this.port == null) this.$refs.portSelect.$refs.reference.$refs.input.focus();
			this.terminalOptions =  !this.initial_terminal_options ? [] : this.initial_terminal_options.map(option => {
				return {
					id: option.id,
					label: option.name,
					value: option.code
				}
			});
		},

		methods: {
			// query DB for ports matching input text
			portRemoteMethod(query) {
				if(query && query.length) {
					this.ports_loading = true;
					axios.get('/api/v1/ports?q=' + query)
						.then(response => {
							this.ports_loading = false;
							this.portOptions = response.data.data.map(port => {
								return {
									id: port.id,
									label: port.name + ' (' + port.code + ')',
									value: port.code,
									time_zone: port.time_zone
								}
							})
						})
				}
			},
			// when option (command) from dropdown is selected
			handleCommand(command) {
				this.$emit('command', command, this.index);
			},
			onCargoFlowDelete(index) {
				// if it is not a new (unsaved) cargo flow, then add it to the list of deletedCargoFlows
				if(this.serviceProformaCargoFlows[index].id) this.$emit('cargoFlowDeleted', this.serviceProformaCargoFlows[index].id);
				this.serviceProformaCargoFlows.splice(index, 1);
			},
			handleCargoFlowChange(newCargoFlow, index) {
				this.serviceProformaCargoFlows[index].cargo_flow = newCargoFlow;
			},
			handleCargoFlowPercentageChange(newPercentage, index) {
				this.serviceProformaCargoFlows[index].percentage = newPercentage;
			},
			onDelete() {
				this.confirmDeleteVisible = false;
				this.handleCommand('delete');
			},
			checkDate(date) {
				let d = new Date(date);
				// check if it is a date object
				if ( Object.prototype.toString.call(d) === "[object Date]" ) {
					// check if date object is a valid date
					return !isNaN(d.getTime());
				} else {
					return false;
				}
			},
		}
  	}
</script>

<style lang="scss">
	.proforma-item {
		padding: 20px 0px;
		background-color: #FFF;
		border-bottom: 1px solid #f3f3f3;	
		.proforma-item-wrapper {
			display: flex;

			& > .handle {
				flex: 0 0 22px;
				box-sizing: border-box;
			}
			& > .data-fields {
				flex: 1 1 50%;
				box-sizing: border-box;
			}
		}
		.options button, button.delete {
			display: flex;
			width: 100%;
			justify-content: center;
			padding-top: 10px;
			padding-bottom: 10px;
		}
		.status-bar {
			background-color: #FAFAFA;
			margin-top: 6px;
			padding: 6px 10px;
			.warning {
				color: red;
			}
		}
	}
	.drag-ghost {
		opacity: 0;
	}
	.chosen-item {
		border: 1px solid #409EFF;
	}
	.date {
		display: flex;
	}
	.cargo-flow {
		margin-top: 10px;
		margin-left: 33px;
		padding: 10px 10px 10px 60px;
		border-radius: 2px;
		background-color: #F5F5F5;
	}
</style>
