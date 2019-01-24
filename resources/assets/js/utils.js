
window.utils = {
	wrapRange: (x, n) => (x % n + n) % n,	
    regex: {
        version: /^#(\d)/,
        alliance: /\|{2} (\S{2,36}) - (\S{2,36}) \|{2}/,
        carriers: /(\S{2,36}) - (\S{2,36})/g 
    },
    parseServiceName: serviceName => {
        let version = utils.regex.version.test(serviceName) ? parseInt(utils.regex.version.exec(serviceName)[1]) : null;
        // get alliance (alliance name and service name)
        let allianceResult = utils.regex.alliance.test(serviceName) ? utils.regex.alliance.exec(serviceName) : null;
        let alliance = allianceResult ? {name: allianceResult[1], service: allianceResult[2]} : null;
        // for carriers we do a string.match
        // that's the only (?) way to do a regex search for multiple occurences of the same pattern
        let carriers = [];
        let carrierResult = serviceName.match(utils.regex.carriers);
        // if the name contains an alliance, then we should start at 1
        let i = allianceResult ? 1 : 0;
        for(;i < carrierResult.length; i++) {
            let split = carrierResult[i].split(' - ');
            carriers.push({name: split[0], service: split[1]});
        }    
        return { version, alliance, carriers };
    }
};


