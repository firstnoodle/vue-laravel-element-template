
/****************************************************************************
 *
 * Components using this mixin should implement the following data:
 *		items: [],		// list of items 
 *		param: 'id', 	// should match route param fx  /:id
 *		queries: {
 *			queryName: {
 *				type: String,
 *				value: null,
 *
 *				// optional
 *				validator: function(value) {
 *					// validation code
 *				}
 *			}
 *		}
 *
 ****************************************************************************/

import {Fajax} from 'root/mixins/Fajax.js'

export const ItemListDetail = {
	data() {
		return {
			currentComponent: null,
			dummyData: null,
			items: [],
			loading: true,
			pagination: {
				current_page: null,
				pages: null,
				per_page: 15,
				total: null,
			},
			path: '',
			queries: {},
			selectedItem: null,
		}
	},
	computed: {
		currentProps() {
			if(this.currentComponent === this.components.list) { 
				let activeQueries = {}
				for(const query in this.queries) { 
					if(this.queries[query]) {
						if(this.queries[query].value !== null) activeQueries[query] = this.queries[query] 
					}
				}
				return { items: this.items, loading: this.loading, path: this.path, queries: activeQueries, pagination: this.pagination }
			} else {
				return { item: this.selectedItem }
			}
		}
	},
	watch: {
		$route(to, from) {
			this.update()
		}
	},
	created() {
		// TODO 
		// Dont register 'required' data variables in this mixin -> currentComponent, items, param, path, queries, and selectedItem
		// Check if they exist in parent component and if not, throw error

		this.locateSelf(this.$router.options.routes, [], this.$options.name)

		// remove forward slash at the end
		this.path = this.path.split(':')[0].replace(/\/$/, '')
		this.update()
		this.loadData()
	},
	methods: {

		back() {
			let queryString = ''
			// Check if there were queries stored locally and reapply them
			for(const key in this.queries) {
				if(this.queries[key].value) {
					if(queryString.length) queryString += '&'
					queryString += key + '=' + this.queries[key].value.toString()
				}
			}
			if(queryString.length) this.$router.push('.?' + queryString)
			else this.$router.push('.')
		},

		gotoPage(page) {
			this.$router.push('?page=' + page)
		},

		/* Recursively find path to current component
		********************************************/
		locateSelf(entry, path, name) {
			let currentPath = path
			for(const route of entry) {
				currentPath.push(route.path)
				if(route.component.name === name) this.path = currentPath.join('/')
				else if(route.children) this.locateSelf(route.children, currentPath, name)
				else if(currentPath.length) currentPath.pop()
			}
			currentPath.pop()
		},

		update() {
			const _component = this.$route.params[this.param.name] ? 'item' : 'list'
			this.currentComponent = this.components[_component]
			
			// what page are we on
			if(_component === 'list') {
				if(this.getQueries()) this.loadData()
			} else {
				this.getParam()
				const __current_page = Math.floor( this.param.value / this.pagination.per_page ) + 1
				if(__current_page !== this.pagination.current_page) this.loadData()
			}
		},

		loadData() {
			this.loading = true
			/*
			Fajax.paginate(this.dummyData, this.pagination).then(data => {
				this.pagination = {
					current_page: data.current_page,
					per_page: data.per_page,
					total: data.total,
					pages: data.pages,
				}
				this.items = data.data
				this.selectedItem = current_item ? this.items[current_item%this.pagination.per_page] : null
				this.loading = false
			}).catch(error => {
				this.$message.error(error.message);
				this.loading = false
			})
			*/
		},

		getParam() {
			let paramValue = this.$route.params[this.param.name]
			let parsedParamValue = null

			if(isNaN(paramValue)) { // String or Boolean
				if(paramValue === 'true' || paramValue === 'false') parsedParamValue = paramValue === 'true' ? true : false
				else parsedParamValue = paramValue
			} else { // Int or Float
				parsedParamValue = paramValue.indexOf('.') != -1 ? parseFloat(paramValue) : parseInt(paramValue)
			}

			if(this.param.validator !== undefined) {
				if(this.param.validator(parsedParamValue)) this.param.value = parsedParamValue
				else console.error('param ['+this.param.name+'] didnt pass custom validation:\n' + this.param.validator.toString())
			} else {
				if(typeof(parsedParamValue) === typeof(this.param.type())) this.param.value = parsedParamValue
				else console.error('param ['+this.param.name+'] requires a ' + typeof(this.param.type()) + ' as value. you passed a ' + typeof(parsedParamValue))
			}
		},

		getQueries() {
			let newQueries = {}

			/* check if there are any queries 
			*********************************/
			if(!_.isEmpty(this.$route.query)) {

				/* Iterate through present queries -> parse and validate
				**************************************************************************************/
				for(const key in this.$route.query) {
					const queryValue = this.$route.query[key]

					if(key in this.queries && queryValue) {
						/* transform query value from string, to its actual type - fx "55" int, "false" boolean, "2.13" float
						*****************************************************************************************************/
						let parsedQueryValue = null
						if(isNaN(queryValue)) { // String or Boolean
							if(queryValue === 'true' || queryValue === 'false') parsedQueryValue = queryValue === 'true' ? true : false
							else parsedQueryValue = queryValue
						} else { // Int or Float
							parsedQueryValue = queryValue.indexOf('.') != -1 ? parseFloat(queryValue) : parseInt(queryValue)
						}
						
						/* check if query has a custom validaton function and run it
						* else check if parsedQueryValue type is the same as declared in our local queries 
						**********************************************************************************/
						if(this.queries[key].validator !== undefined) {
							if(this.queries[key].validator(parsedQueryValue)) { 
								newQueries[key] = parsedQueryValue
							} else { 
								console.error('query ['+key+'] didnt pass custom validation:\n' + this.queries[key].validator.tostring())
							}
						} else {
							if(typeof(parsedQueryValue) === typeof(this.queries[key].type())) {
								newQueries[key] = parsedQueryValue
							} else {
								console.error('query ['+key+'] requires a ' + typeof(this.queries[key].type()) + ' as value. you passed a ' + typeof(parsedQueryValue))
							}
						}
					} else {
						console.error('query [' + key + '=' + this.$route.query[key] +'] not accepted')
					}
				}
			} 
			
			// set new query values, check if there are any new or changed queries, and nullify the rest
			let queryChange = false

			if(_.isEmpty(newQueries)) {
				for(const key in this.queries) {
					if(this.queries[key].value) queryChange = true
					this.queries[key].value = null
				}
			} else {
				for(const key in this.queries) {
					if(newQueries[key]) {
						if(newQueries[key] !== this.queries[key]) queryChange = true
						this.queries[key].value = newQueries[key]
					} else {
						this.queries[key].value = null
					}
				}
			}
			return queryChange	
		},
	}
}
