
<template>
	<main class="app-body">

		<!-- Sidebar -->	
		<div v-if="sidebarVissible" id="sidebar" class="panel">
			<header class="panel__header">
				<!-- Panel header -->				
			</header>
			<div class="panel__body-wrapper">
				<div class="panel__body">
					<!-- Panel body -->				
				</div>
			</div>
			<footer class="panel__footer">
				<!-- Panel footer -->				
			</footer>
		</div>

		<!-- Content -->	
		<div id="content" class="panel">
			<header class="panel__header">
				<template v-for="item in subNav">
					<router-link :to="item.path" tag="a" class="menu-item">
						<span class="menu-item__label">{{ item.label }}</span>
					</router-link>
				</template>
			</header>
			<div class="panel__body-wrapper">
				<div class="panel__body">
					<router-view></router-view>
				</div>
			</div>
			<footer class="panel__footer">
				<el-button size="mini" @click="toggleSidebar">sidebar</el-button>
			</footer>
		</div>
		
	</main>
</template>

<script>
export default {
	name: 'Components',
	data() {
		return {
			sidebarVissible: true,
			subNav: [],
		}
	},
	methods: {
		toggleSidebar() {
			this.sidebarVissible = !this.sidebarVissible
		}
	}
}
</script>
