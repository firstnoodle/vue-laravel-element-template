<template>
	<el-container class="Mapper paper" direction="vertical">
		<el-header style="display:flex;width:100%;height:100%;align-items:center;justify-content:center">
			<AlphabetSelect
				:selectedLetter="selectedLetter"
				@change="letterChanged"
				></AlphabetSelect>
		</el-header>
		<el-main v-loading="loading">
			<MapperRow v-for="(mapping,index) in mappings"
				:key="genUniqueKey(mapping)"
				:mapping="mapping"		
				:index="index"
				:mappingType="mappingType"
				@saved="removeMapping"
				@saveError="saveError"
			>
			</MapperRow>
		</el-main>
	</el-container>
</template>

<script>
	import AlphabetSelect from 'root/components/AlphabetSelect.vue'
	import MapperRow from './MapperRow.vue'

    export default {
        name: 'ScraperMapper',
        components: { AlphabetSelect, MapperRow },
        props: [],
        data() {
            return {
				loading: false,
				mappings: [],
				mappingType: null,
				selectedLetter: 'a'
            }
        },
		computed: {},
		mounted() {
			this.mappingType = window.location.pathname.split('/')[3]
			this.getMappings()
		},
		methods: {
			getMappings() {
				this.loading = true
				const query = this.selectedLetter === 'all' ? '' : '?q=' + this.selectedLetter
				axios.get('/api/v1/scraper/mappings/' + this.mappingType + query).then(response => {
					this.mappings = []
					this.mappings = response.data.data
					this.loading = false
				}).catch(error => {
					this.loading = false
					Raven.captureException(new Error(JSON.stringify(error.response)))
				})
			},
			removeMapping(index) {
				this.mappings.splice(index, 1)
				this.$notify({
					title: 'One down!',
				  	message: 'One down! ' + this.mappings.length + ' in [' + this.selectedLetter + '] to go..',
				  	position: 'bottom-right',
				  	type: 'success'
				});
			},
			saveError() {
				this.$notify({
					title: 'Error',
				  	message: 'There was an error trying to save the mapping',
				  	position: 'bottom-right',
				  	type: 'error'
				});
			},
			letterChanged(letter) {
				this.selectedLetter = letter
				this.getMappings()
			}
		}
	}
</script>

<style lang="sass">
	@import '~variables'

</style>
