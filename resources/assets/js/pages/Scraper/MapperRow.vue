<template>
	<div class="mapper-rows">
		<el-row :gutter="10" class="mapper-row" :class="{ 'focus' : focus || saving }">
			<el-col :span="7" :offset="6">
				<div class="mapper-row__name">{{ mapping.name + ' ' }}</div>
				<div class="mapper-row__company">{{ mapping.company_name }}</div>
			</el-col>
			<el-col :span="8">
				<el-select 
					filterable
					remote	
					class="dropdown mapper-row__options"
					loading-text="fetching options"
					no-data-text="No data"
					ref="options"
					v-model="computedSelection"
					:remote-method="optionsRemoteMethod"
					@focus="focus = true"
					@blur="onSelectBlur"
				>
					<el-option
						v-for="option in mappingOptions"
						:key="option.id"
						:label="option.label"
						:value="option">
					</el-option>
				</el-select>

				<el-button 
					v-if="computedSelection"
					size="mini"
					type="success"
					icon="el-icon-check"
					:loading="saving"
					:disabled="!computedSelection"
					circle
					@click="save" 
				>
				</el-button>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	export default {
		name: 'MapperRow',
		props: ['index', 'mapping', 'mappingType'],
		data() {
			return {
				focus: false,
				selection: null,
				mappingOptions: [],
				saving: false,
			}
		},
		computed: {
			computedSelection: {
				get() { return this.selection ? this.selection.label : null },
				set(newSelection) { this.selection = newSelection }
			},
		},
		methods: {
			onSelectBlur() {
				this.focus = false
			},
			optionsRemoteMethod(query) {
				if(query && query.length > 0) {
					let mappingPath = this.mappingType === 'services' ? 'service-version-companies' : this.mappingType 
					let serviceAppendage = this.mappingType === 'services' ? '&company_code=' + this.mapping.company_code : ''
					axios.get('/api/v1/' + mappingPath + '?q=' + query + serviceAppendage)
						.then(response => {
							this.mappingOptions = response.data.data.map(mapping => {
								const label = this.mappingType === 'services' ? '[' + mapping.name + '] ' + mapping.service_version.name : mapping.name
								return {
									id: mapping.id,
									label,
									value: mapping,
								}
							})
						}).catch(error => {
							Raven.captureException(new Error(JSON.stringify(error.response.message)))
						})
				}
			},
			save() {
				this.saving = true
				let data = {
					company_code: this.mapping.company_code,
					name: this.mapping.name,
				}

				switch(this.mappingType) {
					case 'ports':
						data.port_code = this.selection.value.code
						break;
					case 'terminals':
						data.terminal_code = this.selection.value.code
						break;
					case 'services':
						data.service_code = this.selection.value.code
						break;
					case 'vessels':
						data.vessel_owner_id = this.selection.value.vessel_owner_id
						break;
				}

				axios.post('/api/v1/scraper/mappings/' + this.mappingType, data).then(response => {
					this.$emit('saved', this.index)
					this.saving = false
				}).catch(error => {
					this.$emit('saveError')
					this.saving = false
					Raven.captureException(new Error(JSON.stringify(error.response)))
				})
			},
		}
	}
</script>

<style lang="sass">
	@import '~variables'


	.mapper-row
		padding: 10px
		&.focus
			background-color: $g-pale-blue
			
	.mapper-row__name
		color: $g-dark-blue

	.mapper-row__company
		color: $g-meta-grey
		font-size: $g-txt-tiny

	.mapper-row__options
		margin-right: 10px
		& > .el-input
			font-size: $g-txt-small
</style>
