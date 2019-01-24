<template>
	<el-col :span="12">
		<el-row :gutter="10">	
			<el-col :span="4" class="date-type" style="text-align: right">{{ label }}</el-col>
			<el-col :span="20">
				<el-row :gutter="6">
					<!-- DATE -->
					<el-col :span="3" :offset="1" style="text-align: left">{{ date ? formatDate(date, 'ddd') : null }}</el-col>
					<el-col :span="3" style="text-align: right">{{ date ? formatDate(date, 'DD') : null }}</el-col>
					<el-col :span="3" style="text-align: left">{{ date ? formatDate(date, 'MMM') : null }}</el-col>
					<el-col :span="3" style="text-align: right">{{ date ? formatDate(date, 'hh:mm') : null }}</el-col>
					<!-- in port / at sea -->
					<el-col class="is-weak" :span="3" :offset="2">{{ computedDays }}d</el-col>
					<el-col class="is-weak" :span="3">{{ computedHours }}h</el-col>
					<el-col class="is-weak" :span="3">{{ computedMinutes }}m</el-col>
				</el-row>
			</el-col>
		</el-row>
	</el-col>
</template>

<script>
	export default { 
		name: 'TimeRow', 
		props: [ 'label', 'date', 'duration' ],
		computed: {
			computedDays() { return this.duration ? this.getDays() : null },
			computedHours() { return this.duration ? this.getHours() : null },
			computedMinutes() { return this.duration ? this.getMinutes() : null },
		},
		methods: {
			formatDate(date, format) { return moment(date).format(format) },
			getDays() { return this.prependZero(moment.duration(parseFloat(this.duration), 'hours').days().toString()) },
			getHours() { return this.prependZero(moment.duration(parseFloat(this.duration), 'hours').hours().toString()) },
			getMinutes() { return this.prependZero(moment.duration(parseFloat(this.duration), 'hours').minutes().toString()) },
            prependZero(digits) { return digits.split('')[1] ? digits : '0' + digits },
		}
	}
</script>
