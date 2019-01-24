<template>
	<div>
		<component 
			:is="currentComponent" 
			v-bind="currentProps" 
			@back="back"
			@gotoPage="gotoPage"
			>
		</component>	
	</div>
</template>

<script>
/* DUMMY DATA */
import {users} from 'root/dummy/users.js'

import {ItemListDetail} from 'root/mixins/ItemListDetail.js'
import UserList from './UserList.vue'
import UserItem from './UserItem.vue'

export default {
	name: 'Users',
	mixins: [ ItemListDetail ],
	data() {
		return {
			components: {
				list: UserList,
				item: UserItem
			},
			dummyData: users,
			param: {
				name: 'id',
				type: Number,
				value: null,
			},
			queries: {
				company: {
					type: String,
					value: null
				},
				email: {
					type: String,
					value: null,
					// validator...
				},
				name: {
					type: String,
					value: null
				},
				page: {
					type: Number,
					value: null
				},
				plan_end: {
					type: Date,
					value: null
				},
				plan_start: {
					type: Date,
					value: null
				},
				status: {
					type: String,
					value: null,
					validator: function(value) {
						return ['PRO','PRO_EXPIRING','PRO_EXPIRED','TRIAL','TRIAL_EXPIRED','FREE','ADMINISTRATOR','DEVELOPER'].indexOf(value) !== -1
					}
				},
				user_plans: {
					type: Number,
					value: null
				},
				deleted: {
					type: Boolean,
					value: null
				}
			},
		}
	},
}
</script>
