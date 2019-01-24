<template>
	<component 
		:is="currentComponent" 
		v-bind="currentProps" 
		v-loading="loading"
		@back="back"
		>
	</component>	
</template>

<script>
/* DUMMY DATA */
import {permissions} from 'root/dummy/permissions.js'

import {ItemListDetail} from 'root/mixins/ItemListDetail.js'
import PermissionList from './PermissionList.vue'
import PermissionItem from './PermissionItem.vue'

export default {
	name: 'Permissions',
	mixins: [ ItemListDetail ],
	data() {
		return {
			components: {
				list: PermissionList,
				item: PermissionItem
			},
			dummyData: permissions,
			loading: true,
			param: 'id',
			queries: {
				page: {
					type: Number,
					value: null
				},
				name: {
					type: String,
					value: null
				},
			},
		}
	},
}
</script>
