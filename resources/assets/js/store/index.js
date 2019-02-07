import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import DataTable from './DataTable/index.js'

export default new Vuex.Store({
	modules: {
		DataTable
	}
})