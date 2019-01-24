<template>
	<button 
		class="actual-toggle" 
		:class="{ 'is-on' : state }"
		:disabled="disabled"
		@click="$emit('toggle')"
		>
		<div 
			class="actual-toggle__letter"
			v-for="letter in letters.split('')"
		>
			{{ letter }}
		</div>
	</button>
</template>

<script>
export default {
	name: 'ActualButton',
	props: [ 'disabled', 'offLabel', 'onLabel', 'state'],
	computed: {
		letters() { return this.state ? this.onLabel : this.offLabel },
	},
}
</script>

<style lang="scss">
@import '~variables';

.actual-toggle {
    background-color: $--color-grey-3;
    border: none;
    border-left: 1px solid $--table-border-color;
    border-radius: 0px;
	color: $--color-action-blue;
	display: inline-block;
	float:right;
    font-size: 8px;
    height: 79px;
    padding: 0px;
    position: relative;
    width: 20px;
    
    &.is-on {
		background-color: $--color-action-blue;         
		color: white;

		&:hover {
			color: $--color-pale-blue;
			cursor: pointer;   
			
			&:active {
				background-color: $--color-dark-blue-1;
				color: $--color-white;
			}
		}
    }
    
    &:active {
        background-color: white;
    }
    
    &:hover {
		color: $--color-dark-blue-1;
        cursor: pointer;   
        
        &:active {
            background-color: $--color-dark-blue-1;
			color: $--color-white;
        }
    }
    
    &:focus {
        border-left: 1px solid $--color-dark-blue-1;   
		outline: none;
    }
    
    &:disabled {
        background-color: $--color-grey-2; 
		color: $--color-grey-5;
        cursor: not-allowed;
        
        &:active {
        	background-color: $--color-grey-2; 
			color: $--color-grey-4;
        }
    }
}
</style>
