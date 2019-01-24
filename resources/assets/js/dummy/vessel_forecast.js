const ajax_data = {
	assigned_vessel: {
		imo_number: 9199270,
		name: "OOCL CHICAGO",
		url: "http://app.dev.eesea.com/vessel/9199270"
	},
	monitored_port: {
		name: 'Singapore',
		code: 'SGSING',
	},
	service: {
		name: "#7 || HL - MSE | MSC - West Med to SAEC | ZIM - SAM"
	},
	schedule: [
		{
			port: {
				code: 'SGSING',
				name: 'Singapore',
				next_port: 187,
				type: 'PORT',
			},
			arrival: {
				source: null,
				result: {
					date: null,
					port_hours: null
				}
			},
			departure: {
				source: null,
				result: {
					date: null,
					sea_hours: null
				}
			},
			sources: {
				arrivals: [
					{
						level: 1,
						source: 'FM',
						label: 'AIS ETA',
						type: 'DATE',
						value: '2018-04-25 22:00:00.000000',
					},
					{
						level: 1,
						source: 'FM',
						label: 'CALC ETA',
						type: 'DATE',
						value: '2018-04-26 01:30:00.000000',
					},
					{
						level: 1,
						source: 'MT',
						label: 'AIS ETA',
						type: 'DATE',
						value: '2018-04-25 21:00:00.000000',
					},
					{
						level: 1,
						source: 'MT',
						label: 'CALC ETA',
						type: 'DATE',
						value: '2018-04-25 21:30:00.000000',
					},
					{
						level: 2,
						source: 'CMA CGM',
						label: 'Arrival',
						type: 'DATE',
						value: '2018-04-23 14:00:00.000000',
					},
					{
						level: 2,
						source: 'CMA CGM',
						label: 'Sea hours',
						type: 'DURATION',
						value: 48,
					},
					{
						level: 2,
						source: 'ONE',
						label: 'Arrival',
						type: 'DATE',
						value: '2018-04-23 18:00:00.000000',
					},
					{
						level: 2,
						source: 'ONE',
						label: 'Sea hours',
						type: 'DURATION',
						value: 52,
					},
					{
						level: 3,
						source: null,
						label: 'Arrival',
						type: 'DATE',
						value: '2018-04-20 20:00:00.000000',
					},
					{
						level: 3,
						source: null,
						label: 'Sea hours',
						type: 'DURATION',
						value: 48,
					},
				],
				departures: [
					{
						level: 1,
						source: 'FM',
						label: 'AIS ETD',
						type: 'DATE',
						value: '2018-04-25 22:00:00.000000',
					},
					{
						level: 1,
						source: 'MT',
						label: 'AIS ETD',
						type: 'DATE',
						value: '2018-04-25 21:00:00.000000',
					},
					{
						level: 2,
						source: 'CMA CGM',
						label: 'Departure',
						type: 'DATE',
						value: '2018-04-24 00:00:00.000000',
					},
					{
						level: 2,
						source: 'CMA CGM',
						label: 'Port hours',
						type: 'DURATION',
						value: 10,
					},
					{
						level: 2,
						source: 'ONE',
						label: 'Departure',
						type: 'DATE',
						value: '2018-04-24 06:00:00.000000',
					},
					{
						level: 2,
						source: 'ONE',
						label: 'Port hours',
						type: 'DURATION',
						value: 12,
					},
					{
						level: 3,
						source: null,
						label: 'Departure',
						type: 'DATE',
						value: '2018-04-21 06:00:00.000000',
					},
					{
						level: 3,
						source: null,
						label: 'Port hours',
						type: 'DURATION',
						value: 10,
					},
				],
			}
		}
	]
}

const dummy = [ 
	{
		port: {
			name: "Singapore",
			code: "SGSIN",
		},
		arrival: {
			level: 1,
			source: "FLEETMON",
			type: "CALC_ETA",
			value: "2018-04-26 18:00:00.0000",
			result: {
				date: "2018-04-26 18:00:00.0000",
				port_hours: 12,
			}
		},
		departure: {
			level: 2,
			source: "ONE",
			type: "DURATION",
			value: "14",
			result: {
				date: "2018-04-26 18:00:00.0000",
				sea_hours: 62,
			}
		}
	},
]

const initial_template = [
	{
		port: {
			name: null,
			code: null,
		},
		arrival: {
			label: null,
			level: 1,
			source: null, 
			type: null,
			value: null,
		},
		departure: {
			label: null,
			level: null, // level 1 or 3
			source: null,
			type: null, 
			value: null,
		}
	},
	{
		port: {
			name: null,
			code: null,
		},
		arrival: {
			label: "Sea hours",
			level: 3,
			source: null, 
			type: "DURATION",
			value: null,
		},
		departure: {
			label: "Port hours",
			level: 3,
			source: null,
			type: "DURATION",
			value: null,
		}
	}
]

export default { ajax_data, dummy, initial_template }