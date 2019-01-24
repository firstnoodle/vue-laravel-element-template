<template>
	<div class="service-name">
		<div class="service-version-number" v-if="showVersion">
			{{ name ? 'v' + computedName.version : '' }}
		</div>
		<div class="service-name-tag service-name-tag--alliance" v-if="computedAllianceName">
			<div class="service-name-tag__name">{{ computedAllianceName }}</div>
			<div class="service-name-tag__service">{{ computedAllianceService }}</div>
		</div>
		<div 
			v-for="carrier in computedCarriers"
			class="service-name-tag" 
			>
			<div class="service-name-tag__name">{{ carrier.name }}</div>
			<div class="service-name-tag__service">{{ carrier.service }}</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'ServiceCarrierNames',
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
	.service-name
		font-family: Helvetica Neue 
		align-items: center
		display: inline-flex
		flex-direction: row
		flex-wrap: wrap
		font-size: 10px
		height: 100%
	.service-version-number
		align-items: center
		background-color: #444
		border-radius: 3px
		color: #FFF
		display: inline-flex
		height: 20px
		justify-content: center
		margin-right: 2px
		padding: 0px 6px
	.service-name-tag
		display: inline-flex
		flex-direction: row
		align-items: center
		height: 20px
		padding: 0px 6px
		margin-top: 3px
		margin-bottom: 3px
		margin-right: 1px
		background-color: white 
		border-right: 1px solid #e6e6e6
		&:last-child
			border-right: none
	.service-name-tag__name
		color: #bbb
		margin-right: 3px
	.service-name-tag__service
		color: #364451
	.service-name-tag--alliance
		background-color: #e6e6e6
		border: none
		border-radius: 3px
		margin-left: 2px
		& > .service-name-tag__name
			color: #999

</style>
