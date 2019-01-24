<template>
	<div class="forecast-table">

		 <!-- HEADER --> 
        <div class="forecast-table__header forecast-row">
            <div class="forecast-column forecast-column--port">Port</div>
            <div class="forecast-column forecast-column--source">Source</div>
            <div class="forecast-column forecast-column--result">Result</div>
            <div class="forecast-column forecast-column--proforma">
                <span>Proforma</span>
                <span style="float:right">Deviation</span>
            </div>
            <div class="forecast-column forecast-column--previous">
                <span>Previous forecast</span>
                <span style="float:right">Deviation</span>
            </div>
        </div>

		 <!-- CONTENT --> 
		<div class="forecast-table__content">
			<ForecastPortRow></ForecastPortRow>	

		 	<!-- MONITORED PORT --> 
		</div>
	</div>
</template>

<script>
	import ForecastPortRow from './ForecastPortRow'
	export default {
		name: 'forecast-editor',
		components: { ForecastPortRow },
		data () {
			return {

			}
		}
	}
</script>
