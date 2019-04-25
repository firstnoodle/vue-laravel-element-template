import * as types from './mutation-types.js'
import {setNestedProp, uniqueId} from 'root/utils.js'
import {filterOperators} from 'root/components/DataTables/constants.js'

export const mutations = {
	[types.DELETE_FILTER] (state, id) {
		state.filters = state.filters.filter(filter => filter.id !== id)
	},
	[types.NEW_FILTER] (state) {
		state.filters.push({
			id: uniqueId(),
			column: null,
			operator: filterOperators.EQUAL,
			value: null
		})
	},
	[types.SET_COLUMNS] (state, columns) {
		state.columns = columns
	},
	[types.SET_COLUMN_FILTER_OPTIONS] (state, {column, options}) {
		setNestedProp(column, ['filterValueOptions'], options)
	},
	[types.SET_FILTER_ATTRIBUTE] (state, {id, attribute, value}) {
		let filter = state.filters.find(filter => filter.id === id)
		setNestedProp(filter, [attribute], value)
	},
	[types.SET_ROWS] (state, rows) {
		state.rows = rows
	},
	[types.SET_SORTING_COLUMN] (state, column) {
		state.sorting.column = column
	},
	[types.SET_SORTING_DIRECTION] (state, direction) {
		state.sorting.direction = direction
	},
}