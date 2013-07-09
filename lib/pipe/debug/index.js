/**
 * Tianma - Pipe - Debug
 * Copyright(c) 2010 ~ 2012 Alibaba.com, Inc.
 * MIT Licensed
 */

var pegasus = require('pegasus');

var PATTERN_DEBUG = /\/\*@debug\b([\s\S]*?)\*\//gm,

	CONTENT_TYPES = [
		'text/javascript',
		'application/x-javascript',
		'application/javascript',
		'text/css'
	],

	/**
	 * Active debug code.
	 * @param source {string}
	 * @return {string}
	 */
	active = function (source) {
		return source
			.replace(PATTERN_DEBUG, '$1');
	},

	/**
	 * Pipe function factory.
	 * @param config {Object}
	 */
	debug = pegasus.createPipe({
		/**
		 * Initializer.
		 * @param config {Object}
		 */
		_initialize: function (config) {
			// Nothing to configurate.
		},

		/**
		 * Pipe function entrance.
		 * @param request {Object}
		 * @param response {Object}
		 */
		main: function (request, response) {
			var source = response.body();

			response
				.clear()
				.write(active(source));

			this.next();
		},

		/**
		 * Check whether to process current request.
		 * @param request {Object}
		 * @param response {Object}
		 * @return {boolean}
		 */
		match: function (request, response) {
			return response.status() === 200 &&
				CONTENT_TYPES.indexOf(response.head('content-type')) !== -1;
		}
	});

module.exports = debug;
