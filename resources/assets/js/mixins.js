const UNIQUE_KEY_PROP = '__unique_key_prop__'
const KEY_PREFIX = '__key_prefix__' + Date.now() + '_'
let uid = 0

const isObject = obj => obj !== null && typeof obj === 'object'

export default {
	methods: {
		genUniqueKey(obj) {
			if (isObject(obj)) {
				if (UNIQUE_KEY_PROP in obj) {
					return obj[UNIQUE_KEY_PROP]
				}
				const value = KEY_PREFIX + uid++
				Object.defineProperty(obj, UNIQUE_KEY_PROP, { value })
				return value
			}
			return obj
	  	}
	}
}
