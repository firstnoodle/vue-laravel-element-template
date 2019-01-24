<template>
	<div ref="container" class="faded-line" :class="{ 'is-expanded' : expanded }"  @mouseover="showArrow=true" @mouseleave="onMouseOut">
		<div ref="content" class="faded-line__content">
			<slot></slot>
		</div>
		<div v-if="expandable" class="faded-line__fade" :style="{ width: fadeWidth +'px' }">
			<div v-if="showArrow" class="faded-line__arrow" @click="showContent">
				<span></span>	
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'FadedLine',
	props: { 
		'fadeWidth': {
			type: Number,
			default: 50
		}, 
		'paddingLeft': {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			expandable: false,
			expanded: false,
			showArrow: false,
		}
	},
	mounted() {
		this.expandable = (this.$refs.container.offsetWidth < this.$refs.content.offsetWidth);
	},
	methods: {
		showContent() {
			this.expanded = true;
		},
		onMouseOut(e) {
			if(this.expanded) {
				setTimeout(() => {
					this.expanded = false;	
				}, 500);
			}
			this.showArrow = false;
		}
	}
}
</script>

<style lang="sass">
	@import '~variables'
	.faded-line 
		background-color: white
		height: 100%
		overflow: hidden
		position: relative
		width: 100%
		&.is-expanded
			overflow: visible
			z-index: 1000
			.faded-line__content
				background-color: white
				box-shadow: 0px 0px 12px 0px rgba(0,0,0,0.2)
			.faded-line__fade
				display: none
	.faded-line__content
		align-items: center
		display: inline-flex
		font-size: 10px
		height: 100%
		padding: 0px 10px
		white-space: nowrap
	.faded-line__fade
		background: linear-gradient( to right, rgba(255,255,255,0) 0%,white 100% )
		height: 100% 
		position: absolute
		right: 0px
		top: 0px
	.faded-line__arrow
		align-items: center
		background-color: rgba(255,255,255,0.8)
		cursor: pointer
		display: flex
		height: 100%
		justify-content: center
		position: absolute
		right: 0px
		width: 40px
		&>span
			border-right: 1px solid $g-action-blue
			border-top: 1px solid $g-action-blue
			display: block
			height: 8px
			transform: rotate(45deg)
			width: 8px
		&:hover
			// background-color: rgba(240, 240, 240, 0.8)
			background-color: $g-pale-blue 
			

</style>
