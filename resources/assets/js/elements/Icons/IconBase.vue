<template>
	<svg xmlns="http://www.w3.org/2000/svg"
		:width="width"
		:height="height"
		:viewBox="viewBox"
		:aria-labelledby="iconName"
		role="presentation"
		class="svg-icon"
		style="display:inline"
		>
		<title :id="iconName" lang="en">{{iconName}}</title>
		<g>
			<slot />
		</g>
	</svg>
</template>

<script>
export default {
	name: 'IconBase',
	props: {
		iconName: {
			type: String,
			default: 'box'
		},
		width: {
			type: [Number, String],
			default: 18
		},
		height: {
			type: [Number, String],
			default: 18
		},
		iconClass: {
			type: String,
			default: ''
		}
	},
	computed: {
		viewBox() {
			return '0 0 ' + this.width + ' ' + this.height		
		}
	}
}
</script>
