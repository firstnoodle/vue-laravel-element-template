import {sort} from 'root/utils.js'
import {filterOperators} from 'root/components/DataTables/constants.js'

export const state = {
	columns: [
		{
			name: 'Service',
			layout: { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 },
			classes: ['is-highlighted'],
			fields: [
				{
					label: 'Service',
					path: 'service.name',
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
					filterOperators: [filterOperators.EQUAL, filterOperators.NOT_EQUAL],
					filterType: 'Select',
					filterValueOptions: null,
					sortingFunctions: {
						ascending: sort.stringAscending,
						descending: sort.stringDescending
					}
				}
			]
		},
		{
			name: 'Vessel',
			layout: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
			classes: [],
			fields: [
				{
					label: 'Vessel',
					path: 'vessel.name',
					filterOperators: [filterOperators.EQUAL, filterOperators.NOT_EQUAL],
					filterType: 'Select',
					filterValueOptions: null,
					sortingFunctions: {
						ascending: sort.stringAscending,
						descending: sort.stringDescending
					}
				}
			]
		},
		{
			name: 'Monitored port',
			layout: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
			classes: [],
			fields: [
				{
					label: 'Monitored port',
					path: 'user_service_proforma.port.name',
					filterOperators: [filterOperators.EQUAL, filterOperators.NOT_EQUAL],
					filterType: 'Select',
					filterValueOptions: null,
					sortingFunctions: {
						ascending: sort.stringAscending,
						descending: sort.stringDescending
					}
				}
			]
		},
		{
			name: 'Next port',
			layout: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
			classes: [],
			fields: [	
				{
					label: 'Next port',
					path: 'next_port.name',
					filterOperators: [filterOperators.EQUAL, filterOperators.NOT_EQUAL],
					filterType: 'Select',
					filterValueOptions: null,
					sortingFunctions: {
						ascending: sort.stringAscending,
						descending: sort.stringDescending
					}
				}
			]
		},
		{
			name: 'Subscriber',
			layout: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
			classes: [],
			fields: [	
				{
					label: 'Subscriber',
					path: 'user_service_proforma.user.name',
					filterOperators: [filterOperators.EQUAL, filterOperators.NOT_EQUAL],
					filterType: 'Select',
					filterValueOptions: null,
					sortingFunctions: {
						ascending: sort.stringAscending,
						descending: sort.stringDescending
					}
				}
			]
		},
		{
			name: 'Responsible',
			layout: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
			classes: [],
			fields: [	
				{
					label: 'Responsible',
					path: 'responsible_user.name',
					filterOperators: [filterOperators.EQUAL, filterOperators.NOT_EQUAL],
					filterType: 'Select',
					filterValueOptions: null,
					sortingFunctions: {
						ascending: sort.stringAscending,
						descending: sort.stringDescending
					}
				}
			]
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