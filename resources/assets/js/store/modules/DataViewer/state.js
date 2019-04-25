import {sort} from 'root/utils.js'
import {filterOperators} from 'root/components/DataTables/constants.js'

export const state = {
	columns: [],
	filters: [],
	pagination: {
		current_page: 1,
		last_page: 1,
		per_page: 50,
		per_page_options: [10, 25, 50, 100, 200, 500],
		total: 0,
	},
	rows: [],
	sorting: {
		column: null,
		direction: 'descending'
	},
}