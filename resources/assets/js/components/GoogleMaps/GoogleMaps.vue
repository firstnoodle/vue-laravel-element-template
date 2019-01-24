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
				this.path = new google.maps.Polyline({
					editable: true,
					map: this.map,
					path: this.coordinates,
					strokeColor: 'black',
					strokeOpacity: 1.0,
					strokeWeight: 2,
					suppressUndo: true
				});
				
				this.deleteMenu = new DeleteMenu()

				this.path.addListener('click', event => {
					if(event.vertex && event.vertex !== this.route.length-1) {
						this.deleteMenu.open(this.map, this.path.getPath(), event.vertex)
					}
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
			}
		}
	}	
</script>

<style lang="sass">
	.google-map 
		width: 100%
		height: 100vh
		margin: 0 auto
		background: gray
</style>
