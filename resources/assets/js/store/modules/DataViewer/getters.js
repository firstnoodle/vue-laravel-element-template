import {getValueFromPath} from 'root/utils.js'
import {filterOperators} from 'root/components/DataTables/constants.js'

export const getters = {
	columns: (state) => {
		return state.columns
	},
	columnByLabel: (state) => (label) => {
		return state.columns.find(column => column.label === label)
	},
	columnValue: (state) => (row, path) => {
		return getValueFromPath(row, path)
	},
	filters: (state) => {
		return state.filters
	},
	getColumnClasses: (state) => (label) => {
		const column = state.columns.find(column => column.label === label)
		return column ? column.classes : null
	},
	getColumnLayout: (state) => (label) => {
		const column = state.columns.find(column => column.label === label)
		return column ? column.layout : null
	},
	rows: (state, getters) => {
		let _rows = state.rows
		// filter
		for(const filter of state.filters) {
			if(filter.column && filter.value) {
				_rows = _rows.filter(row => {
					const value = getValueFromPath(row, filter.column.path)

					if(!filter.operator) return value.includes(filter.value)

					const filterValue = filter.value === 'no data' ? null : filter.value

					switch(filter.operator) {
						case filterOperators.EQUAL:
							return value === filterValue
						case filterOperators.NOT_EQUAL:
							return value !== filterValue
						case filterOperators.LESS_THAN_OR_EQUAL:
							return value <= filterValue
						case filterOperators.GREATER_THAN_OR_EQUAL:
							return value >= filterValue
						default:
							console.error('unknown filter operator')
					}
					return true
				})
			}
		}

		// sort
		if(state.sorting.column && state.sorting.direction) {
			return _rows.sort(state.sorting.column.sortingFunctions[state.sorting.direction](state.sorting.column.path))
		}
		return _rows
	},
	sortBy: (state) => {
		return state.sorting.column
	},
	sortDirection: (state) => {
		return state.sorting.direction
	},
}