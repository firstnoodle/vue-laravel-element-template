import * as types from './mutation-types.js'

export const mutations = {
	[types.SET_FORECASTS] (state, forecasts) {
		state.forecasts = forecasts
	}	
}