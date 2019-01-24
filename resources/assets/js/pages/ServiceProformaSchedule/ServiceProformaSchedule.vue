<template>
	<el-container id="proforma-schedule">


		<el-header>
			<el-row class="proforma-schedule-header" :gutter="10">
				<el-col :span="12">
					<a :href="computedBackToService">&lt; back to service</a>
				</el-col>
				<el-col :span="9">
					Detail service
					<el-switch
						v-model="detail_service"
						active-color="#13ce66"
						active-text="on"
						inactive-text="off"
						@change="onDetailServiceChange"
					>
					</el-switch>
				</el-col>
			</el-row> 
		</el-header>


		<el-main v-loading="loading">
			<draggable
				v-model="schedule"
				:options="{
					handle: '.drag-handle',
					ghostClass: 'drag-ghost',
					animation: 150,
					dragClass: 'dragged-item',
					chosenClass: 'chosen-item',
				}"
				@change="onOrderChange">

				<ServiceProforma
						v-for="(item,index) in schedule"
						:index="index"
						:key="item.id"
						:loading="item.loading"
						:arrival_date="item.arrival_date"
						:departure_date="item.departure_date"
						:detail_service="detail_service"
						:distance="item.distance"
						:hours_at_sea="item.hours_at_sea"
						:hours_in_port="item.hours_in_port"
						:order_no="index + 1"
						:port="item.port"
						:primary_cargo_flow="item.primary_cargo_flow"
						:route="item.route"
						:serviceProformaCargoFlows="item.service_proforma_cargo_flows"
						:speed_required="item.speed_required"
						:terminal="item.terminal"
						:cargoFlowOptions="cargoFlowOptions"
						:initial_terminal_options="item.initial_terminal_options"
						@arrival_dateChanged="onArrivalDateChange"
						@arrivalTimeChanged="onArrivalTimeChange"
						@departure_dateChanged="onDepartureDateChange"
						@departureTimeChanged="onDepartureTimeChange"
						@portChanged="onPortChange"
						@terminalChanged="onTerminalChange"
						@command="onCommand"
						@cargoFlowDeleted="onCargoFlowDeleted"
				>
				</ServiceProforma>
			</draggable>
			<el-row class="add-port" type="flex" justify="center">
				<button class="inline-button" @click="onNewServiceProforma">Add port</button>
			</el-row>
		</el-main>
		<el-footer>
			<el-row class="add-port" type="flex" justify="center">
				<el-col :span="6">
					Using: {{ computedRoundTripDays }} of {{ round_trip_days }} Round Trip Days
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="onSave" :disabled="!scheduleValid">Save</el-button>
				</el-col>
			</el-row>
		</el-footer>
	</el-container>
</template>

<script>
    import ServiceProforma from './ServiceProforma.vue'
    import draggable from 'vuedraggable'
	
	// modulo array index even if index is negative
	// swap with utils.wrapRange
	const mod = (x, n) => (x % n + n) % n;

    export default {
        name: 'ProformaSchedule',
        components: { ServiceProforma, draggable },
        props: [],
        data() {
            return {
				loading: false,
				service_version_id: null,
				service_version: null,
				detail_service: false,
				operation: false,
				round_trip_days: null,
                schedule: [],
				deletedServiceProformas: [],
				deletedServiceProformaCargoFlows: [],
                cargoFlowOptions: [],
				scheduleErrors: false,
            }
        },
        computed: {
			computedBackToService() {
				return this.service_version ? '/administrator/service/service/' + this.service_version.service_id + '/' + this.service_version.id : '#';
			},
			scheduleValid() {
				let errors = 0;
				for(let i = 0; i < this.schedule.length; i++) if(!this.schedule[i].valid) errors++;	
				return (errors == 0);
			},
			// return diff between arrival_date of first ServiceProforma and departure_date of last ServiceProforma
			// move to methods and call from datechange
			computedRoundTripDays() {
				if(this.schedule.length > 0) {
					let lastPort = this.schedule.length - 1;
					let startDate = moment(this.schedule[0].arrival_date);
					let endDate = moment(this.schedule[lastPort].departure_date);
					if(startDate.isValid() && endDate.isValid()) {
						// convert hours_at_sea to days.. 
						let lastLeg = this.schedule[lastPort].hours_at_sea ? this.schedule[lastPort].hours_at_sea/24 : 0; 
						return moment.duration(endDate.diff(startDate)).asDays() + lastLeg;
					} else {
						return null;
					}
				} else {
					return null;
				}
			}
        },

        mounted() {

            this.service_version_id = window.location.pathname.split('/')[5];
			this.loading = true;
            axios.get('/api/v1/service/version/' + this.service_version_id + '/proforma').then(response => {
				console.log(response.data.service_proformas[5]);
				this.service_version = response.data.service_version;

				// detailed service??
				if(response.data.detail_service == 'NO') this.detail_service = false; 
				else this.detail_service = true;

				this.round_trip_days = response.data.service_version.round_trip_days;
			
				response.data.cargo_flows.map(cargo_flow => {
					this.cargoFlowOptions.push({
						id: cargo_flow.id,
						value: cargo_flow,
						label: cargo_flow.name
					})
				});

				// make sure service proformas are sorted by order_no
				response.data.service_proformas.sort((a,b) => {
					return a.order_no - b.order_no;
				});

				response.data.service_proformas.map((segment, index) => {
					console.log(segment);
					let cargo_flows = [];
					for(let i = 0; i < response.data.service_proforma_cargo_flows.length; i++) {
						if(response.data.service_proforma_cargo_flows[i].service_proforma_id == segment.id) {
							cargo_flows.push(response.data.service_proforma_cargo_flows[i]);
						}
					}
					let arrival_date = this.detail_service && segment.arrival_date ? this.cropDate(segment.arrival_date.date) : null;
					let departure_date = this.detail_service && segment.departure_date ? this.cropDate(segment.departure_date.date) : null;
					this.schedule.push({
						valid: null,
						loading: false,
						arrival_date: arrival_date,
						departure_date: departure_date, 
						distance: segment.route.distance ? segment.route.distance : null,
						hours_at_sea: segment.hours_at_sea ? parseFloat(segment.hours_at_sea) : null,
						hours_in_port: segment.hours_in_port ? parseFloat(segment.hours_in_port) : null,
						id: segment.id,
						order_no: segment.order_no,
						port: !segment.port ? null : {
							id: segment.port.id,
							label: segment.port.name + ' (' + segment.port.code + ')',
							value: segment.port.code, 
							time_zone: segment.port.time_zone
						},
						primary_cargo_flow: segment.primary_cargo_flow ? segment.primary_cargo_flow : null,
						route: !segment.route ? null : {
							id: segment.route.id,
							from_port_id: segment.route.from_port_id,
							to_port_id: segment.route.to_port_id,
							distance: segment.route.distance,
						},
						service_proforma_cargo_flows: cargo_flows,
						speed_required: segment.speed_required ? segment.speed_required : null,
						terminal: !segment.terminal ? null : {
							id: segment.terminal.id,
							label: segment.terminal.name,
							value: segment.terminal.code
						},
						initial_terminal_options: segment.initial_terminal_options ? segment.initial_terminal_options : [],
					});
				});
				for(let i = 0; i < this.schedule.length; i++) {
					this.validateServiceProforma(i);
				}
				for(let i = 0; i < this.schedule.length; i++) {
					this.getHoursAtSea([i]);
				}
				this.loading = false;
			})
			.catch(error => {
				this.loading = false;
				console.log(error.response);	
			});
        },

        methods: {
			// EVENTS
			onDetailServiceChange() {
				for(let i = 0; i < this.schedule.length; i++) {
					this.validateServiceProforma(i);
				}
				for(let i = 0; i < this.schedule.length; i++) {
					this.getHoursAtSea([i]);
				}
			},

            onPortChange(newPort, index) {
                this.schedule[index].port = newPort;
				this.validateServiceProforma(index);
				this.getRoutes([index-1, index]);
            },
            onTerminalChange(newTerminal, index) {
                this.schedule[index].terminal = newTerminal;
            },
			
			// date changes
            onArrivalDateChange(newDate, index) {
                let date = newDate ? this.parseDateString(newDate) : null;
                let time = this.schedule[index].arrival_date ?  this.schedule[index].arrival_date.split(' ')[1] : null;
                this.schedule[index].arrival_date = date + ' ' + time;
				this.validateServiceProforma(index);
				this.getHoursAtSea([index-1]);
            },
            onArrivalTimeChange(newTime, index) {
                let date = this.schedule[index].arrival_date ? this.schedule[index].arrival_date.split(' ')[0] : null;
                this.schedule[index].arrival_date = date + ' ' + newTime;
				this.validateServiceProforma(index);
				this.getHoursAtSea([index-1]);
            },
            onDepartureDateChange(newDate, index) {
                let date = newDate ? this.parseDateString(newDate) : null;
                let time = this.schedule[index].departure_date ? this.schedule[index].departure_date.split(' ')[1] : null;
                this.schedule[index].departure_date = date + ' ' + time;
				this.validateServiceProforma(index);
				this.getHoursAtSea([index]);
            },
            onDepartureTimeChange(newTime, index) {
                let date = this.schedule[index].departure_date ? this.schedule[index].departure_date.split(' ')[0] : null;
                this.schedule[index].departure_date = date + ' ' + newTime;
				this.validateServiceProforma(index);
				this.getHoursAtSea([index]);
            },

            onOrderChange(e) {
				this.reorder();
				if(e.moved) this.getRoutes([e.moved.oldIndex, e.moved.newIndex-1, e.moved.newIndex]);
            },


			// when an action (command) is selected from the dropdown on a ServiceProforma
            onCommand(command, index) {
                let emptyRow = {
					valid: null,
                    arrival_date: null,
                    departure_date: null,
					distance: null,
					hours_at_sea: null,
					hours_in_port: null,
					id: null,
					order_no: null,
                    port: null,
					primary_cargo_flow: null,
					route: null,
                    service_proforma_cargo_flows: [],
					speed_required: null,
                    terminal: null,
                };

                switch(command) {
                    case 'new-above':
                        this.schedule.splice(index, 0, emptyRow);
						this.reorder();
						this.getRoutes([index-1]); // will nullify route on ServiceProforma above
                        break;
                    case 'new-below':
                        let d = new Date();
                        this.schedule.splice(index+1, 0, emptyRow);
						this.reorder();
						this.getRoutes([index]); // will nullify route on ServiceProforma above
                        break;
                    case 'cargo-flow':
                        if(this.schedule[index].service_proforma_cargo_flows === null) this.schedule[index].service_proforma_cargo_flows = [];
                        this.schedule[index].service_proforma_cargo_flows.push({
							cargo_flow: {
								code: null,
								id: null,
								name: null
							},
							id: null,
							percentage: 0
						});
                        break;
                    case 'delete':
						// only add to 'deleted' array if the ServiceProforam has an id (from the DB)
						if(this.schedule[index].id)	this.deletedServiceProformas.push(this.schedule[index].id);
                        this.schedule.splice(index, 1);
						this.reorder();
						this.getRoutes([index-1]);
                        break;
                    default:
                        console.log('unknown command');
                        break;
                }
            },
            onNewServiceProforma() {
                this.onCommand('new-below', this.schedule.length - 1)
            },
			onCargoFlowDeleted(cargoFlowId) {
				this.deletedServiceProformaCargoFlows.push(cargoFlowId);
			},
			onSave() {
				// service_proformas
				// new_service_proformas
				// deleted_service_proformas
				// cargo_flows
				// new_cargo_flows
				// deleted_cargo_flows

				// SERVICE PROFORMAS
				let service_proformas = []; 
				this.schedule.map(service_proforma => {
					if(typeof service_proforma.id == 'number') {
						service_proformas.push({
							arrival_date: service_proforma.arrival_date,
							departure_date: service_proforma.departure_date,
							distance: Math.round(service_proforma.distance),
							hours_at_sea: service_proforma.hours_at_sea,
							hours_in_port: service_proforma.hours_in_port,
							id: service_proforma.id,
							order_no: service_proforma.order_no,
							port_id: service_proforma.port.id,
							route_id: service_proforma.route.id,
							service_version_id: parseInt(this.service_version_id),
							speed_required: service_proforma.speed_required,
							terminal_id: service_proforma.terminal ? service_proforma.terminal.id : null,
						});
					}
				});

				// NEW SERVICE PROFORMAS
				let new_service_proformas = []; 
				this.schedule.map(service_proforma  => {
					if(service_proforma.id == null) {
						new_service_proformas.push({
							arrival_date: service_proforma.arrival_date,
							departure_date: service_proforma.departure_date,
							distance: Math.round(service_proforma.distance),
							hours_at_sea: service_proforma.hours_at_sea,
							hours_in_port: service_proforma.hours_in_port,
							id: service_proforma.id,
							order_no: service_proforma.order_no,
							port_id: service_proforma.port.id,
							route_id: service_proforma.route.id,
							service_version_id: parseInt(this.service_version_id),
							speed_required: service_proforma.speed_required,
							terminal_id: service_proforma.terminal ? service_proforma.terminal.id : null,
						});
					}
				});

				// CARGO FLOWS
				let cargo_flows = [];
				let new_cargo_flows = [];
				for(let i = 0; i < this.schedule.length; i++) {
					if(this.schedule[i].service_proforma_cargo_flows) {
						for(let j = 0; j < this.schedule[i].service_proforma_cargo_flows.length; j++) {
							if(this.schedule[i].service_proforma_cargo_flows[j].id == null) {
								new_cargo_flows.push({
									// we need order_no if the cargo flow belongs to a 
									// new service_proforma (that doesn't yet have an id)
									service_proforma_order_no: this.schedule[i].order_no,
									id: this.schedule[i].service_proforma_cargo_flows[j].id,	
									service_proforma_id: this.schedule[i].id,
									cargo_flow_id: this.schedule[i].service_proforma_cargo_flows[j].cargo_flow.id,	
									percentage: this.schedule[i].service_proforma_cargo_flows[j].percentage
								});
							} else {
								cargo_flows.push({
									id: this.schedule[i].service_proforma_cargo_flows[j].id,	
									service_proforma_id: this.schedule[i].id,
									cargo_flow_id: this.schedule[i].service_proforma_cargo_flows[j].cargo_flow.id,	
									percentage: this.schedule[i].service_proforma_cargo_flows[j].percentage
								});
							}
						}
					}
				};

				// PACKAGE EVERYTHING
				let data = { 
					detail_service: this.detail_service ? 'YES' : 'NO',
					service_proformas: service_proformas, 
					new_service_proformas: new_service_proformas, 
					deleted_service_proformas: JSON.parse(JSON.stringify(this.deletedServiceProformas)),
					service_proforma_cargo_flows: cargo_flows,
					new_service_proforma_cargo_flows: new_cargo_flows,
					deleted_service_proforma_cargo_flows: JSON.parse(JSON.stringify(this.deletedServiceProformaCargoFlows)),
				};
				console.log(data);
				// POST and validate response 
				this.loading = true;
            	axios.post('/api/v1/service/version/' + this.service_version_id + '/proforma', data)
					.then(response => {
						if(response.status == 200) {
							console.log(response.data);
							// clear deleted service_proformas
							for(let i = 0; i < response.data.deleted_service_proformas.length; i++) {
								for(let j = 0; j < this.deletedServiceProformas.length; j++) {
									if(response.data.deleted_service_proformas[i] == this.deletedServiceProformas[j]) this.deletedServiceProformas.splice(j, 1);
								}
							}
							// clear deleted service proforma cargo flows
							for(let i = 0; i < response.data.deleted_service_proforma_cargo_flows.length; i++) {
								for(let j = 0; j < this.deletedServiceProformaCargoFlows.length; j++) {
									if(response.data.deleted_service_proforma_cargo_flows[i] == this.deletedServiceProformaCargoFlows[j]) this.deletedServiceProformaCargoFlows.splice(j, 1);
								}
							}
							// update id on new service proformas
							for(let i = 0; i < response.data.saved_service_proformas.length; i++) {
								for(let j = 0; j < this.schedule.length; j++) {
									if(response.data.saved_service_proformas[i].order_no == this.schedule[j].order_no) {
										this.schedule[j].id = response.data.saved_service_proformas[i].id;	
									}
								}
							}
							// update id on new saved service proforma cargo flows	
							for(let i = 0; i < response.data.saved_service_proforma_cargo_flows.length; i++) {
								let index = mod(response.data.saved_service_proforma_cargo_flows[i].order_no-1, this.schedule.length);
								for(let j = 0; j < this.schedule[index].service_proforma_cargo_flows.length; j++) {
									if(this.schedule[index].service_proforma_cargo_flows[j].percentage == response.data.saved_service_proforma_cargo_flows[i].percentage && 
										this.schedule[index].service_proforma_cargo_flows[j].cargo_flow.name == response.data.saved_service_proforma_cargo_flows[i].name) 
									{
										this.schedule[index].service_proforma_cargo_flows[j].id = response.data.saved_service_proforma_cargo_flows[i].id;
									}
								}
							}
						}
						this.loading = false;
						this.$message({
							message: 'Schedule was saved succesfully',
							type: 'success'
        				});
					})
					.catch(error => {
						console.log(error.response);
						this.loading = false;
						this.$message({
							message: 'An error occured.. Call Seb!',
							type: 'error'
        				});
					});
			},

			reorder() {
				for(let i = 0; i < this.schedule.length; i++) { this.schedule[i].order_no = i + 1 }
			},

			// receives an array of indexes
			getRoutes(indexes) {
				let routesToQuery = [];
				for(let i = 0; i < indexes.length; i++) {
					let index = mod(indexes[i], this.schedule.length);
					let prevIndex = mod(index+1, this.schedule.length);
					if(this.schedule[prevIndex].port && this.schedule[index].port) {
						this.schedule[index].loading = true;
						routesToQuery.push({
							index: index,
							from_port_id: this.schedule[prevIndex].port.id, 
							to_port_id: this.schedule[index].port.id,
						});
					} else {
						// nullify route
						this.schedule[index].route = null;
					}
				}
				if(routesToQuery.length) {
					axios.post('/api/v1/routes', routesToQuery).then(response => {
						for(let i = 0; i < response.data.length; i++) {
							let index = response.data[i].index;
							this.schedule[index].route = response.data[i].route;
							this.schedule[index].loading = false;
							// if no route nullify distance & req speed
							if(!this.schedule[index].route) {
								this.schedule[index].distance = null;
								this.schedule[index].speed_required = null;
							} else {
								this.schedule[index].distance = response.data[i].route.distance;
							}
						}
						this.getHoursAtSea(indexes);
					});
				}
			},

			getHoursAtSea(indexes) {
				if(this.detail_service) {
					for(let i = 0; i < indexes.length; i++) {
						let index = mod(indexes[i], this.schedule.length);
						let nextIndex = mod(index+1, this.schedule.length);

						if(this.checkDateValidity(this.schedule[index].departure_date) && this.checkDateValidity(this.schedule[nextIndex].arrival_date)) {
							let departure_date = new Date(this.schedule[index].departure_date).getTime();	
							let arrival_date = new Date(this.schedule[nextIndex].arrival_date).getTime();	
							

							let dep_date = moment(this.schedule[index].departure_date);	
							let arr_date = moment(this.schedule[nextIndex].arrival_date);	
							//console.log(moment.duration(arr_date.diff(dep_date)).asHours());

							let departure_tz = this.timeZone(this.schedule[index].port.time_zone);
							let arrival_tz = this.timeZone(this.schedule[nextIndex].port.time_zone);
							
							/*	
							console.log(this.schedule[index].port.time_zone);
							console.log(departure_tz);
							console.log(moment_tz.tz(this.schedule[index].departure_date, departure_tz));
							*/	

							// if it is the last proforma - deduct the round_trip_days from departure_date
							let wrapped_departure_date = null;
							if(nextIndex == 0) {
								wrapped_departure_date  = departure_date - (this.round_trip_days * (24*60*60*1000));
								if(this.scheduleValid) this.getTotalHours();
							} else { 
								wrapped_departure_date = departure_date;
							}

							this.schedule[index].hours_at_sea = ((arrival_date - wrapped_departure_date) / (1000*60*60));
							if(this.schedule[index].hours_at_sea > 0) {
								this.schedule[index].speed_required = (this.schedule[index].distance / this.schedule[index].hours_at_sea);								
							} else {
								this.schedule[index].speed_required = 0;
							}
						} else {
							this.schedule[index].hours_at_sea = 0;
							this.schedule[index].speed_required = 0;
						}
					}
				}
			},

			validateServiceProforma(index) {
				// check required fields 
				let arrivalValid = this.checkDateValidity(this.schedule[index].arrival_date);
				let departureValid = this.checkDateValidity(this.schedule[index].departure_date);
				let portValid =	(this.schedule[index].port != null);
				
				// calculate hours_in_port
				if(arrivalValid && departureValid) {
					let arrival = new Date(this.schedule[index].arrival_date);
					let departure = new Date(this.schedule[index].departure_date);
					this.schedule[index].hours_in_port = ((departure.getTime() - arrival.getTime())/(1000*60*60));
				} else {
					this.schedule[index].hours_in_port = null;
				}

				// validate
				if(this.detail_service) { 
					this.schedule[index].valid = (portValid && (this.schedule[index].hours_in_port >= 0)); 
				} else {
					this.schedule[index].valid = portValid;
				}
			},

			getTotalHours() {
				let total = 0;
				for(let i = 0; i < this.schedule.length; i++) {
					total += this.schedule[i].hours_in_port;	
					total += this.schedule[i].hours_at_sea;	
				}
			},

			// UTILITY METHODS
			timeZone(tz) {
				let code = 'Etc/GMT';
				let offset = parseInt(tz);
				let sign = offset < 0 ? '' : '+';
				return code + sign + offset.toString();	
			},
            prependZero(digits) {
                return digits.split('')[1] ? digits : '0' + digits;
            },
            parseDateString(date) {
                let y = date.getFullYear().toString();
                let m = (date.getMonth() + 1).toString();
                let d = date.getDate().toString();
                return y + '-' + this.prependZero(m) + '-' + this.prependZero(d);
            },
			checkDateValidity(date) {
				let d = new Date(date);
				// check if it is a date object
				if ( Object.prototype.toString.call(d) === "[object Date]" ) {
					// check if date object is a valid date
					return !isNaN(d.getTime());
				} else {
					return false;
				}
			},
			cropDate(date) {
				if(!this.checkDateValidity(date)) return null;
				let d = new Date(date);
				let ymd = this.parseDateString(d);
				let hours = d.getHours().toString();
				let minutes = d.getMinutes().toString();
				return ymd + ' ' + this.prependZero(hours) + ':' + this.prependZero(minutes);
			}
        }
    };
</script>

<style lang="scss">
	@import '~variables';

	$font-size: 12px;
	$border-radius: 2px;
	$input-height: 36px;
	
	#proforma-schedule {
		font-family: system-ui;
		font-size: 11px;
		background-color: white; 
		box-shadow: 0px 2px 6px -1px rgba(0,0,0,0.3);
	}
	.el-select {
		width: 100%;
		font-size: $font-size;
	}
	.dropdown.el-select {
		& .el-input > input {
			border-radius: $border-radius;
			height: $input-height;
			font-size: $font-size;
		}
	}
	.weekday {
		float: left;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: $input-height;
		width: 44px;
		box-sizing: border-box;
		border: 1px solid #dcdfe6;
		background-color: #F5F5F5;
		color: #9b9b9b;
		font-size: $font-size;
		border-radius: $border-radius 0px 0px $border-radius;
	}
	.datepickr.el-input {
		flex: 2 0 50%;	
		& > input {
			padding-left: 10px;
			border-radius: 0px;
			border-left: none;
			font-size: $font-size;
			height: $input-height;
		}
	}
	.timepickr.el-input {
		flex: 1 0 33%;
		& > input {
			padding-left: 10px;
			border-radius: 0px $border-radius $border-radius 0px;
			border-left: none;
			font-size: $font-size;
			height: $input-height;
		}
	}
	.cargo-flow .inline-button {
		margin-top: 10px;
	}
	.proforma-schedule-header {
		padding: 20px 0px 0;
		font-size: 10px;
		font-weight: bold;
		color: #555;
	}
	.proforma-segment {
		margin-bottom: 10px;
	}
	.add-port {
		padding: 16px 0;
	}
</style>
