import {sort} from 'root/utils.js'
import {filterOperators} from 'root/components/DataTables/constants.js'

export const state = {
	columns: [
		{
			label: 'Service',
			path: 'service.name',
			layout: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
			classes: ['is-highlighted'],
			filterOperators: [filterOperators.EQUAL, filterOperators.NOT_EQUAL],
			filterType: 'Select',
			filterValueOptions: null,
			sortingFunctions: {
				ascending: sort.stringAscending,
				descending: sort.stringDescending
			}
		},
		{
			label: 'Vessel',
			path: 'vessel.name',
			layout: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
			classes: [],
			filterOperators: [filterOperators.EQUAL, filterOperators.NOT_EQUAL],
			filterType: 'Select',
			filterValueOptions: null,
			sortingFunctions: {
				ascending: sort.stringAscending,
				descending: sort.stringDescending
			}
		},
		{
			label: 'Monitored port',
			path: 'user_service_proforma.port.name',
			layout: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
			classes: [],
			filterOperators: [filterOperators.EQUAL, filterOperators.NOT_EQUAL],
			filterType: 'Select',
			filterValueOptions: null,
			sortingFunctions: {
				ascending: sort.stringAscending,
				descending: sort.stringDescending
			}
		},
		{
			label: 'Next port',
			path: 'next_port.name',
			layout: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
			classes: [],
			filterOperators: [filterOperators.EQUAL, filterOperators.NOT_EQUAL],
			filterType: 'Select',
			filterValueOptions: null,
			sortingFunctions: {
				ascending: sort.stringAscending,
				descending: sort.stringDescending
			}
		},
		{
			label: 'Subscriber',
			path: 'user_service_proforma.user.name',
			layout: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
			classes: [],
			filterOperators: [filterOperators.EQUAL, filterOperators.NOT_EQUAL],
			filterType: 'Select',
			filterValueOptions: null,
			sortingFunctions: {
				ascending: sort.stringAscending,
				descending: sort.stringDescending
			}
		},
		{
			label: 'Responsible',
			path: 'responsible_user.name',
			layout: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
			classes: [],
			filterOperators: [filterOperators.EQUAL, filterOperators.NOT_EQUAL],
			filterType: 'Select',
			filterValueOptions: null,
			sortingFunctions: {
				ascending: sort.stringAscending,
				descending: sort.stringDescending
			}
		},
	],
	filters: [],
	pagination: {

	},
	sorting: {
		column: null,
		direction: 'descending'
	},
	rows: null	,
}