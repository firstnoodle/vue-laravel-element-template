<template>
	<el-row :gutter="0">
		<el-col :span="7">
			<slot name="service"></slot>
		</el-col>
		<el-col :span="3">
			<slot name="monitored_port"></slot>
		</el-col>
		<el-col :span="3">
			<slot name="vessel"></slot>
		</el-col>
		<el-col :span="4">
			<slot name="next_port"></slot>
		</el-col>
		<el-col :span="3">
			<slot name="subscriber"></slot>
		</el-col>
		<el-col :span="2">
			<slot name="responsible"></slot>
		</el-col>
		<el-col :span="1">
			<slot name="btnEditForecast"></slot>
		</el-col>
		<el-col :span="1">
			<slot name="btnViewForecast"></slot>
		</el-col>
	</el-row>
</template>

<script>
	export default { name: 'VesselForecastListItem' }
</script>
