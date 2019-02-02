import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import SortableList from './SortableList/store.js'

export default new Vuex.Store({
	modules: {
		SortableList
	}
})