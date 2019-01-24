<template>
	<div class="drag-handle">
		<div class="drag-handle-knob"></div>	
		<div class="drag-handle-knob"></div>	
		<div class="drag-handle-knob"></div>	
		<div class="drag-handle-knob"></div>	
		<div class="drag-handle-knob"></div>	
		<div class="drag-handle-knob"></div>	
		<div class="drag-handle-knob"></div>	
		<div class="drag-handle-knob"></div>	
	</div>
</template>

<script>
	export default {
		name: 'DragHandle'
	}
</script>

<style lang="scss">
	.drag-handle {
		display: inline-flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-items: flex-start;
		cursor: move;
		float: left;
		width: 22px;
		padding: 6px 10px 6px 0px;
		height: 24px;
		& > .drag-handle-knob {
			float: left;
			width: 2px;
			height: 2px;
			border-radius: 1px;
			background-color: rgba(0, 0, 0, 0.4);
			margin: 2px;
		}
		&:hover > .drag-handle-knob {
			background-color: rgba(0, 0, 0, 0.7);
		}
	}
</style>
