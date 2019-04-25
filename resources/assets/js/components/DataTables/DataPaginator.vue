<template>
	<div>
		<el-button 
			size="mini" 
			type="text" 
			icon="el-icon-arrow-left" 
			@click="changePage('previous')"
			:disabled="current_page === 1"
			>
		</el-button>
		<el-input-number 
			v-model="computedCurrentPage" 
			size="mini" 
			ref="current_page_input"
			:controls="false" 
			:min="1" 
			:max="last_page"
			>
		</el-input-number>
		<el-select 
			size="mini" 
			v-model="computedPerPage"
			>
			<el-option 
				v-for="option in optionList"
				:key="option.label"
				:label="option.label"
				:value="option"
				>
				<span style="float: left">{{ option.label }}</span>
			    <span style="float: right; color: #8492a6; font-size: 13px">{{ option.value + ' per page' }}</span>
			</el-option>
		</el-select>
		<el-button 
			size="mini" 
			type="text" 
			icon="el-icon-arrow-right" 
			@click="changePage('next')"
			:disabled="current_page === last_page"
			>
		</el-button>
	</div>
</template>

<script>
	export default {
		name: 'DataPaginator',
		props: {
			current_page: {
				type: Number,
				default: 1
			},
			per_page: {
				type: Number,
				default: 50
			},
			perPageOptions: {
				type: Array,
				default: function () {
        			return [10, 25, 50, 100, 200, 500]
      			}
			},
			last_page: {
				type: Number,
				default: 1
			},
			total: {
				type: Number,
			}
		},
		data() {
			return {
				optionList: [],
				t: 24
			}
		},
		computed: {
			computedCurrentPage: {
				get() { return this.current_page },
				set(newValue) { 
					if(newValue > 0 && newValue <= this.last_page) this.$emit('currentPageChange', newValue) 
				}
			},
			computedPerPage: {
				get() { return `/ ${this.last_page} pages` },
				set(newValue) { 
					this.$emit('perPageChange', newValue)
				}
			}
		},
		mounted() {
			this.calculatePerPageOptions()
		},
		methods: {
			changePage(direction) {
				switch(direction) {
					case 'previous':
						if(this.current_page > 1) this.$emit('currentPageChange', this.current_page - 1)
						break;
					case 'next':
						if(this.current_page < this.last_page) this.$emit('currentPageChange', this.current_page + 1)
						break;
					default:
						console.error('page cycle direction not accepted', direction)
				}
			},
			calculatePerPageOptions() {
			    this.optionList = []
			    let allowedOptions = []

			    // handle if last_page is 1 - set per_page to 10
			    // otherwise make a list of allowed options
			    if(this.total < this.perPageOptions[0]) {
			    	allowedOptions.push(this.perPageOptions[0])
			        this.$emit('perPageChange', this.perPageOptions[0])
			    } else {
			        allowedOptions = this.perPageOptions.filter(option => option < this.total).sort((a,b) => a-b)

			        // check if we need to lower per_page
			        const highestOption = allowedOptions[allowedOptions.length-1]

			        if(highestOption > this.perPageOptions[this.perPageOptions.length-1]) this.per_page = highestOption
			    }
			    // populate optionList
			    for(const i in allowedOptions) {
			        const option = allowedOptions[i]
			        const pages = Math.ceil(this.total / option)
			        this.optionList.push({
			            label: pages,
			            value: option
			        })
			    }
			    
			    // if allowedOptions is below max perPageOption (ie if total fx is 422) 
			    // -> add a per page option with last_page
			    // if(this.total && allowedOptions.length < this.perPageOptions.length) {
			    //     this.optionList.push({
			    //         label: `${this.last_page} (1 page)`,
			    //         last_page: 1,
			    //         value: this.last_page
			    //     })
			    // }
			},
		}
	}
</script>
