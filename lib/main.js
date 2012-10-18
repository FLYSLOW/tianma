/**
 * Tianma - Main
 * Copyright(c) 2010 ~ 2012 Alibaba.com, Inc.
 * MIT Licensed
 */

var app = require('./app'),
	fs = require('fs'),
	path = require('path'),
	pegasus = require('pegasus'),
	util = require('./util'),
	version = require('./version');

var DEFAULT_SSL_KEY = path.join(__dirname, '../deploy/key/localhost.key'),

	DEFAULT_SSL_CERT = path.join(__dirname, '../deploy/key/localhost.cer'),

	configured = false,

	/**
	 * Do nothing;
	 */
	noop = function () {};

/**
 * Initiate application.
 * @param config {Object}
 * @return {Object}
 */
exports.init = function (config) {
	config = util.mix({
		silent: false,
		log: false
	}, config);

	app.init(config);
	configured = true;

	exports.init = noop; // Allowed to initiate once.

	return exports;
};

/**
 * Create an Host instance.
 * @param config {Object}
 * @return {Object}
 */
exports.createHost = function (config) {
	var key, cert;

	if (!configured) {
		app.init({ silent: false, log: false });
		configured = true;
	}

	if (config.portssl) {
		key = config.key || DEFAULT_SSL_KEY;
		cert = config.cert || DEFAULT_SSL_CERT;

		try {
			config.key = fs.readFileSync(key);
			config.cert = fs.readFileSync(cert);
		} catch (err) {
			// Fatal error.
			throw util.error(err);
		}
	}

	return pegasus.createHost(config);
};

/**
 * Create an pipe function.
 * @param prototype {Object}
 * @return {Function}
 */
exports.createPipe = pegasus.createPipe;

// Export utility functions for end-user.
exports.util = util;

// Export version number.
exports.version = version.number;

// Export build-in pipe functions.
exports.pipe = {
	'beautify': require('./pipe/refine').beautify,
	'combo': require('./pipe/combo'),
	'compress': require('./pipe/compress'),
	'dynamic': require('./pipe/dynamic'),
	'minify': require('./pipe/refine').minify,
	'proxy': require('./pipe/proxy'),
	'refine': require('./pipe/refine').custom,
	'static': require('./pipe/static')
};

// Log uncaught exception.
process.on('uncaughtException', function (err) {
	app.exit(err);
});
