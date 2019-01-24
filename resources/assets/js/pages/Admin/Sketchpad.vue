<template>
	<div>
		<h1>Sketchpad</h1>
		<el-button @click="dialogVisible = true">OPEN</el-button>

		<pre><code class="js" v-highlightjs>{{ code }}</code></pre>

		<div class="schedule is-striped">
			<div class="schedule-row">
				<div class="schedule-row__port-info is-top">
					<div class="schedule-row__port-name">Hamburg</div>
				</div>
				<div class="schedule-row__data-labels is-top">
					<div class="schedule-row__data-label">Arr</div>
				</div>
				<div class="schedule-row__date is-top">
					<eeDate :date="scheduleRow.arrival"></eeDate>
				</div>
				<div class="schedule-row__duration is-top">
					<eeDuration :duration="scheduleRow.hours_in_port"></eeDuration>
				</div>

				<div class="schedule-row__port-info is-bottom">
					<div class="schedule-row__next-port">12314 nm</div>
					<div class="schedule-row__required-speed">17.5 kn</div>
				</div>
				<div class="schedule-row__data-labels is-bottom">
					<div class="schedule-row__data-label">Dep</div>
				</div>
				<div class="schedule-row__date is-bottom">
					<eeDate :date="scheduleRow.departure"></eeDate>
				</div>
				<div class="schedule-row__duration is-bottom">
					<eeDuration :duration="scheduleRow.hours_at_sea"></eeDuration>
				</div>
			</div>
			<div class="schedule-row">
				<div class="schedule-row__port-info is-top">
					<div class="schedule-row__port-name">Hamburg and other collaborative</div>
				</div>
				<div class="schedule-row__data-labels is-top">
					<div class="schedule-row__data-label">Arr</div>
				</div>
				<div class="schedule-row__date is-top">
					<eeDate :date="scheduleRow.arrival"></eeDate>
				</div>
				<div class="schedule-row__duration is-top">
					<eeDuration :duration="scheduleRow.hours_in_port"></eeDuration>
				</div>

				<div class="schedule-row__port-info is-bottom">
					<div class="schedule-row__next-port">12314 nm</div>
					<div class="schedule-row__required-speed">17.5 kn</div>
				</div>
				<div class="schedule-row__data-labels is-bottom">
					<div class="schedule-row__data-label">Dep</div>
				</div>
				<div class="schedule-row__date is-bottom">
					<eeDate :date="scheduleRow.departure"></eeDate>
				</div>
				<div class="schedule-row__duration is-bottom">
					<eeDuration :duration="scheduleRow.hours_at_sea"></eeDuration>
				</div>
			</div>
		</div>
		<ActualButton :state="status" onLabel="LOCKED" offLabel="LOCK" :disabled="false" @toggle="onToggle"></ActualButton>

		<el-dialog
			title="Tips"
			:visible.sync="dialogVisible"
			width="1180px"
			>
		</el-dialog>
	</div>
</template>

<script>
import {jsonData} from 'root/dummy/service_vessel_assignment.js'

import eeDate from 'root/components/Time/eeDate.vue'
import eeDuration from 'root/components/Time/eeDuration.vue'
import ActualButton from 'root/components/ActualButton.vue'

export default {
	name: 'Sketchpad',
	components: { ActualButton, eeDate, eeDuration },
	data() {
		return {
			status: false,
			code: `
var test = 5;

function printTest(value) {
	console.log(value);
}

printTest(test);
`,
			dialogVisible: false,
			scheduleRow: {
				port: {
					name: 'Hamburg'
				},
				arrival: '2018-09-22 17:30',
				hours_in_port: 22,
				departure: '2018-09-24 12:00',
				hours_at_sea: -56,
				distance: 2345,
				speed: 17.5,
			},
		}
	},
	mounted() {
		console.log(JSON.parse(jsonData).data.service_version.name)
	},
	methods: {
		onToggle() {
			this.status = !this.status
		}
	}
}
</script>
