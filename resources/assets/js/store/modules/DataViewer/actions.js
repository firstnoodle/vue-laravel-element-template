import json from 'root/data/forecasts.json'
import {arrayContains, getValueFromPath} from 'root/utils.js'
import {filterTypes, sortingDirections} from 'root/components/DataTables/constants.js'

export const actions = {
	deleteFilter({commit}, id) {
		commit('DELETE_FILTER', id)
	},
	loadData({commit, getters}) {
		commit('SET_ROWS', json.data)

		// register all select options for all fields (of type.SELECT) -> for select dropdown
		for(const column of getters.columns) {
			if(column.filterType === filterTypes.SELECT) {
				let options = []
				for(const row of getters.rows) {
					// if value is null set it to 'no data'
					const value = getValueFromPath(row, column.path) || 'no data'
					if(!arrayContains(options, value)) options.push(value)	
				}
				commit('SET_COLUMN_FILTER_OPTIONS', {column, options})
			}
		}
	},
	newFilter({commit}) {
		commit('NEW_FILTER')
	},
	setFilterAttribute({commit}, payload) {
		commit('SET_FILTER_ATTRIBUTE', payload)	
	},
	setSortingColumn({commit, getters, dispatch, state}, column) {
		if(getters.sortBy === column) {
			dispatch('updateSortingDirection')
		} else {
			commit('SET_SORTING_DIRECTION', sortingDirections.DESCENDING)
			commit('SET_SORTING_COLUMN', column)
		}
	},
	updateSortingDirection({commit, getters, state}) {
		let direction = getters.sortDirection === sortingDirections.DESCENDING ? sortingDirections.ASCENDING : sortingDirections.DESCENDING
		commit('SET_SORTING_DIRECTION', direction)
	}
}