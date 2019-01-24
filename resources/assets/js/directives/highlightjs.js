export default {
	deep: true,
	bind: function(el, binding) {
		hljs.highlightBlock(el)
	},
	componentUpdated: function(el, binding) {
		hljs.highlightBlock(el)
	}
}
