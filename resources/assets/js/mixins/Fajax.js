
/* simple function to simulate Ajax call
 ***************************************/

export const Fajax = {
	get: (data) => {
		let promise = new Promise((resolve, reject) => {
     		window.setTimeout(function() {
       			resolve(data)
     		}, 1000)
   		});
   		return promise;
	},
	paginate: (data, options) => {
		let promise = new Promise((resolve, reject) => {
     		window.setTimeout(function() {
				const total = data.length
				const pages = Math.ceil(total / options.per_page)
				// take last page into account...
				const from = (options.current_page-1) * options.per_page
				if(from > total) {
					const error = {
						message: `requested page ${options.current_page} is out of range`
					}
					reject(error)
				} else {
					const to = from + options.per_page
					const dataSlice = data.slice(from, to) 
					const packet = {
						current_page: options.current_page,
						per_page: options.per_page,
						total: total,
						pages: pages,
						data: dataSlice
					}
					resolve(packet)
				}
     		}, 1000)
   		});
   		return promise;
	}
}
