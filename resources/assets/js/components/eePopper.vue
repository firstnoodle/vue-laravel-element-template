
<template>
  <span>
    <transition :name="transition" :enter-active-class="enterActiveClass" :leave-active-class="leaveActiveClass" @after-leave="doDestroy">
      <span
        ref="popper"
        v-show="!disabled && showPopper">
        <slot>{{ content }}</slot>
      </span>
    </transition>
    <slot name="reference"></slot>
  </span>
</template>

<script>
	import Popper from 'popper.js';

  	function on(element, event, handler) {
    	if (element && event && handler) {
      		document.addEventListener ? element.addEventListener(event, handler, false) : element.attachEvent('on' + event, handler);
    	}
  	}

  	function off(element, event, handler) {
    	if (element && event) {
      		document.removeEventListener ? element.removeEventListener(event, handler, false) : element.detachEvent('on' + event, handler)
    	}
  	}

  	export default {
    	props: {
      		trigger: {
        		type: String,
        		default: 'click',
        		validator: value => ['click', 'hover'].indexOf(value) > -1
      		},
      		delayOnMouseOver: {
        		type: Number,
        		default: 10,
      		},
      		delayOnMouseOut: {
        		type: Number,
        		default: 10,
      		},
      		disabled: {
        		type: Boolean,
        		default: false
      		},
      		content: String,
      		enterActiveClass: String,
      		leaveActiveClass: String,
      		boundariesSelector: String,
      		reference: {},
      		forceShow: {
        		type: Boolean,
        		default: false
      		},
      		appendToBody: {
        		type: Boolean,
        		default: false
      		},
      		transition: {
        		type: String,
        		default: ''
      		},
      		options: {
        		type: Object,
        		default() {
        	  		return {
						modifiers: {
							preventOverflow: {
								escapeWithReference: true
						  	},
							offset: {
								enabled: true,
								offset: "1, 0"
							}
						}
					};
        		}
      		}
    	},

    	data() {
      		return {
        		referenceElm: null,
        		popperJS: null,
        		showPopper: false,
        		currentPlacement: '',
        		popperOptions: {
          			placement: 'bottom',
          			gpuAcceleration: false
        		}
      		};
    	},

    	watch: {
      		showPopper(value) {
        		if (value) {
				  	this.$emit('show');
				 	this.updatePopper();
        		} else {
          			this.$emit('hide');
        		}
      		},

      		forceShow: {
        		handler(value) {
          			this[value ? 'doShow' : 'doClose']();
        		},
        		immediate: true
      		}
    	},

    	created() {
      		this.appendedToBody = false;
      		this.popperOptions = Object.assign(this.popperOptions, this.options);
    	},

    	mounted() {
      		this.referenceElm = this.reference || this.$slots.reference[0].elm;
      		this.popper = this.$slots.default[0].elm;

      		switch (this.trigger) {
        		case 'click':
          			on(this.referenceElm, 'click', this.doToggle);
          			on(document, 'click', this.handleDocumentClick);
          			break;
        		case 'hover':
          			on(this.referenceElm, 'mouseover', this.onMouseOver);
          			on(this.popper, 'mouseover', this.onMouseOver);
          			on(this.referenceElm, 'mouseout', this.onMouseOut);
          			on(this.popper, 'mouseout', this.onMouseOut);
          			break;
      		}
    	},

    	methods: {
      		doToggle() {
        		if (!this.forceShow) {
          			this.showPopper = !this.showPopper;
        		}
      		},
      		doShow() {
        		this.showPopper = true;
      		},
      		doClose() {
        		this.showPopper = false;
      		},
      		doDestroy() {
        		if (this.showPopper) {
          			return;
        		}
        		if (this.popperJS) {
          			this.popperJS.destroy();
          			this.popperJS = null;
        		}
        		if (this.appendedToBody) {
          			this.appendedToBody = false;
          			document.body.removeChild(this.popper.parentElement);
        		}
      		},

      		createPopper() {
        		this.$nextTick(() => {
          			if (this.appendToBody && !this.appendedToBody) {
            			this.appendedToBody = true;
            			document.body.appendChild(this.popper.parentElement);
          			}

          			if (this.popperJS && this.popperJS.destroy) {
            			this.popperJS.destroy();
          			}

          			if (this.boundariesSelector) {
            			const boundariesElement = document.querySelector(this.boundariesSelector);

            			if (boundariesElement) {
              				this.popperOptions.modifiers = Object.assign({}, this.popperOptions.modifiers);
              				this.popperOptions.modifiers.preventOverflow = Object.assign({}, this.popperOptions.modifiers.preventOverflow);
              				this.popperOptions.modifiers.preventOverflow.boundariesElement = boundariesElement;
            			}
          			}
          			this.popperOptions.onCreate = () => {
            			this.$emit('created', this);
            			this.$nextTick(this.updatePopper);
          			};
          			this.popperJS = new Popper(this.referenceElm, this.popper, this.popperOptions);
        		});
      		},
      		destroyPopper() {
        		off(this.referenceElm, 'click', this.doToggle);
        		off(this.referenceElm, 'mouseup', this.doClose);
        		off(this.referenceElm, 'mousedown', this.doShow);
        		off(this.referenceElm, 'focus', this.doShow);
        		off(this.referenceElm, 'blur', this.doClose);
        		off(this.referenceElm, 'mouseout', this.onMouseOut);
        		off(this.referenceElm, 'mouseover', this.onMouseOver);
        		off(document, 'click', this.handleDocumentClick);
        		this.showPopper = false;
        		this.doDestroy();
      		},
      		updatePopper() {
        		this.popperJS ? this.popperJS.scheduleUpdate() : this.createPopper();
      		},
      		onMouseOver() {
        		clearTimeout(this._timer);
        		this._timer = setTimeout(() => {
          			this.showPopper = true;
        		}, this.delayOnMouseOver);
      		},
      		onMouseOut() {
        		clearTimeout(this._timer);
        		this._timer = setTimeout(() => {
          			this.showPopper = false;
        		}, this.delayOnMouseOut);
      		},
      		handleDocumentClick(e) {
        		if (!this.$el || !this.referenceElm ||
          			this.elementContains(this.$el, e.target) ||
          			this.elementContains(this.referenceElm, e.target) ||
          			!this.popper || this.elementContains(this.popper, e.target)
        		) {
          			return;
        		}
        		this.$emit('documentClick');
        		if (this.forceShow) { return }
        		this.showPopper = false;
      		},

      		elementContains(elm, otherElm) {
				if (typeof elm.contains === 'function') {
					return elm.contains(otherElm);
				}
				return false;
			}
    	},

		destroyed() {
			this.destroyPopper();
		}
  	}
</script>
