<template>
	<el-row :gutter="20" class="subscription" v-loading="loading">
		<el-col :span="4">
			{{ subscription.user.name }}<br>
			<span class="text-meta">
				{{ subscription.user.company }}<br>
				{{ computedEmail }}
			</span>
		</el-col>
		<el-col :span="9" class="service-name" data-name="subscription.service_version.name">
			{{ subscription.service_version.name }}
		</el-col>
		<el-col :span="3">
			<span>{{ subscription.service_proforma.port ? subscription.service_proforma.port.name : 'No port..?' }}</span>
			<span class="order-no">{{ subscription.service_proforma.port ? ' (' + subscription.service_proforma.order_no + ')' : '' }}</span><br>
			<span class="text-meta">{{ subscription.service_proforma.port ? subscription.service_proforma.port.code : '' }}</span>
		</el-col>
		<el-col :span="3" :class="{ 'is-weak' : !subscription.vessel }">{{ subscription.vessel ? subscription.vessel.name : 'No vessel' }}</el-col>
		<el-col :span="2">{{ computedResponsibleUser }}</el-col>

		<!-- Options -->	
		<el-col :span="1">
			<a :href="'/evs/summary/' + today + '/' + computedEmail">
				<el-button type="text" icon="el-icon-tickets"></el-button>
			</a>
		</el-col>
		<el-col :span="1">
			<el-button type="text" icon="el-icon-edit" @click="onEdit"></el-button>
		</el-col>
		<el-popover
			ref="confirmDelete"
			placement="top"
			width="80"
			v-model="confirmDeleteVisible">
				<el-button type="text" size="mini" @click="confirmDeleteVisible = false">cancel</el-button>
				<el-button type="text" size="mini" @click="onDelete">confirm</el-button>
		</el-popover>	
		<el-col :span="1">
			<el-button v-popover:confirmDelete class="delete" type="text" icon="el-icon-delete"></el-button>
		</el-col>
	</el-row>
</template>

<script>
    export default {
        name: 'Subscription',
        components: {},
        props: [
			'subscription',
			'index'
		],
        data() {
            return {
				confirmDeleteVisible: false,
				loading: false,
				today: '',
            }
        },
		computed: {
			computedEmail() {
				return this.subscription.email ? 'alt: ' +  this.subscription.email : this.subscription.user.email;
			},
			computedResponsibleUser() {
				return this.subscription.responsible_user ? this.subscription.responsible_user.name : 'none';
			},
		},
		mounted() {
			this.today = moment().format('YYYY-MM-DD')
		},
		methods: {
			handleCommand(command) {
				this.$emit('command', command, this.index);
			},
			onEdit() {
				this.handleCommand('edit');
			},
			onDelete() {
				this.confirmDeleteVisible = false;
				this.handleCommand('delete');
				this.loading = true;
			},
		}
	}
</script>

<style lang="sass">
	@import '~variables'
	.order-no 
		font-size: 10px
	.subscription
		border-bottom: 1px solid #f3f3f3
</style>
