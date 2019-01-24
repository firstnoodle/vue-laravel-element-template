<template>
	<el-container class="SubscriptionList paper" v-loading="loadingSubscriptions">
		<el-main>
			<el-row 
				class="header subscription"
				:gutter="20"
			>
				<el-col :span="4">Subscriber</el-col>
				<el-col :span="9" class="service-name" data-name="subscription.service_version.name">
					Service
				</el-col>
				<el-col :span="3">Port</el-col>
				<el-col :span="3">Vessel</el-col>
				<el-col :span="3">Responsible</el-col>
			</el-row>
			
			<Subscription
				v-for="(subscription,index) in subscriptions"
				:key="subscription.id"	
				:subscription="subscription"
				:index="index"
				@command="onCommand"
			>
			</Subscription>
		</el-main>
		<el-footer>
			<el-row class="add-port" type="flex" justify="center">
				<button class="inline-button" @click="onNewSubscription">New subscription</button>
			</el-row>
			<!-- FINISH SOON
			<el-row class=""add-portgination type="flex" justify="center">
				<el-pagination
					layout="prev, pager, next"
					:total="50">
				</el-pagination>
			</el-row>
			-->
		</el-footer>

		<EditSubscription 
			:subscription="selectedSubscription"
			:visible="editDialogVisible"
			:windowTitle="editSubscriptionWindowTitle"
			@onCancel="editDialogVisible = false"
			@subscriptionSaved="onSubscriptionSaved"
		>
		</EditSubscription>
	</el-container>

</template>

<script>
    import Subscription from './Subscription.vue'
    import EditSubscription from './EditSubscription.vue'

    export default {
        name: 'Subscriptions',
        components: { Subscription, EditSubscription },
        props: [],
        data() {
            return {
				loadingSubscriptions: false,
				subscriptions: [],
				editDialogVisible: false,
				selectedSubscription: null,
				editSubscriptionWindowTitle: 'Edit subscription',
            }
        },
		computed: {
		},
		mounted() {
			/*
			this.loadingSubscriptions = true;
            axios.get('/api/v1/vessel-schedules/subscriptions').then(response => {
				this.subscriptions = response.data.data.map(subscription => subscription);
				this.loadingSubscriptions = false;
				console.log(response);
			});
			*/
		},
		methods: {
			onCommand(command, index) {
				switch(command) {
					case('delete'):
						axios.delete('/api/v1/vessel-schedules/subscription/' + this.subscriptions[index].id)
							.then(response => {
								console.log(response.data.data);
								for(let i = 0; i < this.subscriptions.length; i++) {
									if(this.subscriptions[i].id == response.data.data.id) {
										this.subscriptions.splice(i, 1);
									}
								}
								
							})
							.catch(error => {
								console.log(error.response);
							});
						break;
					case('edit'):
						this.editSubscriptionWindowTitle = 'Edit subscription';
						this.selectedSubscription = this.subscriptions[index];
						this.editDialogVisible = true;	
						break;
					default:
						console.log('unknown command');
						break;
				}
			},
			onNewSubscription() {
				this.editSubscriptionWindowTitle = 'New subscription';
				this.selectedSubscription = null;
				this.editDialogVisible = true;	
			},
			onSubscriptionSaved(data, newSubscription) {
				// we need to know if it is a new or updated
				if(newSubscription) {
					this.subscriptions.push(data);
				} else {
					for(let i = 0; i < this.subscriptions.length; i++) {
						if(this.subscriptions[i].id == data.id) {
							this.subscriptions[i] = data;
						}
					}
				}
				this.editDialogVisible = false;
			}
		}
	}
</script>

<style lang="sass">
	.SubscriptionList .header
		font-weight: bold
		font-size: 10px

</style>
