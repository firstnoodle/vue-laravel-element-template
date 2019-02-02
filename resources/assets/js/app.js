import '../sass/app.scss'

import Vue from 'vue'

/* Router
******************/
import VueRouter from 'vue-router'
Vue.use(VueRouter)

/* Axios (AJAX)
******************/
import axios from 'axios'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
let token = document.head.querySelector('meta[name="csrf-token"]')
if (token) { 
	axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content
	Vue.use(axios)
} else { 
	console.warn('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token - axios not instantiated')
}

/* Directives
******************/
import highlightjs from './directives/highlightjs.js'
Vue.directive('highlightjs', highlightjs)

/* Mixins
******************/
import globals from './mixins/globals.js'
Vue.mixin(globals)

/* Element-ui 
 * theme-chalk is extended through sass/app.scss
************************************************/
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
Vue.use(ElementUI, { locale })

/* Element-ui classes for responsive hiding
************************************************/
import 'element-ui/lib/theme-chalk/display.css';


/* Other dependencies
*********************/
window.moment = require('moment-timezone') // for some reason 'import' doesnt work...
import _ from 'lodash'

// highligh.js
window.hljs = require('highlight.js/lib/highlight')
require('highlight.js/styles/atom-one-dark.css')
import js from 'highlight.js/lib/languages/javascript'
hljs.registerLanguage('javascript', js)
hljs.configure({tabReplace: '    '})

//require('summernote')

require('./utils');

import App from 'root/pages/App.vue'
import store from 'root/store/index.js'
import router from './routes.js'

new Vue({
	el: '#App',
	router,
	store,
	render: h => h(App)
})
