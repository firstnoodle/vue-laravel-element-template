import Vue from 'vue'
import {SERVICE_VERSION_REGEX, SERVICE_ALLIANCE_REGEX, SERVICE_CARRIER_REGEX} from './regex.js'

/****************************************************** 
  Mixed goodies
 ******************************************************/

// like % (modulo), but also works (loops) when passing negative numbers - ie in range 0-10 passing -2 would yield 9
export const wrapRange = (index, length) => (index % length + length) % length

export const prependZero = value => { 
    const unsignedValue = Math.abs(value).toString()
    return unsignedValue.split('')[1] ? unsignedValue : '0' + unsignedValue
}

export const isObject = obj => obj !== null && typeof obj === 'object'
export const arrayContains = (arr, value) => arr.indexOf(value) > -1

// get object property value using string path fx: 'foo.bar.name'
export const getValueFromPath = (obj, path) => {
    const getNestedProp = (obj, props) => {
        const prop = props.shift()
        if (!obj[prop] || !props.length) return obj[prop]
        return getNestedProp(obj[prop], props)
    }
    let segments = path.split('.')
    return getNestedProp(obj, segments)
}


/****************************************************** 
  Generate unique id
 ******************************************************/

const UNIQUE_ID_KEY = '__id__'
const ID_PREFIX = '__id_prefix__' + Date.now() + '_'
let uid = 0

export const uniqueId = () => {
    return ID_PREFIX + uid++
}


/****************************************************** 
  Set/Get nested props (and trigger reactivity)
 ******************************************************/

export const getNestedProp = (obj, props) => {
    const prop = props.shift()
    if (!obj[prop] || !props.length) {
        return obj[prop]
    }
    return getNestedProp(obj[prop], props)
}

export const setNestedProp = (obj, props, value) => {
    const prop = props.shift()
    if (!obj[prop]) {
        Vue.set(obj, prop, {})
    }
    if (!props.length) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            obj[prop] = { ...obj[prop], ...value }
        } else {
            obj[prop] = value
        }
        return
    }
    setNestedProp(obj[prop], props, value)
}

export const deleteNestedProp = (obj, props) => {
    const prop = props.shift()
    if (!obj[prop]) {
        return
    }
    if (!props.length) {
        Vue.delete(obj, prop)
        return
    }
    deleteNestedProp(obj[prop], props)
}



/****************************************************** 
  Sorting methods
 ******************************************************/

export const sort = { 
    stringAscending: path => {
        return (a,b) => {
            let _a = getValueFromPath(a, path)
            _a = _a ? _a.toUpperCase() : _a
            let _b = getValueFromPath(b, path)
            _b = _b ? _b.toUpperCase() : _b
            if (_a < _b) return 1
            if (_a > _b) return -1
            return 0
        }   
    },
    stringDescending: path => {
        return (a,b) => {
            let _a = getValueFromPath(a, path)
            _a = _a ? _a.toUpperCase() : _a
            let _b = getValueFromPath(b, path)
            _b = _b ? _b.toUpperCase() : _b
            if (_a < _b) return -1
            if (_a > _b) return 1
            return 0
        }
    },
    numberAscending: path => {
        return (a,b) => { 
            const _a = getValueFromPath(a, path)
            const _b = getValueFromPath(b, path)
            return a-b 
        }
    },
    numberDescending: path => {
        return (a,b) => { 
            const _a = getValueFromPath(a, path)
            const _b = getValueFromPath(b, path)
            return a-b 
        }
    },
    dateAscending: path => {
        return (a,b) => {
            const _a = moment(getValueFromPath(a, path))
            const _b = moment(getValueFromPath(b, path))
            if(_a.isBefore(_b)) return 1
            if(_b.isBefore(_a)) return -1
            return 0
        }
    },
    dateDescending: path => {
        return (a,b) => {
            const _a = moment(getValueFromPath(a, path))
            const _b = moment(getValueFromPath(b, path))
            if(_a.isBefore(_b)) return -1
            if(_b.isBefore(_a)) return 1
            return 0
        }
    },
}

/****************************************************** 
  URL Params
 ******************************************************/

export const getUrlParams = (urlTemplate, urlParams, path) => {
    let result = {}
    const urlFormatSegments = urlTemplate.split('/')
    for(const param in urlParams) {
        for(const index of urlFormatSegments.keys()) {
            if(param === urlFormatSegments[index]) {
                const value = path.split('/')[index]
                let parsedValue = null
                if(isNaN(value)) parsedValue = value
                else parsedValue = value.indexOf('.') != -1 ? parseFloat(value) : parseInt(value)
                result[param] = parsedValue
             }
         }
    }
    return result
 }

export const setUrlParams = (params, path) => {
    for(const key in params) {
        path = path.replace(key, params[key])
    }
    return path
}






/****************************************************** 
   Legacy stuff needs to be refactored
 ******************************************************/

export const parseServiceName = serviceName => {
	let version = SERVICE_VERSION_REGEX.test(serviceName) ? parseInt(SERVICE_VERSION_REGEX.exec(serviceName)[1]) : null;
	// get alliance (alliance name and service name)
	let allianceResult = SERVICE_ALLIANCE_REGEX.test(serviceName) ? SERVICE_ALLIANCE_REGEX.exec(serviceName) : null;
	let alliance = allianceResult ? {name: allianceResult[1], service: allianceResult[2]} : null;
	// for carriers we do a string.match
	// that's the only (?) way to do a regex search for multiple occurences of the same pattern
	let carriers = [];
	let carrierResult = serviceName.match(SERVICE_CARRIER_REGEX);
	// if the name contains an alliance, then we should start at 1
	let i = allianceResult ? 1 : 0;
	for(;i < carrierResult.length; i++) {
		let split = carrierResult[i].split(' - ');
		carriers.push({name: split[0], service: split[1]});
	}    
	return { version, alliance, carriers };
}

