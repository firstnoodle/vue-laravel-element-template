<template>
	<div class="google-map" :id="mapName"></div>	
</template>

<script>
	import {DeleteMenu} from './DeleteMenu.js' 

	export default {
		name: 'GoogleMaps',
  		props: ['name', 'route'],
  		data() {
    		return {
    			bounds: null,
      			coordinates: [],
				deleteMenu: null,
				polyline: null,
			    map: null,
      			mapName: this.name + "-map",
    			markers: [],
				options: {
					center: { 
						lat: 30.968189,
						lng: 122.222900
					},
					disableDefaultUI: true,
					scrollwheel: true,
					draggable: true,
					zoomControl: true,
					zoom: 5,
					streetViewControl: false,
					mapTypeControl: false,
					fullscreenControl: false
				},
      			path: null,
    		}
  		},
  		mounted() {
			// get element reference
  			const element = document.getElementById(this.mapName)

			// init bounds and map
  			this.bounds = new google.maps.LatLngBounds()
			this.map = new google.maps.Map(element, this.options)
			
			if(this.route.length) {
				// convert route coordinates to LatLng and fit map
				this.route.forEach(position => { 
					const latlng = new google.maps.LatLng(position.lat, position.lng)
					this.coordinates.push(latlng)
					this.map.fitBounds(this.bounds.extend(latlng))
				});

				// create polyline	
				this.polyline = new google.maps.Polyline({
					editable: true,
					map: this.map,
					path: this.coordinates,
					strokeColor: 'black',
					strokeOpacity: 1.0,
					strokeWeight: 2,
					suppressUndo: true
				});
				
				this.deleteMenu = new DeleteMenu()

				this.polyline.addListener('click', event => {
					//console.log(event)
					// no menu on last vertex (first is disabled by default)
					if(event.vertex && event.vertex !== this.route.length-1) {
						this.$emit('click', this.route[event.vertex])
						this.deleteMenu.open(this.map, this.polyline.getPath(), event.vertex)
					}
				})
				google.maps.event.addListener(this.polyline.getPath(), 'set_at', vertex => {
					console.log(`set_at: ${vertex}`)	
				})
				google.maps.event.addListener(this.polyline.getPath(), 'insert_at', vertex => {
					console.log(`insert_at: ${vertex}`)	
				})
				google.maps.event.addListener(this.polyline.getPath(), 'remove_at', vertex => {
					console.log(`remove_at: ${vertex}`)	
				})
			}
			// add marker to start and end points
			//this.addMarker(this.route[0])
			//this.addMarker(this.route[this.route.length-1])
  			//google.maps.event.trigger(this.map, 'resize');
  		},
		methods: {
			addMarker(point) {
				const position = new google.maps.LatLng(point.lat, point.lng)
				const marker = new google.maps.Marker({ 
					position,
					map: this.map
				});
				this.markers.push(marker)
				this.map.fitBounds(this.bounds.extend(position))
			},
		}
	}	
</script>

<style lang="sass">
	.google-map 
		width: 100%
		height: 100vh
		background: gray
</style>
