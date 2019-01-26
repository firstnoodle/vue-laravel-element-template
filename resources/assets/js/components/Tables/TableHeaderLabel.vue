<template>
	<el-col :span="span">
		<div
			class="table__header-label"
			:class="{ 'is-active' : sort }"
			@click="$emit('click', label)"
		>
			{{ label }}
			<i class="el-icon-arrow-down" v-if="sort === 'descending'"></i>
			<i class="el-icon-arrow-up" v-else-if="sort === 'ascending'"></i>
		</div>
	</el-col>
</template>

<script>
export default {
	name: 'TableHeaderLabel',
	props: [ 'label', 'sort', 'span' ],
}
</script>

<style lang="scss">
	.table__header-label {
		cursor: pointer;
		display: inline-block;
		padding-right: 10px;
		user-select: none;

		&.is-active {
			font-weight: bold;
		}
	}
</style>
