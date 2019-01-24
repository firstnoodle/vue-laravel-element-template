
export const DATE_TIME_REGEX = /^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[01]) ([01]\d|2[0-3]):([0-5]\d|2[0-9])$/
export const DURATION_REGEX = /^[0-9]{2}:([01]\d|2[0-3]):([0-5]\d|2[0-9])$/

export const SERVICE_VERSION_REGEX = /^#(\d)/
export const SERVICE_ALLIANCE_REGEX = /\|{2} (\S{2,36}) - (\S{2,36}) \|{2}/
export const SERVICE_CARRIER_REGEX = /(\S{2,36}) - (\S{2,36})/g
