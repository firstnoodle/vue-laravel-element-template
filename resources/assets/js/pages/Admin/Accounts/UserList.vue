<template>
	<div>
		<h1>Select a user</h1>
		<span v-for="(value, key, index) in queries">{{ key + '=' + value.value + ' ' }}</span>
		<ul v-loading="loading">
			<li v-for="user in items">
				<router-link :to="path + '/' + user.id.toString()">{{ user.name }}</router-link>
			</li>
		</ul>
		<el-pagination
			layout="prev, pager, next"
			:small="true"
			:current-page.sync="pagination.current_page"
			:page-count="pagination.pages"
			:page-size="pagination.per_page"
			:total="pagination.total"
			@current-change="gotoPage"
			>
		</el-pagination>
	</div>
</template>

<script>
export default {
	name: 'UserList',
	props: [ 'items', 'loading', 'path', 'queries', 'pagination' ],
	data() {
		return {
			
		}
	},
	mounted() {
		//console.log(this.queries)
	},
	methods: {
		gotoPage(page) { this.$emit('gotoPage', page) }
	}
}
</script>
