<template>
	<div
		v-else
		class="table__header-label"
		@click="$emit('click', label)"
		>
		{{ label }}
		<i class="el-icon-arrow-down" v-if="sort === 'descending'"></i>
		<i class="el-icon-arrow-up" v-else-if="sort === 'ascending'"></i>
	</div>
</template>

<script>
export default {
	name: 'TableHeaderLabel',
	props: [ 'label', 'sort' ],
}
</script>

<style lang="scss">
	.table__header-label {
		cursor: pointer;
		display: inline-block;
		padding: 10px;
		user-select: none;
	}
</style>
