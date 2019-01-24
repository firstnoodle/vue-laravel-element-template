<template>
	<div class="service-name">
		<div class="service-version-number" v-if="showVersion">
			{{ name ? computedName.version : '' }}
		</div>
		<div class="service-name-tag service-name-tag--alliance" v-if="computedAllianceName">
			<div class="service-name-tag__name">{{ computedAllianceName }}</div>
			<div class="service-name-tag__service">{{ computedAllianceService }}</div>
		</div>
		<div class="service-name-tag" v-for="carrier in computedCarriers">
			<div class="service-name-tag__name">{{ carrier.name }}</div>
			<div class="service-name-tag__service">{{ carrier.service }}</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'ServiceName',
		props: { 
			name: String, 
			showVersion: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {

			}
		},
		computed: {
			computedName() {
				return this.name ? utils.parseServiceName(this.name) : null;
			},
			computedAllianceName() {
				return this.computedName ? 
					this.computedName.alliance ? this.computedName.alliance.name : null
					: null;
			},
			computedAllianceService() {
				return this.computedName ? 
					this.computedName.alliance ? this.computedName.alliance.service : null
					: null;
			},
			computedCarriers() {
				return this.computedName ? 
					this.computedName.carriers ? this.computedName.carriers : [] 
					: [];
			}
		},
		methods: {

		}
	}
</script>

<style lang="sass">
	@import '~variables'
	.service-name
		align-items: center
		display: inline-flex
		flex-direction: row
		font-size: $g-txt-tiny
		height: 100%
	.service-version-number
		display: inline-flex
		align-items: center
		justify-content: center
		width: 20px
		height: 20px
		margin-right: 10px
		border: 1px solid #ccc
		// background-color: $pale-blue
		color: $g-dark-blue
		border-radius: 10px
		// font-weight: bold
	.service-name-tag
		display: inline-flex
		flex-direction: row
		align-items: center
		height: 24px
		padding: 0px 6px
		margin-right: 1px
		background-color: white 
		border-right: 1px solid #f3f3f3
		&:last-child
			border-right: none
		// border-radius: 3px
	.service-name-tag__name
		color: #999
		margin-right: 4px
	.service-name-tag__service
		color: #333
		// font-weight: bold
	.service-name-tag--alliance
		background-color: #f3f3f3
		border-radius: 3px

</style>