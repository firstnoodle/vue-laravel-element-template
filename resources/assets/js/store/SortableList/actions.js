import json from 'root/data/forecasts.json'

export const actions = {
	loadData({commit}) {
		commit('SET_FORECASTS', json.data)
	}
}