<template>
	<div class="alphabet-select">
		<div 
			v-for="letter in alphabet"	
			class="alphabet-select__letterbox"
			:class="{ 'is-selected' : letter === selectedLetter }"
			@click="$emit('change', letter)"
			>
				<span class="aphabet-select__letter">
					{{ letter }}
				</span>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'AlphabetSelect',
		props: {
			'selectedLetter': {
				type: String,
				default: 'a'
			},
		},
		data() {
			return {
				alphabet: []
			}
		},
		created() {
			for(let i = 0; i < 26; i++) {
				this.alphabet.push(String.fromCharCode(97 + i))
			}
			this.alphabet.push('all')
		},
	}
</script>

<style lang="sass">
	@import '~variables'

	.alphabet-select
		display: flex

	.alphabet-select__letterbox
		align-items: center
		border-radius: 16px
		background-color: none
		color: #999
		cursor: pointer
		display: inline-flex
		justify-content: center
		width: 32px
		height: 32px
		&:hover
			background-color: #eee
		&.is-selected
			background-color: $g-dark-blue	
			color: white
			font-weight: bold
		
</style>
