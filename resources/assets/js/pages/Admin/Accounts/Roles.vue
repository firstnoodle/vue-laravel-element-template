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
import {roles} from 'root/dummy/roles.js'

import {ItemListDetail} from 'root/mixins/ItemListDetail.js'
import RoleList from './RoleList.vue'
import RoleItem from './RoleItem.vue'

export default {
	name: 'Roles',
	mixins: [ ItemListDetail ],
	data() {
		return {
			components: {
				list: RoleList,
				item: RoleItem
			},
			dummyData: roles,
			loading: true,
			param: 'id',
			queries: {
				role: {
					type: String,
					value: null
				},
			},
			selectedItem: null,
		}
	},
}
</script>
