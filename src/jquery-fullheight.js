(function ($) {

	'use strict';

	// Device check for limiting resize handling.
	var IS_DEVICE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

	function FullHeight(el, options) {
		this.el = $(el);

		var data = {};
		$.each(this.el.data(), function (attr, value) {
			if (/^fullheight/.test(attr)) {
				var key = attr.replace('fullheight', '').toLowerCase();
				data[key] = value;
			}
		});
		options = $.extend({}, FullHeight.defaults, options, data);
		this.debug = options.debug;
		this.container = $(options.container);
		this.property = options.property;
		this.propertyBefore = this.el.css(this.property);

		// Chrome for Android resizes the browser a lot when scrolling due to the address bar collapsing.
		// This causes a lot of arbitrary layout jumps and slow image resize operations with this plugin.
		// So for device UA where height should not change, we only update if the width changes as well (f.ex.
		// orientation changes).
		this.allowDeviceHeightResize = !(
			options.allowDeviceHeightResize === null ||
			options.allowDeviceHeightResize === false ||
			options.allowDeviceHeightResize === 'false'
		);
		this.lastWidth = this.container.innerWidth();
		this.timerResize = 0;

		this.container.on('resize.yrkup3.fullheight', $.proxy(this, '_onResize'));

		this.update();
	}

	FullHeight.defaults = {
		debug: false,
		allowDeviceHeightResize: false,
		container: window,
		property: 'min-height'
	};

	FullHeight.prototype._onResize = function () {
		var newWidth = this.container.innerWidth();
		var allowResize = !IS_DEVICE || this.allowDeviceHeightResize || newWidth !== this.lastWidth;

		// Do the update if expected.
		if (allowResize) {
			var root = this;
			clearTimeout(this.timerResize);
			this.timerResize = setTimeout(function () {
				root.update();
			}, 200);
		}

		this.lastWidth = newWidth;
	};

	FullHeight.prototype.update = function () {
		if (this.debug) {
			console.log('update', this.el);
		}
		var newHeight;
		var offset = this.container.offset();
		if (typeof offset == 'undefined') {
			newHeight = $(window).innerHeight();
		} else {
			newHeight = this.container.innerHeight() - (this.el.offset().top - offset.top);
		}
		if (newHeight !== this.lastHeight) {
			if (this.debug) {
				console.log('set `' + this.property + '` to ' + newHeight);
			}
			this.el.css(this.property, newHeight);
			this.lastHeight = newHeight;
		}
	};

	FullHeight.prototype.dispose = function () {
		if (this.debug) {
			console.log('dispose');
		}
		this.container.off('.yrkup3.fullheight');
		this.el.css(this.property, this.propertyBefore);
	};

	$.fn.fullheight = function (options) {
		this.each(function () {
			var el = $(this);
			// Store data
			var data = el.data('yrkup3.fullheight');
			if (!data) {
				el.data('yrkup3.fullheight', (data = new FullHeight(el, options)));
			}
			// Run command
			if (typeof options == 'string') {
				data[options]();
			}
		});
		return this;
	};

})(jQuery);
